// ─────────────────────────────────────────────────────────
// OpenNova Seeker - Kelola Challenge: Ruang Diskusi Data & Models
// ─────────────────────────────────────────────────────────

export interface DiscussionReply {
  id: string;
  authorName: string;
  authorRole: "Seeker" | "Solver";
  isOfficial: boolean;
  avatarUrl?: string;
  timestamp: string;
  content: string;
}

export interface DiscussionThread {
  id: string;
  authorName: string;
  authorRole: "Solver";
  avatarUrl?: string;
  timestamp: string;
  content: string;
  replies: DiscussionReply[];
}

export const MOCK_INITIAL_DISCUSSIONS: DiscussionThread[] = [
  {
    id: "thread-1",
    authorName: "Farhan Yudha Pratama",
    authorRole: "Solver",
    timestamp: "04 Sep 2026, 14:20 WIB",
    content:
      "Halo tim Telkom Indonesia, apakah untuk format dataset time-series sensor optik yang disediakan sudah include data noise saat cuaca ekstrem, atau tim kami perlu membuat modul augmentasi simulasi noise sendiri?",
    replies: [
      {
        id: "reply-1-1",
        authorName: "Telkom Indonesia",
        authorRole: "Seeker",
        isOfficial: true,
        timestamp: "04 Sep 2026, 16:45 WIB",
        content:
          "Halo Farhan, dataset dasar yang diberikan mencakup data mentah 3 bulan operasional normal. Modul augmentasi atau penanganan anomali cuaca ekstrem sangat kami apresiasi dan akan dinilai sebagai nilai tambah pada aspek Inovasi & Orisinalitas.",
      },
    ],
  },
  {
    id: "thread-2",
    authorName: "Nova Vanguard Team",
    authorRole: "Solver",
    timestamp: "03 Sep 2026, 10:15 WIB",
    content:
      "Terkait batasan latensi deteksi anomali < 50ms, apakah evaluasi inferensi AI akan diuji pada perangkat Edge Computing lokal yang spesifik, atau menggunakan server cloud benchmark?",
    replies: [
      {
        id: "reply-2-1",
        authorName: "Telkom Indonesia",
        authorRole: "Seeker",
        isOfficial: true,
        timestamp: "03 Sep 2026, 11:30 WIB",
        content:
          "Evaluasi tahap penjurian teknis akan dijalankan menggunakan instance simulasi Edge standar (4 vCPU, 8GB RAM, accelerator T4). Pastikan model tidak membutuhkan overhead resource berlebih agar latensi tetap terjaga.",
      },
    ],
  },
  {
    id: "thread-3",
    authorName: "Bambang Pamungkas",
    authorRole: "Solver",
    timestamp: "02 Sep 2026, 09:00 WIB",
    content:
      "Selamat pagi, apakah dokumen proposal teknis boleh menyertakan lampiran arsitektur sistem dalam bentuk diagram interaktif web atau video demo terpisah di dalam folder Google Drive?",
    replies: [],
  },
  {
    id: "thread-4",
    authorName: "Blater Child",
    authorRole: "Solver",
    timestamp: "01 Sep 2026, 17:35 WIB",
    content:
      "Untuk tahap Pitching Final, apakah seluruh anggota tim diwajibkan hadir secara fisik, atau diperkenankan presentasi daring (hybrid)?",
    replies: [
      {
        id: "reply-4-1",
        authorName: "Telkom Indonesia",
        authorRole: "Seeker",
        isOfficial: true,
        timestamp: "01 Sep 2026, 18:20 WIB",
        content:
          "Sesi Pitching Final dapat dihadiri secara hybrid via Zoom bagi finalis di luar Jabodetabek. Namun kami tetap menyambut hangat kehadiran langsung bagi tim yang memungkinkan hadir.",
      },
    ],
  },
];
