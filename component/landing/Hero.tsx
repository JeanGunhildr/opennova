"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useAuthModal } from "@/component/auth/AuthModalContext";
import { useLandingMode } from "@/component/landing/LandingModeContext";

// ── Partner logos list from public/images/partners/ ───────
const PARTNER_LOGOS = [
  { name: "Adaro",          src: "/images/partners/adaro.svg" },
  { name: "Barito Pacific", src: "/images/partners/barito-pasific.svg" },
  { name: "Indofood",       src: "/images/partners/indofood.svg" },
  { name: "Paragon",        src: "/images/partners/paragon.svg" },
  { name: "Pertamina",      src: "/images/partners/pertamina.svg" },
  { name: "Xurya",          src: "/images/partners/xurya.svg" },
];

// Quadruple items to guarantee width exceeds viewport on all screens
const PARTNERS_LIST = [
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
];

// ── Partner marquee strip ─────────────────────────────────
function PartnerStrip({ isSeeker }: { isSeeker?: boolean }) {
  return (
    <div
      className={`mt-14 w-full max-w-3x1 mx-auto rounded-full border flex items-center overflow-hidden py-5 px-4 transition-colors duration-300 shadow-sm ${
        isSeeker
          ? "border-[#393939] bg-[#191919]/90"
          : "border-gray-200/80 bg-white/80 backdrop-blur-md"
      }`}
      aria-label="Daftar mitra inovasi"
    >
      {/* Fixed static label */}
      <div
        className={`shrink-0 pr-6 pl-2 border-r flex items-center transition-colors duration-300 ${
          isSeeker ? "border-[#393939] text-[#A4A4A4]" : "border-gray-200 text-gray-500"
        }`}
      >
        <span className="text-[11px] font-semibold tracking-widest whitespace-nowrap">
          MITRA INOVASI
        </span>
      </div>

      {/* Right Carousel Track Area */}
      <div className="relative w-full overflow-hidden flex items-center pl-6">
        {/* Left & right fade gradients inside the track */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-all duration-300"
          style={{
            background: isSeeker
              ? "linear-gradient(to right, #191919, transparent)"
              : "linear-gradient(to right, rgba(255,255,255,0.9), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-all duration-300"
          style={{
            background: isSeeker
              ? "linear-gradient(to left, #191919, transparent)"
              : "linear-gradient(to left, rgba(255,255,255,0.9), transparent)",
          }}
        />

        {/* Continuous infinite marquee */}
        <div className="flex gap-10 md:gap-14 items-center animate-marquee-partners">
          {PARTNERS_LIST.map((partner, index) => (
            <img
              key={`partner-logo-${index}`}
              src={partner.src}
              alt={partner.name}
              className={`h-6 md:h-7 w-auto max-w-[130px] object-contain shrink-0 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200 select-none ${
                isSeeker ? "brightness-0 invert opacity-70 hover:opacity-100" : ""
              }`}
              loading="eager"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function Hero() {
  const { open: openAuthModal } = useAuthModal();
  const { isSeeker, toggleMode } = useLandingMode();

  return (
    <section
      aria-label="Hero — OpenNova"
      className={`relative overflow-hidden pt-28 md:pt-36 pb-20 md:pb-24 transition-colors duration-300 ${
        isSeeker ? "bg-[#171717]" : "bg-white"
      }`}
    >
      {/* ================= AMBIENT RED GRADIENT LAYER (GUARANTEED VISIBILITY) ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* A. SOLVER / LIGHT MODE GRADIENT */}
        {!isSeeker && (
          <div className="w-full h-full relative">
            {/* Primary rich coral/red bottom radial bloom */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] md:w-[110%] h-[420px] md:h-[500px]"
              style={{
                background:
                  "radial-gradient(ellipse 75% 60% at 50% 100%, rgba(248, 113, 113, 0.45) 0%, rgba(254, 202, 202, 0.30) 45%, rgba(255, 255, 255, 0) 80%)",
              }}
            />
            {/* Bottom edge linear blend upward */}
            <div
              className="absolute bottom-0 inset-x-0 h-40"
              style={{
                background:
                  "linear-gradient(to top, rgba(239, 68, 68, 0.22) 0%, rgba(254, 226, 226, 0.12) 60%, transparent 100%)",
              }}
            />
          </div>
        )}

        {/* B. SEEKER / DARK MODE GRADIENT */}
        {isSeeker && (
          <div className="w-full h-full relative">
            {/* Primary deep vibrant crimson glow centered behind marquee */}
            <div
              className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[130%] md:w-[95%] h-[440px] md:h-[520px]"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(227, 0, 0, 0.50) 0%, rgba(168, 0, 0, 0.28) 42%, rgba(23, 23, 23, 0) 75%)",
              }}
            />
            {/* Secondary bottom atmosphere */}
            <div
              className="absolute bottom-0 inset-x-0 h-56"
              style={{
                background:
                  "linear-gradient(to top, rgba(160, 0, 0, 0.32) 0%, transparent 100%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center text-center">

        {/* ── Main headline ───────────────────────────── */}
        <h1
          className={`text-[2rem] sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.8rem] font-bold leading-[1.06] tracking-[-0.035em] max-w-4xl transition-colors duration-300 ${
            isSeeker ? "text-white" : "text-gray-900"
          }`}
        >
          {isSeeker ? (
            <>
              Jangkau Inovasi Lebih Luas &{" "}
              <span className="block mt-1.5">
                Mulailah Menjadi{" "}
                {/* State-aware bidirectional TAP Mode Switcher */}
                <button
                  type="button"
                  onClick={toggleMode}
                  title="Beralih ke Solver Mode"
                  aria-label="Beralih ke Solver Mode"
                  className="h-[38px] md:h-[42px] px-2.5 md:px-3 rounded-full inline-flex items-center gap-2.5 transition-all duration-300 select-none align-middle mx-2 hover:scale-105 active:scale-95 shadow-md cursor-pointer bg-[#2E1616] border border-[#7A2020] flex-row-reverse"
                >
                  <span className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#E30000] shadow-inner shrink-0 transition-transform duration-300" />
                  <span className="text-[11px] md:text-xs font-black tracking-widest leading-none text-[#E30000]">
                    TAP
                  </span>
                </button>{" "}
                {/* Underlined word */}
                <span className="relative inline-block">
                  Seeker
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-[#E30000]"
                  />
                </span>
              </span>
            </>
          ) : (
            <>
              Pecahkan Masalah Nyata &{" "}
              <span className="block mt-1.5">
                Berinovasi sebagai{" "}
                {/* State-aware bidirectional TAP Mode Switcher */}
                <button
                  type="button"
                  onClick={toggleMode}
                  title="Beralih ke Seeker Mode"
                  aria-label="Beralih ke Seeker Mode"
                  className="h-[38px] md:h-[42px] px-2.5 md:px-3 rounded-full inline-flex items-center gap-2.5 transition-all duration-300 select-none align-middle mx-2 hover:scale-105 active:scale-95 shadow-md cursor-pointer bg-[#FDE8E8] border border-[#FCA5A5] flex-row"
                >
                  <span className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#E30000] shadow-inner shrink-0 transition-transform duration-300" />
                  <span className="text-[11px] md:text-xs font-black tracking-widest leading-none text-[#E30000]">
                    TAP
                  </span>
                </button>{" "}
                {/* Underlined word */}
                <span className="relative inline-block">
                  Solver
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-[#E30000]"
                  />
                </span>
              </span>
            </>
          )}
        </h1>

        {/* Description */}
        <p
          className={`mt-7 max-w-[660px] text-base md:text-[1.05rem] leading-[1.65] transition-colors duration-300 ${
            isSeeker ? "text-[#A4A4A4]" : "text-gray-500"
          }`}
        >
          {isSeeker
            ? "Temukan beragam solusi inovatif dari 10.000+ Solver di seluruh Indonesia untuk menyelesaikan masalah perusahaan anda. Mulai ciptakan challenge anda sendiri disini."
            : "500+ perusahaan menghadirkan tantangan nyata. Saatnya menciptakan inovasi terbaik anda melalui sains, teknologi, dan bisnis untuk menjawab masalah mereka."}
        </p>

        {/* CTA buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
          {isSeeker ? (
            <>
              <button
                type="button"
                onClick={() => openAuthModal("REGISTER_1")}
                id="hero-cta-seeker"
                className="flex items-center gap-2 bg-white text-gray-900 font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-gray-100 active:scale-[0.97] transition-all duration-150 shadow-[0_2px_14px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                Mulai sebagai Seeker
                <ArrowRight size={14} />
              </button>

              <Link
                href="/seeker/challenges/new"
                id="hero-cta-create-challenge"
                className="flex items-center gap-2 bg-transparent text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-[#E30000] hover:bg-[#E30000]/10 hover:border-[#FF2E2E] active:scale-[0.97] transition-all duration-150"
              >
                Buat Challenge Anda
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal("REGISTER_1")}
                id="hero-cta-solver"
                className="flex items-center gap-2 bg-gray-900 text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all duration-150 shadow-[0_2px_12px_rgba(20,20,20,0.14)] cursor-pointer"
              >
                Mulai sebagai Solver
                <ArrowRight size={14} />
              </button>

              <Link
                href="#challenge"
                id="hero-cta-explore"
                className="flex items-center gap-2 bg-white text-gray-800 font-semibold text-sm px-6 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all duration-150"
              >
                Jelajahi Challenge
              </Link>
            </>
          )}
        </div>

        {/* Partner strip */}
        <PartnerStrip isSeeker={isSeeker} />
      </div>
    </section>
  );
}
