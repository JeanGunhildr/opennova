"use client";

import { Camera, Building2, CheckCircle2 } from "lucide-react";

const MOCK = {
  name: "PT Telkom Indonesia",
  subtitle: "Badan Usaha Milik Negara · Telekomunikasi",
  verified: true,
};

export default function CompanyIdentityCard() {
  return (
    <div
      className="rounded-[18px] p-[22px]"
      style={{
        background: "#191919",
        border: "1px solid #373737",
        minHeight: "200px",
      }}
    >
      <div className="flex items-start gap-[18px]">
        {/* Logo container */}
        <div className="relative flex-shrink-0" style={{ width: "104px", height: "104px" }}>
          <div
            className="group w-full h-full rounded-[18px] flex items-center justify-center overflow-hidden"
            style={{ background: "#232323", border: "1px solid #5C5C5C" }}
          >
            <Building2 size={34} strokeWidth={1.2} style={{ color: "#737373" }} />

            {/* Edit overlay */}
            <label
              className="absolute inset-0 flex items-center justify-center rounded-[18px] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.50)" }}
              aria-label="Ganti logo perusahaan"
            >
              <input type="file" accept="image/*" className="sr-only" />
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: "34px", height: "34px", background: "#FFFFFF" }}
              >
                <Camera size={17} strokeWidth={2} style={{ color: "#171717" }} />
              </div>
            </label>
          </div>
        </div>

        {/* Identity text */}
        <div className="flex flex-col gap-1 min-w-0 pt-1">
          <p className="font-bold text-white leading-tight" style={{ fontSize: "19px" }}>
            {MOCK.name}
          </p>
          <p className="text-[13px]" style={{ color: "#737373" }}>
            {MOCK.subtitle}
          </p>
          {MOCK.verified && (
            <div
              className="inline-flex items-center gap-1.5 mt-1.5"
              style={{ fontSize: "12px", fontWeight: 600, color: "#54D67A" }}
            >
              <CheckCircle2 size={14} strokeWidth={2.2} />
              Terverifikasi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}