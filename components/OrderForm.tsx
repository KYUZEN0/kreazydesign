"use client";

import { useState } from "react";
import { services } from "@/lib/content";

type Status = "idle" | "submitting" | "error";

const MAX_FILE_MB = 4;

export default function OrderForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrorMsg(`Ukuran file referensi maksimal ${MAX_FILE_MB}MB.`);
      e.target.value = "";
      setFileName("");
      return;
    }
    setErrorMsg("");
    setFileName(file.name);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: bot fields fill this hidden input, humans never see it.
    if (data.get("company")) {
      setStatus("idle");
      return;
    }

    const namePayload = String(data.get("name") || "");
    const phonePayload = String(data.get("phone") || "");
    const servicePayload = String(data.get("service") || "");
    const detailsPayload = String(data.get("details") || "");
    const deadlinePayload = String(data.get("deadline") || "");

    try {
      // FormData (data) sudah berisi semua field termasuk file "reference"
      // dari elemen <input type="file">, jadi tinggal kirim apa adanya.
      const res = await fetch("/api/order", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.error || "Gagal mengirim pesanan. Coba lagi ya.");
        setStatus("error");
        return;
      }

      // Order tersimpan di server. Lanjutkan ke WhatsApp dengan ringkasan pesanan.
      const waNumber = result.whatsappNumber;
      const serviceLabel =
        services.find((s) => s.id === servicePayload)?.title || servicePayload;

      const messageLines = [
        `Halo Kreazy.Design, saya ingin order:`,
        ``,
        `Nama: ${namePayload}`,
        `Layanan: ${serviceLabel}`,
        `Deadline: ${deadlinePayload || "-"}`,
        `Detail kebutuhan: ${detailsPayload}`,
      ];

      if (result.referenceUrl) {
        messageLines.push(``, `File referensi: ${result.referenceUrl}`);
      }

      messageLines.push(``, `(Order ID: ${result.orderId})`);

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
        messageLines.join("\n")
      )}`;
      window.location.href = waUrl;
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan. Coba lagi ya.");
      setStatus("error");
    }
  }

  return (
    <section id="order" className="px-4 py-14 sm:px-6 sm:py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          Konsultasi dulu, gratis kok
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Order Sekarang
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-ink-soft">
          Isi detail di bawah, pesanan tersimpan otomatis, lalu kamu akan
          diarahkan ke WhatsApp untuk lanjut konfirmasi.
        </p>

        <form
          onSubmit={handleSubmit}
          className="cut-line mt-10 rounded-b-2xl border border-line bg-surface p-5 sm:p-7 md:p-9"
        >
          {/* Honeypot field, hidden from real users */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px]"
            aria-hidden="true"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nama Lengkap">
              <input
                required
                name="name"
                type="text"
                placeholder="Nama kamu"
                className="input"
              />
            </Field>

            <Field label="Nomor WhatsApp">
              <input
                required
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                className="input"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Pilih Layanan">
              <select required name="service" className="input" defaultValue="">
                <option value="" disabled>
                  Pilih layanan yang dibutuhkan
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — mulai {s.priceFrom}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Deadline (opsional)">
              <input
                name="deadline"
                type="text"
                placeholder="Misal: 3 hari lagi, atau tanggal tertentu"
                className="input"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Detail Kebutuhan">
              <textarea
                required
                name="details"
                rows={4}
                placeholder="Ceritakan kebutuhan desain kamu: ukuran, gaya, warna, referensi, dll."
                className="input resize-none"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Referensi (opsional)" as="div">
              <label
                htmlFor="reference-upload"
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-line bg-paper px-4 py-3.5 text-sm text-ink-soft transition-colors hover:border-ink/40"
              >
                <span className="truncate">
                  {fileName || "Upload gambar atau PDF referensi"}
                </span>
                <span className="flex-shrink-0 rounded-full border border-ink/20 px-3 py-1 font-mono text-xs text-ink">
                  Pilih file
                </span>
              </label>
              <input
                id="reference-upload"
                name="reference"
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="mt-1.5 font-mono text-[11px] text-ink-soft">
                PNG, JPG, WEBP, atau PDF — maks {MAX_FILE_MB}MB
              </p>
            </Field>
          </div>

          {status === "error" && (
            <p className="mt-4 font-mono text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-7 w-full rounded-full bg-blue py-3.5 font-mono text-sm text-paper transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting"
              ? "Mengirim..."
              : "Kirim & Lanjut ke WhatsApp →"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e2e0d8;
          border-radius: 0.75rem;
          padding: 0.8rem 0.9rem;
          font-size: 1rem;
          background: #fff;
          color: #14161a;
        }
        .input:focus {
          outline: 2px solid #2a3eff;
          outline-offset: 1px;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
  as = "label",
}: {
  label: string;
  children: React.ReactNode;
  as?: "label" | "div";
}) {
  const Wrapper = as;
  return (
    <Wrapper className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
    </Wrapper>
  );
}
