import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCurrentUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import JelajahExplorer, { ChallengeItem, CategoryOption } from "@/component/dashboard/JelajahExplorer";
import { dashboardChallenges } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

export default async function JelajahPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }
  const profile = await getCurrentProfile();

  if (profile?.role === "seeker") {
    redirect("/seeker");
  }

  const supabase = await createClient();

  // 1. Ambil kategori dari database
  const { data: dbCategories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  const categories: CategoryOption[] = (dbCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
  }));

  // 2. Ambil data challenge dari database
  const { data: dbChallenges, error: chError } = await supabase
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
      category_id,
      categories (
        id,
        name
      ),
      seeker_profiles (
        company_name,
        representative_name,
        company_type
      )
    `)
    .order("created_at", { ascending: false });

  if (chError) {
    console.error("Error fetching challenges from database:", chError);
  }

  // Map data DB ke ChallengeItem
  const mappedDbChallenges: ChallengeItem[] = (dbChallenges || []).map((ch: any) => {
    const categoryName = Array.isArray(ch.categories)
      ? ch.categories[0]?.name
      : ch.categories?.name || "Umum";
    
    const companyName = Array.isArray(ch.seeker_profiles)
      ? ch.seeker_profiles[0]?.company_name
      : ch.seeker_profiles?.company_name || "Perusahaan Seeker";

    const companyType = Array.isArray(ch.seeker_profiles)
      ? ch.seeker_profiles[0]?.company_type || "Perusahaan Swasta"
      : (ch.seeker_profiles as any)?.company_type || "Perusahaan Swasta";

    const initials = companyName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PR";

    const deadlineDate = ch.deadline ? new Date(ch.deadline) : new Date();
    const formattedDeadline = deadlineDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const prize = Number(ch.prize_pool) || 0;
    const formattedReward = `Rp ${prize.toLocaleString("id-ID")}`;

    return {
      id: ch.id,
      category: categoryName,
      categoryId: ch.category_id,
      company: companyName,
      companyInitials: initials,
      companyType: companyType,
      title: ch.name,
      description: ch.description || "",
      thumbnailPath: ch.thumbnail_path,
      reward: formattedReward,
      deadline: formattedDeadline,
      rawDeadline: ch.deadline,
      createdAt: ch.created_at,
      bgFrom: "#1a2035",
      bgVia: "#1e3358",
      bgTo: "#0d1524",
    };
  });

  // Gunakan murni data database jika ada! Jika tabel database masih 0 baris, gunakan mock data sebagai fallback.
  const mockChallengesEnriched: ChallengeItem[] = dashboardChallenges.map((ch, idx) => ({
    ...ch,
    description: "Inovasi nyata dari mitra industri terkemuka untuk mengakselerasi transformasi digital dan keberlanjutan.",
    companyType: idx % 2 === 0 ? "BUMN" : idx % 3 === 0 ? "UMKM" : "Perusahaan Swasta",
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    rawDeadline: new Date(Date.now() + (idx + 5) * 86400000 * 3).toISOString(),
  }));

  const allChallenges =
    mappedDbChallenges.length > 0 ? mappedDbChallenges : mockChallengesEnriched;

  const userFirstName = profile?.full_name ? profile.full_name.split(" ")[0] : "";

  return (
    <JelajahExplorer
      initialChallenges={allChallenges}
      categories={categories}
      userFirstName={userFirstName}
    />
  );
}