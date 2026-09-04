"use client";

import { Users } from "lucide-react";

export type ChallengeLifecycle = "open" | "expert" | "pitching" | "winner";

export interface SeekerChallenge {
  id: string;
  title: string;
  category: string;
  reward: string;
  participants: number;
  publishedDate: string;
  lifecycle: ChallengeLifecycle;
  thumbnailUrl?: string | null;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
}

const LIFECYCLE_MAP: Record<ChallengeLifecycle, { label: string; bg: string; text: string }> = {
  open:     { label: "Challenge Dibuka",      bg: "#143520",              text: "#54D67A" },
  expert:   { label: "Penjurian Ahli",        bg: "#393713",              text: "#D8C83A" },
  pitching: { label: "Pitching Final",        bg: "rgba(227,0,0,0.14)",   text: "#FF8A8A" },
  winner:   { label: "Pengumuman Pemenang",   bg: "rgba(84,214,122,0.12)",text: "#54D67A" },
};

export default function SeekerChallengeCard({ challenge }: { challenge: SeekerChallenge }) {
  const { title, category, reward, participants, publishedDate, lifecycle, thumbnailUrl, bgFrom, bgVia, bgTo } = challenge;
  const ls = LIFECYCLE_MAP[lifecycle] || LIFECYCLE_MAP.open;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[18px] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#5C5C5C] hover:shadow-[0_8px_28px_rgba(0,0,0,0.30)]"
      style={{
        background: "#171717",
        border: "1px solid #373737",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
      }}
    >
      {/* Media / image header */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          height: "124px",
          background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgVia} 50%, ${bgTo} 100%)`,
        }}
      >
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Status pill */}
        <span
          className="absolute top-[10px] left-[10px] inline-flex items-center h-[28px] px-[10px] rounded-full text-[12px] font-semibold z-10"
          style={{ background: ls.bg, color: ls.text }}
        >
          {ls.label}
        </span>
      </div>

      {/* Card body */}
      <div className="px-[18px] pt-4 pb-3 flex flex-col flex-1">
        <p className="text-[12px] mb-1.5" style={{ color: "#737373" }}>
          Dipublikasikan {publishedDate}
        </p>
        <h3
          className="text-white font-semibold leading-[1.4] line-clamp-2"
          style={{ fontSize: "17px", minHeight: "47px" }}
        >
          {title}
        </h3>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          <span
            className="inline-flex items-center h-[28px] px-[10px] rounded-full text-[12px] font-medium"
            style={{ background: "#373737", border: "1px solid #5C5C5C", color: "#ECECEC" }}
          >
            {category}
          </span>
          <span
            className="inline-flex items-center gap-1 h-[28px] px-[10px] rounded-full text-[12px] font-medium"
            style={{ background: "#373737", border: "1px solid #5C5C5C", color: "#ECECEC" }}
          >
            <Users size={11} strokeWidth={2} />
            {participants} peserta
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-[18px] py-4 flex items-center justify-between gap-3"
        style={{ borderTop: "1px solid #373737" }}
      >
        <div>
          <p className="text-[12px]" style={{ color: "#737373" }}>Hadiah</p>
          <p className="text-white font-semibold" style={{ fontSize: "18px" }}>{reward}</p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Halaman Kelola sedang dalam tahap pengembangan"
          className="inline-flex items-center h-9 px-[14px] rounded-full text-[13px] font-semibold bg-[#232323] text-[#737373] border border-[#373737] cursor-not-allowed select-none opacity-80"
        >
          Kelola Challenge
        </button>
      </div>
    </article>
  );
}