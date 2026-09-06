// lib/utils/seekerChallengeHelper.ts
// Helper terpusat untuk kalkulasi status canonical, jumlah peserta, dan agenda terdekat Seeker.

export type CanonicalTabId = "all" | "pending" | "active" | "completed";

export type ChallengeDbStatus =
  | "pending"
  | "rejected"
  | "ongoing"
  | "judging"
  | "final_pitch"
  | "completed";

export interface SeekerChallengeBadge {
  label: string;
  bg: string;
  text: string;
}

/**
 * Pemetaan status database ke Tab UI Canonical
 * - pending / rejected -> pending
 * - ongoing / judging / final_pitch -> active
 * - completed -> completed
 */
export function getCanonicalTab(status: string): "pending" | "active" | "completed" {
  const s = (status || "").toLowerCase();
  if (s === "pending" || s === "rejected") {
    return "pending";
  }
  if (s === "completed" || s === "closed" || s === "finished") {
    return "completed";
  }
  // ongoing, judging, final_pitch, open, etc.
  return "active";
}

/**
 * Pemetaan status database ke badge visual di card
 */
export function getStatusBadge(status: string): SeekerChallengeBadge {
  const s = (status || "").toLowerCase();

  switch (s) {
    case "pending":
      return { label: "Menunggu Approval", bg: "#393713", text: "#D8C83A" };
    case "rejected":
      return { label: "Ditolak Admin", bg: "rgba(227,0,0,0.2)", text: "#FF4D4D" };
    case "ongoing":
    case "open":
    case "published":
      return { label: "Challenge Dibuka", bg: "#143520", text: "#54D67A" };
    case "judging":
    case "expert":
      return { label: "Penjurian Ahli", bg: "rgba(216,200,58,0.18)", text: "#D8C83A" };
    case "final_pitch":
    case "pitching":
      return { label: "Pitching Final", bg: "rgba(227,0,0,0.18)", text: "#FF8A8A" };
    case "completed":
    case "winner":
    case "closed":
      return { label: "Pengumuman Pemenang", bg: "rgba(84,214,122,0.14)", text: "#54D67A" };
    default:
      return { label: "Challenge Dibuka", bg: "#143520", text: "#54D67A" };
  }
}

/**
 * Source of truth hitung peserta: panjang array challenge_entries
 */
export function getParticipantCount(entries: any[] | null | undefined): number {
  if (Array.isArray(entries)) {
    return entries.length;
  }
  return 0;
}

export interface DynamicAgendaItem {
  id: string;
  date: Date;
  month: string;
  day: string;
  title: string;
  description: string;
}

/**
 * Membentuk daftar agenda terdekat dari seluruh challenge milik Seeker
 * - Mengabaikan challenge pending & rejected
 * - Membuang tanggal yang sudah lewat
 * - Diurutkan ascending berdasarkan tanggal
 */
export function buildUpcomingAgendas(dbChallenges: any[], maxCount = 4): DynamicAgendaItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rawAgendas: DynamicAgendaItem[] = [];

  (dbChallenges || []).forEach((ch) => {
    const status = (ch.status || "").toLowerCase();
    // Abaikan pending & rejected
    if (status === "pending" || status === "rejected") return;

    const challengeName = ch.name || "Challenge";

    // 1. Event: Deadline Pengumpulan
    if (ch.deadline) {
      const deadlineDate = new Date(ch.deadline);
      if (!isNaN(deadlineDate.getTime()) && deadlineDate >= today) {
        const month = deadlineDate
          .toLocaleString("id-ID", { month: "short" })
          .toUpperCase()
          .replace(".", "");
        const day = String(deadlineDate.getDate()).padStart(2, "0");

        rawAgendas.push({
          id: `deadline-${ch.id}`,
          date: deadlineDate,
          month,
          day,
          title: "Batas Pengumpulan",
          description: `${challengeName} — Batas ${day} ${month}`,
        });
      }
    }

    // 2. Event dari Linimasa (challenge_timelines)
    const timelines = Array.isArray(ch.challenge_timelines) ? ch.challenge_timelines : [];
    timelines.forEach((t: any) => {
      const dateStr = t.end_date || t.start_date;
      if (!dateStr) return;

      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime()) || dateObj < today) return;

      const month = dateObj
        .toLocaleString("id-ID", { month: "short" })
        .toUpperCase()
        .replace(".", "");
      const day = String(dateObj.getDate()).padStart(2, "0");

      rawAgendas.push({
        id: `timeline-${ch.id}-${t.id || t.title}`,
        date: dateObj,
        month,
        day,
        title: t.title || "Agenda Challenge",
        description: `${challengeName} — ${
          t.end_date ? `Batas ${day} ${month}` : `Mulai ${day} ${month}`
        }`,
      });
    });
  });

  // Urutkan ascending berdasarkan tanggal
  rawAgendas.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Hapus duplikat id jika ada
  const uniqueAgendas: DynamicAgendaItem[] = [];
  const seenIds = new Set<string>();
  for (const item of rawAgendas) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueAgendas.push(item);
    }
  }

  return uniqueAgendas.slice(0, maxCount);
}
