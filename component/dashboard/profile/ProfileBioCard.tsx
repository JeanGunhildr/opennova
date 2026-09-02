"use client";

const MAX_BIO = 300;

interface ProfileBioCardProps {
  bio: string;
  onChange: (value: string) => void;
}

export default function ProfileBioCard({ bio, onChange }: ProfileBioCardProps) {
  const remaining = MAX_BIO - bio.length;
  const nearLimit = remaining <= 30;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Heading */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-gray-900">Tentang Diri (Bio)</h2>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Tuliskan sedikit tentang dirimu agar Seeker dapat mengenal kamu lebih baik.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={bio}
          onChange={e => {
            if (e.target.value.length <= MAX_BIO) onChange(e.target.value);
          }}
          placeholder="Contoh: Saya adalah developer dengan 3 tahun pengalaman di bidang AI dan sistem terdistribusi…"
          rows={5}
          className="rounded-2xl p-4 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-[14px] text-gray-900 w-full resize-none transition-all placeholder:text-gray-400 leading-[1.6]"
        />
        {/* Character count */}
        <p
          className={[
            "absolute bottom-3 right-4 text-[12px] font-medium",
            nearLimit ? "text-primary-500" : "text-gray-400",
          ].join(" ")}
        >
          {bio.length} / {MAX_BIO} karakter
        </p>
      </div>
    </div>
  );
}