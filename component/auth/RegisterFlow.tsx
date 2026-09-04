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
  fullName: string;
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

    const fullName = formData.get("full_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      setError("Semua field wajib diisi.");
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

    // Simpan data Step 1 ke state parent
    setData((prev) => ({
      ...prev,
      fullName,
      email,
      password,
      confirmPassword,
    }));

    onNavigate("REGISTER_2");
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-9 shrink-0">
        <OpenNovaLogo className="mb-4" />

        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Daftar Sebagai Solver
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleNext} className="px-9 pb-4 flex flex-col gap-4">
        {/* Nama */}
        <div>
          <label htmlFor="reg-name" className={labelCls}>
            Nama Lengkap
          </label>

          <input
            id="reg-name"
            name="full_name"
            type="text"
            defaultValue={data.fullName}
            placeholder="Masukkan nama.."
            required
            className={inputCls}
          />
        </div>

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
            placeholder="Masukkan email.."
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
              placeholder="Masukkan password.."
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
              placeholder="Masukkan password.."
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
        <div className="pt-2 flex flex-col items-center gap-4">
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
      // 1. Ambil data dari Step 2
      const formData = new FormData(event.currentTarget);

      const phone = formData.get("phone");
      const birthday = formData.get("birthday");
      const institution = formData.get("institution");

      if (
        typeof phone !== "string" ||
        typeof birthday !== "string" ||
        !phone.trim() ||
        !birthday
      ) {
        setError("Nomor WhatsApp dan tanggal lahir wajib diisi.");
        return;
      }

      // 2. Gabungkan data Step 1 + Step 2
      const finalData = {
        ...data,
        phone: phone.trim(),
        birthday,
        institution: typeof institution === "string" ? institution.trim() : "",
      };

      // Simpan ke state
      setData(finalData);

      // 3. Buat Supabase client
      const supabase = createClient();

      // 4. Buat user di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: finalData.email,
        password: finalData.password,
      });

      // Debug
      console.log("USER:", authData.user);
      console.log("SESSION:", authData.session);

      // 5. Cek error Auth
      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message);
        return;
      }

      // 6. Pastikan user berhasil dibuat
      if (!authData.user) {
        setError("User gagal dibuat.");
        return;
      }

      // 7. Pastikan user sudah authenticated
      if (!authData.session) {
        console.error("Session tidak tersedia setelah signup.");

        setError(
          "Akun berhasil dibuat, tetapi session belum tersedia. Pastikan Confirm Email dimatikan di Supabase.",
        );

        return;
      }

      // 8. Simpan profile utama
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        role: "solver",
        full_name: finalData.fullName,
        phone: finalData.phone,
        avatar_url: null,
        birthday: finalData.birthday,
      });

      // 9. Cek error profile
      if (profileError) {
        console.error("Profile error:", profileError);

        setError("Akun berhasil dibuat, tetapi profile gagal disimpan.");

        return;
      }

      // 8b. Simpan solver_profile
      const { error: solverProfileError } = await supabase
        .from("solver_profiles")
        .insert({
          user_id: authData.user.id,
          bio: null,
          institution: finalData.institution || null,
        });

      if (solverProfileError) {
        console.error("Solver profile error:", solverProfileError);
      }

      // 10. Berhasil
      console.log("Registrasi berhasil:", authData.user);

      // Pindah ke login
      setSuccess(true);

      setTimeout(() => {
        onNavigate("LOGIN");
      }, 1500);
    } catch (error) {
      console.error("Register error:", error);

      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-9 shrink-0">
        <OpenNovaLogo className="mb-4" />

        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Daftar Sebagai Solver
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

        {/* Date of birth */}
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

        {/* Institusi / Universitas */}
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
    fullName: "",
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
