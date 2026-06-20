const facts = [
  { label: "Berbasis di", value: "Depok, Jawa Barat" },
  { label: "Melayani", value: "Seluruh Indonesia, online" },
  { label: "Format file", value: "PNG · JPG · PDF, siap cetak" },
  { label: "Konsultasi", value: "Gratis sebelum order" },
];

export default function About() {
  return (
    <section id="tentang" className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Tentang Kami
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Studio desain kecil, untuk kebutuhan besar siapa saja.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            Kreazy.Design lahir dari ide sederhana: setiap usaha kecil,
            organisasi, komunitas, dan acara warga berhak punya materi visual
            yang rapi tanpa harus merogoh kantong dalam-dalam. Kami menangani
            setiap pesanan secara personal, dari konsultasi konsep sampai file
            akhir siap pakai.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Bukan template generik — setiap desain disesuaikan dengan
            karakter dan kebutuhan kamu, baik untuk feed Instagram harian
            maupun spanduk acara yang dilihat dari kejauhan.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-7">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Spesifikasi Studio
          </p>
          <dl className="mt-5 divide-y divide-line">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <dt className="text-sm text-ink-soft">{f.label}</dt>
                <dd className="font-mono text-sm font-medium text-ink">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
