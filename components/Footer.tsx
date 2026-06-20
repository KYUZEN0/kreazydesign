import { siteConfig } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="font-display text-sm font-bold text-ink">
          {siteConfig.name}
        </p>
        <p className="font-mono text-xs text-ink-soft">
          © {new Date().getFullYear()} {siteConfig.name}. Logo · Poster &amp;
          Banner · Konten Sosmed · Kartu Nama.
        </p>
        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-blue underline-offset-2 hover:underline"
        >
          @kreazy.design
        </a>
      </div>
    </footer>
  );
}
