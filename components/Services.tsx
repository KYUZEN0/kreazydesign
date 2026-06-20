import { services } from "@/lib/content";

export default function Services() {
  return (
    <section id="layanan" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              Daftar Harga
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Layanan & Pricelist
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-ink-soft md:block">
            Semua paket dibuat dengan harga bersahabat, tanpa mengorbankan
            kualitas hasil desain.
          </p>
        </div>

        <div className="no-scrollbar mt-10 flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {services.map((s) => (
            <article
              key={s.id}
              className="relative min-w-[260px] flex-shrink-0 rounded-2xl border border-line bg-surface p-6 md:min-w-0"
            >
              {s.badge && (
                <span className="absolute -top-3 left-6 rounded-full bg-highlight px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-ink">
                  {s.badge}
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {s.desc}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                  Mulai dari
                </span>
                <span className="font-mono text-lg font-medium text-blue">
                  {s.priceFrom}
                </span>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-4 font-mono text-xs text-ink-soft md:hidden">
          ← geser untuk lihat semua layanan →
        </p>

        <p className="mt-8 text-xs text-ink-soft">
          *Harga dapat menyesuaikan tingkat kerumitan desain & jumlah revisi
          di luar ketentuan paket.
        </p>
      </div>
    </section>
  );
}
