import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminChallengeById } from "@/lib/data/admin-server";
import AdminChallengeDetailClient from "@/component/admin/AdminChallengeDetailClient";

export default async function AdminChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Authentication & Authorization check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/");
  }

  // Fetch complete challenge detail
  const challenge = await getAdminChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return <AdminChallengeDetailClient challenge={challenge} />;
}
