// ─────────────────────────────────────────────────────────
// OpenNova Solver Dashboard — static mock data
// Replace with real API calls when the backend is ready.
// ─────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────
export type ChallengeStatus = "active" | "draft" | "review" | "done";
export type NotificationType = "challenge" | "system" | "earnings";
export type NotificationGroup = "today" | "yesterday" | "earlier";

export interface DashboardChallenge {
  id: string;
  category: string;
  company: string;
  companyInitials: string;
  title: string;
  reward: string;
  deadline: string;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
}

export interface WorkspaceItem {
  id: string;
  challengeTitle: string;
  company: string;
  status: ChallengeStatus;
  deadline: string;
  submittedAt?: string;
  completedAt?: string;
  reward?: string;
}

export interface CertificateRow {
  id: string;
  challengeName: string;
  company: string;
  date: string;
  status: "Selesai" | "Menang";
  downloadable: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  group: NotificationGroup;
  action?: string;
}

// ── Challenge discovery data ───────────────────────────────
export const dashboardChallenges: DashboardChallenge[] = [
  {
    id: "dc-1",
    category: "Teknologi & Rekayasa",
    company: "Telkom Indonesia",
    companyInitials: "TI",
    title: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
    reward: "Rp 50.000.000",
    deadline: "17 Nov 2026",
    bgFrom: "#1a2035",
    bgVia: "#1e3358",
    bgTo: "#0d1524",
  },
  {
    id: "dc-2",
    category: "Lingkungan",
    company: "Pertamina",
    companyInitials: "PT",
    title: "Inovasi Pengurangan Limbah Plastik pada Ekosistem Pesisir dan Laut",
    reward: "Rp 7.000.000",
    deadline: "30 Okt 2026",
    bgFrom: "#0d2818",
    bgVia: "#184d30",
    bgTo: "#0a1f12",
  },
  {
    id: "dc-3",
    category: "Manufaktur & Industri",
    company: "Astra International",
    companyInitials: "AI",
    title: "Optimasi Lini Produksi dengan Computer Vision dan Robotika Adaptif",
    reward: "Rp 25.000.000",
    deadline: "12 Okt 2026",
    bgFrom: "#1c1008",
    bgVia: "#2d1a06",
    bgTo: "#3d2206",
  },
  {
    id: "dc-4",
    category: "Kesehatan",
    company: "Kimia Farma",
    companyInitials: "KF",
    title: "Platform Telemedisin Berbasis AI untuk Layanan Kesehatan Pelosok",
    reward: "Rp 35.000.000",
    deadline: "5 Des 2026",
    bgFrom: "#0a1a2e",
    bgVia: "#0d2540",
    bgTo: "#071624",
  },
  {
    id: "dc-5",
    category: "Energi",
    company: "PLN",
    companyInitials: "PL",
    title: "Sistem Smart Grid Berbasis IoT untuk Efisiensi Distribusi Energi",
    reward: "Rp 60.000.000",
    deadline: "20 Jan 2027",
    bgFrom: "#1a1a0a",
    bgVia: "#2e2e12",
    bgTo: "#1a1a08",
  },
  {
    id: "dc-6",
    category: "Agrikultur",
    company: "Indofood",
    companyInitials: "IF",
    title: "Solusi Precision Farming untuk Meningkatkan Hasil Panen Petani Lokal",
    reward: "Rp 15.000.000",
    deadline: "28 Nov 2026",
    bgFrom: "#0f1a10",
    bgVia: "#1a2e1c",
    bgTo: "#0c150d",
  },
];

// ── Workspace items ────────────────────────────────────────
export const workspaceItems: WorkspaceItem[] = [
  {
    id: "ws-1",
    challengeTitle: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
    company: "Telkom Indonesia",
    status: "active",
    deadline: "17 Nov 2026",
  },
  {
    id: "ws-2",
    challengeTitle: "Inovasi Pengurangan Limbah Plastik pada Ekosistem Pesisir",
    company: "Pertamina",
    status: "draft",
    deadline: "30 Okt 2026",
  },
  {
    id: "ws-3",
    challengeTitle: "Platform Telemedisin Berbasis AI untuk Layanan Kesehatan",
    company: "Kimia Farma",
    status: "review",
    submittedAt: "10 Agu 2026",
    deadline: "5 Des 2026",
  },
  {
    id: "ws-4",
    challengeTitle: "Optimasi Rute Logistik Menggunakan Algoritma Genetika",
    company: "JNE",
    status: "done",
    completedAt: "3 Jul 2026",
    reward: "Rp 20.000.000",
    deadline: "1 Jul 2026",
  },
];

// ── Certificate rows ───────────────────────────────────────
export const certificateRows: CertificateRow[] = [
  {
    id: "cert-1",
    challengeName: "Optimasi Rute Logistik Menggunakan Algoritma Genetika",
    company: "JNE",
    date: "3 Jul 2026",
    status: "Menang",
    downloadable: true,
  },
  {
    id: "cert-2",
    challengeName: "Sistem Deteksi Dini Banjir Berbasis Sensor IoT",
    company: "BNPB",
    date: "14 Apr 2026",
    status: "Selesai",
    downloadable: true,
  },
  {
    id: "cert-3",
    challengeName: "Inovasi Packaging Ramah Lingkungan untuk UMKM",
    company: "Paragon",
    date: "20 Jan 2026",
    status: "Menang",
    downloadable: true,
  },
];

