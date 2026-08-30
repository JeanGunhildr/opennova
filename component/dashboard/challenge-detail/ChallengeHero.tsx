// ChallengeHero.tsx — Styled per JSONC spec
// Gradient: linear-gradient(110deg, #171717 0%, #252525 48%, #6F1717 100%)

import { BadgeCheck, Clock, Trophy } from "lucide-react";

export type HeroStatusStyle = "deadline" | "success" | "danger" | "winner" | "none";

export interface HeroStatus {
  label: string;
  style: HeroStatusStyle;
}

export interface ChallengeHeroProps {
  id: string;
  category: string;
  title: string;
  company: string;
  companyInitials: string;
  verified?: boolean;
  heroStatus?: HeroStatus;
}

function HeroTag({ status }: { status: HeroStatus }) {
  if (status.style === "none") return null;

  if (status.style === "deadline") {
    return (
      <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-white text-primary-500 text-[12px] font-semibold flex-shrink-0">
        <Clock size={11} strokeWidth={2.2} />
        {status.label}
      </span>
    );
  }
  if (status.style === "winner") {
    return (
      <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-[#F0F9F1] text-[#168A39] text-[12px] font-semibold flex-shrink-0">
        <Trophy size={11} strokeWidth={2.2} />
        {status.label}
      </span>
    );
  }
  if (status.style === "success") {
    return (
      <span className="inline-flex items-center h-7 px-2.5 rounded-full bg-[#F0F9F1] text-[#168A39] text-[12px] font-semibold flex-shrink-0">
        {status.label}
      </span>
    );
  }
  // danger
  return (
    <span className="inline-flex items-center h-7 px-2.5 rounded-full bg-white text-primary-500 text-[12px] font-semibold flex-shrink-0">
      {status.label}
    </span>
  );
}

export default function ChallengeHero({
  category,
  title,
  company,
  companyInitials,
  verified = false,
  heroStatus,
}: ChallengeHeroProps) {
  return (
    <div
      className="relative rounded-[18px] overflow-hidden"
      style={{
        background: "linear-gradient(110deg, #171717 0%, #252525 48%, #6F1717 100%)",
        minHeight: "195px",
        padding: "20px 22px",
      }}
    >
      {/* Decorative translucent circle — bottom-right */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "280px",
          height: "280px",
          bottom: "-80px",
          right: "-60px",
          background: "rgba(255,255,255,0.07)",
        }}
      />

      {/* Top-right tags */}
      <div className="flex justify-end gap-2 flex-wrap mb-4">
        {/* Category tag */}
        <span
          className="inline-flex items-center h-7 px-2.5 rounded-full text-white text-[12px] font-medium"
          style={{
            background: "rgba(20,20,20,0.28)",
            border: "1px solid rgba(255,255,255,0.40)",
          }}
        >
          {category}
        </span>

        {/* Hero status tag */}
        {heroStatus && <HeroTag status={heroStatus} />}
      </div>

      {/* Title */}
      <h1
        className="font-bold text-white leading-[1.15] tracking-[-0.02em]"
        style={{ fontSize: "clamp(22px,2.5vw,30px)", maxWidth: "760px" }}
      >
        {title}
      </h1>

      {/* Company row */}
      <div className="flex items-center gap-2 mt-2.5">
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0 select-none"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          {companyInitials}
        </div>
        <span className="text-[14px] font-medium text-white">{company}</span>
        {verified && (
          <BadgeCheck size={16} className="text-white/70 flex-shrink-0" strokeWidth={1.8} />
        )}
      </div>
    </div>
  );
}