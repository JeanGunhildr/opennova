"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export default function SeekerFinalCTA() {
  return (
    <section
      aria-label="Akselerasi Inovasi Seeker"
      className="w-full max-w-[1180px] mx-auto mt-20 p-10 md:p-14 rounded-[24px] bg-[#1F1F1F] border border-[#393939] text-center relative overflow-hidden shadow-2xl"
    >
      {/* Background Glow: Subtle radial red ambient light centered behind text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(227,0,0,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Decorative accent top line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E30000] to-transparent opacity-60"
      />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Siap Akselerasi Inovasi & Temukan Solusi Terbaik?
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#A4A4A4] max-w-[620px] mx-auto mb-8 leading-relaxed">
          Publikasikan tantangan bisnis Anda ke ribuan talenta terbaik di seluruh
          Indonesia sekarang.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/seeker/challenges/new"
            id="seeker-cta-create"
            className="h-[44px] px-8 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-sm font-bold shadow-lg transition-all active:scale-[0.97] inline-flex items-center justify-center gap-2"
          >
            Buat Challenge Sekarang
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
