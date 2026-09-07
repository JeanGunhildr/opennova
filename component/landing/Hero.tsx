"use client";

import Image from "next/image";
import { useAuthModal } from "@/component/auth/AuthModalContext";
import { useLandingMode } from "@/component/landing/LandingModeContext";
import ScienceCanvas from "./ScienceCanvas";

interface HeroProps {
  onOpenAuth?: (tab: "login" | "register", role: "seeker" | "solver") => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  const { mode, setMode } = useLandingMode();
  const { open: openAuthModal } = useAuthModal();

  const isSeeker = mode === "seeker";

  const handleOpenRegister = (role: "seeker" | "solver") => {
    setMode(role);
    if (onOpenAuth) {
      onOpenAuth("register", role);
    } else {
      openAuthModal("REGISTER_1");
    }
  };

  return (
    <section
      id="hero"
      className={`relative min-h-[880px] md:min-h-[940px] pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden transition-colors duration-300 ${
        isSeeker ? "bg-[#090a0c] text-[#f7f7f8]" : "bg-white text-[#111318]"
      }`}
    >
      {/* ── Interactive Canvas & Background Glow ───────────────────────── */}
      <ScienceCanvas mode={mode} />

      <div
        className={`absolute inset-[-20%_-10%] pointer-events-none transition-all duration-500 z-0 ${
          isSeeker ? "hero-glow-dark" : "hero-glow-light"
        }`}
      />

      {/* ── Foreground Content ────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1220px] mx-auto px-6 text-center">
        {/* Kicker Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.08em] uppercase transition-colors duration-300 border mb-6">
          <span
            className={`inline-flex items-center gap-2 ${
              isSeeker
                ? "bg-[#15171b] border-[#2b2e34] text-[#bfc2c8]"
                : "bg-[#f7f7f8] border-[#e7e8eb] text-[#696e77]"
            }`}
          >
            <i className="w-1.5 h-1.5 rounded-full bg-[#E30000] shadow-[0_0_12px_rgba(227,0,0,0.8)] inline-block" />
            Platform Open Innovation Indonesia
          </span>
        </div>

        {/* Headline */}
        <h1
          id="heroTitle"
          className="max-w-[960px] mx-auto text-[42px] sm:text-[56px] md:text-[76px] lg:text-[84px] font-medium leading-[0.96] tracking-[-0.065em] mb-6 transition-all duration-300"
        >
          {isSeeker
            ? "Ubah tantangan bisnis menjadi peluang inovasi."
            : "Temukan challenge nyata, hadirkan solusi yang berdampak."}
        </h1>

        {/* Subheadline */}
        <p
          id="heroSub"
          className={`max-w-[700px] mx-auto text-[15px] md:text-[17px] leading-relaxed mb-8 transition-colors duration-300 ${
            isSeeker ? "text-[#9a9da5]" : "text-[#727780]"
          }`}
        >
          {isSeeker
            ? "Buka challenge di Opennova, temukan perspektif terbaik dari ekosistem inovasi, dan percepat perjalanan dari masalah nyata menuju solusi yang dapat diterapkan."
            : "Jelajahi challenge dari perusahaan dan organisasi di Indonesia, ajukan solusi terbaik Anda, dan buka peluang kolaborasi yang bernilai."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-7">
          {isSeeker ? (
            <>
              <button
                type="button"
                onClick={() => handleOpenRegister("seeker")}
                className="btn-red bg-[#E30000] hover:bg-[#bf0000] text-white px-6 py-3 rounded-full text-[13px] font-semibold tracking-tight shadow-[0_10px_28px_rgba(227,0,0,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Buat Challenge ↗
              </button>
              <a
                href="#inovasi"
                className={`px-6 py-3 rounded-full text-[13px] font-semibold tracking-tight border transition-all cursor-pointer hover:-translate-y-0.5 ${
                  isSeeker
                    ? "bg-[#191b20] border-[#292c32] text-[#f4f4f5] hover:border-[#50545d]"
                    : "bg-white border-[#dfe1e5] text-[#111318] hover:border-[#aeb2b8]"
                }`}
              >
                Lihat Inovasi
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleOpenRegister("solver")}
                className="btn-red bg-[#E30000] hover:bg-[#bf0000] text-white px-6 py-3 rounded-full text-[13px] font-semibold tracking-tight shadow-[0_10px_28px_rgba(227,0,0,0.25)] hover:-translate-y-0.5 transition-all inline-flex items-center"
              >
                Jelajahi Challenge ↗
              </button>
              <a
                href="#inovasi"
                className={`px-6 py-3 rounded-full text-[13px] font-semibold tracking-tight border transition-all cursor-pointer hover:-translate-y-0.5 ${
                  isSeeker
                    ? "bg-[#191b20] border-[#292c32] text-[#f4f4f5] hover:border-[#50545d]"
                    : "bg-white border-[#dfe1e5] text-[#111318] hover:border-[#aeb2b8]"
                }`}
              >
                Lihat Inovasi
              </a>
            </>
          )}
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center justify-center gap-2.5 text-[11px] text-[#727780] select-none">
          <span>Berpindah peran</span>
          <div
            className={`inline-flex items-center p-1 rounded-full border transition-colors duration-300 ${
              isSeeker
                ? "bg-[#17191d] border-[#2b2e34]"
                : "bg-[#f1f2f4] border-[#dedfe4]"
            }`}
          >
            <button
              type="button"
              onClick={() => setMode("seeker")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                isSeeker
                  ? "bg-[#E30000] text-white shadow-sm"
                  : "text-[#727780] hover:text-[#111318]"
              }`}
            >
              Seeker
            </button>
            <button
              type="button"
              onClick={() => setMode("solver")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                !isSeeker
                  ? "bg-[#E30000] text-white shadow-sm"
                  : "text-[#9a9da5] hover:text-white"
              }`}
            >
              Solver
            </button>
          </div>
        </div>

        {/* Dashboard Preview Image Container */}
        <div className="w-full max-w-[1120px] mx-auto mt-12 md:mt-14 relative z-10">
          <div
            className={`rounded-[18px] border overflow-hidden transition-all duration-500 shadow-2xl ${
              isSeeker
                ? "border-[#30333a] shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                : "border-[#e2e4e8] shadow-[0_35px_90px_rgba(20,25,35,0.14)]"
            }`}
          >
            <Image
              src={
                isSeeker
                  ? "/images/landing/hero-preview-seeker.png"
                  : "/images/landing/hero-preview-solver.png"
              }
              alt={
                isSeeker
                  ? "Tampilan dashboard OpenNova Seeker"
                  : "Tampilan dashboard OpenNova Solver"
              }
              width={1120}
              height={630}
              priority
              className="w-full h-auto object-contain block transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
