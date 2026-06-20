export default function Hero() {
  return (
    <section id="beranda" className="px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="crop-frame border border-ink/15 px-5 py-10 sm:px-6 sm:py-14 md:px-16 md:py-20">
          <span className="crop-tl" />
          <span className="crop-tr" />

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            Jasa Desain Grafis · DM atau Order via Website
          </p>

          <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl sm:leading-[1.05] md:text-6xl">
            Desain Profesional,{" "}
            <span className="marker-underline">Harga Bersahabat</span>
          </h1>

          <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-ink-soft sm:mt-6 md:text-lg">
            Butuh desain untuk usaha, organisasi, komunitas, acara, atau sekolah?
            Kreazy.Design bantu wujudkan logo, poster, banner, konten promosi,
            sampai kartu nama — kualitas tetap terjaga, kantong tetap aman.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#order"
              className="rounded-full bg-blue px-7 py-3.5 text-center font-mono text-sm text-paper transition-transform active:scale-[0.98] sm:hover:scale-[1.03]"
            >
              Order Sekarang →
            </a>
            <a
              href="#layanan"
              className="rounded-full border border-ink/20 px-7 py-3.5 text-center font-mono text-sm text-ink transition-colors hover:border-ink"
            >
              Lihat Pricelist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
