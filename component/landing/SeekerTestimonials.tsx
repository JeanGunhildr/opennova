"use client";

import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Melalui OpenNova, kami berhasil mendapatkan 40+ proposal solusi AI untuk infrastruktur optik hanya dalam 3 minggu. Kualitas solusinya melampaui ekspektasi R&D internal kami.",
    name: "Budi Santoso",
    role: "VP Technology & Innovation, Telco & Infrastruktur",
    initials: "BS",
  },
  {
    quote:
      "Mekanisme open innovation dan escrow platform memberikan rasa aman. Solusi cold-chain monitoring yang kami dapatkan kini siap diuji coba di fasilitas kesehatan 3T.",
    name: "Dr. Hendra Gunawan",
    role: "Head of Digital Health R&D, Farmasi Nasional",
    initials: "HG",
  },
  {
    quote:
      "Format challenge terstruktur mempermudah penyaringan inovator terbaik Indonesia. Sangat menghemat biaya dan waktu riset awal perusahaan.",
    name: "Maya Puspitasari",
    role: "Chief Innovation Officer, Energy & Resources Group",
    initials: "MP",
  },
];

export default function SeekerTestimonials() {
  return (
    <section
      id="testimoni"
      aria-label="Apa Kata Mereka Tentang Opennova"
      className="mt-20 md:mt-28 w-full scroll-mt-24"
    >
      {/* 1. Header Banner with Red Gradient */}
      <div className="w-full max-w-[1180px] mx-auto rounded-t-[20px] p-8 md:p-10 text-center relative overflow-hidden bg-gradient-to-r from-[#5B1313] via-[#9E1B1B] to-[#420E0E] shadow-xl">
        {/* Ambient subtle light overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent"
        />
        <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Apa Kata Mereka Tentang Opennova?
        </h2>
      </div>

      {/* 2. Three Dark Testimonial Cards Grid */}
      <div className="w-full max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-[#171717] rounded-b-[20px] border border-t-0 border-[#393939] shadow-2xl">
        {TESTIMONIALS.map((t, idx) => (
          <article
            key={idx}
            className="bg-[#191919] border border-[#393939] rounded-[16px] p-6 flex flex-col justify-between min-h-[220px] shadow-lg hover:border-[#4A4A4A] transition-colors"
          >
            {/* Top row: Avatar + 5 gold stars */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#2A2829] border border-[#4A4A4A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {t.initials}
                </div>
                <div className="flex items-center gap-1" aria-label="5 bintang">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#F0B90B] text-[#F0B90B]"
                    />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <p className="text-xs md:text-[13px] leading-relaxed text-[#C8C8C8] italic mt-3 mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Reviewer identity */}
            <div className="pt-3 border-t border-[#2E2E2E] mt-auto">
              <h3 className="text-xs font-bold text-white leading-tight">
                {t.name}
              </h3>
              <p className="text-[10px] text-[#737373] mt-0.5 leading-snug">
                {t.role}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
