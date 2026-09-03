import { Search, SlidersHorizontal, Zap } from "lucide-react";

import ChallengeCard from "@/component/dashboard/ChallengeCard";
import JelajahFilters from "@/component/dashboard/JelajahFilters";

import { dashboardChallenges } from "@/lib/data/dashboard";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getCurrentUser } from "@/lib/supabase/user";
import { redirect } from "next/navigation";

export default async function JelajahPage() {
  const user = await getCurrentUser();

  if(!user) {
    redirect('/');
  } 
  const profile = await getCurrentProfile();
  
  if (profile?.role == 'seeker') {
    redirect ('/seeker');
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-9 max-w-[1160px]">
      {/* Top banner pill */}
      <div className="inline-flex items-center gap-2 bg-secondary-100 text-primary-500 text-[13px] font-semibold rounded-full px-3.5 py-2 mb-5">
        <Zap size={14} strokeWidth={2.2} />
        125 Challenge Aktif Tersedia
      </div>

      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-0">
        <div>
          <h1 className="text-[36px] lg:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
            Selamat datang, {profile?.full_name ? profile.full_name.split(" ")[0] : ""}
          </h1>

          <p className="text-[16px] text-gray-500 mt-2 max-w-[520px] leading-[1.5]">
            Temukan tantangan nyata dari perusahaan, BUMN hingga UMKM yang
            membutuhkan inovasimu. Cari berdasarkan sektor, kategori, atau
            nilai hadiah.
          </p>
        </div>

        {/* Search + Sector */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              strokeWidth={1.8}
            />

            <input
              type="search"
              placeholder="Cari challenge..."
              className="h-[46px] w-full lg:w-[320px] bg-white border border-[#E2E3E5] rounded-full pl-11 pr-14 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-0.5 rounded-full hidden lg:block">
              ⌘K
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 h-[46px] px-4 bg-white border border-[#E2E3E5] rounded-full text-[14px] font-semibold text-gray-800 hover:border-gray-400 transition-colors flex-shrink-0"
          >
            <SlidersHorizontal size={16} strokeWidth={1.8} />
            Sektor
          </button>
        </div>
      </div>

      {/* Category tabs + filter chips */}
      <JelajahFilters />

      {/* Challenge grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {dashboardChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}