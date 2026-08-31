import type { ReactNode } from "react";
import DashboardSidebar from "@/component/dashboard/DashboardSidebar";

/**
 * Solver dashboard layout.
 * Isolated from (public) layout — no Navbar or Footer.
 * Provides: persistent sidebar + scrollable main canvas.
 */
export default function SolverLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F6F8FA]">
      <DashboardSidebar />
      {/* Main content area — offset top on mobile for the fixed top bar */}
      <main className="flex-1 min-h-screen overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}