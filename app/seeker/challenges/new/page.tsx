"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import CreateChallengeHeader from "@/component/seeker/create-challenge/CreateChallengeHeader";
import Section1BasicInfo from "@/component/seeker/create-challenge/Section1BasicInfo";
import Section2Description from "@/component/seeker/create-challenge/Section2Description";
import Section3SubmissionRules from "@/component/seeker/create-challenge/Section3SubmissionRules";
import Section4Copyright from "@/component/seeker/create-challenge/Section4Copyright";
import Section5Evaluation from "@/component/seeker/create-challenge/Section5Evaluation";
import Section6Timeline, { type TimelineData } from "@/component/seeker/create-challenge/Section6Timeline";
import Section7RewardPayment from "@/component/seeker/create-challenge/Section7RewardPayment";
import DiscardDataModal from "@/component/seeker/create-challenge/modals/DiscardDataModal";
import PublishChallengeModal from "@/component/seeker/create-challenge/modals/PublishChallengeModal";

import type { ListItem } from "@/component/seeker/create-challenge/Section2Description";
import type { Criterion } from "@/component/seeker/create-challenge/Section5Evaluation";

const INIT_TIMELINE: TimelineData = { openStart: "", openEnd: "", expertStart: "", expertEnd: "", pitchStart: "", pitchEnd: "", announcement: "" };

const INIT_EXPERT_CRITERIA: Criterion[] = [
  { id: "e1", title: "Kelayakan Teknis",   description: "" },
  { id: "e2", title: "Dampak & Skalabilitas", description: "" },
];
const INIT_PITCH_CRITERIA: Criterion[] = [
  { id: "p1", title: "Biaya & Sumber Daya",       description: "" },
  { id: "p2", title: "Kesiapan Implementasi",      description: "" },
];

function mkId() { return Date.now().toString() + Math.random().toString(36).slice(2, 6); }

