import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SceneConnector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const plugProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const plugX = interpolate(plugProgress, [0, 1], [680, 520]);

  const clickEffect = spring({
    frame: frame - 38,
    fps,
    config: { damping: 8, mass: 0.3 },
  });

  const clickScale = interpolate(clickEffect, [0, 0.5, 1], [0, 1.3, 1]);
  const clickOpacity = interpolate(frame, [38, 48, 65], [0, 1, 0], {
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12 },
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
          Langkah 1: Hubungkan Kabel JST 4-Pin
        </span>
      </div>

      <svg width="1400" height="600" viewBox="0 0 1400 600" fill="none">
        {/* Base Board (Kiri) */}
        <g id="base-board">
          <rect x="180" y="160" width="340" height="300" rx="20" fill="#15803D" stroke="#166534" strokeWidth="8" />
          <rect x="200" y="180" width="300" height="260" rx="14" fill="#16A34A" />
          <circle cx="210" cy="190" r="10" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="490" cy="190" r="10" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="210" cy="430" r="10" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="490" cy="430" r="10" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="3" />
          <text x="350" y="240" fill="#FFFFFF" fontSize="24" fontWeight="800" textAnchor="middle">
            EDU-BOARD
          </text>
          <text x="350" y="270" fill="#BBF7D0" fontSize="14" fontWeight="700" textAnchor="middle">
            BASE UNIT
          </text>

          {/* Soket JST Asimetris di kanan Base Board */}
          <path
            d="M 470 280 L 520 280 L 520 300 L 515 310 L 515 330 L 520 340 L 520 360 L 470 360 Z"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="4"
          />
          {/* 4 Pin Holes */}
          <rect x="480" y="295" width="8" height="10" rx="2" fill="#334155" />
          <rect x="480" y="312" width="8" height="10" rx="2" fill="#334155" />
          <rect x="480" y="329" width="8" height="10" rx="2" fill="#334155" />
          <rect x="480" y="346" width="8" height="10" rx="2" fill="#334155" />
        </g>

        {/* Kabel 4 Jalur Warna */}
        <g id="jst-wires">
          <path d={`M ${plugX + 70} 300 Q ${plugX + 160} 270 940 300`} stroke="#EF4444" strokeWidth="6" fill="none" />
          <path d={`M ${plugX + 70} 315 Q ${plugX + 160} 295 940 315`} stroke="#3B82F6" strokeWidth="6" fill="none" />
          <path d={`M ${plugX + 70} 330 Q ${plugX + 160} 335 940 330`} stroke="#EAB308" strokeWidth="6" fill="none" />
          <path d={`M ${plugX + 70} 345 Q ${plugX + 160} 360 940 345`} stroke="#1E293B" strokeWidth="6" fill="none" />
        </g>

        {/* Steker JST Asimetris (Bergerak masuk) */}
        <g id="jst-plug" transform={`translate(${plugX}, 0)`}>
          <path
            d="M 5 285 L -50 285 L -50 355 L 5 355 L 10 345 L 10 325 L 5 315 L 5 295 Z"
            fill="#E2E8F0"
            stroke="#64748B"
            strokeWidth="4"
          />
          <rect x="-40" y="292" width="32" height="56" rx="4" fill="#CBD5E1" />
          {/* Pins */}
          <rect x="5" y="297" width="10" height="6" fill="#F59E0B" />
          <rect x="5" y="314" width="10" height="6" fill="#F59E0B" />
          <rect x="5" y="331" width="10" height="6" fill="#F59E0B" />
          <rect x="5" y="348" width="10" height="6" fill="#F59E0B" />
        </g>

        {/* Efek Klik 'KLIK!' visual */}
        {frame >= 38 && (
          <g transform={`translate(525, 320) scale(${clickScale})`} opacity={clickOpacity}>
            <circle cx="0" cy="0" r="36" fill="none" stroke="#F59E0B" strokeWidth="5" strokeDasharray="6 4" />
            <path d="M -25 -25 L -40 -40 M 25 -25 L 40 -40 M -25 25 L -40 40 M 25 25 L 40 40" stroke="#F59E0B" strokeWidth="4" />
            <text x="35" y="-30" fill="#EA580C" fontSize="22" fontWeight="900">
              KLIK!
            </text>
          </g>
        )}

        {/* Modul LED (Kanan) */}
        <g id="led-module">
          <rect x="940" y="190" width="280" height="240" rx="16" fill="#0284C7" stroke="#0369A1" strokeWidth="6" />
          <rect x="955" y="205" width="250" height="210" rx="12" fill="#0EA5E9" />
          <circle cx="965" cy="215" r="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="1195" cy="215" r="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="965" cy="395" r="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="1195" cy="395" r="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />

          {/* LED Bulat Mati */}
          <circle cx="1080" cy="290" r="42" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="5" />
          <circle cx="1080" cy="290" r="32" fill="#CBD5E1" />
          <text x="1080" y="375" fill="#FFFFFF" fontSize="18" fontWeight="700" textAnchor="middle">
            MODUL LED
          </text>
        </g>
      </svg>

      {/* Badge Anti-Terbalik */}
      {frame >= 40 && (
        <div
          style={{
            position: "absolute",
            bottom: 70,
            transform: `scale(${badgeSpring})`,
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
            padding: "12px 30px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 800,
            boxShadow: "0 8px 20px -4px rgba(34, 197, 94, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>✓</span>
          <span>Soket Asimetris: Anti-Terbalik</span>
        </div>
      )}
    </div>
  );
};
