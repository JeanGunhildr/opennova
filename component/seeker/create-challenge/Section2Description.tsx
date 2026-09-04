"use client";

import { useCallback, useRef } from "react";
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

interface Section2Props {
  about: string;
  innovationGoals: ListItem[];
  onAbout: (v: string) => void;
  onGoals: (g: ListItem[]) => void;
}

function focusStyle(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  e.currentTarget.style.border = "1px solid #E30000";
  e.currentTarget.style.boxShadow =
    "0 0 0 2px rgba(227,0,0,0.15)";
}

function blurStyle(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  e.currentTarget.style.border = "1px solid #373737";
  e.currentTarget.style.boxShadow = "none";
}

export default function Section2Description({
  about,
  innovationGoals,
  onAbout,
  onGoals,
}: Section2Props) {
  const newRowRefs = useRef<
    Record<string, HTMLInputElement | null>
  >({});

  function addGoal() {
    const id = Date.now().toString();

    onGoals([
      ...innovationGoals,
      {
        id,
        text: "",
      },
    ]);

    setTimeout(() => {
      newRowRefs.current[id]?.focus();
    }, 50);
  }

  function removeGoal(id: string) {
    // Minimal 1 tujuan
    if (innovationGoals.length <= 1) return;

    onGoals(
      innovationGoals.filter((goal) => goal.id !== id),
    );
  }

  function updateGoal(id: string, text: string) {
    onGoals(
      innovationGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              text,
            }
          : goal,
      ),
    );
  }

  return (
    <div style={CARD_STYLE}>
      {/* Section Header */}
      <div className="flex items-start gap-[10px] mb-4">
        <div style={BADGE_STYLE}>2</div>

        <div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#F7F7F7",
            }}
          >
            Deskripsi Challenge
          </h3>

          <p
            style={{
              fontSize: "11px",
              color: "#737373",
              marginTop: "3px",
            }}
          >
            Permasalahan utama serta tujuan inovasi yang
            menjadi fokus Challenge ini.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Tentang Challenge */}
        <div>
          <label style={LABEL_STYLE}>
            Tentang Challenge
          </label>

          <div className="relative">
            <textarea
              name="description"
              value={about}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  onAbout(e.target.value);
                }
              }}
              onFocus={focusStyle}
              onBlur={blurStyle}
              placeholder="Jelaskan permasalahan yang ingin diselesaikan..."
              style={{
                minHeight: "112px",
                width: "100%",
                background: "#171717",
                border: "1px solid #373737",
                borderRadius: "10px",
                padding: "12px",
                color: "#F7F7F7",
                fontSize: "12px",
                lineHeight: "1.5",
                resize: "vertical",
                outline: "none",
              }}
            />

            <p
              className="text-right mt-1"
              style={{
                fontSize: "10px",
                color:
                  about.length >= 950
                    ? "#E30000"
                    : "#737373",
              }}
            >
              {about.length}/1000
            </p>
          </div>
        </div>

        {/* Tujuan Inovasi */}
        <div>
          <label style={LABEL_STYLE}>
            Tujuan Inovasi
          </label>

          <div className="flex flex-col gap-2">
            {innovationGoals.map((goal) => (
              <div
                key={goal.id}
                className="grid gap-2 items-center"
                style={{
                  gridTemplateColumns:
                    "minmax(0,1fr) 34px",
                }}
              >
                <input
                  ref={(el) => {
                    newRowRefs.current[goal.id] = el;
                  }}
                  type="text"
                  name="objectives"
                  value={goal.text}
                  onChange={(e) =>
                    updateGoal(
                      goal.id,
                      e.target.value,
                    )
                  }
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="Tuliskan tujuan inovasi..."
                  style={INPUT_STYLE}
                />

                <button
                  type="button"
                  onClick={() =>
                    removeGoal(goal.id)
                  }
                  disabled={innovationGoals.length <= 1}
                  className="flex items-center justify-center rounded-[8px] transition-colors disabled:opacity-40"
                  style={{
                    width: "34px",
                    height: "34px",
                    background: "transparent",
                    border: "1px solid #373737",
                    color: "#737373",
                  }}
                  onMouseEnter={(e) => {
                    if (innovationGoals.length > 1) {
                      e.currentTarget.style.background =
                        "#3B1313";
                      e.currentTarget.style.borderColor =
                        "#E30000";
                      e.currentTarget.style.color =
                        "#E30000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "transparent";
                    e.currentTarget.style.borderColor =
                      "#373737";
                    e.currentTarget.style.color =
                      "#737373";
                  }}
                >
                  <Trash2
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Tambah Tujuan */}
          <button
            type="button"
            onClick={addGoal}
            className="mt-2 inline-flex items-center gap-1.5 rounded-[8px] text-[11px] font-semibold transition-colors"
            style={{
              height: "34px",
              padding: "0 11px",
              background: "transparent",
              border: "1px solid #373737",
              color: "#D9D9D9",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "#5C5C5C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "#373737";
            }}
          >
            <Plus size={13} strokeWidth={2.2} />
            Tambah Tujuan
          </button>
        </div>
      </div>
    </div>
  );
}