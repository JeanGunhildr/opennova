"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { OpenNovaLogoMark } from "@/component/landing/Logo";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Pengguna", href: "/admin/users", Icon: Users },
  { label: "Sertifikat", href: "/admin/certificates", Icon: BadgeCheck },
];

const MOCK_ADMIN = {
  name: "Admin OpenNova",
  email: "admin@opennova.id",
  initials: "AO",
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <div className="flex flex-col h-full py-6 px-5">
      {/* Brand */}
      <div className="flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <OpenNovaLogoMark />
          <span className="text-gray-900 font-semibold text-[18px] tracking-tight">
            opennova
          </span>
          <span
            className="ml-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: "#FFE4E1", color: "#B91413" }}
          >
            Admin
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="my-5 h-px bg-gray-200" />

      {/* Nav */}
      <nav className="flex-1" aria-label="Navigasi Admin">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-3 pl-1">
          Menu Admin
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 h-[46px] px-[14px] rounded-[10px] text-[15px] font-medium transition-all",
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")}
                  style={isActive ? { background: "#E30000" } : undefined}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.9}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={16} className="text-white/80" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile widget */}
      <div className="mt-4 rounded-[12px] p-3 flex flex-col gap-3 bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0 select-none"
            style={{ background: "#E30000" }}
          >
            {MOCK_ADMIN.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-gray-900 truncate leading-tight">
              {MOCK_ADMIN.name}
            </p>
            <p className="text-[12px] text-gray-500 truncate leading-tight">
              {MOCK_ADMIN.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full h-10 rounded-full text-[14px] font-semibold border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 transition-colors inline-flex items-center justify-center gap-2"
        >
          <LogOut size={16} strokeWidth={2} />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200"
        style={{ width: "272px", minWidth: "272px" }}
        aria-label="Sidebar navigasi Admin"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 gap-3 bg-white border-b border-gray-200">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <OpenNovaLogoMark />
          <span className="text-gray-900 font-semibold text-[16px]">opennova</span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: "#FFE4E1", color: "#B91413" }}
          >
            Admin
          </span>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-[280px] h-full overflow-y-auto bg-white shadow-2xl">
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
