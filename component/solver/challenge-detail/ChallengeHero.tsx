"use client";

import { BadgeCheck, Sparkles, Clock, Trophy } from "lucide-react";
import type { ResolvedChallengeUI } from "@/lib/data/challengeState";

interface ChallengeHeroProps {
  category: string;
  title: string;
  company: string;
  companyInitials: string;
  resolved: ResolvedChallengeUI;
  isSpecialCollaboration?: boolean;
  imageUrl?: string;
}

export default function ChallengeHero({
  category,
  title,
  company,
  companyInitials,
  resolved,
  isSpecialCollaboration = true,
  imageUrl,
}: ChallengeHeroProps) {
  // Determine tag style from resolved state
  const renderStatusBadge = () => {
    switch (resolved.heroTagStyle) {
      case "success":
        return (
          <span className="h-[28px] px-2.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#CBEBD3] text-[11px] font-semibold inline-flex items-center gap-1 shadow-sm">
            {resolved.heroTagType === "winner" && <Trophy size={12} strokeWidth={2} />}
            {resolved.heroTagLabel}
          </span>
        );
      case "danger":
        return (
          <span className="h-[28px] px-2.5 rounded-full bg-white text-[#E30000] border border-[#F9CCCC] text-[11px] font-semibold inline-flex items-center shadow-sm">
            {resolved.heroTagLabel}
          </span>
        );
      case "closed":
      case "ended":
        return (
          <span className="h-[28px] px-2.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-[11px] font-semibold inline-flex items-center shadow-sm">
            {resolved.heroTagLabel}
          </span>
        );
      case "countdown":
      default:
        return (
          <span className="h-[28px] px-2.5 rounded-full bg-white text-[#E30000] text-[11px] font-semibold inline-flex items-center gap-1 shadow-sm">
            <Clock size={12} strokeWidth={2} className="text-[#E30000]" />
            {resolved.heroTagLabel}
          </span>
        );
    }
  };

  return (
    <div
      className="relative w-full rounded-[18px] overflow-hidden text-white flex flex-col justify-between h-auto md:h-[193px] p-[20px_22px]"
      style={{
        background: "linear-gradient(108deg, #171717 0%, #2C1717 52%, #6C1A1A 100%)",
      }}
    >
      {/* Decorative ambient subtle circle */}
      <div
        className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.055)" }}
        aria-hidden="true"
      />

      {/* Top Area: Tags on the right */}
      <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap mb-3 md:mb-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="h-[28px] px-2.5 rounded-full text-[11px] font-medium text-white inline-flex items-center"
            style={{
              background: "rgba(17,24,39,0.25)",
              border: "1px solid rgba(255,255,255,0.42)",
            }}
          >
            {category}
          </span>

          {isSpecialCollaboration && (
            <span
              className="h-[28px] px-2.5 rounded-full text-[11px] font-medium text-white inline-flex items-center gap-1"
              style={{
                background: "rgba(17,24,39,0.25)",
                border: "1px solid rgba(255,255,255,0.42)",
              }}
            >
              <Sparkles size={12} className="text-amber-300" />
              Kolaborasi Spesial
            </span>
          )}
        </div>

        {/* Dynamic Status / Countdown Tag */}
        <div className="flex items-center gap-2">
          {renderStatusBadge()}
        </div>
      </div>

      {/* Main Content Area: Media Image + Title & Seeker Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4.5 mt-auto">
        {/* Media area thumbnail */}
        <div className="hidden sm:block w-[180px] h-[110px] rounded-[12px] overflow-hidden flex-shrink-0 relative bg-zinc-900 border border-white/10 shadow-inner">
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80"}
            alt={title}
            className="w-[180px] h-[110px] rounded-[12px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Title and Seeker Identity Block */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h1 className="text-[24px] sm:text-[29px] lg:text-[30px] font-bold text-white tracking-tight leading-[1.12] line-clamp-2 mb-2">
            {title}
          </h1>

          <div className="flex items-center gap-2">
            <div
              className="w-[31px] h-[31px] rounded-full flex items-center justify-center font-semibold text-[11px] text-white flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              {companyInitials}
            </div>
            <span className="text-[13px] font-medium text-white truncate">
              {company}
            </span>
            <BadgeCheck size={15} className="text-white flex-shrink-0" strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </div>
  );
}
