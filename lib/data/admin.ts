// ─────────────────────────────────────────────────────────
// OpenNova Admin — static mock data & types
// Replace with real API / Supabase queries when backend is ready.
// ─────────────────────────────────────────────────────────

export const PLATFORM_FEE_RATE = 0.1; // 10% dari nominal hadiah
export const SPECIAL_COLLAB_THRESHOLD = 40_000_000; // >= Rp40.000.000

// ── Types ─────────────────────────────────────────────────

export type ActiveChallengeStatus =
  | "Challenge Dibuka"
  | "Penjurian Ahli"
  | "Pitching Final";

export interface ActiveChallengeRow {
  id: string;
  name: string;
  seekerName: string;
  category: string;
  rewardAmount: number;
  publishedAt: string; // ISO date
  status: ActiveChallengeStatus;
}

export interface CompletedChallengeRow {
  id: string;
  name: string;
  seekerName: string;
  category: string;
  rewardAmount: number;
  completedAt: string; // ISO date
  rewardPaid: boolean;
  certificateIssued: boolean;
}

export interface SeekerRow {
  id: string;
  orgName: string;
  email: string;
  orgType: string;
  contactPerson: string;
  officeAddress: string;
  challengesCreated: number;
}

export interface SolverRow {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  address: string;
  challengesJoined: number;
}

export interface CertificateAuthorizationRow {
  id: string;
  orgName: string;
  picName: string;
  position: string;
  hasSignature: boolean;
  signatureFileName?: string;
}

export interface WinnerRow {
  id: string;
  winnerName: string;
  isTeam: boolean;
  teamSize?: number;
  teamMembers?: string[];
  challengeName: string;
  seekerName: string;
  certificateIssued: boolean;
  certificateFileName?: string;
}

