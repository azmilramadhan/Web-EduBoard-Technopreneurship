import React from "react";
import { Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BaseBoardSVG } from "../components/BaseBoardSVG";
import { LdrModuleSVG } from "../components/LdrModuleSVG";
import { LedModuleSVG } from "../components/LedModuleSVG";

// Scene 3 — 420 frame @ 30fps = 14 detik
// Uji Coba: Rangkaian menyala hijau (status safe).
// Siluet tangan menutupi LDR -> bayangan gelap -> lightLevel turun -> arus mengalir ke LED -> LED menyala.
// Teks status: 'GELAP = LAMPU NYALA'.
// Tangan menjauh -> cahaya masuk kembali -> LED padam ('TERANG = LAMPU PADAM').
export const Scene3_UjiCoba: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Title entrance (spring damping 14, stiffness 90, mass 0.9) ---
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const titleY = interpolate(titleSpring, [0, 1], [-60, 0]);

  // --- Dynamic Lighting / Darkness Transition ---
  // When hand covers LDR, darkProgress ramps from 0 (terang) to 1 (gelap)
  const darkProgress = interpolate(frame, [65, 100, 240, 275], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Hand movement over LDR with smooth cubic bezier Easing ---
  // Cycle: Hand arrives (frames 40->90), stays (90->240), moves away (240->290)
  const handX = interpolate(frame, [40, 90, 240, 290], [1400, 985, 985, 1400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const handY = interpolate(frame, [40, 90, 240, 290], [60, 240, 240, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const handOpacity = interpolate(frame, [30, 45, 290, 310], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Shadow darkness on LDR (smooth bezier) ---
  const shadowOpacity = interpolate(frame, [70, 100, 240, 270], [0, 0.75, 0.75, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Light level for LDR module ---
  const lightLevel = interpolate(frame, [70, 100, 240, 270], [1, 0.05, 0.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Is covered (Dark condition) ---
  const isDark = frame >= 95 && frame <= 250;

  // --- Current dots animation offset ---
  const flowOffset = frame * 6;

  // --- Micro-floating effect (±4px smooth hover) ---
  const floatLdr = Math.sin(frame / 18) * 4;
  const floatLed = Math.cos(frame / 18) * 4;

  // --- Status banner spring (damping 14, stiffness 90, mass 0.9) ---
  const statusSpring = spring({
    frame: isDark ? frame - 95 : frame - 250,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });

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
      {/* ===== DYNAMIC BACKGROUND (Cerah Hangat -> Gelap Gulita saat LDR Ditutup) ===== */}
      {/* 1. Bright Layer (Terang: #FFFBEB -> #FEF9C3) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)",
          opacity: 1 - darkProgress,
          zIndex: 0,
        }}
      >
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
          <defs>
            <pattern id="s3-light-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#F59E0B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s3-light-grid)" />
        </svg>
      </div>

      {/* 2. Dark Layer (Gelap: #0F172A -> #1E293B + Radiant Glow dari LED) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #0B0F19 0%, #0F172A 50%, #1E293B 100%)",
          opacity: darkProgress,
          zIndex: 0,
        }}
      >
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
          <defs>
            <pattern id="s3-dark-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#38BDF8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s3-dark-grid)" />
        </svg>

        {/* Dynamic Yellow Ambient Radiation from LED Module when illuminated */}
        <div
          style={{
            position: "absolute",
            left: 800,
            top: 400,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(250, 204, 21, 0.4) 0%, rgba(245, 158, 11, 0.18) 40%, transparent 70%)",
            filter: "blur(32px)",
            pointerEvents: "none",
            transform: `scale(${1 + Math.sin(frame / 14) * 0.05})`,
          }}
        />
      </div>

      <Audio src={staticFile("audio/vo-scene3.mp3")} />

      {/* SFX: Whoosh saat panel judul & status banner muncul */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={95}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>

      {/* SFX: Electric flow saat garis titik arus mulai mengalir ke modul LED (isDark: frame 95) */}
      <Sequence from={95}>
        <Audio src={staticFile("audio/sfx-electric-flow.wav")} volume={0.7} />
      </Sequence>

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
              backgroundColor: "#F59E0B",
              borderRadius: 999,
              padding: "4px 20px",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            LANGKAH 3
          </span>
          Uji Coba Sensor &amp; Logika Otomatis
        </div>
      </div>

      {/* ===== Base Board (Tengah-Kiri, status safe, Scale Up for Mobile) ===== */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 135,
          width: 660,
          height: 460,
        }}
      >
        <BaseBoardSVG status="safe" isCheckPressed={false} />
      </div>

      {/* ===== LDR Module (Kanan Atas, Scale Up for Mobile + Micro-Floating) ===== */}
      <div
        style={{
          position: "absolute",
          left: 840,
          top: 100,
          width: 290,
          height: 330,
          transform: `translateY(${floatLdr}px)`,
        }}
      >
        <LdrModuleSVG lightLevel={lightLevel} />

        {/* Shadow Overlay over LDR surface when hand covers */}
        {shadowOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 30,
              right: 30,
              bottom: 30,
              backgroundColor: "#0F172A",
              opacity: shadowOpacity,
              borderRadius: 20,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#F8FAFC",
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 1,
                opacity: 0.95,
              }}
            >
              🌑 GELAP
            </span>
          </div>
        )}
      </div>

      {/* ===== LED Module (Kanan Bawah, Scale Up for Mobile + Micro-Floating) ===== */}
      <div
        style={{
          position: "absolute",
          left: 840,
          top: 420,
          width: 290,
          height: 330,
          transform: `translateY(${floatLed}px)`,
        }}
      >
        <LedModuleSVG isOn={isDark} />
      </div>

      {/* ===== SVG Current Flow: BaseBoard -> LED Module (when dark) ===== */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 1920 1080"
        fill="none"
      >
        {/* Permanent connection wires */}
        {/* BaseBoard to LDR */}
        <path d="M 640 310 C 740 310, 780 250, 840 250" stroke="#94A3B8" strokeWidth="5" strokeDasharray="8 6" />
        {/* BaseBoard to LED */}
        <path d="M 640 460 C 740 460, 780 550, 840 550" stroke="#94A3B8" strokeWidth="5" strokeDasharray="8 6" />

        {/* Dynamic Electric Current Dots (active when dark) */}
        {isDark && (
          <g>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const t = ((flowOffset + i * 50) % 400) / 400;
              // Bezier interpolation from (640, 460) to (840, 550)
              const cx = 640 + (840 - 640) * t;
              const cy = 460 + (550 - 460) * Math.sin((t * Math.PI) / 2);
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="8"
                  fill="#FACC15"
                  filter="drop-shadow(0 0 10px #FACC15)"
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* ===== Animated Silhouette Hand ===== */}
      {handOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: handX,
            top: handY,
            transform: "translate(-50%, -50%)",
            opacity: handOpacity,
            fontSize: 140,
            filter: "drop-shadow(0 16px 28px rgba(15,23,42,0.45))",
            pointerEvents: "none",
            zIndex: 35,
            userSelect: "none",
          }}
        >
          ✋
        </div>
      )}

      {/* ===== Status Banner (Safe Bottom 115px - No Subtitle Collision) ===== */}
      <div
        style={{
          position: "absolute",
          bottom: 115,
          left: "50%",
          transform: `translateX(-50%) scale(${statusSpring})`,
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(241, 245, 249, 0.96)",
          border: `3.5px solid ${isDark ? "#FACC15" : "#94A3B8"}`,
          borderRadius: 999,
          padding: "18px 54px",
          boxShadow: isDark
            ? "0 12px 36px rgba(250,204,21,0.35)"
            : "0 8px 24px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 18,
          zIndex: 40,
        }}
      >
        <span style={{ fontSize: 34 }}>{isDark ? "💡" : "☀️"}</span>
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: isDark ? "#FACC15" : "#334155",
            letterSpacing: 1,
          }}
        >
          {isDark ? "GELAP = LAMPU NYALA" : "TERANG = LAMPU PADAM"}
        </span>
      </div>
    </div>
  );
};
