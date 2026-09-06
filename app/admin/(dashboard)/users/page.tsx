import { redirect } from "next/navigation";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import UsersTabs from "@/component/admin/UsersTabs";
import { getAdminSeekers, getAdminSolvers } from "@/lib/data/admin-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  const [seekers, solvers] = await Promise.all([
    getAdminSeekers(),
    getAdminSolvers(),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      <AdminPageHeader
        title="Pengguna"
        description="Kelola data Seeker dan Solver yang terdaftar di platform OpenNova."
      />
      <UsersTabs seekers={seekers} solvers={solvers} />
    </div>
  );
}
