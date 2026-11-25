import React from "react";
import { Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BaseBoardSVG } from "../components/BaseBoardSVG";
import { JstCableSVG } from "../components/JstCableSVG";
import { LdrModuleSVG } from "../components/LdrModuleSVG";
import { LedModuleSVG } from "../components/LedModuleSVG";

// Scene 2 — 570 frame @ 30fps = 19 detik
// Rakit: BaseBoard di tengah-kiri, LDR kanan atas, LED kanan bawah.
// Kabel JST dicolokkan ke soket asimetris. Zoom-in callout "Anti-Terbalik".
// Jari menekan tombol CHECK -> LED AMAN menyala hijau -> Badge "Proteksi Arus Aktif".
export const Scene2_Rakit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Title entrance (spring damping 14, stiffness 90, mass 0.9) ---
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const titleY = interpolate(titleSpring, [0, 1], [-60, 0]);

  // --- Cable 1 insertion progress (smooth cubic bezier) ---
  const cable1Progress = interpolate(frame, [40, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Cable 2 insertion progress (smooth cubic bezier) ---
  const cable2Progress = interpolate(frame, [120, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Zoom callout "Konektor Asimetris: Anti-Terbalik" (spring damping 14, stiffness 90, mass 0.9) ---
  const calloutSpring = spring({ frame: frame - 80, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const calloutOpacity = interpolate(frame, [80, 95, 190, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Finger press CHECK button (spring damping 14, stiffness 90, mass 0.9) ---
  const fingerSpring = spring({ frame: frame - 270, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const fingerY = interpolate(fingerSpring, [0, 0.7, 1], [-120, 10, 0]);
  const fingerOpacity = interpolate(frame, [260, 275, 330, 345], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isCheckPressed = frame >= 285 && frame <= 320;

  // --- Board status: off -> safe after button press (frame >= 300) ---
  const boardStatus = frame >= 300 ? "safe" : "off";

  // --- Badge "Proteksi Arus Aktif" (spring damping 14, stiffness 90, mass 0.9) ---
  const badgeSpring = spring({ frame: frame - 320, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.6, 1]);
  const badgeOpacity = interpolate(frame, [320, 335], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Micro-floating effect (±4px smooth hover) ---
  const floatLdr = Math.sin(frame / 18) * 4;
  const floatLed = Math.cos(frame / 18) * 4;

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
      {/* Contextual Modern Workbench Background: Dark Slate Blueprint + PCB Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 35% 45%, #1E293B 0%, #0F172A 70%, #020617 100%)",
          zIndex: 0,
        }}
      >
        {/* Thin Cyan PCB Grid Lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2 }}>
          <defs>
            <pattern id="s2-pcb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="#38BDF8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#s2-pcb-grid)" />
          {/* Micro PCB decorative traces in background */}
          <path d="M 80 180 H 260 L 310 230 H 580" stroke="#0284C7" strokeWidth="2" strokeDasharray="10 8" opacity="0.35" fill="none" />
          <path d="M 1250 380 H 1480 L 1530 430 H 1820" stroke="#0284C7" strokeWidth="2" strokeDasharray="10 8" opacity="0.35" fill="none" />
        </svg>

        {/* Ambient Workbench Glow behind BaseBoard (enhances contrast of green board) */}
        <div
          style={{
            position: "absolute",
            left: "12%",
            top: "16%",
            width: 750,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.05) 55%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
      </div>

      <Audio src={staticFile("audio/vo-scene2.mp3")} />

      {/* SFX: Whoosh saat panel judul & callout muncul */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={80}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={320}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>

      {/* SFX: JST Click tepat saat steker menyentuh soket (cable1 di frame 140, cable2 di frame 220) */}
      <Sequence from={140}>
        <Audio src={staticFile("audio/sfx-jst-click.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={220}>
        <Audio src={staticFile("audio/sfx-jst-click.wav")} volume={0.7} />
      </Sequence>

      {/* SFX: Button press saat jari menekan tombol CHECK (frame 285) */}
      <Sequence from={285}>
        <Audio src={staticFile("audio/sfx-button-press.wav")} volume={0.7} />
      </Sequence>

      {/* SFX: Safe chime tepat saat LED indikator AMAN menyala hijau (frame 300) */}
      <Sequence from={300}>
        <Audio src={staticFile("audio/sfx-safe-chime.wav")} volume={0.7} />
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
              backgroundColor: "#22C55E",
              borderRadius: 999,
              padding: "4px 20px",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            LANGKAH 2
          </span>
          Rakit &amp; Pre-Flight Check
        </div>
      </div>

      {/* ===== Base Board (Tengah-Kiri, Scale Up for Mobile) ===== */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 135,
          width: 660,
          height: 460,
        }}
      >
        <BaseBoardSVG status={boardStatus} isCheckPressed={isCheckPressed} />

        {/* Animated Finger on CHECK button */}
        {fingerOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: 200,
              top: 225,
              transform: `translateY(${fingerY}px)`,
              opacity: fingerOpacity,
              fontSize: 84,
              filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
              pointerEvents: "none",
            }}
          >
            👆
          </div>
        )}
      </div>

      {/* ===== Cable 1 (Upper: to LDR Module) ===== */}
      <div
        style={{
          position: "absolute",
          left: 630,
          top: 135,
          width: 360,
          height: 180,
          pointerEvents: "none",
        }}
      >
        <JstCableSVG progress={cable1Progress} />
      </div>

      {/* ===== Cable 2 (Lower: to LED Module) ===== */}
      <div
        style={{
          position: "absolute",
          left: 630,
          top: 365,
          width: 360,
          height: 180,
          pointerEvents: "none",
        }}
      >
        <JstCableSVG progress={cable2Progress} />
      </div>

      {/* ===== Right Column: Modules (Scale Up for Mobile + Micro-Floating) ===== */}
      {/* LDR Module (Kanan Atas) */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 100,
          width: 290,
          height: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${floatLdr}px)`,
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <LdrModuleSVG lightLevel={0.8} />
        </div>
      </div>

      {/* LED Module (Kanan Bawah) */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 410,
          width: 290,
          height: 330,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${floatLed}px)`,
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <LedModuleSVG isOn={false} />
        </div>
      </div>

      {/* ===== Zoom Callout: Konektor Asimetris: Anti-Terbalik ===== */}
      {calloutOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 50,
            transform: `scale(${calloutSpring})`,
            opacity: calloutOpacity,
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            border: "3.5px solid #0284C7",
            borderRadius: 24,
            padding: "18px 32px",
            boxShadow: "0 16px 36px rgba(2,132,199,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 18,
            zIndex: 30,
          }}
        >
          <div
            style={{
              backgroundColor: "#E0F2FE",
              color: "#0284C7",
              borderRadius: "50%",
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            🔒
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>
              Konektor Asimetris JST
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0284C7" }}>
              Anti-Terbalik (Fool-Proof Protection)
            </div>
          </div>
        </div>
      )}

      {/* ===== Badge: Proteksi Arus Aktif (Safe Bottom 115px - No Subtitle Collision) ===== */}
      {badgeOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 115,
            left: "50%",
            transform: `translateX(-50%) scale(${badgeScale})`,
            opacity: badgeOpacity,
            backgroundColor: "#15803D",
            color: "#FFFFFF",
            padding: "18px 48px",
            borderRadius: 999,
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 1,
            boxShadow: "0 12px 36px rgba(21,128,61,0.45)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: 36 }}>🛡️</span>
          <span>Proteksi Arus Aktif — Rangkaian Aman dari Korsleting!</span>
        </div>
      )}
    </div>
  );
};
