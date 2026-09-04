import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/user";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";

import ChallengeHeader from "@/component/seeker/challenges/ChallengeHeader";
import SeekerChallengesClient from "@/component/seeker/challenges/SeekerChallengesClient";
import type {
  SeekerChallenge,
  ChallengeLifecycle,
} from "@/component/seeker/challenges/SeekerChallengeCard";

export const dynamic = "force-dynamic";

const GRADIENTS = [
  { bgFrom: "#0d1a2b", bgVia: "#1a2f4a", bgTo: "#0a1520" },
  { bgFrom: "#1a1a0a", bgVia: "#2e2e12", bgTo: "#141408" },
  { bgFrom: "#1a0a1a", bgVia: "#2e1230", bgTo: "#120814" },
  { bgFrom: "#0a1a2b", bgVia: "#152a40", bgTo: "#081520" },
  { bgFrom: "#0a1a0a", bgVia: "#142814", bgTo: "#081408" },
  { bgFrom: "#1a0d0d", bgVia: "#2a1515", bgTo: "#140a0a" },
];

function computeLifecycle(
  status: string,
  timelines?: { title: string; start_date: string | null; end_date: string | null }[]
): ChallengeLifecycle {
  if (status === "completed" || status === "closed" || status === "winner") {
    return "winner";
  }

  if (!timelines || timelines.length === 0) {
    return "open";
  }

  const now = new Date();

  // Cari timeline pengumuman
  const announcement = timelines.find((t) =>
    t.title.toLowerCase().includes("pengumuman")
  );
  if (announcement?.start_date && now >= new Date(announcement.start_date)) {
    return "winner";
  }

  // Cari timeline pitching
  const pitch = timelines.find((t) =>
    t.title.toLowerCase().includes("pitch")
  );
  if (pitch?.start_date && now >= new Date(pitch.start_date)) {
    if (!pitch.end_date || now <= new Date(pitch.end_date)) {
      return "pitching";
    }
  }

  // Cari timeline penjurian ahli
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

export default async function SeekerChallengesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const profile = await getCurrentProfile();
  if (profile?.role === "solver") {
    redirect("/solver");
  }

  const supabase = await createClient();

  const { data: dbChallenges, error } = await supabase
    .from("challenges")
    .select(`
      id,
      name,
      description,
      thumbnail_path,
      prize_pool,
      deadline,
      status,
      created_at,
      categories (
        name
      ),
      challenge_entries (
        id
      ),
      challenge_timelines (
        title,
        start_date,
        end_date,
        sort_order
      )
    `)
    .eq("seeker_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seeker challenges:", error);
  }

  const challenges: SeekerChallenge[] = (dbChallenges || []).map((ch, idx) => {
    const categoryName = Array.isArray(ch.categories)
      ? ch.categories[0]?.name
      : (ch.categories as { name: string } | null)?.name || "Umum";

    const participants = Array.isArray(ch.challenge_entries)
      ? ch.challenge_entries.length
      : 0;

    const publishedDate = ch.created_at
      ? new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(ch.created_at))
      : "Baru saja";

    const reward = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(ch.prize_pool) || 0);

    const grad = GRADIENTS[idx % GRADIENTS.length];
    const lifecycle = computeLifecycle(
      ch.status || "open",
      ch.challenge_timelines as any
    );

    let thumbnailUrl = ch.thumbnail_path;
    if (thumbnailUrl && !thumbnailUrl.startsWith("http://") && !thumbnailUrl.startsWith("https://")) {
      const { data } = supabase.storage.from("challenges").getPublicUrl(thumbnailUrl);
      thumbnailUrl = data?.publicUrl || thumbnailUrl;
    }

    return {
      id: ch.id,
      title: ch.name,
      category: categoryName,
      reward,
      participants,
      publishedDate,
      lifecycle,
      thumbnailUrl,
      bgFrom: grad.bgFrom,
      bgVia: grad.bgVia,
      bgTo: grad.bgTo,
    };
  });

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10">
        <ChallengeHeader />
        <SeekerChallengesClient challenges={challenges} />
      </div>
    </div>
  );
}