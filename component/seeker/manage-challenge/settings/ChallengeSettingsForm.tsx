"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import type { ManageChallengeData } from "@/lib/actions/seeker-manage";
import { updateChallengeSettingsAction } from "@/lib/actions/seeker-manage";
import UpdateConfirmationModal from "./UpdateConfirmationModal";
import DestructiveArea from "./DestructiveArea";
import CancellationModal from "./CancellationModal";

interface LocalCriterion {
  id?: string;
  label: string;
  description: string;
}

interface ChallengeSettingsFormProps {
  challengeId: string;
  data: ManageChallengeData;
}

export default function ChallengeSettingsForm({ challengeId, data }: ChallengeSettingsFormProps) {
  // ── Form State — pre-filled from DB ─────────────────────────
  const [aboutChallenge, setAboutChallenge] = useState(data.description ?? "");
  const [goals, setGoals] = useState<string[]>(data.objectives.length > 0 ? data.objectives : [""]);
  const [rules, setRules] = useState<string[]>(data.requirements.length > 0 ? data.requirements : [""]);
  const [expertCriteria, setExpertCriteria] = useState<LocalCriterion[]>(
    data.expertCriteria.length > 0
      ? data.expertCriteria.map((c) => ({ id: c.id, label: c.name, description: c.description ?? "" }))
      : [{ label: "", description: "" }]
  );
  const [expertWeight, setExpertWeight] = useState<number>(data.expertWeight);
  const [pitchingCriteria, setPitchingCriteria] = useState<LocalCriterion[]>(
    data.pitchingCriteria.length > 0
      ? data.pitchingCriteria.map((c) => ({ id: c.id, label: c.name, description: c.description ?? "" }))
      : [{ label: "", description: "" }]
  );
  const [pitchingWeight, setPitchingWeight] = useState<number>(data.pitchWeight);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Goals handlers
  const handleGoalChange = (idx: number, val: string) => setGoals((p) => { const n=[...p]; n[idx]=val; return n; });
  const handleAddGoal = () => setGoals((p) => [...p, ""]);
  const handleDeleteGoal = (idx: number) => { if (goals.length <= 1) return; setGoals((p) => p.filter((_, i) => i !== idx)); };

  // Rules handlers
  const handleRuleChange = (idx: number, val: string) => setRules((p) => { const n=[...p]; n[idx]=val; return n; });
  const handleAddRule = () => setRules((p) => [...p, ""]);
  const handleDeleteRule = (idx: number) => { if (rules.length <= 1) return; setRules((p) => p.filter((_, i) => i !== idx)); };

  // Expert criteria handlers
  const handleExpertCriterionChange = (idx: number, field: "label" | "description", val: string) =>
    setExpertCriteria((p) => { const n=[...p]; n[idx]={...n[idx],[field]:val}; return n; });
  const handleAddExpertCriterion = () => setExpertCriteria((p) => [...p, { label: "", description: "" }]);
  const handleDeleteExpertCriterion = (idx: number) => { if (expertCriteria.length <= 1) return; setExpertCriteria((p) => p.filter((_, i) => i !== idx)); };

  // Pitching criteria handlers
  const handlePitchingCriterionChange = (idx: number, field: "label" | "description", val: string) =>
    setPitchingCriteria((p) => { const n=[...p]; n[idx]={...n[idx],[field]:val}; return n; });
  const handleAddPitchingCriterion = () => setPitchingCriteria((p) => [...p, { label: "", description: "" }]);
  const handleDeletePitchingCriterion = (idx: number) => { if (pitchingCriteria.length <= 1) return; setPitchingCriteria((p) => p.filter((_, i) => i !== idx)); };

  // Weight coordination
  const handleExpertWeightChange = (valStr: string) => {
    const clamped = Math.min(100, Math.max(0, parseInt(valStr.replace(/\D/g, "") || "0", 10)));
    setExpertWeight(clamped); setPitchingWeight(100 - clamped);
  };
  const handlePitchingWeightChange = (valStr: string) => {
    const clamped = Math.min(100, Math.max(0, parseInt(valStr.replace(/\D/g, "") || "0", 10)));
    setPitchingWeight(clamped); setExpertWeight(100 - clamped);
  };

  const totalWeight = expertWeight + pitchingWeight;
  const isWeightValid = totalWeight === 100;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!aboutChallenge.trim()) errs.aboutChallenge = "Deskripsi Tentang Challenge wajib diisi.";
    if (goals.filter((g) => g.trim()).length === 0) errs.goals = "Minimal 1 tujuan inovasi wajib diisi.";
    if (rules.filter((r) => r.trim()).length === 0) errs.rules = "Minimal 1 ketentuan pengumpulan wajib diisi.";
    if (expertCriteria.some((c) => !c.label.trim() || !c.description.trim())) errs.expertCriteria = "Seluruh judul dan deskripsi kriteria Penjurian Ahli wajib diisi.";
    if (pitchingCriteria.some((c) => !c.label.trim() || !c.description.trim())) errs.pitchingCriteria = "Seluruh judul dan deskripsi kriteria Pitching Final wajib diisi.";
    if (!isWeightValid) errs.weight = "Total bobot harus tepat 100%.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateClick = () => {
    if (validateForm()) {
      setIsUpdateModalOpen(true);
    } else {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) { const el = document.getElementById(firstErrorKey); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }
  };

  const handleConfirmUpdate = () => {
    setIsUpdateModalOpen(false);
    setSaveError(null);
    startTransition(async () => {
      const result = await updateChallengeSettingsAction(challengeId, {
        description: aboutChallenge.trim(),
        objectives: goals.filter((g) => g.trim()),
        requirements: rules.filter((r) => r.trim()),
        expertCriteria: expertCriteria.filter((c) => c.label.trim()).map((c) => ({ id: c.id, name: c.label, description: c.description })),
        pitchingCriteria: pitchingCriteria.filter((c) => c.label.trim()).map((c) => ({ id: c.id, name: c.label, description: c.description })),
        expertWeight,
        pitchWeight: pitchingWeight,
      });
      if (result.success) { setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3500); }
      else { setSaveError(result.error ?? "Terjadi kesalahan saat menyimpan."); }
    });
  };

  return (
    <div className="flex flex-col gap-5 pt-4">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-bold text-white">Update Informasi Challenge</h2>
          <p className="text-xs text-[#737373] max-w-[650px] leading-relaxed">
            Anda bisa memperbarui informasi tertentu pada challenge ini, mulai dari deskripsi challenge, ketentuan pengumpulan, hingga kriteria penilaian.
          </p>
        </div>
        <button type="button" onClick={handleUpdateClick} disabled={isPending}
          className="h-[38px] px-5 rounded-full bg-[#E30000] hover:bg-[#CC0000] text-white text-xs font-semibold transition-all shadow-sm active:scale-[0.98] self-start md:self-auto disabled:opacity-60 disabled:cursor-not-allowed">
          {isPending ? "Menyimpan..." : "Update Challenge"}
        </button>
      </div>

      {showSuccessToast && (
        <div className="bg-[#1F3A27] border border-[rgba(57,217,111,0.28)] text-[#39D96F] px-4 py-3 rounded-[10px] text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Informasi challenge berhasil diperbarui dan disimpan.</span>
        </div>
      )}
      {saveError && (
        <div className="bg-[rgba(227,0,0,0.08)] border border-[rgba(227,0,0,0.3)] text-[#E30000] px-4 py-3 rounded-[10px] text-xs font-medium flex items-center gap-2.5">
          <AlertCircle size={16} className="shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="w-full bg-[#1F1F1F] border border-[#393939] rounded-[12px] p-5 md:p-6 shadow-sm">
        {/* SECTION 1: Deskripsi */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full border border-[rgba(227,0,0,0.65)] text-[#E30000] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-white">Deskripsi Challenge</h3>
              <p className="text-[11px] text-[#737373]">Permasalahan utama serta tujuan inovasi yang menjadi fokus Challenge ini.</p>
            </div>
          </div>
          <div className="space-y-1.5 pt-1" id="aboutChallenge">
            <label className="text-[10px] font-bold text-[#A4A4A4] uppercase tracking-wider block">Tentang Challenge</label>
            <div className="relative">
              <textarea rows={5} maxLength={1000} value={aboutChallenge} onChange={(e) => setAboutChallenge(e.target.value)}
                placeholder="Jelaskan latar belakang masalah dan tantangan yang ingin diselesaikan..."
                className={`w-full bg-[#191919] border rounded-[10px] p-3 text-xs text-white placeholder:text-[#6E6E6E] outline-none transition-colors resize-y leading-relaxed ${errors.aboutChallenge ? "border-[#E30000] bg-[rgba(227,0,0,0.04)]" : "border-[#393939] focus:border-[#E30000]"}`} />
              <span className="absolute bottom-2.5 right-3 text-[9px] text-[#737373] pointer-events-none">{aboutChallenge.length}/1000</span>
            </div>
            {errors.aboutChallenge && <p className="text-[10px] text-[#E30000]">{errors.aboutChallenge}</p>}
          </div>
          <div className="space-y-2 pt-1" id="goals">
            <label className="text-[10px] font-bold text-[#A4A4A4] uppercase tracking-wider block">Tujuan Inovasi</label>
            <div className="space-y-2">
              {goals.map((goal, idx) => (
                <div key={idx} className="grid grid-cols-[minmax(0,1fr)_36px] gap-2">
                  <input type="text" value={goal} onChange={(e) => handleGoalChange(idx, e.target.value)} placeholder={`Tujuan inovasi #${idx + 1}`}
                    className="h-[36px] bg-[#191919] border border-[#393939] focus:border-[#E30000] rounded-[9px] px-3 text-xs text-white placeholder:text-[#6E6E6E] outline-none transition-colors" />
                  <button type="button" onClick={() => handleDeleteGoal(idx)} disabled={goals.length <= 1}
                    className="w-[36px] h-[36px] rounded-[9px] bg-[#191919] border border-[#393939] text-[#737373] hover:text-[#E30000] hover:border-[rgba(227,0,0,0.45)] flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:text-[#737373]">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddGoal} className="h-[31px] px-3 rounded-[8px] border border-[#393939] text-white text-[10px] font-medium hover:bg-[#242424] transition-colors inline-flex items-center gap-1.5 mt-1">
              <Plus size={12} /><span>Tambah Tujuan</span>
            </button>
            {errors.goals && <p className="text-[10px] text-[#E30000]">{errors.goals}</p>}
          </div>
        </div>

        {/* SECTION 2: Ketentuan */}
        <div className="mt-7 pt-6 border-t border-[#2E2E2E] flex flex-col gap-4" id="rules">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full border border-[rgba(227,0,0,0.65)] text-[#E30000] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-white">Ketentuan Pengumpulan</h3>
              <p className="text-[11px] text-[#737373]">Format berkas, dokumen yang wajib dikumpulkan, serta persyaratan submission.</p>
            </div>
          </div>
          <div className="space-y-2 pt-1">
            {rules.map((rule, idx) => (
              <div key={idx} className="grid grid-cols-[minmax(0,1fr)_36px] gap-2">
                <input type="text" value={rule} onChange={(e) => handleRuleChange(idx, e.target.value)} placeholder={`Ketentuan pengumpulan #${idx + 1}`}
                  className="h-[36px] bg-[#191919] border border-[#393939] focus:border-[#E30000] rounded-[9px] px-3 text-xs text-white placeholder:text-[#6E6E6E] outline-none transition-colors" />
                <button type="button" onClick={() => handleDeleteRule(idx)} disabled={rules.length <= 1}
                  className="w-[36px] h-[36px] rounded-[9px] bg-[#191919] border border-[#393939] text-[#737373] hover:text-[#E30000] hover:border-[rgba(227,0,0,0.45)] flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:text-[#737373]">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddRule} className="h-[31px] px-3 rounded-[8px] border border-[#393939] text-white text-[10px] font-medium hover:bg-[#242424] transition-colors inline-flex items-center gap-1.5 mt-1">
              <Plus size={12} /><span>Tambah Ketentuan</span>
            </button>
            {errors.rules && <p className="text-[10px] text-[#E30000]">{errors.rules}</p>}
          </div>
        </div>

        {/* SECTION 3: Kriteria Penilaian */}
        <div className="mt-7 pt-6 border-t border-[#2E2E2E] flex flex-col gap-4">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full border border-[rgba(227,0,0,0.65)] text-[#E30000] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-white">Kriteria Penilaian</h3>
              <p className="text-[11px] text-[#737373]">Poin atau kriteria penilaian dalam tahap Penjurian Ahli dan Pitching Final.</p>
            </div>
          </div>

          {/* Expert */}
          <div className="space-y-3 pt-2" id="expertCriteria">
            <div className="flex items-center justify-between pb-1 border-b border-[#303030]">
              <span className="text-[11px] font-bold text-[#A4A4A4] uppercase tracking-wider">Tahap 1: Penjurian Ahli</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#737373]">Bobot Tahap:</span>
                <div className="flex items-center gap-1">
                  <input type="text" inputMode="numeric" value={expertWeight} onChange={(e) => handleExpertWeightChange(e.target.value)}
                    className="h-[30px] w-[60px] bg-white text-black font-bold text-xs rounded-[7px] text-center outline-none" />
                  <span className="text-xs font-bold text-white">%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {expertCriteria.map((crit, idx) => (
                <div key={idx} className="bg-[#191919] border border-[#393939] rounded-[9px] p-3 relative flex flex-col gap-2">
                  <input type="text" value={crit.label} onChange={(e) => handleExpertCriterionChange(idx, "label", e.target.value)} placeholder="Nama Kriteria..."
                    className="h-[31px] bg-[#1F1F1F] border border-[#393939] focus:border-[#E30000] rounded-[8px] px-2.5 text-xs text-white outline-none" />
                  <textarea rows={2} value={crit.description} onChange={(e) => handleExpertCriterionChange(idx, "description", e.target.value)} placeholder="Deskripsi kriteria penilaian..."
                    className="w-full bg-[#1F1F1F] border border-[#393939] focus:border-[#E30000] rounded-[8px] p-2 text-[10px] text-[#A4A4A4] outline-none resize-none leading-normal" />
                  <button type="button" onClick={() => handleDeleteExpertCriterion(idx)} disabled={expertCriteria.length <= 1}
                    className="absolute top-3 right-3 text-[#737373] hover:text-[#E30000] transition-colors disabled:opacity-30 disabled:hover:text-[#737373]">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddExpertCriterion} className="h-[30px] px-3 rounded-[8px] border border-[#393939] text-white text-[10px] font-medium hover:bg-[#242424] transition-colors inline-flex items-center gap-1.5">
              <Plus size={11} /><span>Tambah Kriteria Penjurian</span>
            </button>
            {errors.expertCriteria && <p className="text-[10px] text-[#E30000]">{errors.expertCriteria}</p>}
          </div>

          {/* Pitching */}
          <div className="space-y-3 pt-4 border-t border-[#2E2E2E]" id="pitchingCriteria">
            <div className="flex items-center justify-between pb-1 border-b border-[#303030]">
              <span className="text-[11px] font-bold text-[#A4A4A4] uppercase tracking-wider">Tahap 2: Pitching Final</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#737373]">Bobot Tahap:</span>
                <div className="flex items-center gap-1">
                  <input type="text" inputMode="numeric" value={pitchingWeight} onChange={(e) => handlePitchingWeightChange(e.target.value)}
                    className="h-[30px] w-[60px] bg-white text-black font-bold text-xs rounded-[7px] text-center outline-none" />
                  <span className="text-xs font-bold text-white">%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {pitchingCriteria.map((crit, idx) => (
                <div key={idx} className="bg-[#191919] border border-[#393939] rounded-[9px] p-3 relative flex flex-col gap-2">
                  <input type="text" value={crit.label} onChange={(e) => handlePitchingCriterionChange(idx, "label", e.target.value)} placeholder="Nama Kriteria..."
                    className="h-[31px] bg-[#1F1F1F] border border-[#393939] focus:border-[#E30000] rounded-[8px] px-2.5 text-xs text-white outline-none" />
                  <textarea rows={2} value={crit.description} onChange={(e) => handlePitchingCriterionChange(idx, "description", e.target.value)} placeholder="Deskripsi kriteria penilaian..."
                    className="w-full bg-[#1F1F1F] border border-[#393939] focus:border-[#E30000] rounded-[8px] p-2 text-[10px] text-[#A4A4A4] outline-none resize-none leading-normal" />
                  <button type="button" onClick={() => handleDeletePitchingCriterion(idx)} disabled={pitchingCriteria.length <= 1}
                    className="absolute top-3 right-3 text-[#737373] hover:text-[#E30000] transition-colors disabled:opacity-30 disabled:hover:text-[#737373]">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddPitchingCriterion} className="h-[30px] px-3 rounded-[8px] border border-[#393939] text-white text-[10px] font-medium hover:bg-[#242424] transition-colors inline-flex items-center gap-1.5">
              <Plus size={11} /><span>Tambah Kriteria Pitching</span>
            </button>
            {errors.pitchingCriteria && <p className="text-[10px] text-[#E30000]">{errors.pitchingCriteria}</p>}
          </div>

          {/* Weight Accumulator */}
          <div className="mt-3 p-3 bg-[#191919] border border-[#303030] rounded-[10px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#A4A4A4]">Akumulasi Bobot:</span>
              <span className="text-xs font-bold text-white">Ahli ({expertWeight}%) + Pitching ({pitchingWeight}%) = {totalWeight}%</span>
            </div>
            {isWeightValid ? (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#39D96F]"><CheckCircle2 size={13} /><span>Bobot Valid (100%)</span></div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#E30000]"><AlertCircle size={13} /><span>Total bobot harus tepat 100%</span></div>
            )}
          </div>
          {errors.weight && <p className="text-[10px] text-[#E30000]">{errors.weight}</p>}
        </div>

        <DestructiveArea onOpenCancellation={() => setIsCancelModalOpen(true)} />
      </div>

      <UpdateConfirmationModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onConfirm={handleConfirmUpdate} />
      <CancellationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} challengeTitle={data.name} />
    </div>
  );
}
