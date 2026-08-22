import Link from "next/link";
import {
  AdaroLogo,
  BaritoPasificLogo,
  IndofoodLogo,
  ParagonLogo,
  PertaminaLogo,
  XuryaLogo,
} from "@/component/logo";

// ── Arrow icon ────────────────────────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
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

// ── Partner logos list ────────────────────────────────────
const partnerLogos = [
  { id: "pertamina",    Component: PertaminaLogo,    label: "Pertamina"    },
  { id: "indofood",     Component: IndofoodLogo,     label: "Indofood"     },
  { id: "adaro",        Component: AdaroLogo,        label: "Adaro"        },
  { id: "barito",       Component: BaritoPasificLogo, label: "Barito Pasific" },
  { id: "paragon",      Component: ParagonLogo,      label: "Paragon"      },
  { id: "xurya",        Component: XuryaLogo,        label: "Xurya"        },
];

// ── Partner marquee strip ─────────────────────────────────
function PartnerStrip() {
  // Duplicated for seamless loop
  const items = [...partnerLogos, ...partnerLogos];

  return (
    <div
      className="mt-14 w-full max-w-3xl rounded-2xl border border-gray-200/80 overflow-hidden flex items-center"
      style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(10px)" }}
      aria-label="Daftar mitra inovasi"
    >
      {/* Fixed label */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 border-r border-gray-200/80">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">
          Mitra Inovasi
        </span>
      </div>

      {/* Scrolling logos */}
      <div className="flex-1 overflow-hidden h-14 relative">
        {/* Edge fade masks */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.65), transparent)" }}
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,0.65), transparent)" }}
        />

        <div className="flex items-center animate-marquee gap-10 whitespace-nowrap px-6 h-full">
          {items.map(({ id, Component, label }, i) => (
            <Component
              key={`${id}-${i}`}
              className="h-6 w-auto flex-shrink-0 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              aria-label={i >= partnerLogos.length ? undefined : label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      aria-label="Hero — OpenNova"
      className="relative overflow-hidden bg-white pt-28 md:pt-36 pb-20 md:pb-24"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[480px] pointer-events-none hero-glow"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center text-center">

        {/* Eyebrow badge */}
        <div className="mb-7 inline-flex items-center gap-2 bg-primary-50 border border-primary-200/70 rounded-full px-3.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-widest">
            Platform Inovasi Terbuka
          </span>
        </div>

        {/* ── Main headline ───────────────────────────── */}
        <h1 className="text-[2rem] sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.8rem] font-bold text-gray-900 leading-[1.06] tracking-[-0.035em] max-w-4xl">
          Pecahkan Masalah Nyata &{" "}
          <span className="block mt-1.5">
            Berinovasi sebagai{" "}
            {/* Status capsule */}
            <span
              className="inline-flex items-center align-middle gap-1.5 bg-secondary-100 border border-secondary-200/80 rounded-full px-3 py-1 text-[0.62em] font-semibold text-secondary-700 leading-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" aria-hidden="true" />
              Inovatif
            </span>{" "}
            {/* Underlined word */}
            <span className="relative inline-block">
              Solver
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-primary-500"
              />
            </span>
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-[660px] text-base md:text-[1.05rem] text-gray-500 leading-[1.65]">
          OpenNova menghubungkan solver terbaik Indonesia dengan tantangan nyata dari
          perusahaan-perusahaan terkemuka. Temukan challenge, kirim solusi inovatif,
          dan raih hadiah serta peluang kolaborasi.
        </p>

        {/* CTA buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/auth/register"
            id="hero-cta-solver"
            className="flex items-center gap-2 bg-gray-900 text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all duration-150 shadow-[0_2px_12px_rgba(20,20,20,0.14)]"
          >
            Mulai sebagai Solver
            <ArrowRight />
          </Link>

          <Link
            href="#challenge"
            id="hero-cta-explore"
            className="flex items-center gap-2 bg-white text-gray-800 font-semibold text-sm px-6 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all duration-150"
          >
            Jelajahi Challenge
          </Link>
        </div>

        {/* Partner strip */}
        <PartnerStrip />
      </div>
    </section>
  );
}
