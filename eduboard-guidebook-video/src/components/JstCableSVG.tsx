import React from "react";

export interface JstCableSVGProps {
  /**
   * Progress animasi colok steker masuk ke soket (0: jauh/tercabut, 1: tertancap pas di soket)
   */
  progress?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const JstCableSVG: React.FC<JstCableSVGProps> = ({
  progress = 0,
  className,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Subtle physical bounce on lock-in (snapping at 0.9 -> 1.0)
  const lockBounce =
    clampedProgress >= 0.88 && clampedProgress < 1
      ? Math.sin((clampedProgress - 0.88) * Math.PI * 5) * 4
      : clampedProgress === 1
      ? 0
      : 0;

  // Plug moves along X towards target socket at x=0 with bounce effect
  // When progress = 0: offset = -140px, progress = 1: offset = 0px
  const plugOffsetX = (1 - clampedProgress) * -140 + lockBounce;

  // Dynamic cable sag & tension flex based on progress
  // At progress 0 (pulled back): higher tension / lower arch
  // While moving: wires flex with natural curve sag
  const flexArch = Math.sin(clampedProgress * Math.PI) * 18;

  return (
    <svg
      viewBox="0 0 500 240"
      width="100%"
      height="100%"
      className={className}
      style={{ overflow: "visible", ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="jst-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>

        <linearGradient id="plug-white-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <filter id="lock-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22C55E" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Flexible Wires with Dynamic Physical Bezier Flex (Merah, Hitam, Kuning, Biru) */}
      <g strokeWidth="8" strokeLinecap="round" fill="none">
        {/* Merah (VCC / 5V) */}
        <path
          d={`M 20 80 C ${100 + plugOffsetX * 0.15} ${60 - flexArch}, ${210 + plugOffsetX * 0.5} ${90 - flexArch * 0.5}, ${300 + plugOffsetX} 100`}
          stroke="#EF4444"
        />
        {/* Hitam (GND) */}
        <path
          d={`M 20 105 C ${110 + plugOffsetX * 0.15} ${85 - flexArch * 0.8}, ${220 + plugOffsetX * 0.5} ${105 - flexArch * 0.4}, ${300 + plugOffsetX} 115`}
          stroke="#0F172A"
        />
        {/* Kuning (Signal / Analog) */}
        <path
          d={`M 20 130 C ${110 + plugOffsetX * 0.15} ${150 + flexArch * 0.8}, ${220 + plugOffsetX * 0.5} ${135 + flexArch * 0.4}, ${300 + plugOffsetX} 130`}
          stroke="#FACC15"
        />
        {/* Biru (Digital / IO) */}
        <path
          d={`M 20 155 C ${100 + plugOffsetX * 0.15} ${175 + flexArch}, ${210 + plugOffsetX * 0.5} ${150 + flexArch * 0.5}, ${300 + plugOffsetX} 145`}
          stroke="#3B82F6"
        />
      </g>

      {/* Steker JST 4-Pin Putih Asimetris (Bergerak sesuai progress + bounce) */}
      <g transform={`translate(${plugOffsetX}, 0)`} filter="url(#jst-shadow)">
        {/* Cable Strain Relief Collar */}
        <rect x="280" y="86" width="22" height="72" rx="4" fill="#64748B" />

        {/* Plug Body Utama */}
        <path
          d="M 302 82 H 375 V 162 H 302 Z"
          fill="url(#plug-white-grad)"
          stroke="#94A3B8"
          strokeWidth="3"
        />

        {/* Asymmetrical Locking Notch / Key / Tonjolan Pengunci (Top side key) */}
        <path
          d="M 320 82 V 72 H 358 V 82 Z"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="3"
        />
        {/* Latch tab hook */}
        <rect
          x="330"
          y="70"
          width="18"
          height="6"
          rx="2"
          fill={clampedProgress === 1 ? "#22C55E" : "#0284C7"}
          filter={clampedProgress === 1 ? "url(#lock-glow)" : undefined}
        />

        {/* Front Nose insertion profile (fits into BaseBoard socket) */}
        <path
          d="M 375 88 H 392 V 104 H 388 V 118 H 392 V 136 H 388 V 146 H 392 V 156 H 375 Z"
          fill="#F1F5F9"
          stroke="#94A3B8"
          strokeWidth="2.5"
        />

        {/* 4 Gold Pins Protruding into socket */}
        {[96, 112, 128, 144].map((py, i) => (
          <rect key={i} x="390" y={py} width="16" height="5" rx="1.5" fill="#F59E0B" />
        ))}

        {/* Gripping ribs on plug body */}
        <line x1="324" y1="92" x2="324" y2="152" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="336" y1="92" x2="336" y2="152" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="348" y1="92" x2="348" y2="152" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

        {/* Label Indikator Anti-Terbalik pada Steker */}
        <text
          x="338"
          y="126"
          fill="#475569"
          fontSize="10"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="1"
          fontFamily="system-ui, sans-serif"
          transform="rotate(-90 338 126)"
        >
          JST 4P
        </text>
      </g>

      {/* Target Socket Outline (Ghosting when unplugged, glowing green when locked) */}
      <g transform="translate(392, 70)">
        <path
          d="M 0 12 H 50 V 98 H 0 V 82 H 6 V 72 H 0 V 48 H 6 V 38 H 0 Z"
          fill={clampedProgress === 1 ? "rgba(34, 197, 94, 0.08)" : "none"}
          stroke={clampedProgress === 1 ? "#22C55E" : "#94A3B8"}
          strokeWidth={clampedProgress === 1 ? "4" : "2"}
          strokeDasharray={clampedProgress === 1 ? "none" : "6 4"}
        />
        <text
          x="26"
          y="118"
          fill={clampedProgress === 1 ? "#15803D" : "#64748B"}
          fontSize="11"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          {clampedProgress === 1 ? "✓ TERKUNCI" : "SOKET JST"}
        </text>
      </g>
    </svg>
  );
};
