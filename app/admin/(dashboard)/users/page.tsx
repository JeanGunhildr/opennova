import AdminPageHeader from "@/component/admin/AdminPageHeader";
import UsersTabs from "@/component/admin/UsersTabs";

export default function AdminUsersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      <AdminPageHeader
        title="Pengguna"
        description="Kelola data Seeker dan Solver yang terdaftar di platform OpenNova."
      />
      <UsersTabs />
    </div>
  );
}
