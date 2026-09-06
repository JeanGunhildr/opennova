"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { OpenNovaLogo } from "@/component/landing/Logo";
import { useAuthModal } from "@/component/auth/AuthModalContext";
import { useLandingMode } from "@/component/landing/LandingModeContext";

const seekerNavLinks = [
  { label: "Panduan",          href: "#panduan" },
  { label: "Kategori Inovasi", href: "#kategori" },
  { label: "Cerita Pengguna",  href: "#testimoni" },
  { label: "Hubungi Kami",     href: "#kontak" },
];

const solverNavLinks = [
  { label: "Jelajah Challenge", href: "#challenge" },
  { label: "Kategori",          href: "#kolaborasi" },
  { label: "Tentang Kami",      href: "#insentif" },
  { label: "Kontak",            href: "#kontak" },
];

// ─────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openAuthModal } = useAuthModal();
  const { isSeeker } = useLandingMode();

  const activeLinks = isSeeker ? seekerNavLinks : solverNavLinks;

  return (
    <>
      {/* ── Floating pill navigation ───────────────────── */}
      <nav
        aria-label="Navigasi utama"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
      >
        <div
          className={`flex items-center justify-between h-14 px-3 rounded-full backdrop-blur-md transition-colors duration-300 ${
            isSeeker
              ? "bg-[#191919]/95 border border-[#2E2E2E] shadow-[0_7px_25px_rgba(0,0,0,0.5)]"
              : "bg-white/82 border border-gray-200/70 shadow-[0_7px_25px_rgba(20,20,20,0.10)]"
          }`}
        >

          {/* Logo */}
          <Link
            href="/"
            aria-label="OpenNova beranda"
            className="flex-shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-[#E30000] focus-visible:ring-offset-2"
          >
            <OpenNovaLogo theme={isSeeker ? "dark" : "light"} />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5" role="list">
            {activeLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 text-sm rounded-full transition-colors duration-150 ${
                    isSeeker
                      ? "text-[#A4A4A4] hover:text-white hover:bg-[#262626]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          {isSeeker ? (
            <button
              type="button"
              id="nav-cta-seeker"
              onClick={() => openAuthModal("LOGIN")}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-xs font-semibold px-4 h-[34px] transition-colors active:scale-[0.97] cursor-pointer shadow-md"
            >
              Masuk
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              id="nav-cta-daftar"
              onClick={() => openAuthModal("LOGIN")}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full active:scale-[0.97] transition-all duration-150 cursor-pointer bg-gray-900 text-white hover:bg-gray-800"
            >
              Masuk
              <ArrowRight size={14} />
            </button>
          )}

          {/* Mobile toggle */}
          <button
            id="nav-mobile-toggle"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              isSeeker
                ? "text-gray-200 hover:bg-[#262626]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-0 z-40 md:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className={`absolute top-[72px] left-4 right-4 rounded-2xl p-3 border shadow-[0_10px_35px_rgba(20,20,20,0.25)] transition-colors duration-300 ${
              isSeeker
                ? "bg-[#191919] border-[#2E2E2E] text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <ul className="space-y-0.5" role="list">
              {activeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 text-[15px] rounded-xl transition-colors ${
                      isSeeker
                        ? "text-[#A4A4A4] hover:text-white hover:bg-[#262626]"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={`mt-3 pt-3 border-t ${isSeeker ? "border-[#2E2E2E]" : "border-gray-100"}`}>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); openAuthModal("REGISTER_1"); }}
                className={`flex w-full items-center justify-center gap-2 font-semibold text-sm py-3 rounded-full transition-colors cursor-pointer ${
                  isSeeker
                    ? "bg-[#E30000] hover:bg-[#CC0000] text-white shadow-md"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {isSeeker ? "Daftar sebagai Seeker" : "Daftar sekarang"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