// ── Helpers ───────────────────────────────────────────────

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateID(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function isSpecialCollab(rewardAmount: number): boolean {
  return rewardAmount >= SPECIAL_COLLAB_THRESHOLD;
}

export function platformFee(rewardAmount: number): number {
  return Math.round(rewardAmount * PLATFORM_FEE_RATE);
}

// ── Mock data: Active challenges ───────────────────────────

export const activeChallenges: ActiveChallengeRow[] = [
  {
    id: "ac-1",
    name: "Sistem Deteksi Dini Kebocoran Pipa Gas",
    seekerName: "PT Pertamina (Persero)",
    category: "Energi & Lingkungan",
    rewardAmount: 75_000_000,
    publishedAt: "2026-07-02",
    status: "Penjurian Ahli",
  },
  {
    id: "ac-2",
    name: "Optimasi Rantai Pasok Produk UMKM Digital",
    seekerName: "PT Telkom Indonesia",
    category: "Teknologi & Rekayasa",
    rewardAmount: 35_000_000,
    publishedAt: "2026-07-18",
    status: "Challenge Dibuka",
  },
  {
    id: "ac-3",
    name: "Inovasi Kemasan Biodegradable untuk Makanan Ringan",
    seekerName: "PT Indofood Sukses Makmur",
    category: "Material & Manufaktur",
    rewardAmount: 50_000_000,
    publishedAt: "2026-06-25",
    status: "Pitching Final",
  },
  {
    id: "ac-4",
    name: "Platform Monitoring Kualitas Udara Tambang",
    seekerName: "PT Adaro Energy Indonesia",
    category: "Energi & Lingkungan",
    rewardAmount: 42_000_000,
    publishedAt: "2026-08-01",
    status: "Challenge Dibuka",
  },
  {
    id: "ac-5",
    name: "Formulasi Bahan Aktif Perawatan Kulit Lokal",
    seekerName: "PT Paragon Technology and Innovation",
    category: "Kesehatan & Kecantikan",
    rewardAmount: 28_000_000,
    publishedAt: "2026-08-10",
    status: "Challenge Dibuka",
  },
  {
    id: "ac-6",
    name: "Sistem Manajemen Energi Surya Skala Komersial",
    seekerName: "PT Xurya Daya Indonesia",
    category: "Energi & Lingkungan",
    rewardAmount: 60_000_000,
    publishedAt: "2026-07-29",
    status: "Penjurian Ahli",
  },
];

// ── Mock data: Completed challenges ────────────────────────

export const completedChallenges: CompletedChallengeRow[] = [
  {
    id: "cc-1",
    name: "Aplikasi Pemantauan Distribusi LPG Bersubsidi",
    seekerName: "PT Pertamina (Persero)",
    category: "Teknologi & Rekayasa",
    rewardAmount: 45_000_000,
    completedAt: "2026-05-14",
    rewardPaid: true,
    certificateIssued: true,
  },
  {
    id: "cc-2",
    name: "Redesain Kemasan Ramah Lingkungan Mi Instan",
    seekerName: "PT Indofood Sukses Makmur",
    category: "Material & Manufaktur",
    rewardAmount: 30_000_000,
    completedAt: "2026-04-20",
    rewardPaid: true,
    certificateIssued: false,
  },
  {
    id: "cc-3",
    name: "Chatbot Layanan Pelanggan Berbasis AI",
    seekerName: "PT Telkom Indonesia",
    category: "Teknologi & Rekayasa",
    rewardAmount: 55_000_000,
    completedAt: "2026-03-11",
    rewardPaid: false,
    certificateIssued: false,
  },
  {
    id: "cc-4",
    name: "Panel Surya Portable untuk Wilayah Terpencil",
    seekerName: "PT Xurya Daya Indonesia",
    category: "Energi & Lingkungan",
    rewardAmount: 65_000_000,
    completedAt: "2026-02-27",
    rewardPaid: true,
    certificateIssued: true,
  },
];

// ── Mock data: Seekers ──────────────────────────────────────

export const seekers: SeekerRow[] = [
  {
    id: "sk-1",
    orgName: "PT Pertamina (Persero)",
    email: "innovation@pertamina.com",
    orgType: "BUMN",
    contactPerson: "Dian Kusuma",
    officeAddress: "Jl. Medan Merdeka Timur No. 1A, Jakarta Pusat",
    challengesCreated: 6,
  },
  {
    id: "sk-2",
    orgName: "PT Telkom Indonesia",
    email: "opencollab@telkom.co.id",
    orgType: "BUMN",
    contactPerson: "Budi Santoso",
    officeAddress: "Jl. Japati No. 1, Bandung",
    challengesCreated: 9,
  },
  {
    id: "sk-3",
    orgName: "PT Indofood Sukses Makmur",
    email: "rnd@indofood.co.id",
    orgType: "Perusahaan Nasional",
    contactPerson: "Sri Wulandari",
    officeAddress: "Sudirman Plaza, Jakarta Selatan",
    challengesCreated: 4,
  },
  {
    id: "sk-4",
    orgName: "PT Adaro Energy Indonesia",
    email: "csr.innovation@adaro.com",
    orgType: "Perusahaan Nasional",
    contactPerson: "Rangga Wirawan",
    officeAddress: "Menara Karya, Jakarta Selatan",
    challengesCreated: 3,
  },
  {
    id: "sk-5",
    orgName: "PT Paragon Technology and Innovation",
    email: "partnership@paragon-innovation.com",
    orgType: "Perusahaan Nasional",
    contactPerson: "Amelia Putri",
    officeAddress: "Jl. Swadarma Raya, Jakarta Selatan",
    challengesCreated: 2,
  },
  {
    id: "sk-6",
    orgName: "PT Xurya Daya Indonesia",
    email: "hello@xurya.com",
    orgType: "Startup / Multinasional",
    contactPerson: "Fajar Nugraha",
    officeAddress: "Jl. Kemang Raya, Jakarta Selatan",
    challengesCreated: 3,
  },
];

// ── Mock data: Solvers ──────────────────────────────────────

export const solvers: SolverRow[] = [
  {
    id: "sv-1",
    fullName: "Ahmad Fauzan",
    email: "ahmad.fauzan@gmail.com",
    whatsapp: "0812-3456-7890",
    address: "Depok, Jawa Barat",
    challengesJoined: 5,
  },
  {
    id: "sv-2",
    fullName: "Nadia Rahmawati",
    email: "nadia.rahma@gmail.com",
    whatsapp: "0813-9988-2211",
    address: "Surabaya, Jawa Timur",
    challengesJoined: 8,
  },
  {
    id: "sv-3",
    fullName: "Muhammad Rizky Pratama",
    email: "rizky.pratama@gmail.com",
    whatsapp: "0857-1122-3344",
    address: "Bandung, Jawa Barat",
    challengesJoined: 3,
  },
  {
    id: "sv-4",
    fullName: "Salsabila Putri Anggraini",
    email: "salsabila.pa@gmail.com",
    whatsapp: "0821-6677-8899",
    address: "Yogyakarta",
    challengesJoined: 6,
  },
  {
    id: "sv-5",
    fullName: "Bagas Wicaksono",
    email: "bagas.wicaksono@gmail.com",
    whatsapp: "0895-3344-5566",
    address: "Malang, Jawa Timur",
    challengesJoined: 2,
  },
  {
    id: "sv-6",
    fullName: "Clara Amanda Simanjuntak",
    email: "clara.amanda@gmail.com",
    whatsapp: "0838-2233-4455",
    address: "Medan, Sumatera Utara",
    challengesJoined: 4,
  },
];

// ── Mock data: Certificate authorization files ──────────────

export const certificateAuthorizations: CertificateAuthorizationRow[] = [
  {
    id: "auth-1",
    orgName: "PT Pertamina (Persero)",
    picName: "Dian Kusuma",
    position: "VP Innovation & Digitalization",
    hasSignature: true,
    signatureFileName: "otorisasi-pertamina.pdf",
  },
  {
    id: "auth-2",
    orgName: "PT Telkom Indonesia",
    picName: "Budi Santoso",
    position: "Head of Open Innovation",
    hasSignature: true,
    signatureFileName: "otorisasi-telkom.pdf",
  },
  {
    id: "auth-3",
    orgName: "PT Indofood Sukses Makmur",
    picName: "Sri Wulandari",
    position: "R&D Director",
    hasSignature: false,
  },
  {
    id: "auth-4",
    orgName: "PT Xurya Daya Indonesia",
    picName: "Fajar Nugraha",
    position: "Co-Founder & CEO",
    hasSignature: true,
    signatureFileName: "otorisasi-xurya.pdf",
  },
];

// ── Mock data: Winners management ───────────────────────────

export const winners: WinnerRow[] = [
  {
    id: "wn-1",
    winnerName: "Ahmad Fauzan",
    isTeam: false,
    challengeName: "Aplikasi Pemantauan Distribusi LPG Bersubsidi",
    seekerName: "PT Pertamina (Persero)",
    certificateIssued: true,
    certificateFileName: "sertifikat-ahmad-fauzan.pdf",
  },
  {
    id: "wn-2",
    winnerName: "Tim Nusantara Digital",
    isTeam: true,
    teamSize: 3,
    teamMembers: ["Nadia Rahmawati", "Bagas Wicaksono", "Clara Amanda Simanjuntak"],
    challengeName: "Redesain Kemasan Ramah Lingkungan Mi Instan",
    seekerName: "PT Indofood Sukses Makmur",
    certificateIssued: false,
  },
  {
    id: "wn-3",
    winnerName: "Tim Solaris",
    isTeam: true,
    teamSize: 2,
    teamMembers: ["Muhammad Rizky Pratama", "Salsabila Putri Anggraini"],
    challengeName: "Panel Surya Portable untuk Wilayah Terpencil",
    seekerName: "PT Xurya Daya Indonesia",
    certificateIssued: true,
    certificateFileName: "sertifikat-tim-solaris.pdf",
  },
  {
    id: "wn-4",
    winnerName: "Nadia Rahmawati",
    isTeam: false,
    challengeName: "Chatbot Layanan Pelanggan Berbasis AI",
    seekerName: "PT Telkom Indonesia",
    certificateIssued: false,
  },
];

// ── Derived dashboard summary ────────────────────────────────

export function getDashboardSummary() {
  const totalSolver = solvers.length * 187; // demo multiplier for a realistic platform scale
  const totalSeeker = seekers.length * 23;
  const totalActiveChallenge = activeChallenges.length;

  const allRewardsForFee = [
    ...activeChallenges.map((c) => c.rewardAmount),
    ...completedChallenges.map((c) => c.rewardAmount),
  ];
  const platformRevenue = allRewardsForFee.reduce(
    (sum, reward) => sum + platformFee(reward),
    0
  );

  const escrowHeld = activeChallenges.reduce(
    (sum, c) => sum + c.rewardAmount,
    0
  );

  return {
    totalSolver,
    totalSeeker,
    totalActiveChallenge,
    platformRevenue,
    escrowHeld,
  };
}
