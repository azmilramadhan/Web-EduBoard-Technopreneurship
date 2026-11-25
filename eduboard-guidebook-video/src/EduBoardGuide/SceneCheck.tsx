import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SceneCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Finger animation
  const fingerSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  const fingerY = interpolate(fingerSpring, [0, 0.7, 1], [-120, 20, 0]);

  // Button press depth
  const buttonPress = interpolate(frame, [22, 27, 45, 52], [0, 5, 5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Aman LED activation
  const ledTurnOn = interpolate(frame, [27, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = frame >= 34 ? Math.sin((frame - 34) * 0.3) * 6 + 18 : 0;

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
          Langkah 2: Tekan Tombol CHECK untuk Pre-Flight Test
        </span>
      </div>

      <svg width="1200" height="650" viewBox="0 0 1200 650" fill="none">
        {/* PCB Board Fokus */}
        <rect x="250" y="140" width="700" height="420" rx="24" fill="#15803D" stroke="#166534" strokeWidth="10" />
        <rect x="280" y="170" width="640" height="360" rx="18" fill="#16A34A" />

        {/* Jalur Tembaga PCB */}
        <path d="M 450 350 L 550 350 L 550 280 L 730 280" stroke="#86EFAC" strokeWidth="5" fill="none" opacity="0.6" />
        <path d="M 450 380 L 620 380 L 620 440 L 730 440" stroke="#86EFAC" strokeWidth="5" fill="none" opacity="0.6" />

        {/* Tombol CHECK */}
        <g id="check-button" transform={`translate(450, ${350 + buttonPress})`}>
          <rect x="-60" y="-60" width="120" height="120" rx="20" fill="#334155" stroke="#1E293B" strokeWidth="6" />
          <circle cx="0" cy="0" r="42" fill="#0F172A" stroke="#475569" strokeWidth="4" />
          <text x="0" y="8" fill="#FFFFFF" fontSize="18" fontWeight="800" textAnchor="middle">
            CHECK
          </text>
        </g>
        <text x="450" y="445" fill="#DCFCE7" fontSize="16" fontWeight="700" textAnchor="middle">
          TEST KEAMANAN
        </text>

        {/* Indikator LED AMAN */}
        <g id="led-aman" transform="translate(750, 350)">
          {/* Efek Glow */}
          {ledTurnOn > 0 && (
            <circle
              cx="0"
              cy="0"
              r={38 + glowPulse}
              fill="#22C55E"
              opacity={0.35 * ledTurnOn}
            />
          )}

          <circle
            cx="0"
            cy="0"
            r="36"
            fill={ledTurnOn > 0.5 ? "#22C55E" : "#14532D"}
            stroke={ledTurnOn > 0.5 ? "#4ADE80" : "#166534"}
            strokeWidth="6"
          />
          <circle
            cx="-10"
            cy="-10"
            r="10"
            fill="#FFFFFF"
            opacity={ledTurnOn > 0.5 ? 0.6 : 0.15}
          />

          <text x="0" y="65" fill="#FFFFFF" fontSize="22" fontWeight="800" textAnchor="middle">
            INDIKATOR
          </text>
          <text
            x="0"
            y="95"
            fill={ledTurnOn > 0.5 ? "#22C55E" : "#94A3B8"}
            fontSize="26"
            fontWeight="900"
            textAnchor="middle"
          >
            {ledTurnOn > 0.5 ? "✓ AMAN" : "STANDBY"}
          </text>
        </g>

        {/* Jari menekan tombol */}
        <g id="finger-indicator" transform={`translate(450, ${280 + fingerY})`}>
          <path
            d="M -25 -100 C -25 -120 25 -120 25 -100 L 25 -30 C 25 -10 15 0 0 0 C -15 0 -25 -10 -25 -30 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="5"
          />
          <ellipse cx="0" cy="-20" rx="14" ry="10" fill="#FDE68A" />
        </g>
      </svg>

      {/* Pop-up Status Aman */}
      {frame >= 35 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            backgroundColor: "#DCFCE7",
            border: "2px solid #22C55E",
            color: "#166534",
            padding: "12px 32px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 800,
            boxShadow: "0 8px 20px -5px rgba(34, 197, 94, 0.3)",
          }}
        >
          Sirkuit Terproteksi: Tidak Ada Hubungan Singkat
        </div>
      )}
    </div>
  );
};
