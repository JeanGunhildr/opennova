"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLandingMode } from "./LandingModeContext";

interface InnovationCardData {
  id: number;
  image: string;
  category: string;
  title: string;
}

const INNOVATION_CARDS: InnovationCardData[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=85",
    category: "Energi",
    title: "Sistem monitoring energi industri",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=85",
    category: "Bisnis",
    title: "Platform optimasi proses operasional",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=85",
    category: "AI & Analitik Data",
    title: "Prediksi kebutuhan berbasis data",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=85",
    category: "Manufaktur & Industri",
    title: "Otomasi inspeksi kualitas",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=85",
    category: "Rekayasa & Infrastruktur",
    title: "Solusi pemeliharaan aset",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=85",
    category: "Lingkungan",
    title: "Pemanfaatan limbah menjadi material baru",
  },
];

// Double items for infinite seamless scroll
const DISPLAY_ITEMS = [...INNOVATION_CARDS, ...INNOVATION_CARDS, ...INNOVATION_CARDS];

export default function RecentInnovationsCarousel() {
  const { isSeeker } = useLandingMode();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(2);

  const stateRef = useRef({
    position: 0,
    nudge: 0,
    paused: false,
    lastTime: 0,
    setWidth: 0,
    cardWidth: 217, // 205 + 12 gap default
  });

  useEffect(() => {
    const track = trackRef.current;
    const mask = maskRef.current;
    if (!track || !mask) return;

    let animId: number;

    function measure() {
      if (!track) return;
      const firstCard = track.children[0] as HTMLElement;
      if (!firstCard) return;
      const gap = 12;
      const cardRect = firstCard.getBoundingClientRect();
      const unitWidth = cardRect.width + gap;
      stateRef.current.cardWidth = unitWidth;
      stateRef.current.setWidth = unitWidth * INNOVATION_CARDS.length;
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });

    function updateActiveCard() {
      if (!mask || !track) return;
      const maskRect = mask.getBoundingClientRect();
      const center = maskRect.left + maskRect.width / 2;

      let closestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < track.children.length; i++) {
        const card = track.children[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(center - cardCenter);

        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }

      setActiveIndex(closestIdx);
    }

    stateRef.current.lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min(32, now - stateRef.current.lastTime);
      stateRef.current.lastTime = now;

      if (!stateRef.current.paused) {
        stateRef.current.position -= 0.62 * (dt / 16.666);
      }

      stateRef.current.nudge += (0 - stateRef.current.nudge) * 0.16;

      const setWidth = stateRef.current.setWidth;
      if (setWidth > 0) {
        while (stateRef.current.position <= -setWidth) {
          stateRef.current.position += setWidth;
        }
        while (stateRef.current.position > 0) {
          stateRef.current.position -= setWidth;
        }
      }

      if (track) {
        track.style.transform = `translate3d(${
          stateRef.current.position + stateRef.current.nudge
        }px, 0, 0)`;
      }

      updateActiveCard();
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleStep = (dir: number) => {
    const amount = stateRef.current.cardWidth;
    stateRef.current.nudge += dir * amount;
    stateRef.current.position += dir * amount;
  };

  return (
    <section
      id="inovasi"
      className={`py-24 md:py-32 transition-colors duration-300 ${
        isSeeker ? "bg-[#0e1014]" : "bg-[#f6f6f8]"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-6">
        {/* Section Head */}
        <div className="text-center max-w-[760px] mx-auto mb-14">
          <div className="text-[10px] md:text-[11px] tracking-[0.17em] uppercase font-bold text-[#E30000] mb-3">
            INOVASI TERBARU
          </div>
          <h2 className="text-[34px] sm:text-[44px] md:text-[56px] leading-[0.98] tracking-[-0.055em] font-medium mb-4">
            Ide yang bergerak menjadi solusi nyata.
          </h2>
          <p
            className={`text-[15px] md:text-[16px] leading-relaxed ${
              isSeeker ? "text-[#92969e]" : "text-[#727780]"
            }`}
          >
            Contoh hasil kolaborasi antara seeker dan solver yang lahir dari
            challenge di ekosistem Opennova.
          </p>
        </div>

        {/* Carousel Outer */}
        <div
          className="relative select-none"
          onMouseEnter={() => {
            stateRef.current.paused = true;
          }}
          onMouseLeave={() => {
            stateRef.current.paused = false;
            stateRef.current.lastTime = performance.now();
          }}
        >
          {/* Mask container */}
          <div ref={maskRef} className="overflow-hidden py-6">
            <div
              ref={trackRef}
              className="flex gap-3 will-change-transform"
              style={{ width: "max-content" }}
            >
              {DISPLAY_ITEMS.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <article
                    key={`${item.id}-${idx}`}
                    className={`relative shrink-0 w-[205px] h-[315px] rounded-[15px] overflow-hidden flex items-end text-white transition-all duration-500 ${
                      isActive
                        ? "scale-[1.05] opacity-100 shadow-[0_24px_55px_rgba(0,0,0,0.25)] z-10"
                        : "scale-[0.92] opacity-60"
                    }`}
                    style={{
                      backgroundImage: `url('${item.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                    {/* Card Content */}
                    <div className="relative z-10 p-4.5 w-full">
                      <small className="text-[10px] tracking-wide uppercase text-white/80 font-medium block">
                        {item.category}
                      </small>
                      <h3 className="text-[16px] font-semibold leading-snug mt-1.5 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Carousel Controls (Prev/Next buttons) */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <button
              type="button"
              aria-label="Sebelumnya"
              onClick={() => handleStep(1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer hover:border-[#E30000] hover:text-[#E30000] ${
                isSeeker
                  ? "border-[#3b3e45] text-[#d7d9dc]"
                  : "border-[#9da1a8] text-[#111318]"
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Berikutnya"
              onClick={() => handleStep(-1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer hover:border-[#E30000] hover:text-[#E30000] ${
                isSeeker
                  ? "border-[#3b3e45] text-[#d7d9dc]"
                  : "border-[#9da1a8] text-[#111318]"
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
