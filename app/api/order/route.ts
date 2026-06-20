import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { services, siteConfig } from "@/lib/content";

// Batas sederhana: maksimal 5 order per IP per 10 menit, disimpan di memori.
// Catatan: di Vercel serverless, memori ini bisa reset antar invocation,
// jadi ini lapisan pelindung tambahan, bukan satu-satunya. Untuk proteksi
// lebih kuat, pertimbangkan Vercel Firewall / rate limiting di level edge.
const recentRequests = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

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

    const body = await req.json();
    const { name, phone, service, details, deadline } = body || {};

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
    const cleanDeadline = sanitize(deadline || "", 100);

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

    const db = getDb();
    const docRef = await db.collection("orders").add({
      name: cleanName,
      phone: cleanPhone,
      service,
      details: cleanDetails,
      deadline: cleanDeadline,
      status: "baru",
      createdAt: new Date().toISOString(),
      sourceIp: ip,
    });

    return NextResponse.json({
      orderId: docRef.id,
      whatsappNumber: siteConfig.whatsappNumber,
    });
  } catch (err) {
    console.error("Order submission error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan di server. Coba lagi ya." },
      { status: 500 }
    );
  }
}
