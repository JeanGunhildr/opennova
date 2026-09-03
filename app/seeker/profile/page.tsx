import CompanyProfileHeader from "@/component/seeker/profile/CompanyProfileHeader";
import CompanyIdentityCard from "@/component/seeker/profile/CompanyIdentityCard";
import AccountActionsCard from "@/component/seeker/profile/AccountActionsCard";
import CompanyInformationForm from "@/component/seeker/profile/CompanyInformationForm";

export default function SeekerProfilePage() {
  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10 pb-14">
        <CompanyProfileHeader />

        {/* 2-column grid: left (identity + actions) / right (form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <CompanyIdentityCard />
            <AccountActionsCard />
          </div>

          {/* Right column */}
          <div>
            <CompanyInformationForm />
          </div>
        </div>
      </div>
    </div>
  );
}