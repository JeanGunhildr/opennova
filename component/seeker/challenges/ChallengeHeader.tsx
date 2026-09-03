"use client";

import { Plus } from "lucide-react";

interface ChallengeHeaderProps {
  eyebrow?: string;
}

export default function ChallengeHeader({ eyebrow = "Manajemen Challenge" }: ChallengeHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
      <div className="flex-1 min-w-0">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{ background: "#FFFFFF", border: "6px solid #373737" }}
          />
          <span className="text-[14px] font-semibold text-white">{eyebrow}</span>
        </div>

        <h1
          className="text-white font-bold leading-[1.1]"
          style={{ fontSize: "40px", letterSpacing: "-0.025em" }}
        >
          Kelola &amp; Buat Challenge
        </h1>

        <p className="mt-2 text-[16px] leading-[1.5] max-w-[760px]" style={{ color: "#A4A4A4" }}>
          Kelola seluruh challenge yang anda selenggarakan, mulai dari publikasi hingga proses seleksi dan penetapan pemenang.
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-start flex-shrink-0 pt-1">
        <a
          type="button"
          className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-white text-[15px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors"
          href="/seeker/challenges/new"
        >
          <Plus size={18} strokeWidth={2.2} />
          Buat Challenge Baru
        </a>
      </div>
    </div>
  );
}