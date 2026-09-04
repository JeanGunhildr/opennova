"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { AuthView } from "./AuthModal";
import { OpenNovaLogo } from "@/component/landing/Logo";

import { createClient } from "@/lib/supabase/client";

interface RegisterFlowProps {
  view: "REGISTER_1" | "REGISTER_2";
  onNavigate: (view: AuthView) => void;
}

interface RegisterData {
  role: "solver" | "seeker";
  fullName: string;
  companyName: string;
  companyType: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthday: string;
  institution: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared icons
// ─────────────────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 3L5 8L10 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1
// ─────────────────────────────────────────────────────────────────────────────

function Step1({
  data,
  setData,
  onNavigate,
}: {
  data: RegisterData;
  setData: React.Dispatch<React.SetStateAction<RegisterData>>;
  onNavigate: (view: AuthView) => void;
}) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const inputCls =
    "w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all";

  const labelCls = "block text-[14px] font-medium text-gray-900 mb-2";

  function handleNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const fullName = (formData.get("full_name") as string)?.trim();
    const companyName = (formData.get("company_name") as string)?.trim() || "";
    const companyType = (formData.get("company_type") as string)?.trim() || "Perusahaan Swasta";
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (data.role === "seeker" && !companyName) {
      setError("Nama Perusahaan wajib diisi untuk Seeker.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setData((prev) => ({
      ...prev,
      fullName,
      companyName,
      companyType,
      email,
      password,
      confirmPassword,
    }));

    onNavigate("REGISTER_2");
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-4 px-9 shrink-0">
        <OpenNovaLogo className="mb-3" />

        <h1 className="text-[26px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center mb-3">
          Daftar Akun Baru
        </h1>

        {/* Role toggle */}
        <div className="flex items-center p-1 bg-[#F0F3F6] rounded-full w-full max-w-[320px]">
          <button
            type="button"
            onClick={() => setData((prev) => ({ ...prev, role: "solver" }))}
            className={[
              "flex-1 h-9 rounded-full text-[13px] font-semibold transition-all",
              data.role === "solver"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            Solver (Peserta)
          </button>
          <button
            type="button"
            onClick={() => setData((prev) => ({ ...prev, role: "seeker" }))}
            className={[
              "flex-1 h-9 rounded-full text-[13px] font-semibold transition-all",
              data.role === "seeker"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            Seeker (Perusahaan)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleNext} className="px-9 pb-4 flex flex-col gap-3.5 overflow-y-auto max-h-[calc(100vh-220px)]">
        {/* Seeker: Company Name & Type */}
        {data.role === "seeker" ? (
          <>
            <div>
              <label htmlFor="reg-company-name" className={labelCls}>
                Nama Perusahaan / Organisasi
              </label>
              <input
                id="reg-company-name"
                name="company_name"
                type="text"
                defaultValue={data.companyName}
                placeholder="Contoh: PT Telkom Indonesia"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="reg-company-type" className={labelCls}>
                Kategori Perusahaan
              </label>
              <select
                id="reg-company-type"
                name="company_type"
                defaultValue={data.companyType || "Perusahaan Swasta"}
                className={inputCls}
              >
                <option value="BUMN">BUMN</option>
                <option value="Perusahaan Swasta">Perusahaan Swasta</option>
                <option value="UMKM">UMKM</option>
              </select>
            </div>

            <div>
              <label htmlFor="reg-name" className={labelCls}>
                Nama Perwakilan
              </label>
              <input
                id="reg-name"
                name="full_name"
                type="text"
                defaultValue={data.fullName}
                placeholder="Masukkan nama perwakilan..."
                required
                className={inputCls}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="reg-name" className={labelCls}>
              Nama Lengkap
            </label>
            <input
              id="reg-name"
              name="full_name"
              type="text"
              defaultValue={data.fullName}
              placeholder="Masukkan nama..."
              required
              className={inputCls}
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className={labelCls}>
            Email
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            defaultValue={data.email}
            placeholder="Masukkan email..."
            required
            className={inputCls}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className={labelCls}>
            Password Baru
          </label>
          <div className="relative">
            <input
              id="reg-password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password..."
              required
              className={`${inputCls} pr-12`}
            />
            <button
              type="button"
              aria-label={showPass ? "Sembunyikan" : "Tampilkan"}
              onClick={() => setShowPass((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2] hover:text-gray-700 transition-colors"
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-confirm" className={labelCls}>
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              id="reg-confirm"
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              placeholder="Masukkan password..."
              required
              className={`${inputCls} pr-12`}
            />
            <button
              type="button"
              aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2] hover:text-gray-700 transition-colors"
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Footer */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            type="submit"
            className="w-full h-[46px] rounded-full bg-[#E9201E] hover:bg-[#D91817] active:bg-[#B91413] text-white text-[15px] font-semibold transition-colors"
          >
            Berikutnya
          </button>

          <p className="text-[14px] text-[#7D7D7D]">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => onNavigate("LOGIN")}
              className="text-[#E9201E] hover:text-[#D91817] font-semibold transition-colors"
            >
              Masuk
            </button>
          </p>
        </div>
      </form>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2
// ─────────────────────────────────────────────────────────────────────────────

function Step2({
  data,
  setData,
  onNavigate,
}: {
  data: RegisterData;
  setData: React.Dispatch<React.SetStateAction<RegisterData>>;
  onNavigate: (view: AuthView) => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputCls =
    "w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all";

  const labelCls = "block text-[14px] font-medium text-gray-900 mb-2";

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const phone = (formData.get("phone") as string)?.trim();
      const birthday = (formData.get("birthday") as string)?.trim();
      const institution = (formData.get("institution") as string)?.trim() || "";

      if (!phone || (!birthday && data.role === "solver")) {
        setError("Semua field wajib diisi.");
        setLoading(false);
        return;
      }

      const finalData = {
        ...data,
        phone,
        birthday: birthday || new Date().toISOString().split("T")[0],
        institution,
      };

      setData(finalData);

      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: finalData.email,
        password: finalData.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("User gagal dibuat.");
        setLoading(false);
        return;
      }

      if (!authData.session) {
        setError(
          "Akun berhasil dibuat, tetapi session belum tersedia. Pastikan Confirm Email dimatikan di Supabase."
        );
        setLoading(false);
        return;
      }

      // 1. Simpan profile utama
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        role: finalData.role,
        full_name: finalData.fullName,
        phone: finalData.phone,
        avatar_url: null,
        birthday: finalData.birthday,
      });

      if (profileError) {
        console.error("Profile error:", profileError);
        setError("Akun berhasil dibuat, tetapi profile gagal disimpan.");
        setLoading(false);
        return;
      }

      // 2. Simpan role profile (solver vs seeker)
      if (finalData.role === "seeker") {
        const { error: seekerError } = await supabase
          .from("seeker_profiles")
          .insert({
            user_id: authData.user.id,
            company_name: finalData.companyName || finalData.fullName,
            representative_name: finalData.fullName,
            legal_document_path: "verified",
            company_type: finalData.companyType || "Perusahaan Swasta",
          });

        if (seekerError) {
          console.error("Seeker profile error:", seekerError);
        }
      } else {
        const { error: solverError } = await supabase
          .from("solver_profiles")
          .insert({
            user_id: authData.user.id,
            bio: null,
            institution: finalData.institution || null,
          });

        if (solverError) {
          console.error("Solver profile error:", solverError);
        }
      }

      setSuccess(true);

      setTimeout(() => {
        onNavigate("LOGIN");
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-4 px-9 shrink-0">
        <OpenNovaLogo className="mb-3" />
        <h1 className="text-[26px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          {data.role === "seeker" ? "Daftar Sebagai Seeker" : "Daftar Sebagai Solver"}
        </h1>
      </div>

      {/* Success message */}
      {success && (
        <div className="mx-9 mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          Registrasi berhasil! Silakan masuk dengan akun kamu.
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleRegister} className="px-9 pb-4 flex flex-col gap-4">
        {/* WhatsApp */}
        <div>
          <label htmlFor="reg-phone" className={labelCls}>
            Nomor Whatsapp
          </label>
          <input
            id="reg-phone"
            name="phone"
            type="tel"
            defaultValue={data.phone}
            placeholder="0000 0000 0000"
            required
            className={inputCls}
          />
        </div>

        {/* Date of birth (Solver only) */}
        {data.role === "solver" && (
          <div>
            <label htmlFor="reg-dob" className={labelCls}>
              Tanggal Lahir
            </label>
            <div className="relative">
              <input
                id="reg-dob"
                name="birthday"
                type="date"
                defaultValue={data.birthday}
                required
                className={`${inputCls} pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2]">
                <CalendarIcon />
              </span>
            </div>
          </div>
        )}

        {/* Institusi (Solver only) */}
        {data.role === "solver" && (
          <div>
            <label htmlFor="reg-institution" className={labelCls}>
              Institusi / Universitas <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input
              id="reg-institution"
              name="institution"
              type="text"
              defaultValue={data.institution}
              placeholder="Contoh: Universitas Indonesia"
              className={inputCls}
            />
          </div>
        )}

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate("REGISTER_1")}
            disabled={loading}
            className="flex items-center gap-1.5 text-[15px] font-medium text-[#E9201E] hover:text-[#D91817] transition-colors min-h-[44px] disabled:opacity-50"
          >
            <ArrowLeft />
            Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className="h-[46px] px-8 rounded-full bg-[#E9201E] hover:bg-[#D91817] active:bg-[#B91413] text-white text-[15px] font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </div>
      </form>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Register Flow
// ─────────────────────────────────────────────────────────────────────────────

export default function RegisterFlow({ view, onNavigate }: RegisterFlowProps) {
  const [data, setData] = useState<RegisterData>({
    role: "solver",
    fullName: "",
    companyName: "",
    companyType: "Perusahaan Swasta",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthday: "",
    institution: "",
  });

  if (view === "REGISTER_2") {
    return <Step2 data={data} setData={setData} onNavigate={onNavigate} />;
  }

  return <Step1 data={data} setData={setData} onNavigate={onNavigate} />;
}
