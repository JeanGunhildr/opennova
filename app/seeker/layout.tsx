import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import SeekerSidebar from "@/component/seeker/SeekerSidebar";

export default async function SeekerLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // Fetch current user profile and seeker_profiles for dynamic sidebar
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companyName = "Penyelenggara";
  let fullName = "Pengguna";
  let email = "";
  let initials = "??";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const { data: seekerProfile } = await supabase
      .from("seeker_profiles")
      .select("company_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.full_name) {
      fullName = profile.full_name;
      initials = fullName
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }

    if (seekerProfile?.company_name) {
      companyName = seekerProfile.company_name;
    }

    email = user.email ?? "";
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#171717" }}>
      <SeekerSidebar
        companyName={companyName}
        fullName={fullName}
        email={email}
        initials={initials}
      />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}