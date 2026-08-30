"use client";

import { Compass, Bell, Wallet } from "lucide-react";
import type { Notification, NotificationType } from "@/lib/data/dashboard";

interface NotificationItemProps {
  notification: Notification;
  isLast: boolean;
  onMarkRead: (id: string) => void;
}

const iconConfig: Record<NotificationType, { Icon: typeof Bell; bg: string; color: string }> = {
  challenge: { Icon: Compass,  bg: "bg-secondary-100",   color: "text-primary-500"  },
  system:    { Icon: Bell,     bg: "bg-gray-100",         color: "text-gray-700"     },
  earnings:  { Icon: Wallet,   bg: "bg-[#E6F4E8]",        color: "text-[#15803D]"    },
};

export default function NotificationItem({
  notification,
  isLast,
  onMarkRead,
}: NotificationItemProps) {
  const { id, type, title, description, timestamp, read, action } = notification;
  const { Icon, bg, color } = iconConfig[type];

  return (
    <div
      className={[
        "relative flex gap-3.5 px-5 py-4 cursor-pointer transition-colors",
        !isLast ? "border-b border-[#EAEBED]" : "",
        read
          ? "bg-white hover:bg-gray-50 border-l-[3px] border-l-transparent"
          : "bg-primary-50 hover:bg-secondary-100 border-l-[3px] border-l-primary-500",
      ].join(" ")}
      onClick={() => !read && onMarkRead(id)}
      role="article"
      aria-label={title}
    >
      {/* Icon container */}
      <div
        className={[
          "flex-shrink-0 w-11 h-11 rounded-[12px] flex items-center justify-center",
          bg,
        ].join(" ")}
      >
        <Icon size={20} className={color} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            "text-[14px] leading-[1.35] text-gray-900 pr-5",
            read ? "font-medium" : "font-bold",
          ].join(" ")}
        >
          {title}
        </p>
        <p className="text-[13px] leading-[1.45] text-gray-600 mt-0.5 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[12px] text-gray-400">{timestamp}</span>
          {action && (
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="text-[12px] font-medium text-gray-700 border border-[#E0E2E4] rounded-full px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors"
            >
              {action}
            </button>
          )}
        </div>
      </div>

      {/* Unread dot */}
      {!read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" aria-label="Belum dibaca" />
      )}
    </div>
  );
}