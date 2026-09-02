import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/supabase/profile";

export async function requireSolver() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "solver") {
    redirect("/");
  }

  return profile;
}