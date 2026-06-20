export const siteConfig = {
  name: "Kreazy.Design",
  tagline: "Jasa Desain Grafis",
  // Ganti dengan nomor WhatsApp bisnis kamu, format: 62xxxxxxxxxx (tanpa + atau 0 di depan)
  whatsappNumber: "6285712605291",
  instagram: "https://instagram.com/kreazy.design",
};

export type Service = {
  id: string;
  title: string;
  desc: string;
  priceFrom: string;
  badge?: string;
};

export const services: Service[] = [
  {
    id: "logo",
    title: "Desain Logo",
    desc: "2 konsep awal, revisi sampai cocok, file PNG/JPG/PDF.",
    priceFrom: "Rp 50rb",
  },
  {
    id: "poster-banner",
    title: "Poster & Banner Promosi",
    desc: "Desain siap pakai untuk feed, story, atau cetak.",
    priceFrom: "Rp 35rb",
    badge: "Paling Dicari",
  },
  {
    id: "konten-sosmed",
    title: "Konten Sosial Media",
    desc: "Per desain, cocok untuk feed Instagram & promosi harian.",
    priceFrom: "Rp 20rb",
  },
  {
    id: "x-banner",
    title: "X-Banner / Spanduk",
    desc: "Desain ukuran custom, siap kirim ke percetakan.",
    priceFrom: "Rp 75rb",
  },
  {
    id: "kartu-nama",
    title: "Kartu Nama",
    desc: "Desain depan-belakang, file siap cetak.",
    priceFrom: "Rp 30rb",
  },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

// Contoh testimoni — ganti dengan testimoni asli dari pelanggan kamu.
export const testimonials: Testimonial[] = [
  {
    name: "Dimas R.",
    role: "Ketua Panitia, Acara Sekolah",
    quote:
      "Order banner buat acara sekolah, sehari jadi dan hasilnya rapi banget. Harganya juga jauh di bawah ekspektasi.",
  },
  {
    name: "Sri W.",
    role: "Pemilik UMKM Katering",
    quote:
      "Logo dan konten feed Instagram dibuatin sekaligus, konsisten temanya. Komunikasinya enak, revisi cepat ditanggapi.",
  },
  {
    name: "RT 09 Kelurahan",
    role: "Kepanitiaan Acara Warga",
    quote:
      "Bikin struktur organisasi sama spanduk acara 17 Agustus, desainnya modern tapi tetap gampang dibaca dari jauh.",
  },
];
