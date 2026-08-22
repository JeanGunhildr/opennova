// ─────────────────────────────────────────────────────────
// OpenNova landing page — static copy & mock data
// ─────────────────────────────────────────────────────────

export const navLinks = [
  { label: "Kolaborasi",       href: "#kolaborasi" },
  { label: "Challenge Terbaru", href: "#challenge"  },
  { label: "Insentif Inovasi", href: "#insentif"   },
  { label: "Hubungi Kami",     href: "#kontak"     },
] as const;

export type NavLink = (typeof navLinks)[number];

// ── Partner strip ─────────────────────────────────────────
export const partners = [
  "Pertamina",
  "Telkom Indonesia",
  "Bank Mandiri",
  "PLN",
  "Unilever",
  "Gojek",
  "Astra International",
  "Bank BCA",
  "Indofood",
  "Grab Indonesia",
] as const;

// ── Challenge cards ───────────────────────────────────────
export interface Challenge {
  id: string;
  category: string;
  title: string;
  reward: string;
  deadline: string;
  /** CSS-compatible linear-gradient stop colors */
  bgFrom: string;
  bgVia: string;
  bgTo: string;
}

export const challenges: Challenge[] = [
  {
    id: "ch-1",
    category: "Teknologi & Rekayasa",
    title: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
    reward: "Rp50.000.000",
    deadline: "17 November 2026",
    bgFrom: "#1a2035",
    bgVia:  "#1e3358",
    bgTo:   "#0d1524",
  },
  {
    id: "ch-2",
    category: "Lingkungan",
    title: "Inovasi Pengurangan Limbah Plastik pada Ekosistem Pesisir dan Laut",
    reward: "Rp7.000.000",
    deadline: "30 Oktober 2026",
    bgFrom: "#0d2818",
    bgVia:  "#184d30",
    bgTo:   "#0a1f12",
  },
  {
    id: "ch-3",
    category: "Manufaktur & Industri",
    title: "Optimasi Lini Produksi dengan Computer Vision dan Robotika Adaptif",
    reward: "Rp25.000.000",
    deadline: "12 Oktober 2026",
    bgFrom: "#1c1008",
    bgVia:  "#2d1a06",
    bgTo:   "#3d2206",
  },
];

// ── Collaboration process steps ───────────────────────────
export const processSteps = [
  "Pilih challenge",
  "Pelajari detail challenge",
  "Setujui ketentuan & ikuti",
  "Unggah & kirim solusi anda",
  "Raih insentif & peluang kolaborasi",
] as const;

// ── Incentive cards ───────────────────────────────────────
export interface Incentive {
  id: string;
  title: string;
  description: string;
  featured: boolean;
}

export const incentives: Incentive[] = [
  {
    id: "inc-1",
    title: "Hadiah Finansial",
    description:
      "Raih hadiah uang tunai hingga ratusan juta rupiah untuk solusi inovatif terbaik yang lolos seleksi ketat.",
    featured: true,
  },
  {
    id: "inc-2",
    title: "Sertifikat Resmi",
    description:
      "Dapatkan sertifikat pengakuan resmi dari perusahaan mitra dan OpenNova untuk memperkuat portofolio profesional Anda.",
    featured: false,
  },
  {
    id: "inc-3",
    title: "Kerja Sama",
    description:
      "Peluang kolaborasi langsung dengan perusahaan mitra untuk mengembangkan solusi Anda ke tahap implementasi nyata.",
    featured: false,
  },
];
