"use client";

import { Trophy, FileCheck2, CalendarClock, Bell } from "lucide-react";

export type NotificationType = "challenge" | "submission" | "timeline" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
}

const TYPE_CONFIG: Record<NotificationType, {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  bg: string;
  iconColor: string;
}> = {
  challenge:  { Icon: Trophy,        bg: "rgba(227,0,0,0.12)", iconColor: "#C61A1A"  },
  submission: { Icon: FileCheck2,    bg: "rgba(227,0,0,0.10)", iconColor: "#C61A1A"  },
  timeline:   { Icon: CalendarClock, bg: "#393713",            iconColor: "#D8C83A"  },
  system:     { Icon: Bell,          bg: "#373737",            iconColor: "#BDBDBD"  },
};

interface NotificationItemProps {
  item: Notification;
  isLast: boolean;
}

export default function NotificationItem({ item, isLast }: NotificationItemProps) {
  const { type, title, description, timestamp, read, actionLabel } = item;
  const cfg = TYPE_CONFIG[type];
  const { Icon } = cfg;

  return (
    <div
      className="group relative flex gap-[14px] items-start transition-colors duration-150"
      style={{
        padding: "18px 20px",
        borderBottom: isLast ? "none" : "1px solid #393939",
        borderLeft: read ? "3px solid transparent" : "3px solid #E30000",
        background: read ? "transparent" : "rgba(227,0,0,0.045)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = read
          ? "#232323"
          : "rgba(227,0,0,0.075)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = read
          ? "transparent"
          : "rgba(227,0,0,0.045)";
      }}
    >
      {/* Unread dot */}
      {!read && (
        <span
          className="absolute top-[18px] right-[18px] rounded-full"
          style={{ width: "8px", height: "8px", background: "#E30000", flexShrink: 0 }}
        />
      )}

      <div
        className="flex items-center justify-center rounded-[12px] flex-shrink-0"
        style={{ width: "44px", height: "44px", background: cfg.bg }}
      >
        <span style={{ color: cfg.iconColor, display: "flex" }}>
          <Icon size={20} strokeWidth={1.8} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="leading-[1.35] text-[15px]"
          style={{ fontWeight: read ? 500 : 700, color: read ? "#D9D9D9" : "#F7F7F7" }}
        >
          {title}
        </p>
        <p className="text-[13px] leading-[1.5] mt-0.5 max-w-[760px]" style={{ color: "#A4A4A4" }}>
          {description}
        </p>
        <p className="text-[12px] mt-1" style={{ color: "#737373" }}>
          {timestamp}
        </p>
      </div>

      {/* Trailing action */}
      {actionLabel && (
        <button
          type="button"
          className="flex-shrink-0 self-center text-[12px] font-semibold transition-colors rounded-full"
          style={{
            height: "34px",
            padding: "0 12px",
            background: "transparent",
            border: "1px solid #5C5C5C",
            color: "#BDBDBD",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "#E30000";
            (e.currentTarget as HTMLElement).style.color = "#F7F7F7";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "#5C5C5C";
            (e.currentTarget as HTMLElement).style.color = "#BDBDBD";
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}