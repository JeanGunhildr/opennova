"use client";

import { useLandingMode } from "./LandingModeContext";

interface CategoryItem {
  id: string;
  title: string;
  desc: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "01", title: "Teknologi Digital", desc: "Software, platform, dan transformasi digital." },
  { id: "02", title: "Manufaktur & Industri", desc: "Efisiensi proses, otomasi, dan produksi." },
  { id: "03", title: "Energi", desc: "Energi terbarukan, efisiensi, dan penyimpanan." },
  { id: "04", title: "Kesehatan", desc: "Teknologi dan layanan kesehatan yang lebih baik." },
  { id: "05", title: "Bioteknologi", desc: "Biologi terapan, pangan, dan bioindustri." },
  { id: "06", title: "Logistik & Rantai Pasok", desc: "Distribusi, pergudangan, dan visibilitas supply chain." },
  { id: "07", title: "Air & Sanitasi", desc: "Akses air, pengolahan, dan sanitasi berkelanjutan." },
  { id: "08", title: "Bisnis", desc: "Model bisnis, produktivitas, dan pengalaman pelanggan." },
  { id: "09", title: "AI & Analitik Data", desc: "Kecerdasan buatan, prediksi, dan data intelligence." },
  { id: "10", title: "Lingkungan", desc: "Mitigasi dampak, sirkularitas, dan keberlanjutan." },
  { id: "11", title: "Pertanian & Pangan", desc: "Agri-tech, produksi, dan ketahanan pangan." },
  { id: "12", title: "Material & Kimia", desc: "Material maju, formulasi, dan proses kimia." },
  { id: "13", title: "Layanan Publik", desc: "Solusi untuk layanan masyarakat dan pemerintahan." },
  { id: "14", title: "Transportasi", desc: "Mobilitas, kendaraan, dan sistem transportasi." },
  { id: "15", title: "Rekayasa & Infrastruktur", desc: "Engineering, aset, konstruksi, dan infrastruktur." },
];

export default function CategoryGridSection() {
  const { isSeeker } = useLandingMode();

  return (
    <section id="kategori" className="py-24 md:py-32">
      <div className="max-w-[1220px] mx-auto px-6">
        {/* Section Head */}
        <div className="text-center max-w-[760px] mx-auto mb-14">
          <div className="text-[10px] md:text-[11px] tracking-[0.17em] uppercase font-bold text-[#E30000] mb-3">
            KATEGORI
          </div>
          <h2 className="text-[34px] sm:text-[44px] md:text-[56px] leading-[0.98] tracking-[-0.055em] font-medium mb-4">
            Satu ekosistem, banyak ruang untuk berinovasi.
          </h2>
          <p
            className={`text-[15px] md:text-[16px] leading-relaxed ${
              isSeeker ? "text-[#92969e]" : "text-[#727780]"
            }`}
          >
            Jelajahi berbagai bidang tantangan yang dapat dibuka dan diselesaikan
            melalui platform Opennova.
          </p>
        </div>

        {/* Outer Shell */}
        <div
          className={`rounded-[22px] overflow-hidden transition-all duration-300 border ${
            isSeeker
              ? "bg-[#111317] border-[#2b2e34]"
              : "bg-white border-[#e4e5e8] shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          }`}
        >
          {/* Top Info Bar */}
          <div
            className={`px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b transition-colors duration-300 ${
              isSeeker ? "border-[#292c32]" : "border-[#e7e8eb]"
            }`}
          >
            <span className="text-[11px] font-bold tracking-[0.13em] uppercase text-[#898e96]">
              Bidang Inovasi
            </span>
            <div className="flex items-center gap-4 text-[11px] text-[#858a92] font-medium">
              <span>15 Kategori</span>
              <span>•</span>
              <span>Lintas Industri</span>
              <span>•</span>
              <span>Terbuka Untuk Kolaborasi</span>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, idx) => {
              return (
                <div
                  key={cat.id}
                  className={`p-6 min-h-[125px] flex items-start gap-4 transition-colors duration-200 border-b ${
                    isSeeker
                      ? "border-[#292c32] hover:bg-[#17191e]"
                      : "border-[#e7e8eb] hover:bg-[#fff6f6]"
                  } ${(idx + 1) % 3 !== 0 ? (isSeeker ? "lg:border-r border-[#292c32]" : "lg:border-r border-[#e7e8eb]") : ""} ${
                    (idx + 1) % 2 !== 0 ? (isSeeker ? "sm:max-lg:border-r border-[#292c32]" : "sm:max-lg:border-r border-[#e7e8eb]") : ""
                  }`}
                >
                  {/* Icon badge */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-[11px] flex items-center justify-center font-extrabold text-[13px] text-[#E30000] border ${
                      isSeeker
                        ? "bg-[#E30000]/10 border-[#E30000]/25"
                        : "bg-[#fff0f0] border-[#ffd1d1]"
                    }`}
                  >
                    {cat.id}
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="text-[14px] font-semibold tracking-tight mb-1">
                      {cat.title}
                    </h3>
                    <p
                      className={`text-[11px] leading-relaxed ${
                        isSeeker ? "text-[#9a9da5]" : "text-[#727780]"
                      }`}
                    >
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer inside shell */}
          <div
            className={`text-center py-4 px-6 text-[11px] transition-colors duration-300 ${
              isSeeker
                ? "bg-[#0d0f12] text-[#8b9098]"
                : "bg-[#fafafa] text-[#8b9098]"
            }`}
          >
            Dan berbagai bidang inovasi lainnya yang terus berkembang di Indonesia.
          </div>
        </div>
      </div>
    </section>
  );
}
