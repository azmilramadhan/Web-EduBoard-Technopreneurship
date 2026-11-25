import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SceneFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dot flow progress (dots flowing from board to LED)
  const flowOffset = frame * 4;

  // LED yellow glow
  const ledOn = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = ledOn > 0 ? Math.sin(frame * 0.25) * 8 + 24 : 0;

  // Success banner
  const bannerSpring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Montserrat, sans-serif",
      }}
    >
      {/* Kartu Instruksi */}
      <div
        style={{
          position: "absolute",
          top: 60,
          backgroundColor: "#FFFFFF",
          padding: "16px 36px",
          borderRadius: 20,
          border: "2px solid #E2E8F0",
          boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700, color: "#1E293B" }}>
          Langkah 3: Aliran Arus &amp; Hasil LED
        </span>
      </div>

      <svg width="1400" height="550" viewBox="0 0 1400 550" fill="none">
        {/* Base Board */}
        <g id="base-board-flow">
          <rect x="80" y="140" width="300" height="260" rx="20" fill="#15803D" stroke="#166534" strokeWidth="8" />
          <rect x="100" y="160" width="260" height="220" rx="14" fill="#16A34A" />
          <text x="230" y="250" fill="#FFFFFF" fontSize="22" fontWeight="800" textAnchor="middle">
            EDU-BOARD
          </text>
          <text x="230" y="280" fill="#BBF7D0" fontSize="14" fontWeight="700" textAnchor="middle">
            BASE UNIT
          </text>

          {/* GREEN LED Indicator on board */}
          <circle cx="230" cy="320" r="16" fill="#22C55E" stroke="#4ADE80" strokeWidth="4">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <text x="230" y="360" fill="#DCFCE7" fontSize="11" fontWeight="700" textAnchor="middle">
            AMAN ✓
          </text>
        </g>

        {/* Animated current-flow dots */}
        <g id="current-flow-path">
          <path
            id="flow-line"
            d="M 380 270 C 580 220 800 320 940 270"
            stroke="#E2E8F0"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const baseOffset = ((flowOffset + i * 60) % 600) / 600;
            const dotOpacity = interpolate(frame, [0, 15], [0, 1], {
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={interpolate(baseOffset, [0, 0.5, 1], [380, 660, 940])}
                cy={interpolate(baseOffset, [0, 0.25, 0.5, 0.75, 1], [270, 240, 260, 290, 270])}
                r="7"
                fill="#FBBF24"
                opacity={dotOpacity * interpolate(baseOffset, [0.9, 1], [1, 0], { extrapolateLeft: "clamp" })}
              />
            );
          })}

          {/* Direction arrows */}
          <polygon points="650,240 670,250 650,260" fill="#94A3B8" opacity="0.6" />
          <polygon points="830,255 850,265 830,275" fill="#94A3B8" opacity="0.6" />

          {/* Label */}
          <text x="660" y="210" fill="#64748B" fontSize="15" fontWeight="700" textAnchor="middle">
            ⚡ ALIRAN ARUS
          </text>
        </g>

        {/* Modul LED (Kanan) */}
        <g id="led-module-result">
          <rect x="940" y="140" width="300" height="300" rx="20" fill="#0284C7" stroke="#0369A1" strokeWidth="8" />
          <rect x="960" y="160" width="260" height="260" rx="14" fill="#0EA5E9" />

          {/* LED Bulat */}
          {ledOn > 0 && (
            <circle
              cx="1090"
              cy="260"
              r={50 + glowPulse}
              fill="#FBBF24"
              opacity={0.35 * ledOn}
            />
          )}
          <circle
            cx="1090"
            cy="260"
            r="48"
            fill={ledOn > 0.5 ? "#FBBF24" : "#E2E8F0"}
            stroke={ledOn > 0.5 ? "#F59E0B" : "#94A3B8"}
            strokeWidth="6"
          />
          {ledOn > 0.5 && (
            <>
              <circle cx="1075" cy="246" r="12" fill="#FDE68A" opacity="0.7" />
              <path d="M 1070 234 L 1065 220 M 1058 244 L 1044 240 M 1075 230 L 1072 216" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </>
          )}

          <text x="1090" y="345" fill="#FFFFFF" fontSize="20" fontWeight="800" textAnchor="middle">
            MODUL LED
          </text>
          <text x="1090" y="375" fill="#BAE6FD" fontSize="16" fontWeight="700" textAnchor="middle">
            {ledOn > 0.5 ? "🟡 MENYALA" : "STANDBY"}
          </text>
        </g>
      </svg>

      {/* Banner Sukses */}
      {frame >= 48 && (
        <div
          style={{
            position: "absolute",
            bottom: 55,
            transform: `scale(${bannerSpring})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              backgroundColor: "#22C55E",
              color: "#FFFFFF",
              padding: "14px 46px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 900,
              boxShadow: "0 12px 30px -5px rgba(34, 197, 94, 0.5)",
            }}
          >
            ✓ Rangkaian Aman &amp; Berhasil!
          </div>
          <span style={{ fontSize: 16, color: "#64748B", fontWeight: 600 }}>
            Misi 1 Selesai — Lanjut ke Misi 2
          </span>
        </div>
      )}
    </div>
  );
};
