import Link from "next/link";
import { challenges } from "@/lib/data/landing";
import type { Challenge } from "@/lib/data/landing";

// ── Individual challenge card ─────────────────────────────
function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const gradient = `linear-gradient(135deg, ${challenge.bgFrom} 0%, ${challenge.bgVia} 50%, ${challenge.bgTo} 100%)`;

  return (
    <article
      className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 focus-within:ring-2 focus-within:ring-primary-500/40"
      style={{ boxShadow: "0 8px 30px rgba(20,20,20,0.07)" }}
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
        <h3 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-2 mb-3">
          {challenge.title}
        </h3>

        {/* Reward badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-primary-100">
            Hadiah: {challenge.reward}
          </span>
        </div>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* ── Footer ────────────────────────────────── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
          <div>
            <p className="text-[11px] text-gray-400 leading-none mb-1">
              Batas waktu
            </p>
            <p className="text-[13px] font-semibold text-gray-700 leading-none">
              {challenge.deadline}
            </p>
          </div>

          <Link
            href={`/challenge/${challenge.id}`}
            id={`card-detail-${challenge.id}`}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[11px] font-semibold px-3.5 py-[7px] rounded-full transition-colors duration-150"
          >
            Lihat detail
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M2 5H8M8 5L5.5 2.5M8 5L5.5 7.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
export default function ChallengeSection() {
  return (
    <section
      id="challenge"
      aria-labelledby="challenge-heading"
      className="py-20 md:py-24 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">

        {/* Section heading */}
        <div className="text-center mb-12 md:mb-14">
          <h2
            id="challenge-heading"
            className="text-[1.8rem] md:text-[2.25rem] lg:text-[2.5rem] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em] mb-4"
          >
            Jelajahi Challenge Terbaru
          </h2>
          <p className="text-gray-500 text-base md:text-[1.05rem] max-w-lg mx-auto leading-relaxed">
            Pilih tantangan yang sesuai dengan keahlian anda dan mulai ciptakan solusi.
          </p>
        </div>

        {/* 1-col → 2-col → 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Section CTA */}
        <div className="flex justify-center">
          <Link
            href="/challenge"
            id="challenge-cta-all"
            className="flex items-center gap-2 bg-gray-900 text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all duration-150 shadow-[0_2px_12px_rgba(20,20,20,0.10)]"
          >
            Lihat Semua Challenge
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7H11M11 7L8 4M11 7L8 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
