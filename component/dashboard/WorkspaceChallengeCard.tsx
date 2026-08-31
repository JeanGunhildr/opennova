import { Clock, BadgeCheck, Bookmark } from "lucide-react";
import type { WorkspaceChallenge } from "@/lib/data/dashboard";

interface WorkspaceChallengeCardProps {
  challenge: WorkspaceChallenge;
}

export default function WorkspaceChallengeCard({ challenge }: WorkspaceChallengeCardProps) {
  const { category, company, companyInitials, verified, title, reward, deadline, completed, outcome, bgFrom, bgVia, bgTo } =
    challenge;

  const isOverdue = new Date(deadline) < new Date();
  
  // Format deadline date to locale string like "17 Nov 2026"
  const formattedDeadline = new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <article className="bg-white border border-gray-200 rounded-[16px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition-all duration-200 flex flex-col">
      {/* Gradient image header */}
      <div
        className="relative h-[118px] w-full flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgVia} 50%, ${bgTo} 100%)`,
          objectFit: 'cover'
        }}
      >
        {/* Category badge */}
        <span className="absolute top-[10px] left-[10px] h-[28px] px-[11px] bg-black/78 text-white text-[12px] font-medium rounded-full flex items-center justify-center">
          {category}
        </span>
        
        {/* Bookmark button */}
        <button className="absolute top-[10px] right-[10px] w-[34px] h-[34px] bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-800">
            <Bookmark size={18} strokeWidth={2} />
        </button>

        {/* Outcome badges */}
        {completed && outcome === "winner" && (
          <span className="absolute bottom-[10px] right-[10px] h-[28px] px-[11px] bg-[#F0F9F1] border border-[#1F9D45] text-[#168A39] text-[12px] font-semibold rounded-full flex items-center justify-center">
            Pemenang
          </span>
        )}
        {completed && outcome === "failed" && (
          <span className="absolute bottom-[10px] right-[10px] h-[28px] px-[11px] bg-gray-100 border border-gray-300 text-gray-800 text-[12px] font-semibold rounded-full flex items-center justify-center">
            Tidak lolos
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-[14px] flex-1 flex flex-col">
        {/* Company row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-semibold text-gray-500 flex-shrink-0 select-none">
            {companyInitials}
          </div>
          <span className="text-[15px] font-medium text-gray-600 truncate">{company}</span>
          {verified && (
            <BadgeCheck size={14} className="text-gray-900 flex-shrink-0" strokeWidth={1.8} />
          )}
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-semibold text-gray-900 leading-[1.35] line-clamp-2 min-h-[49px] mb-5">
          {title}
        </h3>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-[14px] min-h-[80px] flex items-center justify-between gap-3">
        {/* Reward */}
        <div>
          <p className="text-[13px] text-gray-600 leading-[1.3] mb-1">Hadiah</p>
          <p className="text-[17px] font-bold text-primary-500 leading-[1.25]">
            {reward}
          </p>
        </div>
        {/* Deadline pill */}
        <div 
          className={[
            "inline-flex items-center justify-center gap-[7px] h-[36px] px-[11px] rounded-full border text-[14px] font-medium whitespace-nowrap flex-shrink-0",
            isOverdue 
              ? "bg-primary-50 border-primary-200 text-primary-500" 
              : "bg-white border-gray-500 text-gray-900"
          ].join(" ")}
        >
          <Clock size={16} strokeWidth={2} className={isOverdue ? "text-primary-500" : "text-gray-800"} />
          {formattedDeadline}
        </div>
      </div>
    </article>
  );
}