"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useLandingMode } from "./LandingModeContext";

interface TestimonialItem {
  id: number;
  name: string;
  role: "Solver" | "Seeker";
  company?: string;
  avatar: string;
  alt: string;
  quoteType: string;
  quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "Andi Rahman",
    role: "Solver",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Andi Rahman",
    quoteType: "Cerita Solver",
    quote: "Challenge yang dibuka Opennova membuat kami bisa menerapkan solusi pada masalah industri yang nyata, bukan sekadar mengerjakan studi kasus.",
  },
  {
    id: 2,
    name: "Nadia Sari",
    role: "Solver",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Nadia Sari",
    quoteType: "Cerita Solver",
    quote: "Brief challenge yang jelas membuat kami lebih cepat memahami kebutuhan seeker dan menyusun solusi yang benar-benar relevan.",
  },
  {
    id: 3,
    name: "Dimas Pratama",
    role: "Solver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Dimas Pratama",
    quoteType: "Cerita Solver",
    quote: "Opennova membuka kesempatan kolaborasi yang sebelumnya sulit kami temukan melalui jaringan profesional biasa.",
  },
  {
    id: 4,
    name: "Sinta Maharani",
    role: "Solver",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Sinta Maharani",
    quoteType: "Cerita Solver",
    quote: "Kami dapat menguji pendekatan baru dengan konteks bisnis yang nyata dan mendapatkan umpan balik langsung dari seeker.",
  },
  {
    id: 5,
    name: "Maya Lestari",
    role: "Seeker",
    company: "PT Nusantara Energi",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Maya Lestari",
    quoteType: "Cerita Seeker",
    quote: "Opennova membantu kami mengubah masalah internal menjadi challenge yang jelas sehingga lebih mudah menarik perspektif dari luar perusahaan.",
  },
  {
    id: 6,
    name: "Rizky Aditya",
    role: "Seeker",
    company: "PT Cakrawala Industri",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Rizky Aditya",
    quoteType: "Cerita Seeker",
    quote: "Kami mendapatkan pendekatan yang beragam untuk masalah operasional yang sebelumnya hanya kami lihat dari sudut pandang internal.",
  },
  {
    id: 7,
    name: "Ayu Prameswari",
    role: "Seeker",
    company: "PT Sinar Inovasi Indonesia",
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&q=85",
    alt: "Foto profil Ayu Prameswari",
    quoteType: "Cerita Seeker",
    quote: "Proses membuka challenge terasa lebih terarah, dan kami bisa menjangkau solver dengan perspektif yang jauh lebih luas.",
  },
];

export default function TestimonialsSlider() {
  const { isSeeker } = useLandingMode();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4600);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="cerita"
      className={`py-24 md:py-32 transition-colors duration-300 ${
        isSeeker ? "bg-[#0e1014]" : "bg-[#f6f6f8]"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-6">
        {/* Section Head */}
        <div className="text-center max-w-[760px] mx-auto mb-14">
          <div className="text-[10px] md:text-[11px] tracking-[0.17em] uppercase font-bold text-[#E30000] mb-3">
            CERITA PENGGUNA
          </div>
          <h2 className="text-[34px] sm:text-[44px] md:text-[56px] leading-[0.98] tracking-[-0.055em] font-medium mb-4">
            Kolaborasi yang membuka peluang baru.
          </h2>
          <p
            className={`text-[15px] md:text-[16px] leading-relaxed ${
              isSeeker ? "text-[#92969e]" : "text-[#727780]"
            }`}
          >
            Pengalaman seeker dan solver yang berkolaborasi melalui challenge Opennova.
          </p>
        </div>

        {/* Testimonial Shell */}
        <div
          className="relative max-w-[1040px] mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Viewport */}
          <div className="overflow-hidden rounded-[23px]">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ transform: `translateX(-${currentIdx * 100}%)` }}
            >
              {TESTIMONIALS.map((t) => (
                <article
                  key={t.id}
                  className={`min-w-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-14 items-center p-8 sm:p-10 md:p-14 rounded-[23px] border transition-colors duration-300 ${
                    isSeeker
                      ? "bg-[#121419] border-[#2b2e34]"
                      : "bg-white border-[#e4e5e8] shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  {/* Left Column: Author */}
                  <div>
                    <div className="text-[#E30000] text-[64px] md:text-[74px] leading-[0.7] select-none mb-6">
                      “
                    </div>
                    <div className="flex items-center gap-3.5">
                      <Image
                        src={t.avatar}
                        alt={t.alt || t.name}
                        width={54}
                        height={54}
                        unoptimized
                        className="w-[54px] h-[54px] rounded-full object-cover shrink-0 border border-current/10"
                      />
                      <div>
                        <strong className="block text-[15px] font-semibold tracking-tight">
                          {t.name}
                        </strong>
                        <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full bg-[#E30000]/10 text-[#E30000] text-[10px] font-bold">
                          {t.role}
                        </span>
                        {t.company && (
                          <span className="block text-[11px] text-[#727780] mt-1">
                            {t.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Quote */}
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[#858a92] font-bold mb-3.5">
                      {t.quoteType}
                    </div>
                    <blockquote className="text-[20px] sm:text-[24px] md:text-[32px] font-medium leading-[1.18] tracking-[-0.035em]">
                      “{t.quote}”
                    </blockquote>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, dotIdx) => {
              const isActive = dotIdx === currentIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  aria-label={`Pindah ke testimoni ${dotIdx + 1}`}
                  onClick={() => setCurrentIdx(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-6 bg-[#E30000]"
                      : isSeeker
                      ? "w-2 bg-[#3b3e45] hover:bg-[#50545d]"
                      : "w-2 bg-[#aeb2b9] hover:bg-[#858992]"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
