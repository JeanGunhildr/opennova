// SeekerInfoCard.tsx — Styled per JSONC spec
// Includes: (1) red reward/countdown card, (2) seeker profile card

import { BadgeCheck, Globe, Copyright } from "lucide-react";

export interface SeekerInfoCardProps {
  companyName: string;
  companyInitials: string;
  industry: string;
  about: string;
  website?: string;
  verified?: boolean;
  reward: string;
  deadline: string;
}

export default function SeekerInfoCard({
  companyName,
  companyInitials,
  industry,
  about,
  website,
  verified = false,
  reward,
  deadline,
}: SeekerInfoCardProps) {
  return (
    <div className="flex flex-col gap-3">

      {/* ── Reward / countdown card ────────────────────────── */}
      <div
        className="rounded-[14px] grid grid-cols-2 items-center px-4"
        style={{ height: "62px", background: "linear-gradient(100deg,#E9201E 0%,#7F1717 100%)" }}
      >
        {/* Reward block */}
        <div>
          <p className="text-[10px] leading-none mb-1" style={{ color: "rgba(255,255,255,0.78)" }}>
            Total Hadiah
          </p>
          <p className="text-[20px] font-bold text-white leading-none tracking-tight">{reward}</p>
        </div>

        {/* Countdown block */}
        <div className="text-right">
          <p className="text-[10px] leading-none mb-1" style={{ color: "rgba(255,255,255,0.78)" }}>
            Deadline
          </p>
          <p className="text-[18px] font-bold text-white leading-none">{deadline}</p>
        </div>
      </div>

      {/* ── Seeker profile card ────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)]">

        {/* Header */}
        <div className="flex items-center gap-2.5 px-3.5 py-3.5 border-b border-gray-200">
          <div className="w-[38px] h-[38px] rounded-full bg-gray-100 flex items-center justify-center text-[13px] font-semibold text-gray-800 flex-shrink-0 select-none">
            {companyInitials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-bold text-gray-800 truncate">{companyName}</p>
              {verified && (
                <BadgeCheck size={14} className="text-gray-700 flex-shrink-0" strokeWidth={1.8} />
              )}
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">{industry}</p>
          </div>
        </div>

        {/* About section */}
        <div className="px-3.5 py-3.5">
          <p className="text-[12px] font-bold text-gray-800 mb-1.5">Tentang Perusahaan</p>
          <p className="text-[12px] text-gray-600 leading-[1.55]">{about}</p>

          {/* Website */}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-primary-500 font-medium hover:text-primary-600 mt-2.5"
            >
              <Globe size={12} strokeWidth={1.8} />
              {website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {/* Copyright button */}
        <div className="px-3.5 pb-3.5">
          <button
            type="button"
            className="w-full h-[38px] rounded-full bg-white border border-gray-300 text-gray-800 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Copyright size={13} strokeWidth={1.8} />
            Lihat Kesepakatan Hak Cipta
          </button>
        </div>
      </div>
    </div>
  );
}