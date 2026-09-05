import type { Metadata } from "next";
import AdminLoginForm from "@/component/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Masuk Admin | OpenNova",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-10">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(227,0,0,0.08) 0%, transparent 70%)",
        }}
      />
      <AdminLoginForm />
    </div>
  );
}
