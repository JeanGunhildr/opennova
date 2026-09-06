"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { updateSeekerProfileSelfAction } from "@/lib/actions/user-profile";

const ORG_TYPES = ["Swasta", "BUMN", "Startup", "Instansi Pemerintah", "NGO"];

const FIELD_STYLE: React.CSSProperties = {
  height: "46px",
  width: "100%",
  background: "#171717",
  border: "1px solid #373737",
  borderRadius: "10px",
  padding: "0 14px",
  fontSize: "14px",
  color: "#F7F7F7",
  outline: "none",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label
        className="text-[12px] font-semibold"
        style={{ color: "#BDBDBD", textTransform: "uppercase", letterSpacing: "0.01em" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

interface CompanyInformationFormProps {
  initialData?: {
    companyName: string;
    email: string;
    companyType: string;
    representativeName: string;
    phone: string;
    website: string;
    companyDescription: string;
  };
}

export default function CompanyInformationForm({ initialData }: CompanyInformationFormProps) {
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [orgType, setOrgType] = useState(initialData?.companyType || "Swasta");
  const [picName, setPicName] = useState(initialData?.representativeName || "");
  const [picPhone, setPicPhone] = useState(initialData?.phone || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [description, setDescription] = useState(initialData?.companyDescription || "");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const BIO_LIMIT = 500;

  function inputStyle(fieldName: string, readOnly = false): React.CSSProperties {
    if (readOnly) return { ...FIELD_STYLE, background: "#232323", border: "1px solid #373737", color: "#8C8C8C", cursor: "not-allowed" };
    return {
      ...FIELD_STYLE,
      border: focusedField === fieldName ? "1px solid #E30000" : "1px solid #373737",
      boxShadow: focusedField === fieldName ? "0 0 0 2px rgba(227,0,0,0.16)" : "none",
    };
  }

  function textareaStyle(fieldName: string): React.CSSProperties {
    return {
      width: "100%",
      background: "#171717",
      border: focusedField === fieldName ? "1px solid #E30000" : "1px solid #373737",
      borderRadius: "10px",
      padding: "12px 14px",
      fontSize: "14px",
      lineHeight: "1.5",
      color: "#F7F7F7",
      outline: "none",
      resize: "vertical" as const,
      boxShadow: focusedField === fieldName ? "0 0 0 2px rgba(227,0,0,0.16)" : "none",
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await updateSeekerProfileSelfAction({
        companyName,
        representativeName: picName,
        phone: picPhone,
        companyType: orgType,
        companyDescription: description,
        website,
      });

      if (res.success) {
        setMessage({ type: "success", text: "Profil perusahaan berhasil diperbarui!" });
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
      className="rounded-[18px] flex flex-col gap-[18px]"
      style={{ background: "#191919", border: "1px solid #373737", padding: "22px" }}
    >
      <div>
        <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
          Informasi Perusahaan
        </h3>
        <p className="text-[13px] leading-[1.5] mt-0.5" style={{ color: "#737373" }}>
          Data ini digunakan pada komunikasi resmi dan publikasi challenge.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-[10px] text-[13px] font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-950/80 border border-emerald-500/30 text-emerald-300"
              : "bg-red-950/80 border border-red-500/30 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Nama Perusahaan */}
      <Field label="Nama Perusahaan / Organisasi">
        <input
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          placeholder="Masukkan nama perusahaan..."
          required
          style={inputStyle("name")}
        />
      </Field>

      {/* Email (read-only) */}
      <Field label="Email Resmi (Auth)">
        <div className="relative flex items-center">
          <input
            type="email"
            value={initialData?.email || ""}
            readOnly
            style={inputStyle("email", true)}
          />
          <span
            className="absolute right-3 inline-flex items-center gap-1 h-[26px] px-2.5 rounded-full text-[11px] font-semibold flex-shrink-0"
            style={{ background: "#143520", color: "#54D67A" }}
          >
            <CheckCircle2 size={11} strokeWidth={2.2} />
            Terverifikasi
          </span>
        </div>
      </Field>

      {/* Jenis Organisasi */}
      <Field label="Jenis Perusahaan / Organisasi">
        <select
          value={orgType}
          onChange={e => setOrgType(e.target.value)}
          onFocus={() => setFocusedField("orgtype")}
          onBlur={() => setFocusedField(null)}
          style={{ ...inputStyle("orgtype"), appearance: "auto" }}
        >
          {ORG_TYPES.map(opt => (
            <option key={opt} value={opt} style={{ background: "#232323" }}>
              {opt}
            </option>
          ))}
        </select>
      </Field>

      {/* Contact person row */}
      <div>
        <h3 className="text-white font-bold mb-[14px]" style={{ fontSize: "18px" }}>
          Kontak Penanggung Jawab
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          <Field label="Nama PIC / Perwakilan">
            <input
              type="text"
              value={picName}
              onChange={e => setPicName(e.target.value)}
              onFocus={() => setFocusedField("pic")}
              onBlur={() => setFocusedField(null)}
              placeholder="Masukkan nama penanggung jawab..."
              required
              style={inputStyle("pic")}
            />
          </Field>
          <Field label="Nomor WhatsApp / Telepon">
            <input
              type="tel"
              value={picPhone}
              onChange={e => setPicPhone(e.target.value)}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              placeholder="Masukkan nomor kontak..."
              style={inputStyle("phone")}
            />
          </Field>
        </div>
      </div>

      {/* Description & Website fields */}
      <div className="flex flex-col gap-[14px]">
        <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
          Deskripsi &amp; Website
        </h3>

        <Field label="Website / Link Perusahaan">
          <input
            type="url"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            onFocus={() => setFocusedField("website")}
            onBlur={() => setFocusedField(null)}
            placeholder="https://perusahaan.co.id"
            style={inputStyle("website")}
          />
        </Field>

        <Field label="Tentang / Profil Singkat">
          <textarea
            rows={5}
            value={description}
            onChange={e => {
              if (e.target.value.length <= BIO_LIMIT) setDescription(e.target.value);
            }}
            onFocus={() => setFocusedField("bio")}
            onBlur={() => setFocusedField(null)}
            placeholder="Jelaskan profil singkat perusahaan atau organisasi..."
            style={textareaStyle("bio")}
          />
          <p
            className="text-[11px] text-right mt-0.5"
            style={{ color: description.length >= BIO_LIMIT - 30 ? "#E30000" : "#737373" }}
          >
            {description.length} / {BIO_LIMIT}
          </p>
        </Field>
      </div>

      {/* Footer */}
      <div
        className="flex justify-end items-center pt-1"
        style={{ borderTop: "1px solid #373737" }}
      >
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] active:bg-[#B30000] transition-colors disabled:opacity-60 cursor-pointer"
          style={{ height: "44px", padding: "0 20px" }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}