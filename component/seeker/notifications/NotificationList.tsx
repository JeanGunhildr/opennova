import NotificationItem from "./NotificationItem";
import type { Notification } from "./NotificationItem";

interface NotificationListProps {
  items: Notification[];
}

export default function NotificationList({ items }: NotificationListProps) {
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{
        background: "#191919",
        border: "1px solid #373737",
        boxShadow: "0 1px 3px rgba(0,0,0,0.28)",
      }}
    >
      {/* List header */}
      <div
        className="flex items-center justify-between px-5"
        style={{ height: "56px", borderBottom: "1px solid #373737" }}
      >
        <p className="text-[14px] font-semibold" style={{ color: "#BDBDBD" }}>
          Semua Notifikasi
        </p>
        {unreadCount > 0 && (
          <span
            className="inline-flex items-center justify-center rounded-full text-[11px] font-bold"
            style={{
              height: "22px",
              minWidth: "22px",
              padding: "0 7px",
              background: "rgba(227,0,0,0.18)",
              color: "#E30000",
            }}
          >
            {unreadCount} belum dibaca
          </span>
        )}
      </div>

      {/* Items */}
      {items.map((item, i) => (
        <NotificationItem
          key={item.id}
          item={item}
          isLast={i === items.length - 1}
        />
      ))}
    </div>
  );
}