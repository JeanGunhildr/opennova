"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { OpenNovaLogo } from "@/component/landing/Logo";
import type { AuthView } from "./AuthModal";
import PopupToast, { type ToastNotification } from "@/component/ui/PopupToast";

import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  onNavigate: (view: AuthView) => void;
}

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

export default function LoginForm({ onNavigate }: LoginFormProps) {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // 1. Ambil data dari form
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      // 2. Pastikan nilainya string
      if (typeof email !== "string" || typeof password !== "string") {
        const msg = "Email dan password wajib diisi.";
        setError(msg);
        setToast({ type: "error", title: "Validasi Gagal", message: msg });
        setLoading(false);
        return;
      }

      // 3. Buat Supabase client
      const supabase = createClient();

      // 4. Login ke Supabase Auth
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      // 5. Kalau login gagal
      if (signInError) {
        console.error("Login gagal:", signInError);
        const userMsg =
          signInError.message === "Invalid login credentials"
            ? "Email atau kata sandi tidak cocok. Silakan periksa kembali."
            : signInError.message;

        setError(userMsg);
        setToast({
          type: "error",
          title: "Gagal Masuk",
          message: userMsg,
        });
        setLoading(false);
        return;
      }

      // 6. Pastikan session berhasil dibuat
      if (!data.session || !data.user) {
        const msg = "Login berhasil, tetapi sesi tidak ditemukan.";
        setError(msg);
        setToast({ type: "error", title: "Sesi Gagal", message: msg });
        setLoading(false);
        return;
      }

      // 7. Cek role pengguna di database profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      const targetPath = profile?.role === "seeker" ? "/seeker" : "/solver";

      setToast({
        type: "success",
        title: "Berhasil Masuk!",
        message: "Selamat datang kembali di OpenNova. Mengarahkan...",
      });

      setTimeout(() => {
        router.replace(targetPath);
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan pada sistem.";
      setError(msg);
      setToast({ type: "error", title: "Kesalahan Sistem", message: msg });
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-9">
        <OpenNovaLogo className="mb-4" />

        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Masuk Sebagai Solver
        </h1>

        <p className="mt-2 text-[14px] text-[#7D7D7D] leading-[1.4] text-center">
          Lengkapi info akun untuk masuk ke halaman utama.
        </p>
      </div>

      {/* Content */}
      <form className="px-9 pb-4" onSubmit={handleLogin}>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="login-email"
            className="block text-[14px] font-medium text-gray-900 mb-2"
          >
            Email
          </label>

          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="Masukkan email.."
            required
            className="w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="login-password"
            className="block text-[14px] font-medium text-gray-900 mb-2"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password.."
              required
              className="w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 pr-12 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all"
            />

            <button
              type="button"
              aria-label={
                showPass
                  ? "Sembunyikan password"
                  : "Tampilkan password"
              }
              onClick={() => setShowPass((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2] hover:text-gray-700 transition-colors"
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-2 text-[14px] text-gray-900 cursor-pointer select-none">
            <input
              name="remember"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 accent-[#E9201E]"
            />

            Ingatkan saya
          </label>

          <button
            type="button"
            className="text-[14px] text-[#E9201E] hover:text-[#D91817] font-medium transition-colors"
          >
            Lupa Password?
          </button>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] rounded-full bg-[#E9201E] hover:bg-[#D91817] active:bg-[#B91413] text-white text-[15px] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(233,32,30,0.3)]"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="px-9 pb-6 pt-1 flex justify-center">
        <p className="text-[14px] text-[#7D7D7D]">
          Belum punya akun?{" "}

          <button
            type="button"
            onClick={() => onNavigate("REGISTER_1")}
            className="text-[#E9201E] hover:text-[#D91817] font-semibold transition-colors"
          >
            Daftar
          </button>
        </p>
      </div>

      {/* Popup Notification */}
      <PopupToast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

