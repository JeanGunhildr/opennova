"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { OpenNovaLogo } from "@/component/landing/Logo";
import type { AuthView } from "./AuthModal";
import PopupToast, { type ToastNotification } from "@/component/ui/PopupToast";

import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  onNavigate: (view: AuthView) => void;
  isDark?: boolean;
}

export default function LoginForm({ onNavigate, isDark }: LoginFormProps) {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const inputCls = isDark
    ? "w-full h-[46px] rounded-full border border-[#393939] bg-[#1F1F1F] px-4 text-[14px] text-white placeholder:text-[#6E6E6E] outline-none focus:border-[#E30000] focus:ring-2 focus:ring-[#E30000]/20 transition-all"
    : "w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E9201E] focus:bg-white focus:ring-2 focus:ring-[#E9201E]/20 transition-all";

  const labelCls = `block text-[14px] font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`;

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
        <OpenNovaLogo theme={isDark ? "dark" : "light"} className="mb-4" />

        <h1 className={`text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-center ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          {isDark ? "Masuk Sebagai Seeker" : "Masuk Sebagai Solver"}
        </h1>

        <p className={`mt-2 text-[14px] leading-[1.4] text-center ${
          isDark ? "text-[#A4A4A4]" : "text-[#7D7D7D]"
        }`}>
          Lengkapi info akun untuk masuk ke halaman utama.
        </p>
      </div>

      {/* Content */}
      <form className="px-9 pb-4" onSubmit={handleLogin}>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="login-email" className={labelCls}>
            Email
          </label>

          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="Masukkan email.."
            required
            className={inputCls}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="login-password" className={labelCls}>
            Password
          </label>

          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password.."
              required
              className={`${inputCls} pr-12`}
            />

            <button
              type="button"
              aria-label={
                showPass
                  ? "Sembunyikan password"
                  : "Tampilkan password"
              }
              onClick={() => setShowPass((prev) => !prev)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                isDark ? "text-[#737373] hover:text-white" : "text-[#A2A2A2] hover:text-gray-700"
              }`}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
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
          <label className={`flex items-center gap-2 text-[14px] cursor-pointer select-none ${
            isDark ? "text-[#A4A4A4]" : "text-gray-900"
          }`}>
            <input
              name="remember"
              type="checkbox"
              className={`w-4 h-4 rounded border-gray-300 ${
                isDark ? "accent-[#E30000]" : "accent-[#E9201E]"
              }`}
            />
            Ingatkan saya
          </label>

          <button
            type="button"
            className={`text-[14px] font-medium transition-colors ${
              isDark ? "text-[#E30000] hover:text-[#CC0000]" : "text-[#E9201E] hover:text-[#D91817]"
            }`}
          >
            Lupa Password?
          </button>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] rounded-full bg-[#E30000] hover:bg-[#CC0000] active:scale-[0.98] text-white text-[15px] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(227,0,0,0.3)] cursor-pointer"
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
        <p className={`text-[14px] ${isDark ? "text-[#A4A4A4]" : "text-[#7D7D7D]"}`}>
          Belum punya akun?{" "}

          <button
            type="button"
            onClick={() => onNavigate("REGISTER_1")}
            className="text-[#E30000] hover:underline font-semibold transition-colors cursor-pointer"
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

