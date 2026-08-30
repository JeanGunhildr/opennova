import { incentives } from "@/lib/data/landing";
import type { Incentive } from "@/lib/data/landing";

// ── Icon components (use currentColor so they adapt to container bg) ──
function MoneyIcon({ className }: { className?: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.125 23.88H20.1C21.075 23.88 21.885 23.01 21.885 21.96C21.885 20.655 21.42 20.4 20.655 20.13L19.14 19.605V23.88H19.125Z" fill="#292D32"/>
      <path d="M17.955 2.85C9.67498 2.88 2.96998 9.615 2.99998 17.895C3.02998 26.175 9.76498 32.88 18.045 32.85C26.325 32.82 33.03 26.085 33 17.805C32.97 9.525 26.235 2.835 17.955 2.85ZM21.39 18C22.56 18.405 24.135 19.275 24.135 21.96C24.135 24.27 22.32 26.13 20.1 26.13H19.125V27C19.125 27.615 18.615 28.125 18 28.125C17.385 28.125 16.875 27.615 16.875 27V26.13H16.335C13.875 26.13 11.88 24.06 11.88 21.51C11.88 20.895 12.39 20.385 13.005 20.385C13.62 20.385 14.13 20.895 14.13 21.51C14.13 22.815 15.12 23.88 16.335 23.88H16.875V18.81L14.61 18C13.44 17.595 11.865 16.725 11.865 14.04C11.865 11.73 13.68 9.87 15.9 9.87H16.875V9C16.875 8.385 17.385 7.875 18 7.875C18.615 7.875 19.125 8.385 19.125 9V9.87H19.665C22.125 9.87 24.12 11.94 24.12 14.49C24.12 15.105 23.61 15.615 22.995 15.615C22.38 15.615 21.87 15.105 21.87 14.49C21.87 13.185 20.88 12.12 19.665 12.12H19.125V17.19L21.39 18Z" fill="#292D32"/>
      <path d="M14.13 14.055C14.13 15.36 14.595 15.615 15.36 15.885L16.875 16.41V12.12H15.9C14.925 12.12 14.13 12.99 14.13 14.055Z" fill="#292D32"/>
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.6667 2.83337H11.3333C6.375 2.83337 4.25 5.66671 4.25 9.91671V24.0834C4.25 28.3334 6.375 31.1667 11.3333 31.1667H22.6667C27.625 31.1667 29.75 28.3334 29.75 24.0834V9.91671C29.75 5.66671 27.625 2.83337 22.6667 2.83337ZM11.3333 17.3542H17C17.5808 17.3542 18.0625 17.8359 18.0625 18.4167C18.0625 18.9975 17.5808 19.4792 17 19.4792H11.3333C10.7525 19.4792 10.2708 18.9975 10.2708 18.4167C10.2708 17.8359 10.7525 17.3542 11.3333 17.3542ZM22.6667 25.1459H11.3333C10.7525 25.1459 10.2708 24.6642 10.2708 24.0834C10.2708 23.5025 10.7525 23.0209 11.3333 23.0209H22.6667C23.2475 23.0209 23.7292 23.5025 23.7292 24.0834C23.7292 24.6642 23.2475 25.1459 22.6667 25.1459ZM26.2083 13.1042H23.375C21.2217 13.1042 19.4792 11.3617 19.4792 9.20837V6.37504C19.4792 5.79421 19.9608 5.31254 20.5417 5.31254C21.1225 5.31254 21.6042 5.79421 21.6042 6.37504V9.20837C21.6042 10.1859 22.3975 10.9792 23.375 10.9792H26.2083C26.7892 10.9792 27.2708 11.4609 27.2708 12.0417C27.2708 12.6225 26.7892 13.1042 26.2083 13.1042Z" fill="white"/>
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.8433 18.0341C28.3192 18.0341 27.88 17.6375 27.8233 17.1133C27.4833 13.9966 25.8117 11.1916 23.2333 9.40665C22.7658 9.08081 22.6525 8.44331 22.9783 7.97581C23.3042 7.50831 23.9417 7.39498 24.4092 7.72081C27.4833 9.85998 29.4667 13.2033 29.8775 16.9008C29.9342 17.4675 29.5233 17.9775 28.9567 18.0341C28.9142 18.0341 28.8858 18.0341 28.8433 18.0341Z" fill="white"/>
      <path d="M5.29836 18.105C5.27002 18.105 5.22752 18.105 5.19919 18.105C4.63252 18.0484 4.22169 17.5384 4.27836 16.9717C4.66086 13.2742 6.61586 9.93087 9.66169 7.77754C10.115 7.45171 10.7667 7.56504 11.0925 8.01837C11.4184 8.48587 11.305 9.12337 10.8517 9.44921C8.30169 11.2625 6.64419 14.0675 6.33252 17.17C6.27586 17.7084 5.82252 18.105 5.29836 18.105Z" fill="white"/>
      <path d="M22.6525 29.8917C20.91 30.7275 19.04 31.1525 17.085 31.1525C15.045 31.1525 13.1042 30.6992 11.2909 29.7784C10.7809 29.5375 10.5825 28.9142 10.8375 28.4042C11.0784 27.8942 11.7017 27.6959 12.2117 27.9367C13.1042 28.39 14.0534 28.7017 15.0167 28.8859C16.32 29.1409 17.6517 29.155 18.955 28.9284C19.9184 28.7584 20.8675 28.4609 21.7459 28.0359C22.27 27.795 22.8934 27.9934 23.12 28.5175C23.375 29.0275 23.1767 29.6509 22.6525 29.8917Z" fill="white"/>
      <path d="M17.0708 2.84753C14.875 2.84753 13.0758 4.63253 13.0758 6.84253C13.0758 9.05253 14.8608 10.8375 17.0708 10.8375C19.2808 10.8375 21.0658 9.05253 21.0658 6.84253C21.0658 4.63253 19.2808 2.84753 17.0708 2.84753Z" fill="white"/>
      <path d="M7.15418 19.6492C4.95835 19.6492 3.15918 21.4342 3.15918 23.6442C3.15918 25.8542 4.94418 27.6392 7.15418 27.6392C9.36418 27.6392 11.1492 25.8542 11.1492 23.6442C11.1492 21.4342 9.35001 19.6492 7.15418 19.6492Z" fill="white"/>
      <path d="M26.8458 19.6492C24.65 19.6492 22.8508 21.4342 22.8508 23.6442C22.8508 25.8542 24.6358 27.6392 26.8458 27.6392C29.0558 27.6392 30.8408 25.8542 30.8408 23.6442C30.8408 21.4342 29.0558 19.6492 26.8458 19.6492Z" fill="white"/>
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
