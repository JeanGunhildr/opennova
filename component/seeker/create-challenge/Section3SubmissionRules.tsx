"use client";

import { useRef } from "react";
import { Trash2, Plus } from "lucide-react";

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#A4A4A4",
  textTransform: "uppercase",
  letterSpacing: "0.015em",
  marginBottom: "6px",
  display: "block",
};

const CARD_STYLE: React.CSSProperties = {
  background: "#191919",
  border: "1px solid #373737",
  borderRadius: "16px",
  padding: "16px 18px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.30)",
};

const BADGE_STYLE: React.CSSProperties = {
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  border: "1px solid #E30000",
  color: "#E30000",
  fontSize: "11px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const INPUT_STYLE: React.CSSProperties = {
  height: "38px",
  background: "#171717",
  border: "1px solid #373737",
  borderRadius: "8px",
  padding: "0 12px",
  color: "#F7F7F7",
  fontSize: "12px",
  outline: "none",
  width: "100%",
};

export interface ListItem {
  id: string;
  text: string;
}

interface Section3Props {
  rules: ListItem[];
  onRules: (r: ListItem[]) => void;
}

export default function Section3SubmissionRules({
  rules,
  onRules,
}: Section3Props) {
  const newRowRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function addRule() {
    const id = crypto.randomUUID();

    onRules([
      ...rules,
      {
        id,
        text: "",
      },
    ]);

    setTimeout(() => {
      newRowRefs.current[id]?.focus();
    }, 50);
  }

  function removeRule(id: string) {
    if (rules.length <= 1) return;

    onRules(rules.filter((r) => r.id !== id));
  }

  function updateRule(id: string, text: string) {
    onRules(
      rules.map((r) =>
        r.id === id
          ? {
              ...r,
              text,
            }
          : r
      )
    );
  }

  return (
    <div style={CARD_STYLE}>
      {/* Header */}
      <div className="flex items-start gap-[10px] mb-4">
        <div style={BADGE_STYLE}>3</div>

        <div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#F7F7F7",
            }}
          >
            Ketentuan Pengumpulan
          </h3>

          <p
            style={{
              fontSize: "11px",
              color: "#737373",
              marginTop: "3px",
            }}
          >
            Format berkas, dokumen yang wajib dikumpulkan, serta persyaratan
            submission.
          </p>
        </div>
      </div>

      {/* Content */}
      <div>
        <label style={LABEL_STYLE}>Ketentuan Pengumpulan</label>

        <div className="flex flex-col gap-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="grid gap-2 items-center"
              style={{
                gridTemplateColumns: "minmax(0,1fr) 34px",
              }}
            >
              <input
                ref={(el) => {
                  newRowRefs.current[rule.id] = el;
                }}
                type="text"
                name="requirements"
                value={rule.text}
                onChange={(e) =>
                  updateRule(rule.id, e.target.value)
                }
                placeholder="Tuliskan ketentuan..."
                style={INPUT_STYLE}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid #E30000";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(227,0,0,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid #373737";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              <button
                type="button"
                onClick={() => removeRule(rule.id)}
                disabled={rules.length <= 1}
                className="flex items-center justify-center rounded-[8px] transition-colors disabled:opacity-40"
                style={{
                  width: "34px",
                  height: "34px",
                  background: "transparent",
                  border: "1px solid #373737",
                  color: "#737373",
                }}
                onMouseEnter={(e) => {
                  if (rules.length > 1) {
                    e.currentTarget.style.background = "#3B1313";
                    e.currentTarget.style.borderColor = "#E30000";
                    e.currentTarget.style.color = "#E30000";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#373737";
                  e.currentTarget.style.color = "#737373";
                }}
                aria-label="Hapus ketentuan"
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Rule */}
        <button
          type="button"
          onClick={addRule}
          className="mt-2 inline-flex items-center gap-1.5 rounded-[8px] text-[11px] font-semibold transition-colors"
          style={{
            height: "34px",
            padding: "0 11px",
            background: "transparent",
            border: "1px solid #373737",
            color: "#D9D9D9",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#5C5C5C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#373737";
          }}
        >
          <Plus size={13} strokeWidth={2.2} />
          Tambah Ketentuan
        </button>
      </div>
    </div>
  );
}