import { incentives } from "@/lib/data/landing";
import type { Incentive } from "@/lib/data/landing";

// ── Icon components (use currentColor so they adapt to container bg) ──
function MoneyIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M11 5.5V7M11 15V16.5M8.5 9C8.5 8.17 9.17 7.5 10 7.5H12C12.83 7.5 13.5 8.17 13.5 9C13.5 9.83 12.83 10.5 12 10.5H10C9.17 10.5 8.5 11.17 8.5 12C8.5 12.83 9.17 13.5 10 13.5H12C12.83 13.5 13.5 12.83 13.5 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="3" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 7.5H11M5 10.5H8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="15.5" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14.5 19.5L13.5 21.5L16 20L18.5 21.5L17.5 19.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 12.5C4.5 15 7 14 9 13L13 11C15 10 16.5 10.5 18 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.5 9.5L9 7C10.5 6 12 6 13.5 7L17 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M2 12.5L5.5 16M18 12L20 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getIcon(id: string) {
  switch (id) {
    case "inc-1": return MoneyIcon;
    case "inc-2": return CertificateIcon;
    default:      return HandshakeIcon;
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
        <Icon className="text-gray-900" />
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-2.5">{incentive.title}</h3>
        <p className="text-[14px] text-white/80 leading-relaxed">{incentive.description}</p>
      </div>
    </article>
  );
}

// ── Standard incentive card (white background) ────────────
function StandardCard({ incentive }: { incentive: Incentive }) {
  const Icon = getIcon(incentive.id);
  return (
    <article
      className="bg-white border border-gray-200 rounded-2xl p-6"
      style={{ minHeight: "256px" }}
    >
      {/* Icon container — dark in light mode, white in dark mode */}
      <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center mb-5">
        <Icon className="text-white" />
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-2.5">
        {incentive.title}
      </h3>
      <p className="text-[14px] text-gray-500 leading-relaxed">
        {incentive.description}
      </p>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
export default function IncentiveSection() {
  const featured  = incentives.find((i) => i.featured) ?? incentives[0]!;
  const standards = incentives.filter((i) => !i.featured);

  return (
    <section
      id="insentif"
      aria-labelledby="incentive-heading"
      className="py-20 md:py-24 lg:py-32 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">

          {/* ── Left intro block ────────────────────── */}
          <div className="lg:flex-shrink-0 lg:w-72 xl:w-80">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-1.5 bg-gray-900 rounded-full px-3.5 py-1.5 mb-6">
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
              className="text-[1.8rem] md:text-[2.15rem] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]"
            >
              Insentif yang Akan Anda Terima Sebagai Pemenang
            </h2>
          </div>

          {/* ── Right cards grid ─────────────────────── */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeaturedCard incentive={featured} />
            {standards.map((inc) => (
              <StandardCard key={inc.id} incentive={inc} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
