"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { challenges } from "@/lib/data/landing";
import type { Challenge } from "@/lib/data/landing";
import { useLandingMode } from "@/component/landing/LandingModeContext";

// ── Individual challenge card ─────────────────────────────
function ChallengeCard({
  challenge,
  isSeeker,
}: {
  challenge: Challenge;
  isSeeker?: boolean;
}) {
  const gradient = `linear-gradient(135deg, ${challenge.bgFrom} 0%, ${challenge.bgVia} 50%, ${challenge.bgTo} 100%)`;

  return (
    <article
      className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary-500/40 ${
        isSeeker
          ? "bg-[#191919] border border-[#393939] hover:border-[#4E4E4E]"
          : "bg-white border border-gray-200 hover:border-gray-300"
      }`}
      style={{ boxShadow: isSeeker ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 30px rgba(20,20,20,0.07)" }}
    >
      {/* ── Media area ──────────────────────────────── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "2.05 / 1" }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.04]"
          style={{ background: gradient }}
          aria-hidden="true"
        />

        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Bottom fade overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.28) 100%)",
          }}
        />

        {/* Category badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="inline-block text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(20,20,20,0.82)", backdropFilter: "blur(6px)" }}
          >
            {challenge.category}
          </span>
        </div>
      </div>

      {/* ── Card body ───────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className={`text-[14px] font-bold leading-snug line-clamp-2 mb-3 transition-colors ${
          isSeeker ? "text-white" : "text-gray-800"
        }`}>
          {challenge.title}
        </h3>

        {/* Reward badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${
            isSeeker
              ? "bg-primary-950/40 text-primary-400 border-primary-900/50"
              : "bg-primary-50 text-primary-700 border-primary-100"
          }`}>
            Hadiah: {challenge.reward}
          </span>
        </div>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* ── Footer ────────────────────────────────── */}
        <div className={`flex items-center justify-between pt-3 border-t mt-1 ${
          isSeeker ? "border-[#262626]" : "border-gray-100"
        }`}>
          <div>
            <p className="text-[11px] text-gray-400 leading-none mb-1">
              Batas waktu
            </p>
            <p className={`text-[13px] font-semibold leading-none ${
              isSeeker ? "text-[#D4D4D4]" : "text-gray-700"
            }`}>
              {challenge.deadline}
            </p>
          </div>

          <Link
            href={`/challenge/${challenge.id}`}
            id={`card-detail-${challenge.id}`}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[11px] font-semibold px-3.5 py-[7px] rounded-full transition-colors duration-150"
          >
            Lihat detail
            <ArrowRight size={11} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
export default function ChallengeSection() {
  const { isSeeker } = useLandingMode();

  return (
    <section
      id="challenge"
      aria-labelledby="challenge-heading"
      className={`py-20 md:py-24 lg:py-32 transition-colors duration-300 ${
        isSeeker ? "bg-[#171717]" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">

        {/* Section heading */}
        <div className="text-center mb-12 md:mb-14">
          <h2
            id="challenge-heading"
            className={`text-[1.8rem] md:text-[2.25rem] lg:text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em] mb-4 transition-colors duration-300 ${
              isSeeker ? "text-white" : "text-gray-900"
            }`}
          >
            {isSeeker ? "Tantangan Terkini dari Berbagai Industri" : "Jelajahi Challenge Terbaru"}
          </h2>
          <p className={`text-base md:text-[1.05rem] max-w-lg mx-auto leading-relaxed transition-colors duration-300 ${
            isSeeker ? "text-[#A4A4A4]" : "text-gray-500"
          }`}>
            {isSeeker
              ? "Lihat bagaimana tantangan industri diselesaikan dengan pendekatan inovasi terbuka berstandar tinggi."
              : "Pilih tantangan yang sesuai dengan keahlian anda dan mulai ciptakan solusi."}
          </p>
        </div>

        {/* 1-col → 2-col → 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} isSeeker={isSeeker} />
          ))}
        </div>

        {/* Section CTA */}
        <div className="flex justify-center">
          <Link
            href="/challenge"
            id="challenge-cta-all"
            className={`flex items-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-full active:scale-[0.97] transition-all duration-150 ${
              isSeeker
                ? "bg-white text-gray-900 hover:bg-gray-100 shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
                : "bg-gray-900 text-white hover:bg-gray-800 shadow-[0_2px_12px_rgba(20,20,20,0.10)]"
            }`}
          >
            Lihat Semua Challenge
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
