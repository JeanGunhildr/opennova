import Link from "next/link";
import type { DashboardChallenge } from "@/lib/data/dashboard";
import { Clock, BadgeCheck } from "lucide-react";

export interface ExtendedChallenge extends DashboardChallenge {
  description?: string;
  thumbnailPath?: string | null;
}

interface ChallengeCardProps {
  challenge: ExtendedChallenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const {
    id,
    category,
    company,
    companyInitials,
    title,
    reward,
    deadline,
    bgFrom,
    bgVia,
    bgTo,
    description,
    thumbnailPath,
  } = challenge;

  return (
    <Link href={`/solver/challenge/${id}`} className="block group">
      <article className="bg-white border border-[#E1E3E5] rounded-[16px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:border-gray-300 h-full">
        {/* Image / gradient header */}
        <div
          className="relative h-[140px] w-full overflow-hidden bg-gray-900"
          style={{
            background: thumbnailPath
              ? undefined
              : `linear-gradient(135deg, ${bgFrom || "#1a2f4a"} 0%, ${bgVia || "#0d1a2b"} 50%, ${bgTo || "#0a1520"} 100%)`,
          }}
        >
          {thumbnailPath ? (
            <img
              src={thumbnailPath}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : null}

          {/* Overlay gradient for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

          {/* Category badge */}
          <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[12px] font-medium rounded-full px-2.5 py-1.5 leading-none z-10 backdrop-blur-xs">
            {category}
          </span>
        </div>

        {/* Body */}
        <div className="px-4 pt-3.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Company row */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-[28px] h-[28px] rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-700 flex-shrink-0 select-none border border-gray-200">
                {companyInitials}
              </div>
              <span className="text-[13px] font-semibold text-gray-700 truncate">{company}</span>
              <BadgeCheck size={15} className="text-gray-800 flex-shrink-0" strokeWidth={1.8} />
            </div>

            {/* Title */}
            <h3 className="text-[16px] font-bold text-gray-900 leading-[1.35] line-clamp-2 min-h-[44px] group-hover:text-primary-500 transition-colors">
              {title}
            </h3>

            {/* Description Excerpt */}
            {description && (
              <p className="text-[13px] text-gray-500 line-clamp-2 mt-2 leading-[1.45]">
                {description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3.5 border-t border-[#E7E8EA] flex items-center justify-between gap-3 mb-1">
            <div>
              <p className="text-[11px] text-gray-500 leading-tight">Total Hadiah</p>
              <p className="text-[15px] font-bold text-primary-500 leading-tight tracking-tight mt-0.5">
                {reward}
              </p>
            </div>
            <div className="flex items-center gap-1.5 border border-[#8B8D90] rounded-full px-3 py-1.5 text-[12px] font-semibold text-gray-700 flex-shrink-0">
              <Clock size={13} strokeWidth={1.8} className="text-gray-600" />
              {deadline}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}