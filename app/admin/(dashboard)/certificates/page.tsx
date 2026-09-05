import AdminPageHeader from "@/component/admin/AdminPageHeader";
import CertificateTemplateCard from "@/component/admin/CertificateTemplateCard";
import AuthorizationFilesTable from "@/component/admin/AuthorizationFilesTable";
import WinnersManagementTable from "@/component/admin/WinnersManagementTable";

export default function AdminCertificatesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      <AdminPageHeader
        title="Sertifikat"
        description="Kelola template, berkas otorisasi seeker, dan pengiriman sertifikat pemenang."
      />

      <div className="flex flex-col gap-6">
        <CertificateTemplateCard />
        <AuthorizationFilesTable />
        <WinnersManagementTable />
      </div>
    </div>
  );
}
