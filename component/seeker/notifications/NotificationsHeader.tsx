"use client";

interface NotificationsHeaderProps {
  hasUnread: boolean;
  onMarkAllRead: () => void;
}

export default function NotificationsHeader({ hasUnread, onMarkAllRead }: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 mb-1">
          <div
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{ background: "#FFFFFF", border: "6px solid #5C5C5C" }}
          />
          <span className="text-[14px] font-semibold text-white">Notifikasi</span>
        </div>
        <h1
          className="font-bold text-white leading-[1.1]"
          style={{ fontSize: "40px", letterSpacing: "-0.025em" }}
        >
          Notifikasi
        </h1>
        <p className="text-[15px] leading-[1.5] max-w-[700px]" style={{ color: "#A4A4A4" }}>
          Lihat pembaruan terbaru terkait challenge, submission, dan aktivitas akun Anda.
        </p>
      </div>

      {/* Mark all read */}
      {hasUnread && (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="self-start sm:self-auto inline-flex items-center text-[14px] font-semibold transition-colors rounded-full"
          style={{
            height: "42px",
            padding: "0 18px",
            background: "#232323",
            border: "1px solid #5C5C5C",
            color: "#F7F7F7",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "#373737";
            (e.currentTarget as HTMLElement).style.borderColor = "#737373";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "#232323";
            (e.currentTarget as HTMLElement).style.borderColor = "#5C5C5C";
          }}
        >
          Tandai Semua Dibaca
        </button>
      )}
    </div>
  );
}