// ── Notifications ──────────────────────────────────────────
export const notifications: Notification[] = [
  {
    id: "n-1",
    type: "challenge",
    title: "Challenge baru: Sistem AI Pendeteksi Kebocoran Pipa",
    description: "Pertamina membuka challenge baru yang sesuai dengan keahlian Rekayasa & Energimu. Hadiah Rp 80.000.000.",
    timestamp: "2 jam lalu",
    read: false,
    group: "today",
    action: "Lihat Challenge",
  },
  {
    id: "n-2",
    type: "earnings",
    title: "Hadiah berhasil dikreditkan ke saldo",
    description: "Selamat! Hadiah sebesar Rp 50.000.000 dari challenge Optimasi Rute Logistik telah masuk ke saldo kamu.",
    timestamp: "5 jam lalu",
    read: false,
    group: "today",
  },
  {
    id: "n-3",
    type: "system",
    title: "Profil kamu berhasil diverifikasi",
    description: "Identitas dan keahlianmu telah terverifikasi oleh tim OpenNova. Kamu kini dapat mengikuti challenge berhadiah.",
    timestamp: "1 hari lalu",
    read: true,
    group: "yesterday",
  },
  {
    id: "n-4",
    type: "challenge",
    title: "Deadline mendekat: Platform Telemedisin AI",
    description: "Challenge Platform Telemedisin Berbasis AI akan berakhir dalam 3 hari. Pastikan submission-mu sudah dikirim.",
    timestamp: "1 hari lalu",
    read: true,
    group: "yesterday",
    action: "Lihat Challenge",
  },
  {
    id: "n-5",
    type: "system",
    title: "Submission diterima untuk ditinjau",
    description: "Submission kamu untuk challenge Inovasi Packaging Ramah Lingkungan telah berhasil diterima dan sedang dalam proses penilaian.",
    timestamp: "5 hari lalu",
    read: true,
    group: "earlier",
  },
  {
    id: "n-6",
    type: "earnings",
    title: "Sertifikat challenge tersedia untuk diunduh",
    description: "Sertifikat partisipasi challenge Sistem Deteksi Dini Banjir kini sudah tersedia. Unduh dan tambahkan ke portofoliomu.",
    timestamp: "1 minggu lalu",
    read: true,
    group: "earlier",
  },
];
// ── Workspace Challenge stage type ────────────────────────
export type ChallengeStage = "submitted" | "screening" | "expert-review" | "result";

export interface WorkspaceChallenge {
  id: string;
  category: string;
  company: string;
  companyInitials: string;
  verified: boolean;
  title: string;
  reward: string;
  deadline: string; // ISO date string
  completed: boolean;
  outcome: "winner" | "failed" | null;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
}

// Generate some dates relative to now to ensure overdue logic works
const now = new Date();
const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

export const workspaceChallenges: WorkspaceChallenge[] = [
  {
    id: "wc-1",
    category: "Teknologi & Rekayasa",
    company: "Telkom Indonesia",
    companyInitials: "TI",
    verified: true,
    title: "Solusi Monitoring Infrastruktur Jaringan Berbasis AI Real-Time",
    reward: "Rp 50.000.000",
    deadline: futureDate,
    completed: false,
    outcome: null,
    bgFrom: "#1a2035",
    bgVia: "#1e3358",
    bgTo: "#0d1524",
  },
  {
    id: "wc-2",
    category: "Lingkungan",
    company: "Pertamina",
    companyInitials: "PT",
    verified: true,
    title: "Inovasi Pengurangan Limbah Plastik pada Ekosistem Pesisir dan Laut",
    reward: "Rp 7.000.000",
    deadline: futureDate,
    completed: false,
    outcome: null,
    bgFrom: "#0d2818",
    bgVia: "#184d30",
    bgTo: "#0a1f12",
  },
  {
    id: "wc-3",
    category: "Kesehatan",
    company: "Kimia Farma",
    companyInitials: "KF",
    verified: true,
    title: "Platform Telemedisin Berbasis AI untuk Layanan Kesehatan Pelosok",
    reward: "Rp 35.000.000",
    deadline: pastDate, // Overdue but not marked completed yet
    completed: false,
    outcome: null,
    bgFrom: "#0a1a2e",
    bgVia: "#0d2540",
    bgTo: "#071624",
  },
  {
    id: "wc-4",
    category: "Energi",
    company: "PLN",
    companyInitials: "PL",
    verified: false,
    title: "Sistem Smart Grid Berbasis IoT untuk Efisiensi Distribusi Energi",
    reward: "Rp 60.000.000",
    deadline: pastDate,
    completed: true,
    outcome: "failed",
    bgFrom: "#1a1a0a",
    bgVia: "#2e2e12",
    bgTo: "#1a1a08",
  },
  {
    id: "wc-5",
    category: "Logistik",
    company: "JNE",
    companyInitials: "JN",
    verified: true,
    title: "Optimasi Rute Logistik Menggunakan Algoritma Genetika Multi-Tujuan",
    reward: "Rp 20.000.000",
    deadline: pastDate,
    completed: true,
    outcome: "winner",
    bgFrom: "#1c0a1a",
    bgVia: "#2e1230",
    bgTo: "#140818",
  },
];