"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import NotificationsHeader from "@/component/seeker/notifications/NotificationsHeader";
import NotificationList from "@/component/seeker/notifications/NotificationList";
import NotificationEmptyState from "@/component/seeker/notifications/NotificationEmptyState";
import type { Notification } from "@/component/seeker/notifications/NotificationItem";
import {
  getUserNotificationsAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notifications";

function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 60) return "Baru saja";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} jam lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hari lalu`;
  return `${Math.floor(diffSec / 86400)} hari lalu`;
}

export default function SeekerNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getUserNotificationsAction();
      if (res.data) {
        const mapped: Notification[] = res.data.map((n) => ({
          id: n.id,
          type: (n.type || "system") as any,
          title: n.title,
          description: n.body,
          timestamp: formatRelativeTime(n.createdAt),
          read: n.isRead,
          actionLabel: n.actionUrl ? "Lihat Detail" : undefined,
        }));
        setItems(mapped);
      }
      setLoading(false);
    }
    load();
  }, []);

  const hasUnread = items.some((n) => !n.read);

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsReadAction();
  }

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10">
        <NotificationsHeader hasUnread={hasUnread} onMarkAllRead={markAllRead} />
        <div className="mt-6">
          {loading ? (
            <div className="w-full h-[300px] bg-[#191919] border border-[#393939] rounded-[14px] flex items-center justify-center text-[#737373] text-sm gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span>Memuat notifikasi...</span>
            </div>
          ) : items.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <NotificationList items={items} />
          )}
        </div>
      </div>
    </div>
  );
}