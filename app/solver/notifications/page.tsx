"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import NotificationItem from "@/component/dashboard/NotificationItem";
import { notifications as initialNotifs } from "@/lib/data/dashboard";
import type { NotificationType, NotificationGroup } from "@/lib/data/dashboard";

const FILTER_TABS: { label: string; value: NotificationType | "all" }[] = [
  { label: "Semua",     value: "all"       },
  { label: "Challenge", value: "challenge" },
  { label: "Sistem",    value: "system"    },
  { label: "Perolehan", value: "earnings"  },
];

const GROUP_LABELS: Record<NotificationGroup, string> = {
  today:     "Hari ini",
  yesterday: "Kemarin",
  earlier:   "Sebelumnya",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">("all");

  const filtered = activeFilter === "all"
    ? notifs
    : notifs.filter((n) => n.type === activeFilter);

  const unreadCount = notifs.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  // Group the filtered notifs
  const groups: NotificationGroup[] = ["today", "yesterday", "earlier"];

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-9 max-w-[1160px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[36px] lg:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
            Notifikasi
          </h1>
          <p className="text-[16px] text-gray-500 mt-2 leading-[1.5]">
            Lihat pembaruan challenge, aktivitas akun, dan perolehan terbaru.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-gray-900 border border-[#E2E3E5] rounded-full px-4 py-2 bg-white hover:bg-gray-50 transition-colors flex-shrink-0 self-start"
          >
            <CheckCheck size={15} strokeWidth={1.8} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Body: 2-col on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* ── Left: notification feed ─────────────────── */}
        <div>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTER_TABS.map(({ label, value }) => {
              const isActive = activeFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveFilter(value)}
                  className={[
                    "h-[38px] px-4 rounded-full text-[13px] font-medium border transition-colors",
                    isActive
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-[#E2E3E5] hover:border-gray-400",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Notification list */}
          {filtered.length === 0 ? (
            /* Empty state */
            <div className="bg-white border border-[#E2E3E5] rounded-[16px] min-h-[420px] flex flex-col items-center justify-center text-center p-10">
              <div className="w-[72px] h-[72px] rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Bell size={30} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[19px] font-semibold text-gray-900 mt-0.5">
                Tidak ada notifikasi
              </h3>
              <p className="text-[14px] text-gray-500 leading-[1.5] max-w-[340px] mt-2">
                Kamu akan melihat pembaruan challenge, aktivitas akun, dan perolehan di sini.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E3E5] rounded-[16px] overflow-hidden">
              {groups.map((group) => {
                const items = filtered.filter((n) => n.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    {/* Group label */}
                    <div className="px-5 py-3 border-b border-[#EAEBED]">
                      <span className="text-[13px] font-semibold text-gray-500">
                        {GROUP_LABELS[group]}
                      </span>
                    </div>
                    {items.map((notif, idx) => {
                      const isLastInGroup = idx === items.length - 1;
                      const isLastOverall = notif === filtered[filtered.length - 1];
                      return (
                        <NotificationItem
                          key={notif.id}
                          notification={notif}
                          isLast={isLastOverall}
                          onMarkRead={markRead}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right: summary card ─────────────────────── */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E3E5] rounded-[16px] p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Ringkasan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-gray-600">Belum dibaca</span>
                <span className="text-[24px] font-bold text-gray-900">{unreadCount}</span>
              </div>
              <div className="h-px bg-[#E8EAEC]" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-gray-600">Update challenge</span>
                <span className="text-[24px] font-bold text-gray-900">
                  {notifs.filter((n) => n.type === "challenge").length}
                </span>
              </div>
              <div className="h-px bg-[#E8EAEC]" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-gray-600">Perolehan</span>
                <span className="text-[24px] font-bold text-gray-900">
                  {notifs.filter((n) => n.type === "earnings").length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E3E5] rounded-[16px] p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Filter kategori</h3>
            <p className="text-[13px] text-gray-500 leading-snug">
              Gunakan filter di atas untuk memfilter notifikasi berdasarkan kategori: Challenge, Sistem, atau Perolehan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}