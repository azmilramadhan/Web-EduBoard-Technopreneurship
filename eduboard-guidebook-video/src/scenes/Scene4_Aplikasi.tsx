import React from "react";
import { Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Scene 4 — 330 frame @ 30fps = 11 detik
// Aplikasi: Transisi dari EDU-BOARD ke ilustrasi vektor jalanan/taman kota saat senja.
// Langit berubah dari sore (oranye/ungu) ke malam (biru gelap).
// Lampu-lampu jalan otomatis menyala bersamaan dengan efek glow.
// Kartu ringkasan 'Aplikasi Dunia Nyata: Lampu Jalan & Taman Otomatis' + logo EDU-BOARD di akhir.
export const Scene4_Aplikasi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Sunset transition with smooth bezier Easing (frames 30->150) ---
  const nightProgress = interpolate(frame, [30, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Street lights turn on as night sets in (frame >= 100)
  const lightsOn = frame >= 100;
  const lightsGlow = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // --- Summary Card entrance (spring damping 14, stiffness 90, mass 0.9) ---
  const cardSpring = spring({ frame: frame - 120, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Final EDU-BOARD Logo Outro entrance (spring damping 14, stiffness 90, mass 0.9) ---
  const logoSpring = spring({ frame: frame - 220, fps, config: { damping: 14, stiffness: 90, mass: 0.9 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(frame, [220, 235], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Micro-floating effect (±4px smooth hover) ---
  const floatCard = Math.sin(frame / 18) * 4;

  // Sky colors: Dusk gradient (#F97316 -> #7C3AED) to Night (#0F172A -> #1E1B4B)
  const skyTopColor = nightProgress > 0.5 ? "#0F172A" : "#C2410C";
  const skyBottomColor = nightProgress > 0.5 ? "#1E1B4B" : "#F97316";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Audio src={staticFile("audio/vo-scene4.mp3")} />

      {/* SFX: Whoosh saat kartu ringkasan & outro logo muncul */}
      <Sequence from={120}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={220}>
        <Audio src={staticFile("audio/sfx-whoosh.wav")} volume={0.7} />
      </Sequence>

      {/* ===== Dynamic Sky Background ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${skyTopColor} 0%, ${skyBottomColor} 100%)`,
          transition: "background 0.5s ease",
        }}
      />

      {/* Stars appearing at night */}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: (i % 3) + 2,
            height: (i % 3) + 2,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            left: `${(i * 47) % 95}%`,
            top: `${(i * 31) % 45}%`,
            opacity: nightProgress * (0.3 + (i % 4) * 0.2),
          }}
        />
      ))}

      {/* Moon (rising as night progresses) */}
      <div
        style={{
          position: "absolute",
          right: 180,
          top: interpolate(nightProgress, [0, 1], [160, 80]),
          opacity: nightProgress,
          fontSize: 64,
          filter: "drop-shadow(0 0 20px #CBD5E1)",
        }}
      >
        🌙
      </div>

      {/* ===== City Skyline & Street Vector Scene ===== */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 600,
        }}
        viewBox="0 0 1920 600"
        fill="none"
      >
        <defs>
          {/* Light cone gradient for street lamps */}
          <linearGradient id="lamp-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.0" />
          </linearGradient>

          {/* Lamp bulb glow */}
          <filter id="street-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Distant City Buildings Silhouette */}
        <g fill={nightProgress > 0.5 ? "#090D16" : "#431407"} opacity="0.6">
          <rect x="80" y="220" width="120" height="280" />
          <rect x="230" y="160" width="160" height="340" />
          <rect x="420" y="240" width="140" height="260" />
          <rect x="600" y="190" width="180" height="310" />
          <rect x="820" y="260" width="130" height="240" />
          <rect x="990" y="150" width="200" height="350" />
          <rect x="1230" y="210" width="160" height="290" />
          <rect x="1430" y="170" width="190" height="330" />
          <rect x="1660" y="230" width="180" height="270" />
        </g>

        {/* Midground Trees / Park */}
        <g fill={nightProgress > 0.5 ? "#064E3B" : "#14532D"} opacity="0.8">
          <circle cx="200" cy="380" r="60" />
          <circle cx="260" cy="390" r="50" />
          <circle cx="560" cy="390" r="55" />
          <circle cx="920" cy="380" r="65" />
          <circle cx="1380" cy="385" r="55" />
          <circle cx="1720" cy="380" r="60" />
        </g>

        {/* Road / Pavement */}
        <rect x="0" y="440" width="1920" height="160" fill="#1E293B" />
        <rect x="0" y="440" width="1920" height="12" fill="#334155" />

        {/* Road markings */}
        <g stroke="#94A3B8" strokeWidth="6" strokeDasharray="50 40">
          <line x1="0" y1="520" x2="1920" y2="520" />
        </g>

        {/* Street Lamps (4 lamps across the road) */}
        {[300, 750, 1200, 1650].map((lx, idx) => (
          <g key={idx}>
            {/* Lamp Pole */}
            <rect x={lx - 4} y="220" width="8" height="230" rx="4" fill="#64748B" />
            <path
              d={`M ${lx} 230 C ${lx} 190, ${lx + 35} 185, ${lx + 45} 200`}
              stroke="#64748B"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Lamp Cap */}
            <path
              d={`M ${lx + 30} 200 L ${lx + 60} 200 L ${lx + 54} 212 L ${lx + 36} 212 Z`}
              fill="#334155"
            />

            {/* Light Cone (visible when night/lightsOn) */}
            {lightsOn && (
              <polygon
                points={`${lx + 38},212 ${lx + 52},212 ${lx + 130},440 ${lx - 40},440`}
                fill="url(#lamp-cone)"
                opacity={lightsGlow}
              />
            )}

            {/* Glowing Bulb */}
            <circle
              cx={lx + 45}
              cy={215}
              r={lightsOn ? 10 : 7}
              fill={lightsOn ? "#FEF08A" : "#94A3B8"}
              filter={lightsOn ? "url(#street-glow)" : undefined}
            />
          </g>
        ))}
      </svg>

      {/* ===== Summary Card (Aplikasi Dunia Nyata - Enlarged for Mobile + Micro-Floating) ===== */}
      {cardOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: 45,
            left: "50%",
            transform: `translateX(-50%) translateY(${floatCard}px) scale(${cardScale})`,
            opacity: cardOpacity,
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            backdropFilter: "blur(14px)",
            border: "2.5px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 28,
            padding: "26px 54px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
            maxWidth: 1020,
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#38BDF8",
              letterSpacing: 4,
              marginBottom: 8,
            }}
          >
            APLIKASI DUNIA NYATA
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.25,
            }}
          >
            Lampu Jalan &amp; Taman Otomatis
          </div>
          <p
            style={{
              fontSize: 23,
              fontWeight: 600,
              color: "#E2E8F0",
              marginTop: 12,
              margin: 0,
            }}
          >
            Saat matahari terbenam, sensor LDR memicu lampu menyala tanpa campur tangan manusia.
          </p>
        </div>
      )}

      {/* ===== Celebratory Confetti / Star Sparkles (Detik Terakhir frame >= 220) ===== */}
      {frame >= 220 && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
          {[
            { x: 300, y: 350, emoji: "✨", s: 44, delay: 0 },
            { x: 420, y: 220, emoji: "🎉", s: 48, delay: 5 },
            { x: 600, y: 160, emoji: "⭐", s: 38, delay: 12 },
            { x: 1350, y: 170, emoji: "🌟", s: 40, delay: 8 },
            { x: 1520, y: 260, emoji: "🚀", s: 52, delay: 4 },
            { x: 1640, y: 380, emoji: "✨", s: 44, delay: 14 },
            { x: 250, y: 550, emoji: "💡", s: 42, delay: 10 },
            { x: 1680, y: 540, emoji: "🧩", s: 46, delay: 6 },
          ].map((item, idx) => {
            const itemSpring = spring({
              frame: frame - 220 - item.delay,
              fps,
              config: { damping: 9, mass: 0.5 },
            });
            const floatY = Math.sin((frame + idx * 25) * 0.08) * 12;
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y + floatY,
                  fontSize: item.s,
                  transform: `scale(${Math.max(0, itemSpring)})`,
                  opacity: Math.min(1, itemSpring),
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
                  userSelect: "none",
                }}
              >
                {item.emoji}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Celebratory Outro Badge with Tagline (Safe Bottom 115px - No Subtitle Collision) ===== */}
      {logoOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 115,
            left: "50%",
            transform: `translateX(-50%) scale(${logoScale})`,
            opacity: logoOpacity,
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.96) 0%, rgba(30, 64, 175, 0.96) 100%)",
            border: "3px solid rgba(255, 255, 255, 0.35)",
            color: "#FFFFFF",
            padding: "20px 52px",
            borderRadius: 999,
            boxShadow: "0 18px 45px rgba(2, 132, 199, 0.55), 0 0 30px rgba(56, 189, 248, 0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            zIndex: 35,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: 3 }}>
              ⚡ EDU-BOARD
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#FEF08A",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Ciptakan Solusi Cerdas dari Tanganmu! 🚀
            </span>
          </div>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#E0F2FE",
              letterSpacing: 1,
            }}
          >
            Siap Berpetualang ke Misi Berikutnya? ✨
          </span>
        </div>
      )}
    </div>
  );
};
