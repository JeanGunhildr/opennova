"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { OpenNovaLogo } from "@/component/landing/Logo";
import PopupToast, { type ToastNotification } from "@/component/ui/PopupToast";

export default function AdminLoginForm() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      const msg = "Email dan password wajib diisi.";
      setError(msg);
      setToast({ type: "error", title: "Validasi Gagal", message: msg });
      return;
    }

    setLoading(true);

    // NOTE: UI-only mock auth flow — sambungkan ke Supabase / backend admin
    // (role-based auth) saat API admin tersedia.
    setToast({
      type: "success",
      title: "Berhasil Masuk!",
      message: "Selamat datang kembali, Admin. Mengarahkan ke dashboard...",
    });

    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 900);
  }

  return (
    <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center pt-9 pb-5 px-9">
        <OpenNovaLogo className="mb-4" />
        <span
          className="mb-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: "#FFE4E1", color: "#B91413" }}
        >
          Admin Panel
        </span>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] leading-[1.15] text-gray-900 text-center">
          Masuk sebagai Admin
        </h1>
        <p className="mt-2 text-[14px] text-[#7D7D7D] leading-[1.4] text-center">
          Kelola platform OpenNova melalui panel admin.
        </p>
      </div>

      {/* Form */}
      <form className="px-9 pb-4" onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="admin-email"
            className="block text-[14px] font-medium text-gray-900 mb-2"
          >
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            placeholder="admin@opennova.id"
            required
            autoComplete="username"
            className="w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E30000] focus:bg-white focus:ring-2 focus:ring-[#E30000]/20 transition-all"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="admin-password"
            className="block text-[14px] font-medium text-gray-900 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password.."
              required
              autoComplete="current-password"
              className="w-full h-[46px] rounded-full border border-[#E5E7EB] bg-[#F0F3F6] px-4 pr-12 text-[14px] text-gray-900 placeholder:text-[#999999] outline-none focus:border-[#E30000] focus:bg-white focus:ring-2 focus:ring-[#E30000]/20 transition-all"
            />
            <button
              type="button"
              aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
              onClick={() => setShowPass((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A2A2A2] hover:text-gray-700 transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-2 text-[14px] text-gray-900 cursor-pointer select-none">
            <input
              name="remember"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 accent-[#E30000]"
            />
            Ingatkan Saya
          </label>

          <button
            type="button"
            className="text-[14px] text-[#E30000] hover:text-[#B91413] font-medium underline underline-offset-2 transition-colors"
          >
            Lupa Password
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] rounded-full bg-[#E30000] hover:bg-[#CC0000] active:bg-[#B91413] text-white text-[15px] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(227,0,0,0.3)]"
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

      <div className="px-9 pb-8 pt-1 flex justify-center">
        <p className="text-[13px] text-gray-400 text-center">
          Halaman ini khusus untuk Admin OpenNova. Hubungi tim IT jika Anda
          mengalami kendala akses.
        </p>
      </div>

      <PopupToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
