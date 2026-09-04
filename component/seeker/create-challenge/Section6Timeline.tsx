"use client";

import { ArrowRight } from "lucide-react";

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

const DATE_STYLE: React.CSSProperties = {
  height: "34px",
  background: "#171717",
  border: "1px solid #373737",
  borderRadius: "8px",
  padding: "0 8px",
  fontSize: "11px",
  color: "#ECECEC",
  outline: "none",
  width: "100%",
  textAlign: "center",
};

export interface TimelineData {
  openStart: string;
  openEnd: string;

  expertStart: string;
  expertEnd: string;

  pitchStart: string;
  pitchEnd: string;

  announcement: string;
}

interface Section6Props {
  timeline: TimelineData;
  onTimeline: (t: TimelineData) => void;
}

function focusBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.border = "1px solid #E30000";
  e.target.style.boxShadow = "0 0 0 2px rgba(227,0,0,0.15)";
}

function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.border = "1px solid #373737";
  e.target.style.boxShadow = "none";
}

export default function Section6Timeline({
  timeline,
  onTimeline,
}: Section6Props) {
  function update(field: keyof TimelineData, val: string) {
    onTimeline({
      ...timeline,
      [field]: val,
    });
  }

  const STAGES = [
    {
      label: "CHALLENGE DIBUKA",
      startKey: "openStart" as const,
      endKey: "openEnd" as const,
      startName: "open_start",
      endName: "open_end",
      single: false,
    },
    {
      label: "PENJURIAN AHLI",
      startKey: "expertStart" as const,
      endKey: "expertEnd" as const,
      startName: "expert_start",
      endName: "expert_end",
      single: false,
    },
    {
      label: "PITCHING FINAL",
      startKey: "pitchStart" as const,
      endKey: "pitchEnd" as const,
      startName: "pitch_start",
      endName: "pitch_end",
      single: false,
    },
    {
      label: "PENGUMUMAN PEMENANG",
      startKey: "announcement" as const,
      endKey: null,
      startName: "announcement",
      endName: null,
      single: true,
    },
  ];

  return (
    <div style={CARD_STYLE}>
      <div className="flex items-start gap-[10px] mb-4">
        <div style={BADGE_STYLE}>6</div>

        <div>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#F7F7F7",
            }}
          >
            Linimasa Challenge
          </h3>

          <p
            style={{
              fontSize: "11px",
              color: "#737373",
              marginTop: "3px",
            }}
          >
            Jadwal tahapan Challenge mulai pembukaan hingga pengumuman
            pemenang.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {STAGES.map((stage) => (
          <div key={stage.label}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#A4A4A4",
                textTransform: "uppercase",
                letterSpacing: "0.015em",
                marginBottom: "7px",
              }}
            >
              {stage.label}
            </p>

            {stage.single ? (
              <input
                type="date"
                name={stage.startName}
                value={timeline[stage.startKey]}
                onChange={(e) =>
                  update(stage.startKey, e.target.value)
                }
                onFocus={focusBorder}
                onBlur={blurBorder}
                style={DATE_STYLE}
              />
            ) : (
              <div
                className="grid items-center gap-2"
                style={{
                  gridTemplateColumns: "1fr 18px 1fr",
                }}
              >
                <input
                  type="date"
                  name={stage.startName}
                  value={timeline[stage.startKey]}
                  onChange={(e) =>
                    update(stage.startKey, e.target.value)
                  }
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  style={DATE_STYLE}
                />

                <div className="flex justify-center">
                  <ArrowRight
                    size={14}
                    strokeWidth={2}
                    style={{ color: "#E30000" }}
                  />
                </div>

                <input
                  type="date"
                  name={stage.endName ?? undefined}
                  value={
                    stage.endKey
                      ? timeline[stage.endKey]
                      : ""
                  }
                  onChange={(e) => {
                    if (stage.endKey) {
                      update(stage.endKey, e.target.value);
                    }
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  style={DATE_STYLE}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
