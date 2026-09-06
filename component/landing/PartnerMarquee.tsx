"use client";

import Image from "next/image";
import { useLandingMode } from "./LandingModeContext";

const PARTNER_LOGOS = [
  { name: "Indofood", src: "/images/partners/indofood.svg" },
  { name: "Pertamina", src: "/images/partners/pertamina.svg" },
  { name: "Adaro", src: "/images/partners/adaro.svg" },
  { name: "Xurya", src: "/images/partners/xurya.svg" },
  { name: "Barito Pacific", src: "/images/partners/barito-pasific.svg" },
  { name: "Paragon Corp", src: "/images/partners/paragon.svg" },
];

// Repeat to ensure continuous, seamless infinite loop
const REPEATED_LOGOS = [
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
];

export default function PartnerMarquee() {
  const { isSeeker } = useLandingMode();

  return (
    <section className="py-10 md:py-16 text-center overflow-hidden">
      <div className="max-w-[1220px] mx-auto px-6">
        <p className="text-[10px] md:text-[11px] tracking-[0.16em] uppercase font-semibold text-[#858992] mb-7">
          Dipercaya dan berkolaborasi dengan
        </p>

        {/* Gradient edge mask */}
        <div className="logo-mask relative w-full overflow-hidden">
          <div className="animate-partner-marquee flex items-center gap-12 md:gap-16 py-2">
            {REPEATED_LOGOS.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="shrink-0 flex items-center gap-3 px-2 group cursor-default"
              >
                <div
                  className={`h-8 md:h-9 flex items-center justify-center transition-all duration-300 ${
                    isSeeker
                      ? "opacity-60 brightness-0 invert group-hover:opacity-100"
                      : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                  }`}
                >
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={130}
                    height={36}
                    className="h-7 md:h-8 w-auto max-w-[120px] md:max-w-[140px] object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
