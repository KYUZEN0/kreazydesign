"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/content";

const links = [
  { href: "#beranda", label: "Beranda" },
  { href: "#layanan", label: "Layanan" },
  { href: "#tentang", label: "Tentang" },
  { href: "#testimoni", label: "Testimoni" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#beranda" className="font-display text-lg font-bold tracking-tight text-ink">
          {siteConfig.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#order"
          className="hidden rounded-full bg-ink px-5 py-2.5 font-mono text-sm text-paper transition-colors hover:bg-blue md:inline-block"
        >
          Order Sekarang
        </a>

        <button
          aria-label="Buka menu"
          aria-expanded={open}
          className="-mr-2 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex w-6 flex-col gap-1.5">
            <span className="h-0.5 w-full bg-ink" />
            <span className="h-0.5 w-full bg-ink" />
            <span className="h-0.5 w-3/4 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line bg-paper px-4 py-4 sm:px-6 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 font-mono text-sm text-ink-soft"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-ink px-5 py-2.5 text-center font-mono text-sm text-paper"
          >
            Order Sekarang
          </a>
        </nav>
      )}
    </header>
  );
}
