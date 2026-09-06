"use client";

import Link from "next/link";
import { processSteps } from "@/lib/data/landing";
import { useLandingMode } from "@/component/landing/LandingModeContext";

// ── Browser-framed product preview ───────────────────────
function ProductPreview({ isSeeker }: { isSeeker?: boolean }) {
  return (
    <div
      className={`w-full rounded-[20px] border p-3 transition-colors duration-300 ${
        isSeeker
          ? "border-[#393939] bg-[#191919]"
          : "border-gray-200 bg-gray-50"
      }`}
      style={{ boxShadow: isSeeker ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 30px rgba(20,20,20,0.07)" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-1 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${isSeeker ? "bg-[#393939]" : "bg-gray-200"}`} />
        <div className={`w-2.5 h-2.5 rounded-full ${isSeeker ? "bg-[#393939]" : "bg-gray-200"}`} />
        <div className={`w-2.5 h-2.5 rounded-full ${isSeeker ? "bg-[#393939]" : "bg-gray-200"}`} />
        <div className={`flex-1 mx-2 h-[22px] rounded-full border flex items-center px-3 ${
          isSeeker
            ? "bg-[#222222] border-[#393939] text-[#888888]"
            : "bg-white border-gray-200 text-gray-400"
        }`}>
          <span className="text-[9.5px] leading-none">
            opennova.id/challenge
          </span>
        </div>
      </div>

      {/* App UI mock — challenge listing interface */}
      <div
        className={`rounded-xl overflow-hidden border ${
          isSeeker ? "bg-[#141414] border-[#2E2E2E]" : "bg-white border-gray-100"
        }`}
        style={{ aspectRatio: "1.72 / 1" }}
        aria-hidden="true"
        role="presentation"
      >
        <div className="p-4 h-full flex flex-col gap-3">
          {/* Page title bar */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className={`h-5 w-36 rounded-lg ${isSeeker ? "bg-[#262626]" : "bg-gray-100"}`} />
            <div className="h-6 w-20 bg-primary-100 rounded-full" />
          </div>

          {/* Challenge card grid */}
          <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
            {[
              { from: "#1a2035", to: "#1e3358" },
              { from: "#0d2818", to: "#184d30" },
              { from: "#1c1008", to: "#2d1a06" },
              { from: "#1a1a2e", to: "#16213e" },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden flex flex-col p-2.5 gap-2"
                style={{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }}
              >
                <div className="h-1.5 bg-white/20 rounded-full w-4/5" />
                <div className="h-1.5 bg-white/13 rounded-full w-1/2" />
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-3.5 w-14 bg-primary-400/70 rounded-full" />
                  <div className="h-3.5 w-10 bg-white/15 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SEEKER_PROCESS_STEPS = [
  "Definisikan kebutuhan & objektif challenge",
  "Tentukan kriteria penilaian & total reward",
  "Publikasikan challenge ke 10.000+ Solver",
  "Review proposal solusi & kurasi finalis",
  "Pilih pemenang & implementasikan inovasi",
] as const;

// ── Process steps card ────────────────────────────────────
function ProcessCard({ isSeeker }: { isSeeker?: boolean }) {
  const ACTIVE_STEP = 1; // Step 2 shown as active for visual interest
  const steps = isSeeker ? SEEKER_PROCESS_STEPS : processSteps;

  return (
    <div
      className={`rounded-2xl border p-5 transition-colors duration-300 ${
        isSeeker
          ? "bg-[#191919] border-[#393939] text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
      style={{ boxShadow: isSeeker ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 30px rgba(20,20,20,0.07)" }}
    >
      {/* Card header */}
      <div className="mb-5">
        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 ${
          isSeeker ? "bg-[#262626] text-[#A4A4A4]" : "bg-gray-100 text-gray-500"
        }`}>
          5 langkah
        </span>
        <p className={`text-sm font-bold leading-snug ${isSeeker ? "text-white" : "text-gray-900"}`}>
          {isSeeker
            ? "Langkah terstruktur meluncurkan challenge inovasi perusahaan Anda."
            : "Temukan challenge dan kirim solusi inovatif anda."}
        </p>
      </div>

      {/* Steps list */}
      <ol className="space-y-1.5" aria-label="Langkah partisipasi">
        {steps.map((step, i) => {
          const isActive = i === ACTIVE_STEP;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors ${
                isActive
                  ? isSeeker
                    ? "bg-[#E30000] text-white font-semibold"
                    : "bg-gray-900 text-white font-semibold"
                  : isSeeker
                    ? "text-[#A4A4A4] hover:bg-[#262626] hover:text-white"
                    : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive ? "bg-white" : isSeeker ? "bg-[#555555]" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <span>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function CollaborationSection() {
  const { isSeeker } = useLandingMode();

  return (
    <section
      id={isSeeker ? "panduan" : "kolaborasi"}
      aria-labelledby="collab-heading"
      className={`py-20 md:py-24 lg:py-32 transition-colors duration-300 scroll-mt-24 ${
        isSeeker ? "bg-[#141414]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">

        {/* Section header row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-10 lg:mb-14">
          <h2
            id="collab-heading"
            className={`text-[1.8rem] md:text-[2.25rem] lg:text-[2.6rem] font-bold leading-[1.1] tracking-[-0.02em] max-w-[540px] transition-colors duration-300 ${
              isSeeker ? "text-white" : "text-gray-900"
            }`}
          >
            {isSeeker
              ? "Pelajari Cara Membuat & Publikasi Challenge"
              : "Dapatkan Kesempatan Berkolaborasi dengan Perusahaan"}
          </h2>

          <div className="lg:pt-3">
            <Link
              href={isSeeker ? "/seeker/challenges/new" : "#challenge"}
              className={`text-sm font-medium transition-colors underline underline-offset-4 ${
                isSeeker
                  ? "text-[#A4A4A4] hover:text-primary-400 decoration-[#393939] hover:decoration-primary-400"
                  : "text-gray-500 hover:text-primary-600 decoration-gray-300 hover:decoration-primary-400"
              }`}
            >
              {isSeeker ? "Mulai buat challenge →" : "Temukan challenge →"}
            </Link>
          </div>
        </div>

        {/* Two-column layout: product preview (65%) + process card (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-5 lg:gap-6">
          <ProductPreview isSeeker={isSeeker} />
          <ProcessCard isSeeker={isSeeker} />
        </div>
      </div>
    </section>
  );
}