export default function CreateChallengePage() {
  const router = useRouter();

  // Section 1
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Section 2
  const [about, setAbout] = useState("");
  const [innovationGoals, setInnovationGoals] = useState<ListItem[]>([{ id: mkId(), text: "" }]);

  // Section 3
  const [submissionRules, setSubmissionRules] = useState<ListItem[]>([{ id: mkId(), text: "" }]);

  // Section 4
  const [copyrightFile, setCopyrightFile] = useState<File | null>(null);

  // Section 5
  const [expertCriteria, setExpertCriteria] = useState<Criterion[]>(INIT_EXPERT_CRITERIA);
  const [expertWeight, setExpertWeight] = useState(60);
  const [pitchCriteria, setPitchCriteria] = useState<Criterion[]>(INIT_PITCH_CRITERIA);
  const [pitchWeight, setPitchWeight] = useState(40);

  // Section 6
  const [timeline, setTimeline] = useState<TimelineData>(INIT_TIMELINE);

  // Section 7
  const [rewardAmount, setRewardAmount] = useState(0);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending");

  // Modals
  const [showDiscard, setShowDiscard] = useState(false);
  const [publishModal, setPublishModal] = useState<null | { mode: "guidance" | "confirmation"; items: string[] }>(null);

  // Validation gates
  const sec1 = !!(thumbnail && title.trim() && categoryId);
  const sec2 = !!(about.trim() && about.length <= 1000 && innovationGoals.some(g => g.text.trim()));
  const sec3 = submissionRules.some(r => r.text.trim());
  const sec4 = !!copyrightFile;
  const sec5 = !!(expertCriteria.length > 0 && pitchCriteria.length > 0 && expertWeight + pitchWeight === 100 && expertCriteria.every(c => c.title.trim()) && pitchCriteria.every(c => c.title.trim()));
  const sec6 = !!(timeline.openStart && timeline.openEnd && timeline.expertStart && timeline.expertEnd && timeline.pitchStart && timeline.pitchEnd && timeline.announcement);
  const sec7 = !!(rewardAmount >= 500_000 && selectedBank && paymentStatus === "paid");
  const allValid = sec1 && sec2 && sec3 && sec4 && sec5 && sec6 && sec7;

  function getMissingItems(): string[] {
    const items: string[] = [];
    if (!sec1) items.push("Informasi Dasar (thumbnail, judul, dan kategori belum lengkap)");
    if (!sec2) items.push("Deskripsi Challenge belum lengkap");
    if (!sec3) items.push("Ketentuan Pengumpulan belum diisi");
    if (!sec4) items.push("Dokumen Kesepakatan Hak Cipta belum diunggah");
    if (!sec5) items.push("Kriteria Penilaian belum lengkap (atau bobot tidak 100%)");
    if (!sec6) items.push("Linimasa Challenge belum diisi lengkap");
    if (!paymentStatus || paymentStatus !== "paid") items.push("Pembayaran belum diselesaikan (status: Menunggu Pembayaran)");
    return items;
  }

  function handlePublishClick() {
    if (allValid) {
      setPublishModal({ mode: "confirmation", items: [] });
    } else {
      setPublishModal({ mode: "guidance", items: getMissingItems() });
    }
  }

  function handleDiscard() {
    // Reset all state
    setThumbnail(null); setTitle(""); setCategoryId(null);
    setAbout(""); setInnovationGoals([{ id: mkId(), text: "" }]);
    setSubmissionRules([{ id: mkId(), text: "" }]);
    setCopyrightFile(null);
    setExpertCriteria(INIT_EXPERT_CRITERIA); setExpertWeight(60);
    setPitchCriteria(INIT_PITCH_CRITERIA); setPitchWeight(40);
    setTimeline(INIT_TIMELINE);
    setRewardAmount(0); setSelectedBank(null); setPaymentStatus("pending");
    router.push("/seeker/challenges");
  }

  return (
    <div className="min-h-screen pt-14 lg:pt-0" style={{ background: "#171717" }}>
      <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-0 py-8 pb-16">
        <CreateChallengeHeader onDiscard={() => setShowDiscard(true)} onPublish={handlePublishClick} />

        {/* 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px] gap-[18px] items-start">
          {/* Left column */}
          <div className="flex flex-col gap-[18px]">
            <Section1BasicInfo thumbnail={thumbnail} title={title} categoryId={categoryId}
              onThumbnail={setThumbnail} onTitle={setTitle} onCategory={setCategoryId} />
            <Section2Description about={about} innovationGoals={innovationGoals}
              onAbout={setAbout} onGoals={setInnovationGoals} />
            <Section3SubmissionRules rules={submissionRules} onRules={setSubmissionRules} />
            <Section4Copyright copyrightFile={copyrightFile} onFile={setCopyrightFile} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-[18px]">
            <Section5Evaluation expertCriteria={expertCriteria} expertWeight={expertWeight}
              pitchCriteria={pitchCriteria} pitchWeight={pitchWeight}
              onExpertCriteria={setExpertCriteria} onExpertWeight={setExpertWeight}
              onPitchCriteria={setPitchCriteria} onPitchWeight={setPitchWeight} />
            <Section6Timeline timeline={timeline} onTimeline={setTimeline} />
            <Section7RewardPayment rewardAmount={rewardAmount} selectedBank={selectedBank}
              paymentStatus={paymentStatus} onReward={setRewardAmount} onBank={setSelectedBank}
              onPaymentPaid={() => setPaymentStatus("paid")} />
          </div>
        </div>
      </div>

      {showDiscard && (
        <DiscardDataModal onClose={() => setShowDiscard(false)} onConfirm={handleDiscard} />
      )}
      {publishModal && (
        <PublishChallengeModal mode={publishModal.mode} missingItems={publishModal.items}
          onClose={() => setPublishModal(null)}
          onConfirm={() => { setPublishModal(null); router.push("/seeker/challenges"); }} />
      )}
    </div>
  );
}