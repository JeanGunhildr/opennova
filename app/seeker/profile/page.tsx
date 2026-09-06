import { createClient } from "@/lib/supabase/server";
import CompanyProfileHeader from "@/component/seeker/profile/CompanyProfileHeader";
import CompanyIdentityCard from "@/component/seeker/profile/CompanyIdentityCard";
import AccountActionsCard from "@/component/seeker/profile/AccountActionsCard";
import CompanyInformationForm from "@/component/seeker/profile/CompanyInformationForm";

export default async function SeekerProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companyName = "Perusahaan Seeker";
  let representativeName = "";
  let phone = "";
  let companyType = "Swasta";
  let website = "";
  let companyDescription = "";
  let email = user?.email || "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    const { data: seekerProf } = await supabase
      .from("seeker_profiles")
      .select("company_name, representative_name, company_type, company_description, website")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      phone = profile.phone || "";
      representativeName = profile.full_name || "";
    }

    if (seekerProf) {
      if (seekerProf.company_name) companyName = seekerProf.company_name;
      if (seekerProf.representative_name) representativeName = seekerProf.representative_name;
      if (seekerProf.company_type) companyType = seekerProf.company_type;
      if (seekerProf.company_description) companyDescription = seekerProf.company_description;
      if (seekerProf.website) website = seekerProf.website;
    }
  }

  const seekerInitialData = {
    companyName,
    email,
    companyType,
    representativeName,
    phone,
    website,
    companyDescription,
  };

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10 pb-14">
        <CompanyProfileHeader />

        {/* 2-column grid: left (identity + actions) / right (form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <CompanyIdentityCard
              companyName={companyName}
              orgType={companyType}
              email={email}
            />
            <AccountActionsCard />
          </div>

          {/* Right column */}
          <div>
            <CompanyInformationForm initialData={seekerInitialData} />
          </div>
        </div>
      </div>
    </div>
  );
}