import Link from "next/link";
import { processSteps } from "@/lib/data/landing";

// ── Browser-framed product preview ───────────────────────
function ProductPreview() {
  return (
    <div
      className="w-full rounded-[20px] border border-gray-200 bg-gray-50 p-3"
      style={{ boxShadow: "0 8px 30px rgba(20,20,20,0.07)" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-1 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="flex-1 mx-2 h-[22px] bg-white rounded-full border border-gray-200 flex items-center px-3">
          <span className="text-[9.5px] text-gray-400 leading-none">
            opennova.id/challenge
          </span>
        </div>
      </div>

      {/* App UI mock — challenge listing interface */}
      <div
        className="rounded-xl overflow-hidden bg-white border border-gray-100"
        style={{ aspectRatio: "1.72 / 1" }}
        aria-hidden="true"
        role="presentation"
      >
        <div className="p-4 h-full flex flex-col gap-3">
          {/* Page title bar */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="h-5 w-36 bg-gray-100 rounded-lg" />
            <div className="h-6 w-20 bg-primary-100 rounded-full" />
          </div>

          {/* Challenge card grid */}
          <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
            {[
              { from: "#1a2035", to: "#1e3358" },
              { from: "#0d2818", to: "#184d30" },
              { from: "#1c1008", to: "#2d1a06" },
              { from: "#1a1a2e", to: "#16213e" },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden flex flex-col p-2.5 gap-2"
                style={{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }}
              >
                <div className="h-1.5 bg-white/20 rounded-full w-4/5" />
                <div className="h-1.5 bg-white/13 rounded-full w-1/2" />
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-3.5 w-14 bg-primary-400/70 rounded-full" />
                  <div className="h-3.5 w-10 bg-white/15 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Process steps card ────────────────────────────────────
function ProcessCard() {
  const ACTIVE_STEP = 1; // Step 2 shown as active for visual interest

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-5"
      style={{ boxShadow: "0 8px 30px rgba(20,20,20,0.07)" }}
    >
      {/* Card header */}
      <div className="mb-5">
        <span className="inline-flex items-center bg-gray-100 text-gray-500 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
          5 langkah
        </span>
        <p className="text-sm font-bold text-gray-900 leading-snug">
          Temukan challenge dan kirim solusi inovatif anda.
        </p>
      </div>

      {/* Steps list */}
      <ol className="space-y-1.5" aria-label="Langkah partisipasi">
        {processSteps.map((step, i) => {
          const isActive = i === ACTIVE_STEP;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive ? "bg-primary-500" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <span className={isActive ? "font-semibold" : ""}>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function CollaborationSection() {
  return (
    <section
      id="kolaborasi"
      aria-labelledby="collab-heading"
      className="py-20 md:py-24 lg:py-32 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">

        {/* Section header row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-10 lg:mb-14">
          <h2
            id="collab-heading"
            className="text-[1.8rem] md:text-[2.25rem] lg:text-[2.6rem] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em] max-w-[520px]"
          >
            Dapatkan Kesempatan Berkolaborasi dengan Perusahaan
          </h2>

          <div className="lg:pt-3">
            <Link
              href="#challenge"
              className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-primary-400"
            >
              Temukan challenge →
            </Link>
          </div>
        </div>

        {/* Two-column layout: product preview (65%) + process card (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-5 lg:gap-6">
          <ProductPreview />
          <ProcessCard />
        </div>
      </div>
    </section>
  );
}
