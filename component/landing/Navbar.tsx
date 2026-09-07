"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuthModal } from "@/component/auth/AuthModalContext";
import { useLandingMode } from "@/component/landing/LandingModeContext";

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegister }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSeeker, mode, setMode } = useLandingMode();
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      openAuthModal("LOGIN");
    }
  };

  const handleRegister = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      openAuthModal("REGISTER_1");
    }
  };

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSeeker
          ? isScrolled
            ? "bg-[#090a0c]/85 border-b border-white/[0.08] backdrop-blur-xl shadow-lg"
            : "bg-[#090a0c]/60 border-b border-transparent backdrop-blur-md"
          : isScrolled
          ? "bg-white/90 border-b border-gray-200/80 backdrop-blur-xl shadow-sm"
          : "bg-white/70 border-b border-transparent backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6">
        <nav className="h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="#hero"
            className="flex items-center gap-2.5 font-semibold text-[18px] tracking-[-0.035em] group"
          >
            <Image
              src="/icon.svg"
              alt="Opennova"
              width={28}
              height={28}
              priority
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            <a
              href="#inovasi"
              className={`text-[13px] font-medium transition-colors ${
                isSeeker
                  ? "text-[#cfd1d5] hover:text-white"
                  : "text-[#30343a] hover:text-[#E30000]"
              }`}
            >
              Inovasi Terbaru
            </a>
            <a
              href="#kategori"
              className={`text-[13px] font-medium transition-colors ${
                isSeeker
                  ? "text-[#cfd1d5] hover:text-white"
                  : "text-[#30343a] hover:text-[#E30000]"
              }`}
            >
              Kategori
            </a>
            <a
              href="#cerita"
              className={`text-[13px] font-medium transition-colors ${
                isSeeker
                  ? "text-[#cfd1d5] hover:text-white"
                  : "text-[#30343a] hover:text-[#E30000]"
              }`}
            >
              Cerita Pengguna
            </a>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleLogin}
              className={`hidden sm:inline-flex px-4 py-2 rounded-full text-[13px] font-semibold border transition-all cursor-pointer hover:-translate-y-0.5 ${
                isSeeker
                  ? "bg-[#191b20] border-[#292c32] text-[#f4f4f5] hover:border-[#50545d]"
                  : "bg-white border-[#dfe1e5] text-[#111318] hover:border-[#aeb2b8]"
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-5 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white font-semibold text-xs sm:text-sm whitespace-nowrap inline-flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Daftar<span className="hidden sm:inline"> Sekarang</span></span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className={`md:hidden p-2 rounded-full border transition-colors cursor-pointer shrink-0 ${
                isSeeker
                  ? "border-[#2b2e34] text-white hover:bg-[#1a1c22]"
                  : "border-[#e7e8eb] text-[#111318] hover:bg-gray-100"
              }`}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div
            className={`md:hidden mt-2 p-5 rounded-2xl border shadow-xl flex flex-col gap-4 animate-in fade-in duration-200 ${
              isSeeker
                ? "bg-[#090a0c] border-[#2b2e34] text-white"
                : "bg-white border-[#e7e8eb] text-[#111318]"
            }`}
          >
            <a
              href="#inovasi"
              onClick={() => setMobileOpen(false)}
              className="text-[14px] font-medium py-1"
            >
              Inovasi Terbaru
            </a>
            <a
              href="#kategori"
              onClick={() => setMobileOpen(false)}
              className="text-[14px] font-medium py-1"
            >
              Kategori
            </a>
            {!isSeeker && (
              <a
                href="#inovasi"
                onClick={() => setMobileOpen(false)}
                className="text-[14px] font-medium py-1"
              >
                Jelajahi
              </a>
            )}
            <a
              href="#cerita"
              onClick={() => setMobileOpen(false)}
              className="text-[14px] font-medium py-1"
            >
              Cerita Pengguna
            </a>

            <div className="pt-3 border-t border-current/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogin();
                }}
                className={`w-full py-2.5 rounded-full text-[13px] font-semibold border ${
                  isSeeker
                    ? "bg-[#191b20] border-[#292c32] text-white"
                    : "bg-white border-[#dfe1e5] text-[#111318]"
                }`}
              >
                Masuk
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
