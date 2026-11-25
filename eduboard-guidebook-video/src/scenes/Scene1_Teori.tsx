import React from "react";
import { Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LdrModuleSVG } from "../components/LdrModuleSVG";

// Scene 1 — 450 frame @ 30fps = 15 detik
// Teori LDR: wujud fisik + skematik + grafik hambatan interaktif
export const Scene1_Teori: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Intro Bumper (frames 0-65) ---
  const introSpring = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const introOpacity = interpolate(frame, [45, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Title entrance (smooth spring damping 14, stiffness 90, mass 0.9) ---
  const titleSpring = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const titleY = interpolate(titleSpring, [0, 1], [-70, 0]);

  // --- Sun/Moon cycle with smooth cubic bezier Easing ---
  const sunX = interpolate(frame, [30, 180], [-100, 330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const sunOpacity = interpolate(frame, [180, 220, 350, 390], [1, 0, 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moonOpacity = interpolate(frame, [220, 260, 380, 420], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moonX = interpolate(frame, [220, 380], [-80, 330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- lightLevel fed to LdrModuleSVG (smooth ease) ---
  const lightLevel = interpolate(frame, [60, 170, 240, 350], [0.95, 0.95, 0.05, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Micro-floating effect (±4px smooth hover) ---
  const floatY = Math.sin(frame / 18) * 4;
  const sunPulse = 1 + Math.sin(frame / 20) * 0.08;

  // --- Resistance bar (inverse of light) ---
  const resistancePercent = Math.round((1 - lightLevel) * 100);
  const isLight = lightLevel > 0.5;

  // --- Bar / meter ---
  const barHeight = interpolate(lightLevel, [0, 1], [160, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const barColor = isLight ? "#22C55E" : "#EF4444";

  // --- Status text fade ---
  const statusOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- LDR card entrance (spring damping 14, stiffness 90, mass 0.9) ---
  const ldrCardSpring = spring({ frame: frame - 55, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const ldrCardX = interpolate(ldrCardSpring, [0, 1], [-80, 0]);

  // --- Schematic entrance ---
  const schematicSpring = spring({ frame: frame - 65, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const schematicOpacity = schematicSpring;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Contextual Warm Gradient Background with Technical Dot Grid & Pulsing Sun Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)",
          zIndex: 0,
        }}
      >
        {/* Technical Dot Grid Pattern */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }}>
          <defs>
            <pattern id="s1-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" fill="#D97706" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s1-dots)" />
        </svg>

        {/* Pulsing Sun Glow Orb in the background */}
        <div
          style={{
            position: "absolute",
            right: "12%",
            top: "16%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(253, 230, 138, 0.15) 55%, transparent 70%)",
            transform: `scale(${sunPulse})`,
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Audio VO */}
      <Audio src={staticFile("audio/vo-scene1.mp3")} />

      {/* SFX: Whoosh saat panel judul dan kartu LDR muncul */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={55}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>

      {/* ===== INTRO BUMPER WITH TAGLINE (Frames 0 - 60) ===== */}
      {introOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: introOpacity,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "3px solid rgba(56, 189, 248, 0.4)",
              borderRadius: 36,
              padding: "48px 80px",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
              transform: `scale(${introSpring})`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#0284C7",
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 3,
                padding: "8px 24px",
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              ⚡ EDU-BOARD STEM SERIES
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1,
                lineHeight: 1.2,
              }}
            >
              MISI 2: SENSOR CAHAYA (LDR)
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#38BDF8",
                marginTop: 18,
                letterSpacing: 0.5,
              }}
            >
              Belajar Elektronika Semudah Pasang Balok! 🧩
            </div>
          </div>
        </div>
      )}

      {/* Top Title */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            padding: "12px 48px",
            borderRadius: 999,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 1,
            boxShadow: "0 8px 24px rgba(15,23,42,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              backgroundColor: "#0284C7",
              borderRadius: 999,
              padding: "4px 20px",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            MISI 2
          </span>
          Sensor Cahaya (LDR)
        </div>
      </div>

      {/* ===== LEFT PANEL: LDR + Schematic (Safe Bottom 125px + Micro-Floating) ===== */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 110,
          width: 580,
          bottom: 125,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          transform: `translateX(${ldrCardX}px) translateY(${floatY}px)`,
        }}
      >
        {/* LDR Module card */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            borderRadius: 24,
            border: "2px solid #E2E8F0",
            padding: 22,
            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
            flex: 1.1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: 18, fontWeight: 800, color: "#475569", letterSpacing: 2, marginBottom: 8 }}
          >
            WUJUD FISIK MODUL
          </span>
          <div style={{ width: "100%", flex: 1 }}>
            <LdrModuleSVG lightLevel={lightLevel} />
          </div>
        </div>

        {/* Schematic Symbol */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            borderRadius: 24,
            border: "2px solid #E2E8F0",
            padding: 20,
            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
            opacity: schematicOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 800, color: "#475569", letterSpacing: 2, marginBottom: 8 }}>
            SIMBOL SKEMATIK
          </span>
          <svg viewBox="0 0 320 120" width="340" height="115" fill="none">
            {/* Wire left */}
            <line x1="0" y1="60" x2="60" y2="60" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            {/* Resistor box */}
            <rect x="60" y="38" width="130" height="44" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="4" />
            {/* Zig-zag inside */}
            <path d="M 75 60 L 90 46 L 108 74 L 126 46 L 144 74 L 162 60" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Wire right */}
            <line x1="190" y1="60" x2="260" y2="60" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            {/* Light arrows */}
            <line x1="220" y1="20" x2="240" y2="40" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            <line x1="240" y1="10" x2="260" y2="30" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            {/* Label */}
            <text x="125" y="105" fill="#B45309" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="system-ui">
              LDR (Light Dependent Resistor)
            </text>
          </svg>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Animated Sun/Moon + Resistance Meter (Safe Bottom 125px + Micro-Floating) ===== */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 110,
          width: 650,
          bottom: 125,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          transform: `translateY(${-floatY}px)`,
        }}
      >
        {/* Sun/Moon Animation Area */}
        <div
          style={{
            backgroundColor: isLight ? "#FEF9C3" : "#1E293B",
            borderRadius: 24,
            border: `2.5px solid ${isLight ? "#FDE68A" : "#334155"}`,
            flex: 1,
            position: "relative",
            overflow: "hidden",
            transition: "background-color 0.2s",
            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
          }}
        >
          {/* Stars background (moon mode) */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                left: `${(i * 83) % 100}%`,
                top: `${(i * 57 + 10) % 80}%`,
                opacity: moonOpacity * (0.4 + (i % 3) * 0.2),
              }}
            />
          ))}

          {/* Sun */}
          <div
            style={{
              position: "absolute",
              left: sunX,
              top: "50%",
              transform: "translate(-50%, -50%)",
              opacity: sunOpacity,
              fontSize: 90,
              filter: "drop-shadow(0 0 28px #FDE68A)",
              lineHeight: 1,
            }}
          >
            ☀️
          </div>

          {/* Moon */}
          <div
            style={{
              position: "absolute",
              left: moonX,
              top: "50%",
              transform: "translate(-50%, -50%)",
              opacity: moonOpacity,
              fontSize: 82,
              filter: "drop-shadow(0 0 22px #CBD5E1)",
              lineHeight: 1,
            }}
          >
            🌙
          </div>

          {/* Status Label (Enlarged for Mobile) */}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: statusOpacity,
              backgroundColor: isLight ? "#15803D" : "#7C3AED",
              color: "#FFFFFF",
              borderRadius: 999,
              padding: "10px 30px",
              fontSize: 23,
              fontWeight: 900,
              whiteSpace: "nowrap",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            }}
          >
            {isLight ? "🌤 TERANG → Hambatan Kecil → Arus Mengalir" : "🌙 GELAP → Hambatan Besar → Arus Tertahan"}
          </div>
        </div>

        {/* Resistance Meter Card */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            borderRadius: 24,
            border: "2px solid #E2E8F0",
            padding: "22px 32px",
            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#475569", letterSpacing: 2, marginBottom: 8 }}>
              HAMBATAN LDR
            </div>
            {/* Bar container */}
            <div
              style={{
                height: 38,
                backgroundColor: "#F1F5F9",
                borderRadius: 20,
                overflow: "hidden",
                border: "2.5px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${resistancePercent}%`,
                  backgroundColor: barColor,
                  borderRadius: 18,
                  transition: "width 0.15s, background-color 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 12,
                }}
              >
                <span style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 900 }}>
                  {resistancePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Vertical mini-meter */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#475569" }}>HAMBATAN</span>
            <div
              style={{
                width: 26,
                height: 170,
                backgroundColor: "#F1F5F9",
                borderRadius: 14,
                border: "2px solid #E2E8F0",
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: barHeight,
                  backgroundColor: barColor,
                  borderRadius: 10,
                  transition: "height 0.15s, background-color 0.3s",
                }}
              />
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#64748B" }}>Ω</div>
          </div>

          {/* Summary pill */}
          <div
            style={{
              backgroundColor: isLight ? "#DCFCE7" : "#EDE9FE",
              border: `2.5px solid ${isLight ? "#22C55E" : "#7C3AED"}`,
              borderRadius: 22,
              padding: "14px 22px",
              minWidth: 160,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900, color: isLight ? "#15803D" : "#5B21B6" }}>
              {isLight ? "↓ Kecil" : "↑ Besar"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#475569", marginTop: 4 }}>
              {isLight ? "Cahaya Tinggi" : "Cahaya Rendah"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
