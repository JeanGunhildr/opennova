"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { updateSolverProfileSelfAction } from "@/lib/actions/user-profile";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

interface SolverInformationFormProps {
  initialData?: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
  };
}

export default function SolverInformationForm({ initialData }: SolverInformationFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [institution, setInstitution] = useState(initialData?.institution || "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const inputCls =
    "w-full h-11 px-3.5 rounded-[10px] border border-gray-300 bg-white text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/15 transition-all";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await updateSolverProfileSelfAction({
        fullName,
        phone,
        institution,
      });

      if (res.success) {
        setMessage({ type: "success", text: "Profil Solver berhasil diperbarui!" });
      } else {
        setMessage({ type: "error", text: res.error || "Gagal memperbarui profil." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Terjadi kesalahan server." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-[18px] flex flex-col gap-5 p-6 bg-white border border-[#E6E6E6] shadow-xs"
    >
      <div>
        <h3 className="text-gray-900 font-bold text-lg">
          Informasi Profil Solver
        </h3>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Data ini digunakan untuk identitas profil Solver dan komunikasi pengerjaan challenge.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-[10px] text-[13px] font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Nama Lengkap */}
      <Field label="Nama Lengkap">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nama Lengkap Anda..."
          required
          className={inputCls}
        />
      </Field>

      {/* Email (Read-only) */}
      <Field label="Email Terdaftar (Auth)">
        <div className="relative flex items-center">
          <input
            type="email"
            value={initialData?.email || ""}
            readOnly
            className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200`}
          />
          <span className="absolute right-3 inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={11} strokeWidth={2.2} />
            Terverifikasi
          </span>
        </div>
      </Field>

      {/* No WhatsApp */}
      <Field label="No. Telepon / WhatsApp">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="081234567890"
          className={inputCls}
        />
      </Field>

      {/* Institusi / Alamat */}
      <Field label="Institusi / Universitas / Kota">
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Contoh: Universitas Indonesia / PT Telkom"
          className={inputCls}
        />
      </Field>

      {/* Footer Submit */}
      <div className="flex justify-end items-center pt-3 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-semibold bg-red-600 hover:bg-red-700 transition-colors h-11 px-6 disabled:opacity-60 cursor-pointer shadow-xs"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
