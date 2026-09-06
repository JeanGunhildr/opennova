"use client";

const ROW_1_CATEGORIES = [
  "Teknologi Digital",
  "Manufaktur & Industri",
  "Energi",
  "Kesehatan",
  "Bioteknologi",
  "Logistik & Rantai Pasok",
  "Bisnis",
  "AI & Analitik Data",
];

const ROW_2_CATEGORIES = [
  "Lingkungan",
  "Pertanian & Pangan",
  "Material & Kimia",
  "Layanan Publik",
  "Transportasi",
  "Air & Sanitasi",
  "IoT & Sistem Cerdas",
];

// 4x multi-set duplication ensures the track is wide enough to cover any display (including 4K/ultrawide)
// and seamlessly translate -50% without gaps or snapping.
const ROW_1_ITEMS = [
  ...ROW_1_CATEGORIES,
  ...ROW_1_CATEGORIES,
  ...ROW_1_CATEGORIES,
  ...ROW_1_CATEGORIES,
];

const ROW_2_ITEMS = [
  ...ROW_2_CATEGORIES,
  ...ROW_2_CATEGORIES,
  ...ROW_2_CATEGORIES,
  ...ROW_2_CATEGORIES,
];


export default function InnovationCategories() {
  return (
    <section
      id="kategori"
      aria-label="Kategori & Bidang Inovasi"
      className="py-16 md:py-24 w-full overflow-hidden scroll-mt-24 bg-[#171717] relative"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 mb-10 md:mb-14 text-center">
        {/* Heading & Subtitle */}
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Cakup Berbagai Sektor & Domain Tantangan
        </h2>
        <p className="text-sm md:text-base text-[#A4A4A4] max-w-2xl mx-auto leading-relaxed">
          Mulai dari kecerdasan buatan, energi hijau, hingga bioteknologi terapan. Temukan talenta
          multidisiplin untuk setiap skala kebutuhan perusahaan.
        </p>
      </div>

      {/* Marquee dual tracks container with edge fade masks */}
      <div className="relative w-full overflow-hidden space-y-3.5">
        {/* Ambient edge gradient masks */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #171717, transparent)" }}
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #171717, transparent)" }}
        />

        {/* Track 1 (Row 1 - Leftward flow) */}
        <div className="flex overflow-hidden w-full">
          <div className="flex gap-3 animate-marquee-categories-1 items-center">
            {ROW_1_ITEMS.map((item, idx) => (
              <div
                key={`cat1-${idx}`}
                className="h-[38px] px-4 rounded-full bg-[#191919] border border-[#393939] flex items-center gap-2.5 shrink-0 select-none hover:border-[#E30000]/60 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span className="text-xs font-medium text-white whitespace-nowrap">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2 (Row 2 - Rightward flow) */}
        <div className="flex overflow-hidden w-full mt-3">
          <div className="flex gap-3 animate-marquee-categories-2 items-center">
            {ROW_2_ITEMS.map((item, idx) => (
              <div
                key={`cat2-${idx}`}
                className="h-[38px] px-4 rounded-full bg-[#191919] border border-[#393939] flex items-center gap-2.5 shrink-0 select-none hover:border-[#E30000]/60 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span className="text-xs font-medium text-white whitespace-nowrap">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
