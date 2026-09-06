// ─────────────────────────────────────────────────────────
// OpenNova Admin — types & UI helpers
// ─────────────────────────────────────────────────────────

export const PLATFORM_FEE_RATE = 0.1;
export const SPECIAL_COLLAB_THRESHOLD = 40_000_000;

// ── Types ─────────────────────────────────────────────────

export type ActiveChallengeStatus =
  | "Challenge Dibuka"
  | "Penjurian Ahli"
  | "Pitching Final"
  | "Menunggu Persetujuan"
  | "Selesai"
  | "Ditolak"
  | "Takedown"
  | string;

export interface ActiveChallengeRow {
  id: string;
  name: string;
  seekerName: string;
  category: string;
  rewardAmount: number;
  publishedAt: string;
  status: ActiveChallengeStatus;
  rawStatus?: string;
}

export interface CompletedChallengeRow {
  id: string;
  name: string;
  seekerName: string;
  category: string;
  rewardAmount: number;
  completedAt: string;
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
  phone?: string;
  companyDescription?: string | null;
  website?: string | null;
  legalDocumentPath?: string | null;
  challengesCreated: number;
  createdAt?: string;
}

export interface SolverRow {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  address: string;
  bio?: string | null;
  institution?: string | null;
  birthday?: string | null;
  challengesJoined: number;
  createdAt?: string;
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

export function formatDateID(iso?: string | null): string {
  if (!iso || typeof iso !== "string") return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
}

export function isSpecialCollab(rewardAmount: number): boolean {
  return rewardAmount >= SPECIAL_COLLAB_THRESHOLD;
}

export function platformFee(rewardAmount: number): number {
  return Math.round(rewardAmount * PLATFORM_FEE_RATE);
}
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
    name: "Platform Monitoring Kualitas Air",
    seekerName: "PT Tirta Investama",
    category: "Lingkungan",
    rewardAmount: 50_000_000,
    publishedAt: "2026-06-20",
    status: "Challenge Dibuka",
  },
  {
    id: "ac-3",
    name: "AI untuk Optimasi Distribusi Pangan",
    seekerName: "PT XYZ",
    category: "Teknologi",
    rewardAmount: 60_000_000,
    publishedAt: "2026-06-12",
    status: "Pitching Final",
  },
];

// ── Status helpers ─────────────────────────────────────────

export function activeChallengeStatusTone(
  status: ActiveChallengeStatus,
): "neutral" | "brand" | "warning" | "success" {
  switch (status) {
    case "Challenge Dibuka":
      return "success";

    case "Penjurian Ahli":
      return "brand";

    case "Pitching Final":
      return "warning";

    case "Menunggu Persetujuan":
      return "neutral";

    default:
      return "neutral";
  }
}

export const seekers: SeekerRow[] = [
  {
    id: "s-1",
    orgName: "PT Pertamina (Persero)",
    email: "contact@pertamina.com",
    orgType: "BUMN",
    contactPerson: "Budi Santoso",
    officeAddress: "Jakarta Pusat",
    challengesCreated: 5,
  },
  {
    id: "s-2",
    orgName: "PT Telkom Indonesia",
    email: "innovation@telkom.co.id",
    orgType: "BUMN",
    contactPerson: "Siti Rahma",
    officeAddress: "Bandung",
    challengesCreated: 3,
  },
  {
    id: "s-3",
    orgName: "PT Indofood Sukses Makmur",
    email: "corporate@indofood.co.id",
    orgType: "Swasta",
    contactPerson: "Hendra Wijaya",
    officeAddress: "Jakarta Selatan",
    challengesCreated: 2,
  },
];

export const solvers: SolverRow[] = [
  {
    id: "sl-1",
    fullName: "Ahmad Fauzi",
    email: "ahmad.fauzi@gmail.com",
    whatsapp: "081234567890",
    address: "Surabaya",
    challengesJoined: 4,
  },
  {
    id: "sl-2",
    fullName: "Dewi Lestari",
    email: "dewi.lestari@gmail.com",
    whatsapp: "082198765432",
    address: "Yogyakarta",
    challengesJoined: 6,
  },
  {
    id: "sl-3",
    fullName: "Rizky Pratama",
    email: "rizky.pratama@gmail.com",
    whatsapp: "085678901234",
    address: "Bandung",
    challengesJoined: 2,
  },
];

export const certificateAuthorizations: CertificateAuthorizationRow[] = [
  {
    id: "ca-1",
    orgName: "PT Pertamina (Persero)",
    picName: "Budi Santoso",
    position: "Head of Innovation",
    hasSignature: true,
    signatureFileName: "signature-pertamina.png",
  },
  {
    id: "ca-2",
    orgName: "PT Telkom Indonesia",
    picName: "Siti Rahma",
    position: "VP Digital Transformation",
    hasSignature: false,
  },
];

export const winners: WinnerRow[] = [
  {
    id: "w-1",
    winnerName: "Tim Alpha Tech",
    isTeam: true,
    teamSize: 3,
    teamMembers: ["Ahmad Fauzi", "Dewi Lestari", "Rizky Pratama"],
    challengeName: "Aplikasi Pemantauan Distribusi LPG Bersubsidi",
    seekerName: "PT Pertamina (Persero)",
    certificateIssued: true,
    certificateFileName: "certificate-alpha-tech.pdf",
  },
  {
    id: "w-2",
    winnerName: "Budi Setiawan",
    isTeam: false,
    challengeName: "Panel Surya Portable untuk Wilayah Terpencil",
    seekerName: "PT Xurya Daya Indonesia",
    certificateIssued: true,
    certificateFileName: "certificate-budi.pdf",
  },
];

export function getDashboardSummary() {
  const totalSolver = solvers.length * 187;
  const totalSeeker = seekers.length * 23;
  const totalActiveChallenge = activeChallenges.length;

  const allRewardsForFee = [
    ...activeChallenges.map((c) => c.rewardAmount),
    ...completedChallenges.map((c) => c.rewardAmount),
  ];

  const platformRevenue = allRewardsForFee.reduce(
    (sum, reward) => sum + platformFee(reward),
    0,
  );

  const escrowHeld = activeChallenges.reduce(
    (sum, c) => sum + c.rewardAmount,
    0,
  );

  return {
    totalSolver,
    totalSeeker,
    totalActiveChallenge,
    platformRevenue,
    escrowHeld,
  };
}