"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data/landing";
import { OpenNovaLogo } from "@/component/landing/Logo";
import { useAuthModal } from "@/component/auth/AuthModalContext";


// ── Arrow icon used in CTA button ────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7H11M11 7L8 4M11 7L8 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Hamburger / close icon ────────────────────────────────
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      {open ? (
        <path
          d="M4 4L14 14M14 4L4 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <>
          <line x1="2" y1="5"  x2="16" y2="5"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="2" y1="9"  x2="16" y2="9"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openAuthModal } = useAuthModal();

  return (
    <>
      {/* ── Floating pill navigation ───────────────────── */}
      <nav
        aria-label="Navigasi utama"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl"
      >
        <div className="flex items-center justify-between h-14 px-3 rounded-full bg-white/82 backdrop-blur-md border border-gray-200/70 shadow-[0_7px_25px_rgba(20,20,20,0.10)]">

          {/* Logo */}
          <Link href="/" aria-label="OpenNova beranda" className="flex-shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
            <OpenNovaLogo />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-full transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <button
            type="button"
            id="nav-cta-daftar"
            onClick={openAuthModal}
            className="hidden md:flex items-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all duration-150"
          >
            Masuk
            <ArrowRight />
          </button>

          {/* Mobile toggle */}
          <button
            id="nav-mobile-toggle"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MenuIcon open={mobileOpen} />
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
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="absolute top-[72px] left-4 right-4 bg-white rounded-2xl shadow-[0_10px_35px_rgba(20,20,20,0.14)] border border-gray-200 p-3">
            <ul className="space-y-0.5" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-[15px] text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); openAuthModal(); }}
                className="flex w-full items-center justify-center gap-2 bg-gray-900 text-white font-semibold text-sm py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Daftar sekarang
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
