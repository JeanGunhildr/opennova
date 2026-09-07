"use client";

import Image from "next/image";
import Link from "next/link";
import { useLandingMode } from "./LandingModeContext";
import { useAuthModal } from "@/component/auth/AuthModalContext";

export default function Footer() {
  const { isSeeker, setMode } = useLandingMode();
  const { open: openAuthModal } = useAuthModal();

  return (
    <footer
      className={`py-16 md:py-20 transition-colors duration-300 border-t ${
        isSeeker
          ? "bg-[#07080a] border-[#22252a] text-[#858a92]"
          : "bg-[#fafafa] border-[#e7e8eb] text-[#858a92]"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-6">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 pb-12">
          {/* Brand & Mission */}
          <div>
            <Link
              href="#hero"
              className="inline-flex items-center gap-2.5 font-semibold text-[18px] tracking-tight group"
            >
              <Image
                src="/icon.svg"
                alt="Opennova"
                width={28}
                height={28}
                className="object-contain"
              />
              <span
                className={`transition-colors duration-300 ${
                  isSeeker ? "text-white" : "text-[#111318]"
                }`}
              >
                Opennova
              </span>
            </Link>
            <p className="max-w-[400px] text-[13px] leading-relaxed mt-4 text-[#858a92]">
              Platform open innovation dan crowdsourcing yang mempertemukan
              tantangan nyata dengan solusi terbaik dari ekosistem inovasi.
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-[12px]">
            {/* Col 1: Jelajahi */}
            <div className="flex flex-col gap-2.5">
              <h4
                className={`text-[11px] font-bold uppercase tracking-[0.1em] mb-1 transition-colors ${
                  isSeeker ? "text-white" : "text-[#111318]"
                }`}
              >
                Jelajahi
              </h4>
              <a
                href="#inovasi"
                className="hover:text-[#E30000] transition-colors"
              >
                Inovasi Terbaru
              </a>
              <a
                href="#kategori"
                className="hover:text-[#E30000] transition-colors"
              >
                Kategori
              </a>
            </div>

            {/* Col 2: Pengguna */}
            <div className="flex flex-col gap-2.5">
              <h4
                className={`text-[11px] font-bold uppercase tracking-[0.1em] mb-1 transition-colors ${
                  isSeeker ? "text-white" : "text-[#111318]"
                }`}
              >
                Pengguna
              </h4>
              <button
                type="button"
                onClick={() => {
                  setMode("seeker");
                  document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left hover:text-[#E30000] transition-colors cursor-pointer"
              >
                Seeker
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("solver");
                  document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left hover:text-[#E30000] transition-colors cursor-pointer"
              >
                Solver
              </button>
              <a
                href="#cerita"
                className="hover:text-[#E30000] transition-colors"
              >
                Cerita Pengguna
              </a>
            </div>

            {/* Col 3: Opennova */}
            <div className="flex flex-col gap-2.5">
              <h4
                className={`text-[11px] font-bold uppercase tracking-[0.1em] mb-1 transition-colors ${
                  isSeeker ? "text-white" : "text-[#111318]"
                }`}
              >
                Opennova
              </h4>
              <button
                type="button"
                onClick={() => openAuthModal("LOGIN")}
                className="text-left hover:text-[#E30000] transition-colors cursor-pointer"
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("REGISTER_1")}
                className="text-left hover:text-[#E30000] transition-colors cursor-pointer"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] transition-colors duration-300 ${
            isSeeker ? "border-[#22252a] text-[#858a92]" : "border-[#e7e8eb] text-[#858a92]"
          }`}
        >
          <span>© 2026 Opennova. Seluruh hak cipta dilindungi.</span>
          <span>Dibuat untuk ekosistem inovasi terbuka Indonesia.</span>
        </div>
      </div>
    </footer>
  );
}
