import type { DashboardChallenge } from "@/lib/data/dashboard";
import { Clock, Bookmark, BadgeCheck } from "lucide-react";

interface ChallengeCardProps {
  challenge: DashboardChallenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { category, company, companyInitials, title, reward, deadline, bgFrom, bgVia, bgTo } = challenge;

  return (
    <article className="bg-white border border-[#E1E3E5] rounded-[16px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
      {/* Image / gradient header */}
      <div
        className="relative h-[130px]"
        style={{
          background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgVia} 50%, ${bgTo} 100%)`,
        }}
      >
        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[12px] font-medium rounded-full px-2.5 py-1.5 leading-none">
          {category}
        </span>
        {/* Bookmark button */}
        <button
          type="button"
          aria-label="Simpan challenge"
          className="absolute top-2.5 right-2.5 w-[34px] h-[34px] bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-700 hover:text-primary-500 transition-colors shadow-sm"
        >
          <Bookmark size={15} strokeWidth={1.8} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 flex-1 flex flex-col">
        {/* Company row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-semibold text-gray-600 flex-shrink-0 select-none">
            {companyInitials}
          </div>
          <span className="text-[14px] font-medium text-gray-600 truncate">{company}</span>
          <BadgeCheck size={15} className="text-gray-800 flex-shrink-0" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3
          className="text-[17px] font-semibold text-gray-900 leading-[1.35] line-clamp-2 min-h-[46px]"
        >
          {title}
        </h3>
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-[#E7E8EA] px-4 py-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] text-gray-600 leading-tight">Total Hadiah</p>
          <p className="text-[16px] font-bold text-primary-500 leading-tight tracking-tight mt-0.5">
            {reward}
          </p>
        </div>
        <div className="flex items-center gap-1.5 border border-[#8B8D90] rounded-full px-3 py-2 text-[13px] font-medium text-gray-700 flex-shrink-0">
          <Clock size={13} strokeWidth={1.8} className="text-gray-600" />
          {deadline}
        </div>
      </div>
    </article>
  );
}