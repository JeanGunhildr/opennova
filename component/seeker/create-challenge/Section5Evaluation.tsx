"use client";
import { Trash2, Plus, Info } from "lucide-react";
import { useRef } from "react";

const CARD_STYLE: React.CSSProperties = { background: "#191919", border: "1px solid #373737", borderRadius: "16px", padding: "16px 18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.30)" };
const BADGE_STYLE: React.CSSProperties = { width: "22px", height: "22px", borderRadius: "50%", border: "1px solid #E30000", color: "#E30000", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

export interface Criterion { id: string; title: string; description: string; }

interface Section5Props {
  expertCriteria: Criterion[];
  expertWeight: number;
  pitchCriteria: Criterion[];
  pitchWeight: number;
  onExpertCriteria: (c: Criterion[]) => void;
  onExpertWeight: (w: number) => void;
  onPitchCriteria: (c: Criterion[]) => void;
  onPitchWeight: (w: number) => void;
}

function CriteriaStage({ label, criteria, weight, onCriteria, onWeight, otherSetter }: {
  label: string; criteria: Criterion[]; weight: number;
  onCriteria: (c: Criterion[]) => void; onWeight: (w: number) => void; otherSetter: (w: number) => void;
}) {
  const newRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function addCriterion() {
    const id = Date.now().toString();
    onCriteria([...criteria, { id, title: "", description: "" }]);
    setTimeout(() => newRefs.current[id]?.focus(), 50);
  }

  function removeCriterion(id: string) {
    if (criteria.length <= 1) return;
    onCriteria(criteria.filter(c => c.id !== id));
  }

  function handleWeightChange(val: string) {
    const n = Math.min(100, Math.max(0, parseInt(val) || 0));
    onWeight(n);
    otherSetter(100 - n);
  }

  const inputBase: React.CSSProperties = { outline: "none", color: "#F7F7F7", background: "#232323", border: "1px solid #373737" };

  return (
    <div>
      <p style={{ fontSize: "10px", fontWeight: 700, color: "#A4A4A4", textTransform: "uppercase", letterSpacing: "0.015em", marginBottom: "8px" }}>{label}</p>
      <div className="flex flex-col gap-2 mb-2">
        {criteria.map(c => (
          <div key={c.id} className="rounded-[9px] p-2 flex flex-col gap-[7px]" style={{ background: "#171717", border: "1px solid #373737" }}>
            <div className="flex items-center gap-2">
              <input ref={el => { newRefs.current[c.id] = el; }} type="text" value={c.title}
                onChange={e => onCriteria(criteria.map(x => x.id === c.id ? { ...x, title: e.target.value } : x))}
                onFocus={e => { (e.target as HTMLInputElement).style.border = "1px solid #E30000"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(227,0,0,0.15)"; }}
                onBlur={e => { (e.target as HTMLInputElement).style.border = "1px solid #373737"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
                placeholder="Judul kriteria..." style={{ ...inputBase, height: "32px", borderRadius: "7px", padding: "0 10px", fontSize: "11px", flex: 1 }} />
              <button type="button" onClick={() => removeCriterion(c.id)} disabled={criteria.length <= 1}
                className="flex-shrink-0 transition-colors disabled:opacity-30"
                style={{ width: "24px", height: "24px", color: "#737373", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => { if (criteria.length > 1) (e.currentTarget as HTMLElement).style.color = "#E30000"; }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#737373"}>
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            </div>
            <textarea value={c.description}
              onChange={e => onCriteria(criteria.map(x => x.id === c.id ? { ...x, description: e.target.value } : x))}
              placeholder="Deskripsi singkat..." rows={2}
              style={{ ...inputBase, borderRadius: "7px", padding: "8px", fontSize: "10px", color: "#A4A4A4", resize: "vertical", border: "none" }} />
          </div>
        ))}
      </div>
      {/* Add + Weight row */}
      <div className="grid items-center gap-2" style={{ gridTemplateColumns: "34px minmax(0,1fr) 60px" }}>
        <button type="button" onClick={addCriterion}
          className="flex items-center justify-center rounded-[8px] transition-colors"
          style={{ width: "34px", height: "34px", background: "transparent", border: "1px solid #373737", color: "#F7F7F7" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#5C5C5C")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#373737")}>
          <Plus size={15} strokeWidth={2.2} />
        </button>
        <p style={{ fontSize: "11px", color: "#737373" }}>Tambah kriteria</p>
        <div className="flex items-center rounded-[8px] overflow-hidden" style={{ height: "34px", background: "#F7F7F7" }}>
          <input type="number" value={weight} min={0} max={100}
            onChange={e => handleWeightChange(e.target.value)}
            style={{ height: "34px", background: "#F7F7F7", border: "none", outline: "none", color: "#171717", fontSize: "12px", fontWeight: 600, width: "38px", textAlign: "center", padding: 0 }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#5C5C5C", paddingRight: "8px" }}>%</span>
        </div>
      </div>
    </div>
  );
}

export default function Section5Evaluation({ expertCriteria, expertWeight, pitchCriteria, pitchWeight, onExpertCriteria, onExpertWeight, onPitchCriteria, onPitchWeight }: Section5Props) {
  const totalValid = expertWeight + pitchWeight === 100;
  return (
    <div style={CARD_STYLE}>
      <div className="flex items-start gap-[10px] mb-4">
        <div style={BADGE_STYLE}>5</div>
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#F7F7F7" }}>Kriteria Penilaian</h3>
          <p style={{ fontSize: "11px", color: "#737373", marginTop: "3px" }}>Poin penilaian dalam tahap Penjurian Ahli dan Pitching Final.</p>
        </div>
      </div>

      {/* Info callout */}
      <div className="flex gap-2 rounded-[8px] p-[10px] mb-4" style={{ background: "#17223D", border: "1px solid rgba(138,168,255,0.45)" }}>
        <Info size={14} strokeWidth={2} style={{ color: "#8AA8FF", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "10px", lineHeight: "1.45", color: "#BDBDBD" }}>
          Total bobot dua tahap penilaian harus berjumlah 100%. Mengubah bobot satu tahap akan otomatis memperbarui tahap lainnya.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <CriteriaStage label="Penjurian Ahli" criteria={expertCriteria} weight={expertWeight}
          onCriteria={onExpertCriteria} onWeight={onExpertWeight} otherSetter={onPitchWeight} />
        <CriteriaStage label="Pitching Final" criteria={pitchCriteria} weight={pitchWeight}
          onCriteria={onPitchCriteria} onWeight={onPitchWeight} otherSetter={onExpertWeight} />
      </div>

      {!totalValid && (
        <p className="mt-3 text-[11px]" style={{ color: "#E30000" }}>Total bobot harus 100%. Saat ini: {expertWeight + pitchWeight}%.</p>
      )}
    </div>
  );
}