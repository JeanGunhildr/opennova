"use client";

import { useState } from "react";
import LegalHeader from "@/component/seeker/legal/LegalHeader";
import LegalTabs from "@/component/seeker/legal/LegalTabs";
import type { LegalTab } from "@/component/seeker/legal/LegalTabs";
import CopyrightAgreementPanel from "@/component/seeker/legal/CopyrightAgreementPanel";
import CertificateAuthorizationPanel from "@/component/seeker/legal/CertificateAuthorizationPanel";

export default function SeekerLegalPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>("copyright");

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div
        className="w-full max-w-[1160px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-8 lg:py-8 xl:py-10 pb-12"
      >
        {/* Header */}
        <LegalHeader />

        {/* Tabs */}
        <LegalTabs active={activeTab} onChange={setActiveTab} />

        {/* Panel */}
        {activeTab === "copyright"   && <CopyrightAgreementPanel />}
        {activeTab === "certificate" && <CertificateAuthorizationPanel />}
      </div>
    </div>
  );
}