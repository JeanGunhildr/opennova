// SeekerInfoCard.tsx — Styled per JSONC spec
// Includes: (1) red reward/countdown card, (2) seeker profile card with jenis_perusahaan, deskripsi_perusahaan, alamat_domain

import { BadgeCheck, Globe, Copyright, Building2 } from "lucide-react";

export interface SeekerInfoCardProps {
  companyName: string;
  companyInitials: string;
  industry: string;
  about: string;
  website?: string;
  verified?: boolean;
  reward: string;
  deadline: string;
  jenisPerusahaan?: string | null;
  deskripsiPerusahaan?: string | null;
  alamatDomain?: string | null;
}

/** Helper to format company type into clean Indonesian label */
function formatJenisPerusahaan(raw?: string | null, fallbackIndustry?: string): string {
  if (!raw) return fallbackIndustry || "Perusahaan Swasta";
  const lower = raw.toLowerCase().trim();
  if (lower === "bumn") return "BUMN";
  if (lower === "swasta") return "Perusahaan Swasta";
  if (lower === "umkm") return "UMKM";
  if (lower === "instansi_pemerintah" || lower === "pemerintah") return "Instansi Pemerintah";
  return raw;
}

export default function SeekerInfoCard({
  companyName,
  companyInitials,
  industry,
  about,
  website,
  verified = false,
  reward,
  deadline,
  jenisPerusahaan,
  deskripsiPerusahaan,
  alamatDomain,
}: SeekerInfoCardProps) {
  const displayCompanyType = formatJenisPerusahaan(jenisPerusahaan, industry);
  const displayAbout =
    deskripsiPerusahaan && deskripsiPerusahaan.trim() !== ""
      ? deskripsiPerusahaan
      : about && about.trim() !== ""
      ? about
      : "Belum ada deskripsi profil perusahaan.";

  const rawWebsite =
    alamatDomain && alamatDomain.trim() !== ""
      ? alamatDomain
      : website && website.trim() !== ""
      ? website
      : null;

  const displayWebsite = rawWebsite ? rawWebsite.replace(/^https?:\/\//i, "").replace(/\/$/, "") : null;
  const hrefWebsite = rawWebsite ? (rawWebsite.startsWith("http") ? rawWebsite : `https://${rawWebsite}`) : null;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Reward / countdown card ────────────────────────── */}
      <div
        className="rounded-[14px] grid grid-cols-2 items-center px-4"
        style={{ height: "62px", background: "linear-gradient(100deg,#E9201E 0%,#7F1717 100%)" }}
      >
        {/* Reward block */}
        <div>
          <p className="text-[10px] leading-none mb-1" style={{ color: "rgba(255,255,255,0.78)" }}>
            Total Hadiah
          </p>
          <p className="text-[20px] font-bold text-white leading-none tracking-tight">{reward}</p>
        </div>

        {/* Countdown block */}
        <div className="text-right">
          <p className="text-[10px] leading-none mb-1" style={{ color: "rgba(255,255,255,0.78)" }}>
            Deadline
          </p>
          <p className="text-[18px] font-bold text-white leading-none">{deadline}</p>
        </div>
      </div>

      {/* ── Seeker profile card ────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.035)]">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3.5 py-3.5 border-b border-gray-200">
          <div className="w-[38px] h-[38px] rounded-full bg-gray-100 flex items-center justify-center text-[13px] font-semibold text-gray-800 flex-shrink-0 select-none border border-gray-200">
            {companyInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-bold text-gray-800 truncate">{companyName}</p>
              {verified && (
                <BadgeCheck size={14} className="text-gray-700 flex-shrink-0" strokeWidth={1.8} />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                <Building2 size={10} className="text-gray-500" />
                {displayCompanyType}
              </span>
            </div>
          </div>
        </div>

        {/* About section */}
        <div className="px-3.5 py-3.5">
          <p className="text-[12px] font-bold text-gray-800 mb-1.5">Tentang Kami</p>
          <p className="text-[12px] text-gray-600 leading-[1.55]">{displayAbout}</p>

          {/* Website Domain */}
          {hrefWebsite && displayWebsite && (
            <a
              href={hrefWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-primary-500 font-medium hover:text-primary-600 mt-2.5 transition-colors"
            >
              <Globe size={12} strokeWidth={1.8} />
              {displayWebsite}
            </a>
          )}
        </div>

        {/* Copyright button */}
        <div className="px-3.5 pb-3.5">
          <button
            type="button"
            className="w-full h-[38px] rounded-full bg-white border border-gray-300 text-gray-800 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Copyright size={13} strokeWidth={1.8} />
            Lihat Kesepakatan Hak Cipta
          </button>
        </div>
      </div>
    </div>
  );
}