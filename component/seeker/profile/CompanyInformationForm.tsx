"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const ORG_TYPES = ["BUMN", "Swasta", "Startup", "Instansi Pemerintah", "NGO"];

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

export default function CompanyInformationForm() {
  const [companyName, setCompanyName] = useState("PT Telkom Indonesia");
  const [taxNumber, setTaxNumber] = useState("01.574.816.3-091.000");
  const [orgType, setOrgType] = useState("BUMN");
  const [picName, setPicName] = useState("Budi Santoso");
  const [picPhone, setPicPhone] = useState("+628119987776");
  const [address, setAddress] = useState("Jl. Japati No.1, Bandung, Jawa Barat 40133");
  const [bio, setBio] = useState("Telkom Indonesia adalah BUMN yang menyelenggarakan layanan teknologi informasi dan komunikasi serta jaringan telekomunikasi di Indonesia.");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
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

      {/* Nama Perusahaan */}
      <Field label="Nama Perusahaan / Organisasi">
        <input
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          placeholder="Masukkan nama perusahaan..."
          style={inputStyle("name")}
        />
      </Field>

      {/* Email (read-only) */}
      <Field label="Email Resmi">
        <div className="relative flex items-center">
          <input
            type="email"
            value="admin@telkom.co.id"
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

      {/* NPWP */}
      <Field label="NPWP Perusahaan / Organisasi">
        <input
          type="text"
          value={taxNumber}
          onChange={e => setTaxNumber(e.target.value)}
          onFocus={() => setFocusedField("npwp")}
          onBlur={() => setFocusedField(null)}
          placeholder="Masukkan NPWP..."
          style={inputStyle("npwp")}
        />
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
          <Field label="Nama PIC">
            <input
              type="text"
              value={picName}
              onChange={e => setPicName(e.target.value)}
              onFocus={() => setFocusedField("pic")}
              onBlur={() => setFocusedField(null)}
              placeholder="Masukkan nama penanggung jawab..."
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

      {/* Description fields */}
      <div className="flex flex-col gap-[14px]">
        <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
          Deskripsi &amp; Alamat
        </h3>

        <Field label="Alamat Kantor">
          <textarea
            rows={4}
            value={address}
            onChange={e => setAddress(e.target.value)}
            onFocus={() => setFocusedField("addr")}
            onBlur={() => setFocusedField(null)}
            placeholder="Masukkan alamat kantor lengkap..."
            style={textareaStyle("addr")}
          />
        </Field>

        <Field label="Tentang / Profil Singkat">
          <textarea
            rows={5}
            value={bio}
            onChange={e => {
              if (e.target.value.length <= BIO_LIMIT) setBio(e.target.value);
            }}
            onFocus={() => setFocusedField("bio")}
            onBlur={() => setFocusedField(null)}
            placeholder="Jelaskan profil singkat perusahaan atau organisasi..."
            style={textareaStyle("bio")}
          />
          <p
            className="text-[11px] text-right mt-0.5"
            style={{ color: bio.length >= BIO_LIMIT - 30 ? "#E30000" : "#737373" }}
          >
            {bio.length} / {BIO_LIMIT}
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
          className="inline-flex items-center justify-center rounded-full text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] active:bg-[#B30000] transition-colors disabled:opacity-60"
          style={{ height: "44px", padding: "0 20px" }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}