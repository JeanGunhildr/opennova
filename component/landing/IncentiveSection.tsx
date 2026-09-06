"use client";

import { Coins, Award, Handshake } from "lucide-react";
import { incentives } from "@/lib/data/landing";
import type { Incentive } from "@/lib/data/landing";
import { useLandingMode } from "@/component/landing/LandingModeContext";

function getIcon(id: string) {
  switch (id) {
    case "inc-1": return Coins;
    case "inc-2": return Award;
    default:      return Handshake;
  }
}

// ── Featured incentive card (primary red background) ──────
function FeaturedCard({ incentive }: { incentive: Incentive }) {
  const Icon = getIcon(incentive.id);
  return (
    <article
      className="relative overflow-hidden rounded-2xl bg-primary-500 p-6 text-white"
      style={{ minHeight: "256px" }}
      aria-label={`Insentif unggulan: ${incentive.title}`}
    >
      {/* Organic blob — lower right */}
      <svg
        aria-hidden="true"
        className="absolute -bottom-6 -right-6 w-52 h-52 text-primary-700/55"
        viewBox="0 0 210 210"
        fill="currentColor"
      >
        <path d="M185 145C165 185 100 218 52 200C4 182 -15 135 7 94C29 53 80 34 110 15C140 -4 182 7 196 47C210 87 205 105 185 145Z" />
      </svg>
      {/* Organic blob — upper left */}
      <svg
        aria-hidden="true"
        className="absolute -top-4 -left-4 w-32 h-32 text-primary-600/30"
        viewBox="0 0 130 130"
        fill="currentColor"
      >
        <path d="M65 5C90 4 122 24 127 54C132 84 110 118 80 126C50 134 16 120 6 93C-4 66 10 28 36 12C46 7 55 5 65 5Z" />
      </svg>

      {/* Icon */}
      <div className="relative z-10 w-11 h-11 bg-white/90 rounded-xl flex items-center justify-center mb-5">
        <Icon size={24} className="text-gray-900" />
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-2.5">{incentive.title}</h3>
        <p className="text-[14px] text-white/80 leading-relaxed">{incentive.description}</p>
      </div>
    </article>
  );
}

// ── Standard incentive card ───────────────────────────────
function StandardCard({
  incentive,
  isSeeker,
}: {
  incentive: Incentive;
  isSeeker?: boolean;
}) {
  const Icon = getIcon(incentive.id);
  return (
    <article
      className={`rounded-2xl p-6 transition-colors duration-300 ${
        isSeeker
          ? "bg-[#191919] border border-[#393939]"
          : "bg-white border border-gray-200"
      }`}
      style={{ minHeight: "256px" }}
    >
      {/* Icon container */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
        isSeeker ? "bg-[#262626]" : "bg-gray-900"
      }`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className={`text-base font-bold mb-2.5 transition-colors ${
        isSeeker ? "text-white" : "text-gray-800"
      }`}>
        {incentive.title}
      </h3>
      <p className={`text-[14px] leading-relaxed transition-colors ${
        isSeeker ? "text-[#A4A4A4]" : "text-gray-500"
      }`}>
        {incentive.description}
      </p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
export default function IncentiveSection() {
  const { isSeeker } = useLandingMode();
  const featured  = incentives.find((i) => i.featured) ?? incentives[0]!;
  const standards = incentives.filter((i) => !i.featured);

  return (
    <section
      id="insentif"
      aria-labelledby="incentive-heading"
      className={`py-20 md:py-24 lg:py-32 transition-colors duration-300 ${
        isSeeker ? "bg-[#141414]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">

          {/* ── Left intro block ────────────────────── */}
          <div className="lg:flex-shrink-0 lg:w-72 xl:w-80">
            {/* Eyebrow pill */}
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 mb-6 ${
              isSeeker ? "bg-[#262626]" : "bg-gray-900"
            }`}>
              <span
                className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold text-white uppercase tracking-widest">
                Insentif
              </span>
            </div>

            <h2
              id="incentive-heading"
              className={`text-[1.8rem] md:text-[2.15rem] font-bold leading-[1.1] tracking-[-0.02em] transition-colors duration-300 ${
                isSeeker ? "text-white" : "text-gray-900"
              }`}
            >
              {isSeeker
                ? "Ekosistem Terpercaya untuk Mendorong Inovasi Nyata"
                : "Insentif yang Akan Anda Terima Sebagai Pemenang"}
            </h2>
          </div>

          {/* ── Right cards grid ─────────────────────── */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeaturedCard incentive={featured} />
            {standards.map((inc) => (
              <StandardCard key={inc.id} incentive={inc} isSeeker={isSeeker} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
