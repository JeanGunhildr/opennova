import SeekerPageHeader from "@/component/seeker/dashboard/SeekerPageHeader";
import DashboardSummaryGrid from "@/component/seeker/dashboard/DashboardSummaryGrid";
import ActiveChallengePanel, {
  type ActiveChallengeItem,
  type ActiveChallengeStatus,
} from "@/component/seeker/dashboard/ActiveChallengePanel";
import AgendaPanel, {
  type AgendaItem,
} from "@/component/seeker/dashboard/AgendaPanel";
import { getCurrentUser } from "@/lib/supabase/user";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SeekerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const profile = await getCurrentProfile();
  if (profile?.role === "solver") {
    redirect("/solver");
  }

  const supabase = await createClient();

  // 1. Ambil seluruh data challenge milik Seeker ini
  const { data: dbChallenges, error } = await supabase
    .from("challenges")
    .select(`
      id,
      name,
      prize_pool,
      status,
      created_at,
      categories (
        name
      ),
      challenge_entries (
        id
      ),
      challenge_timelines (
        id,
        title,
        start_date,
        end_date,
        sort_order
      )
    `)
    .eq("seeker_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seeker dashboard data:", error);
  }

  const challenges = dbChallenges || [];

  // 2. Helper penghitung status aktif
  function computeStatus(
    status: string,
    timelines?: { title: string; start_date: string | null; end_date: string | null }[]
  ): ActiveChallengeStatus | "winner" {
    if (status === "completed" || status === "closed" || status === "winner") {
      return "winner";
    }

    if (!timelines || timelines.length === 0) {
      return "open";
    }

    const now = new Date();

    const announcement = timelines.find((t) =>
      t.title.toLowerCase().includes("pengumuman")
    );
    if (announcement?.start_date && now >= new Date(announcement.start_date)) {
      return "winner";
    }

    const pitch = timelines.find((t) =>
      t.title.toLowerCase().includes("pitch")
    );
    if (pitch?.start_date && now >= new Date(pitch.start_date)) {
      if (!pitch.end_date || now <= new Date(pitch.end_date)) {
        return "pitching";
      }
    }

    const expert = timelines.find((t) =>
      t.title.toLowerCase().includes("ahli")
    );
    if (expert?.start_date && now >= new Date(expert.start_date)) {
      if (!expert.end_date || now <= new Date(expert.end_date)) {
        return "expert";
      }
    }

    return "open";
  }

  // 3. Hitung challenge aktif & akumulasi total hadiah
  const activeChallenges: ActiveChallengeItem[] = [];
  let totalRewardSum = 0;

  challenges.forEach((ch) => {
    totalRewardSum += Number(ch.prize_pool) || 0;

    const computed = computeStatus(
      ch.status || "open",
      ch.challenge_timelines as any
    );

    if (computed !== "winner") {
      const categoryName = Array.isArray(ch.categories)
        ? ch.categories[0]?.name
        : (ch.categories as { name: string } | null)?.name || "Umum";

      const participants = Array.isArray(ch.challenge_entries)
        ? ch.challenge_entries.length
        : 0;

      activeChallenges.push({
        id: ch.id,
        title: ch.name,
        category: categoryName,
        status: computed,
        participants,
      });
    }
  });

  // 4. Format total hadiah
  let rewardLabel = "Rp 0";
  if (totalRewardSum >= 1_000_000_000) {
    rewardLabel = `Rp ${(totalRewardSum / 1_000_000_000)
      .toFixed(1)
      .replace(".0", "")} M`;
  } else if (totalRewardSum >= 1_000_000) {
    rewardLabel = `Rp ${Math.round(totalRewardSum / 1_000_000)} Jt`;
  } else if (totalRewardSum > 0) {
    rewardLabel = `Rp ${totalRewardSum.toLocaleString("id-ID")}`;
  }

  // 5. Ekstrak agenda linimasa terdekat
  interface TempAgenda {
    id: string;
    date: Date;
    month: string;
    day: string;
    title: string;
    description: string;
  }

  const rawAgendas: TempAgenda[] = [];

  challenges.forEach((ch) => {
    const timelines = ch.challenge_timelines || [];
    timelines.forEach((t: any) => {
      const dateStr = t.end_date || t.start_date;
      if (!dateStr) return;

      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return;

      // Hanya masukkan tanggal hari ini atau ke depan
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dateObj < today) return;

      const month = dateObj
        .toLocaleString("id-ID", { month: "short" })
        .toUpperCase()
        .replace(".", "");

      const day = String(dateObj.getDate()).padStart(2, "0");

      rawAgendas.push({
        id: `${ch.id}-${t.id || t.title}`,
        date: dateObj,
        month,
        day,
        title: t.title,
        description: `${ch.name} — ${
          t.end_date ? `Batas ${day} ${month}` : `Mulai ${day} ${month}`
        }`,
      });
    });
  });

  rawAgendas.sort((a, b) => a.date.getTime() - b.date.getTime());

  const agendas: AgendaItem[] = rawAgendas.slice(0, 4).map((a) => ({
    id: a.id,
    month: a.month,
    day: a.day,
    title: a.title,
    description: a.description,
  }));

  const displayName = profile?.full_name ? profile.full_name.split(" ")[0] : "";

  return (
    <div
      className="min-h-screen pt-14 lg:pt-0"
      style={{ background: "#171717" }}
    >
      <div
        className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10"
      >
        {/* Page header */}
        <SeekerPageHeader
          eyebrow={displayName ? `Halo, ${displayName}` : "Ringkasan Hari Ini"}
          title="Dashboard Aktivitas"
          description="Berikut aktivitas, perkembangan terbaru, dan status seluruh challenge yang Anda kelola."
          actionLabel="Lihat Detail Challenge"
          actionHref="/seeker/challenges"
        />

        {/* Summary cards */}
        <DashboardSummaryGrid
          totalCount={challenges.length}
          activeCount={activeChallenges.length}
          totalRewardLabel={rewardLabel}
        />

        {/* 2-column: Active challenges + Agenda */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-[18px] mt-7"
        >
          <ActiveChallengePanel challenges={activeChallenges.slice(0, 5)} />
          <AgendaPanel agendas={agendas} />
        </div>
      </div>
    </div>
  );
}