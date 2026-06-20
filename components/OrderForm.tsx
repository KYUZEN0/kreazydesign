"use client";

import { useState } from "react";
import { services } from "@/lib/content";

type Status = "idle" | "submitting" | "error";

export default function OrderForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      service: String(data.get("service") || ""),
      details: String(data.get("details") || ""),
      deadline: String(data.get("deadline") || ""),
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        services.find((s) => s.id === payload.service)?.title || payload.service;

      const message = [
        `Halo Kreazy.Design, saya ingin order:`,
        ``,
        `Nama: ${payload.name}`,
        `Layanan: ${serviceLabel}`,
        `Deadline: ${payload.deadline || "-"}`,
        `Detail kebutuhan: ${payload.details}`,
        ``,
        `(Order ID: ${result.orderId})`,
      ].join("\n");

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
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
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}
