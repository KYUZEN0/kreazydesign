import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section id="testimoni" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          Testimoni
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Kata mereka yang sudah order
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6"
            >
              <blockquote className="text-sm leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="font-display text-sm font-bold text-ink">
                  {t.name}
                </p>
                <p className="font-mono text-xs text-ink-soft">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
