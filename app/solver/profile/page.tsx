import { createClient } from "@/lib/supabase/server";
import SolverProfileHeader from "@/component/solver/profile/SolverProfileHeader";
import SolverIdentityCard from "@/component/solver/profile/SolverIdentityCard";
import SolverAccountActionsCard from "@/component/solver/profile/SolverAccountActionsCard";
import SolverInformationForm from "@/component/solver/profile/SolverInformationForm";

export default async function SolverProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = "Solver";
  let phone = "";
  let institution = "";
  let email = user?.email || "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    const { data: solverProf } = await supabase
      .from("solver_profiles")
      .select("institution")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      if (profile.full_name) fullName = profile.full_name;
      if (profile.phone) phone = profile.phone;
    }

    if (solverProf?.institution) {
      institution = solverProf.institution;
    }
  }

  const solverInitialData = {
    fullName,
    email,
    phone,
    institution,
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] p-6 lg:p-8">
      <div className="max-w-[1160px] mx-auto space-y-6">
        <SolverProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <SolverIdentityCard
              fullName={fullName}
              email={email}
              institution={institution}
            />
            <SolverAccountActionsCard />
          </div>

          {/* Right column */}
          <div>
            <SolverInformationForm initialData={solverInitialData} />
          </div>
        </div>
      </div>
    </div>
  );
}