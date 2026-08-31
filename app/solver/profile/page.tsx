"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProfileIdentityCard from "@/component/dashboard/profile/ProfileIdentityCard";
import ProfileFormCard from "@/component/dashboard/profile/ProfileFormCard";
import type { ProfileFormData } from "@/component/dashboard/profile/ProfileFormCard";
import ProfileBioCard from "@/component/dashboard/profile/ProfileBioCard";
import LogoutModal from "@/component/dashboard/profile/LogoutModal";
import FeedbackToast from "@/component/dashboard/profile/FeedbackToast";
import type { ToastState } from "@/component/dashboard/profile/FeedbackToast";

// ── Mock initial data ──────────────────────────────────────
const INITIAL_FORM: ProfileFormData = {
  fullName: "Irfan Maulana",
  email: "irfan@example.com",
  phone: "81234567890",
  birthDate: "2000-05-15",
  address: "Jakarta Selatan, DKI Jakarta",
};
const INITIAL_BIO = "Frontend enthusiast & problem solver";

// ── Page ───────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();

  // ── Form state ─────────────────────────────────────────
  const [form, setForm] = useState<ProfileFormData>(INITIAL_FORM);
  const [bio, setBio] = useState(INITIAL_BIO);
  const [isDirty, setIsDirty] = useState(false);

  function handleFormChange(field: keyof ProfileFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }
  function handleBioChange(value: string) {
    setBio(value);
    setIsDirty(true);
  }
  function handleCancel() {
    setForm(INITIAL_FORM);
    setBio(INITIAL_BIO);
    setIsDirty(false);
  }
  function handleSave() {
    setIsDirty(false);
    showToast({
      title: "Perubahan Disimpan",
      description: "Informasi profil Anda telah berhasil diperbarui.",
    });
  }

  // ── Modal state ────────────────────────────────────────
  const [logoutOpen, setLogoutOpen] = useState(false);

  // ── Toast state ────────────────────────────────────────
  const [toast, setToast] = useState<ToastState | null>(null);
  function showToast(t: ToastState) { setToast(t); }
  const dismissToast = useCallback(() => setToast(null), []);

  // ── Logout flow ────────────────────────────────────────
  function handleLogoutConfirm() {
    setLogoutOpen(false);
    showToast({
      title: "Sesi Berakhir",
      description: "Anda telah berhasil keluar dari sistem. Mengalihkan ke halaman utama...",
    });
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <>
      {/* ── Modals ─────────────────────────────────────── */}
      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* ── Toast ──────────────────────────────────────── */}
      <FeedbackToast toast={toast} onDismiss={dismissToast} />

      {/* ── Page content ───────────────────────────────── */}
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 lg:py-10">

        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-[32px] md:text-[36px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
            Profil Saya
          </h1>
          <p className="text-[15px] text-gray-500 mt-1">
            Kelola informasi akun dan preferensi solver Anda.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">

          {/* ── Left column (sticky on lg) ──────────────── */}
          <div className="lg:sticky lg:top-6">
            <ProfileIdentityCard
              name={form.fullName}
              email={form.email}
              initials="IM"
              onLogout={() => setLogoutOpen(true)}
            />
          </div>

          {/* ── Right column ────────────────────────────── */}
          <div className="flex flex-col">
            <ProfileFormCard data={form} onChange={handleFormChange} />
            <ProfileBioCard bio={bio} onChange={handleBioChange} />

            {/* Action bar */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={!isDirty}
                className="px-6 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 text-[14px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty}
                className="px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}