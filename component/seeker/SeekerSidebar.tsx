"use client";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Bell,
  ChevronRight,
  Menu,
  X,
  Layers,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/seeker", Icon: LayoutDashboard },
  { label: "Challenge Anda", href: "/seeker/challenges", Icon: Trophy },
  { label: "Legal & Dokumen", href: "/seeker/legal", Icon: FileText },
  { label: "Notifikasi", href: "/seeker/notifications", Icon: Bell, badge: 4 },
];

const MOCK = {
  company: "PT Telkom Indonesia",
  name: "Budi Santoso",
  email: "budi@telkom.co.id",
  initials: "BS",
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full py-6 px-[26px]">
      {/* Brand */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#E30000" }}
          >
            <Layers size={16} className="text-white" strokeWidth={2} />
          </div>
          <span
            className="text-white font-medium"
            style={{ fontSize: "22px", letterSpacing: "-0.01em" }}
          >
            opennova
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Brand divider */}
      <div className="my-5 h-px" style={{ background: "#373737" }} />

      {/* Greeting */}
      <div className="pb-6" style={{ borderBottom: "1px solid #373737" }}>
        <p
          className="font-medium text-white leading-[1.1]"
          style={{ fontSize: "26px" }}
        >
          Selamat Datang Kembali!
        </p>
        <p className="mt-1.5 text-[13px]" style={{ color: "#A4A4A4" }}>
          {MOCK.company}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-5" aria-label="Navigasi Seeker">
        <p
          className="text-[13px] font-semibold uppercase tracking-wider mb-3 pl-1"
          style={{ color: "#737373" }}
        >
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, Icon, badge }) => {
            const isActive =
              href === "/seeker"
                ? pathname === "/seeker"
                : pathname.startsWith(href);

            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  className={[
                    "flex items-center gap-3 h-[44px] px-[14px] rounded-[9px] text-[16px] font-medium transition-all",
                    isActive ? "text-white" : "hover:text-white",
                  ].join(" ")}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(90deg, #303030 0%, #651717 100%)",
                          border: "1px solid #5C5C5C",
                          color: "#F7F7F7",
                        }
                      : { color: "#A4A4A4" }
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-[#737373]"}
                    strokeWidth={1.8}
                  />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className="flex items-center justify-center rounded-full text-[11px] font-bold leading-none"
                      style={{
                        minWidth: "20px",
                        height: "20px",
                        background: "#FFFFFF",
                        color: "#171717",
                        padding: "0 4px",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
                {/* Red accent bar */}
                {isActive && (
                  <span
                    className="absolute right-0 top-[8px] bottom-[8px] w-[4px] rounded-full"
                    style={{ background: "#E30000" }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 h-[44px] px-[14px] rounded-[9px] text-[15px] font-medium text-[#A4A4A4] hover:text-white hover:bg-white/5 transition-all"
      >
        <LogOut size={18} strokeWidth={1.8} />
        <span>Keluar</span>
      </button>

      {/* Profile widget */}
      <div
        className="mt-auto rounded-[10px] p-3 flex flex-col gap-3"
        style={{ background: "#232323", border: "1px solid #373737" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-medium flex-shrink-0 select-none"
            style={{ background: "#373737", border: "1px solid #5C5C5C" }}
          >
            {MOCK.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-white truncate leading-tight">
              {MOCK.name}
            </p>
            <p
              className="text-[12px] truncate leading-tight"
              style={{ color: "#737373" }}
            >
              {MOCK.email}
            </p>
          </div>
          <ChevronRight
            size={16}
            style={{ color: "#5C5C5C" }}
            strokeWidth={1.8}
            className="flex-shrink-0"
          />
        </div>
        <Link
          href="/seeker/profile"
          className="w-full h-10 rounded-full text-white text-[14px] font-semibold bg-[#E30000] hover:bg-[#CC0000] transition-colors inline-flex items-center justify-center"
        >
          Lihat Profil
        </Link>
      </div>
    </div>
  );
}

export default function SeekerSidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{
          width: "290px",
          minWidth: "290px",
          background: "#171717",
          borderRight: "1px solid #373737",
        }}
        aria-label="Sidebar navigasi Seeker"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 gap-3"
        style={{ background: "#171717", borderBottom: "1px solid #373737" }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-white font-semibold text-[18px]">opennova</span>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-[290px] h-full overflow-y-auto"
            style={{ background: "#171717" }}
          >
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
