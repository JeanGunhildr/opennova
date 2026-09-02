"use client";

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
}

interface ProfileFormCardProps {
  data: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string) => void;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-primary-500 ml-0.5">*</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-full h-11 px-4 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-[14px] text-gray-900 bg-white transition-all placeholder:text-gray-400";

export default function ProfileFormCard({ data, onChange }: ProfileFormCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-5">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-[18px] font-bold text-gray-900">Informasi Pribadi</h2>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Informasi ini digunakan untuk verifikasi identitas dan komunikasi challenge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Lengkap */}
        <div>
          <FieldLabel label="Nama Lengkap" required />
          <input
            type="text"
            value={data.fullName}
            onChange={e => onChange("fullName", e.target.value)}
            placeholder="Masukkan nama lengkap"
            className={inputBase}
          />
        </div>

        {/* Email — disabled, clean (no badge) */}
        <div>
          <FieldLabel label="Email Akun" />
          <input
            type="email"
            value={data.email}
            disabled
            className="w-full rounded-full h-11 px-4 border border-gray-200 text-[14px] text-gray-400 bg-gray-50 cursor-not-allowed outline-none"
          />
        </div>

        {/* No. WhatsApp */}
        <div>
          <FieldLabel label="No. WhatsApp / HP" />
          <div className="flex">
            <span className="inline-flex items-center h-11 px-3.5 rounded-l-full border border-r-0 border-gray-300 bg-gray-50 text-[14px] font-medium text-gray-600 flex-shrink-0">
              +62
            </span>
            <input
              type="tel"
              value={data.phone}
              onChange={e => onChange("phone", e.target.value)}
              placeholder="81234567890"
              className="flex-1 h-11 px-4 border border-gray-300 rounded-r-full focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-[14px] text-gray-900 bg-white transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tanggal Lahir */}
        <div>
          <FieldLabel label="Tanggal Lahir" />
          <input
            type="date"
            value={data.birthDate}
            onChange={e => onChange("birthDate", e.target.value)}
            className={inputBase}
          />
        </div>

        {/* Alamat Domisili — full width */}
        <div className="md:col-span-2">
          <FieldLabel label="Alamat Domisili" />
          <input
            type="text"
            value={data.address}
            onChange={e => onChange("address", e.target.value)}
            placeholder="Kota, Provinsi"
            className={inputBase}
          />
        </div>
      </div>
    </div>
  );
}