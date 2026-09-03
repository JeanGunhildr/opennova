import { BellOff } from "lucide-react";

export default function NotificationEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-[16px]"
      style={{
        minHeight: "420px",
        background: "#191919",
        border: "1px solid #373737",
        padding: "48px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.28)",
      }}
    >
      {/* Illustration circle */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: "76px",
          height: "76px",
          background: "#232323",
          border: "1px solid #373737",
        }}
      >
        <BellOff size={32} strokeWidth={1.4} style={{ color: "#737373" }} />
      </div>

      <p className="mt-[18px] font-semibold text-white" style={{ fontSize: "19px" }}>
        Belum ada notifikasi
      </p>
      <p
        className="text-[14px] leading-[1.5] mt-[7px] max-w-[420px]"
        style={{ color: "#737373" }}
      >
        Aktivitas terkait challenge, submission, dan pembaruan akun Anda akan muncul di sini secara otomatis.
      </p>
    </div>
  );
}