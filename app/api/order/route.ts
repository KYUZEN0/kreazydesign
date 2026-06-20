import { NextRequest, NextResponse } from "next/server";
import { getDb, getBucket } from "@/lib/firebaseAdmin";
import { services, siteConfig } from "@/lib/content";
import { randomUUID } from "crypto";

// Batas sederhana: maksimal 5 order per IP per 10 menit, disimpan di memori.
// Catatan: di Vercel serverless, memori ini bisa reset antar invocation,
// jadi ini lapisan pelindung tambahan, bukan satu-satunya. Untuk proteksi
// lebih kuat, pertimbangkan Vercel Firewall / rate limiting di level edge.
const recentRequests = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

// Vercel Serverless Functions membatasi ukuran body request (~4.5MB).
// Kita kasih sedikit ruang aman di bawah itu.
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (recentRequests.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  recentRequests.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

function sanitize(input: string, maxLen: number): string {
  return input.trim().slice(0, maxLen);
}

function safeExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext && ext.length <= 5 ? ext : "bin";
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const phone = formData.get("phone");
    const service = formData.get("service");
    const details = formData.get("details");
    const deadline = formData.get("deadline");
    const reference = formData.get("reference");

    if (
      typeof name !== "string" ||
      typeof phone !== "string" ||
      typeof service !== "string" ||
      typeof details !== "string"
    ) {
      return NextResponse.json(
        { error: "Data yang dikirim tidak lengkap." },
        { status: 400 }
      );
    }

    const cleanName = sanitize(name, 100);
    const cleanPhone = sanitize(phone, 20);
    const cleanDetails = sanitize(details, 1000);
    const cleanDeadline = sanitize(typeof deadline === "string" ? deadline : "", 100);

    if (!cleanName || !cleanPhone || !cleanDetails) {
      return NextResponse.json(
        { error: "Nama, nomor WhatsApp, dan detail kebutuhan wajib diisi." },
        { status: 400 }
      );
    }

    const validService = services.some((s) => s.id === service);
    if (!validService) {
      return NextResponse.json(
        { error: "Layanan yang dipilih tidak valid." },
        { status: 400 }
      );
    }

    const phoneDigits = cleanPhone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid." },
        { status: 400 }
      );
    }

    // Referensi file bersifat opsional.
    let referenceUrl: string | null = null;
    let referenceFileName: string | null = null;

    if (reference instanceof File && reference.size > 0) {
      if (reference.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "Ukuran file referensi maksimal 4MB." },
          { status: 400 }
        );
      }

      if (!ALLOWED_FILE_TYPES.includes(reference.type)) {
        return NextResponse.json(
          {
            error:
              "Format file referensi tidak didukung. Gunakan PNG, JPG, WEBP, atau PDF.",
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await reference.arrayBuffer());
      const ext = safeExtension(reference.name || "file");
      const objectPath = `order-references/${Date.now()}-${randomUUID()}.${ext}`;

      const bucket = getBucket();
      const file = bucket.file(objectPath);
      await file.save(buffer, {
        contentType: reference.type,
        metadata: { cacheControl: "private, max-age=0" },
      });

      // URL signed dengan masa berlaku sangat panjang, supaya kamu (admin)
      // bisa membuka file ini dari Firestore atau dari link WhatsApp,
      // tanpa perlu membuat bucket Storage menjadi publik.
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: "01-01-2491",
      });

      referenceUrl = signedUrl;
      referenceFileName = reference.name || objectPath;
    }

    const db = getDb();
    const docRef = await db.collection("orders").add({
      name: cleanName,
      phone: cleanPhone,
      service,
      details: cleanDetails,
      deadline: cleanDeadline,
      referenceUrl,
      referenceFileName,
      status: "baru",
      createdAt: new Date().toISOString(),
      sourceIp: ip,
    });

    return NextResponse.json({
      orderId: docRef.id,
      whatsappNumber: siteConfig.whatsappNumber,
      referenceUrl,
    });
  } catch (err) {
    console.error("Order submission error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan di server. Coba lagi ya." },
      { status: 500 }
    );
  }
}
