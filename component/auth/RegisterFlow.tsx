"use client";

import { useState } from "react";
import type { AuthView } from "./AuthModal";
import { OpenNovaLogo } from "@/component/landing/Logo";

interface RegisterFlowProps {
  view: "REGISTER_1" | "REGISTER_2";
  onNavigate: (view: AuthView) => void;
}

// ── Shared icon components ────────────────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function Step1({ onNavigate }: { onNavigate: (view: AuthView) => void }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputCls = "w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all";
  const labelCls = "block text-[14px] font-medium text-gray-900 mb-2";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-9 shrink-0">
        <OpenNovaLogo className="mb-4" />
        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Daftar Sebagai Solver
        </h1>
      </div>

      {/* Fields */}
      <div className="px-9 pb-4 flex flex-col gap-4">
        <div>
          <label htmlFor="reg-name" className={labelCls}>Nama Lengkap</label>
          <input id="reg-name" type="text" placeholder="Masukkan nama.." className={inputCls} />
        </div>
        <div>
          <label htmlFor="reg-email" className={labelCls}>Email</label>
          <input id="reg-email" type="email" placeholder="Masukkan email.." className={inputCls} />
        </div>
        <div>
          <label htmlFor="reg-password" className={labelCls}>Password Baru</label>
          <div className="relative">
            <input id="reg-password" type={showPass ? "text" : "password"} placeholder="Masukkan password.." className={`${inputCls} pr-12`} />
            <button type="button" aria-label={showPass ? "Sembunyikan" : "Tampilkan"} onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2] hover:text-gray-700 transition-colors">
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="reg-confirm" className={labelCls}>Konfirmasi Password</label>
          <div className="relative">
            <input id="reg-confirm" type={showConfirm ? "text" : "password"} placeholder="Masukkan password.." className={`${inputCls} pr-12`} />
            <button type="button" aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2] hover:text-gray-700 transition-colors">
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-9 pb-6 pt-2 flex flex-col items-center gap-4">
        <button type="button" onClick={() => onNavigate("REGISTER_2")} className="w-full h-[46px] rounded-full bg-[#E9201E] hover:bg-[#D91817] active:bg-[#B91413] text-white text-[15px] font-semibold transition-colors">
          Berikutnya
        </button>
        <p className="text-[14px] text-[#7D7D7D]">
          Sudah punya akun?{" "}
          <button type="button" onClick={() => onNavigate("LOGIN")} className="text-[#E9201E] hover:text-[#D91817] font-semibold transition-colors">
            Masuk
          </button>
        </p>
      </div>
    </>
  );
}

// Indonesian provinces list (abbreviated)
const PROVINCES = [
  "Aceh","Bali","Banten","Bengkulu","DI Yogyakarta","DKI Jakarta",
  "Gorontalo","Jambi","Jawa Barat","Jawa Tengah","Jawa Timur",
  "Kalimantan Barat","Kalimantan Selatan","Kalimantan Tengah","Kalimantan Timur","Kalimantan Utara",
  "Kepulauan Bangka Belitung","Kepulauan Riau","Lampung","Maluku","Maluku Utara",
  "Nusa Tenggara Barat","Nusa Tenggara Timur","Papua","Papua Barat",
  "Riau","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tengah","Sulawesi Tenggara","Sulawesi Utara",
  "Sumatera Barat","Sumatera Selatan","Sumatera Utara",
];

// ── Step 2 ────────────────────────────────────────────────────────────────────
function Step2({ onNavigate }: { onNavigate: (view: AuthView) => void }) {
  const inputCls = "w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all";
  const labelCls = "block text-[14px] font-medium text-gray-900 mb-2";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-9 shrink-0">
        <OpenNovaLogo className="mb-4" />
        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Daftar Sebagai Solver
        </h1>
      </div>

      {/* Fields */}
      <div className="px-9 pb-4 flex flex-col gap-4">
        {/* WhatsApp */}
        <div>
          <label htmlFor="reg-phone" className={labelCls}>No WhatsApp / HP</label>
          <input id="reg-phone" type="tel" placeholder="0000 0000 0000" className={inputCls} />
        </div>

        {/* Date of birth */}
        <div>
          <label htmlFor="reg-dob" className={labelCls}>Tanggal Lahir</label>
          <div className="relative">
            <input
              id="reg-dob"
              type="date"
              placeholder="DD/MM/YYYY"
              className={`${inputCls} pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2]">
              <CalendarIcon />
            </span>
          </div>
        </div>

        {/* Province select */}
        <div>
          <label htmlFor="reg-province" className={labelCls}>Alamat</label>
          <div className="relative">
            <select
              id="reg-province"
              defaultValue=""
              className={`${inputCls} pr-10 appearance-none cursor-pointer`}
            >
              <option value="" disabled>Jawa Barat</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2]">
              <ChevronDown />
            </span>
          </div>
        </div>

        {/* About textarea */}
        <div>
          <label htmlFor="reg-about" className={labelCls}>Tentang</label>
          <textarea
            id="reg-about"
            rows={4}
            placeholder="Deskripsi anda.."
            className="w-full rounded-[18px] border border-[#E5E7EB] bg-[#F0F3F6] px-4 py-3.5 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all resize-none min-h-[120px]"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-9 pb-6 pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate("REGISTER_1")}
          className="flex items-center gap-1.5 text-[15px] font-medium text-[#E9201E] hover:text-[#D91817] transition-colors min-h-[44px]"
        >
          <ArrowLeft />
          Kembali
        </button>
        <button
          type="button"
          onClick={() => onNavigate("REGISTER_3")}
          className="h-[46px] px-8 rounded-full bg-[#E9201E] hover:bg-[#D91817] active:bg-[#B91413] text-white text-[15px] font-semibold transition-colors"
        >
          Daftar
        </button>
      </div>
    </>
  );
}

// ── RegisterFlow ──────────────────────────────────────────────────────────────
export default function RegisterFlow({ view, onNavigate }: RegisterFlowProps) {
  if (view === "REGISTER_2") return <Step2 onNavigate={onNavigate} />;
  return <Step1 onNavigate={onNavigate} />;
}