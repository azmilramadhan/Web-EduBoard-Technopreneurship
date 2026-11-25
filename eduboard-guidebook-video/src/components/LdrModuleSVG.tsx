import React from "react";

export interface LdrModuleSVGProps {
  /**
   * Tingkat cahaya yang diterima LDR (0 = gelap total, 1 = terang penuh).
   */
  lightLevel?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const LdrModuleSVG: React.FC<LdrModuleSVGProps> = ({
  lightLevel = 1,
  className,
  style,
}) => {
  const clampedLight = Math.max(0, Math.min(1, lightLevel));
  // Resistance bar fills inversely (gelap -> hambatan besar, terang -> kecil)
  const resistanceHeight = (1 - clampedLight) * 50 + 10; // 10–60px

  return (
    <svg
      viewBox="0 0 320 380"
      width="100%"
      height="100%"
      className={className}
      style={{ overflow: "visible", ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="ldr-board-shadow" x="-5%" y="-3%" width="110%" height="112%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Module PCB Board */}
      <rect
        x="30"
        y="30"
        width="260"
        height="320"
        rx="20"
        fill="#0284C7"
        stroke="#0369A1"
        strokeWidth="7"
        filter="url(#ldr-board-shadow)"
      />
      <rect x="44" y="44" width="232" height="292" rx="14" fill="#0EA5E9" />

      {/* Screw Holes */}
      {[
        [56, 56],
        [264, 56],
        [56, 324],
        [264, 324],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="5" fill="#0F172A" opacity="0.6" />
        </g>
      ))}

      {/* Module Label */}
      <rect x="90" y="58" width="140" height="30" rx="10" fill="#0F172A" />
      <text
        x="160"
        y="77"
        fill="#38BDF8"
        fontSize="13"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="2"
        fontFamily="system-ui, sans-serif"
      >
        MODUL LDR
      </text>
      <text
        x="160"
        y="102"
        fill="#BAE6FD"
        fontSize="10"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="1"
        fontFamily="system-ui, sans-serif"
      >
        SENSOR CAHAYA
      </text>

      {/* LDR Component (Lingkaran besar dengan pola zig-zag merah khas LDR) */}
      <g transform="translate(160, 180)">
        {/* LDR body (ceramic disc) */}
        <circle
          cx="0"
          cy="0"
          r="52"
          fill={clampedLight < 0.3 ? "#1E293B" : "#F1F5F9"}
          stroke="#64748B"
          strokeWidth="5"
        />
        {/* LDR window */}
        <circle
          cx="0"
          cy="0"
          r="40"
          fill={clampedLight < 0.3 ? "#0F172A" : "#FEFCE8"}
          stroke="#94A3B8"
          strokeWidth="2"
        />

        {/* Zig-zag merah khas LDR */}
        <path
          d="M -26 -15 L -18 -25 L -10 -15 L -2 -25 L 6 -15 L 14 -25 L 22 -15"
          stroke="#DC2626"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M -26 2 L -18 -8 L -10 2 L -2 -8 L 6 2 L 14 -8 L 22 2"
          stroke="#DC2626"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M -26 19 L -18 9 L -10 19 L -2 9 L 6 19 L 14 9 L 22 19"
          stroke="#DC2626"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* LDR leads (kaki) */}
        <rect x="-6" y="44" width="12" height="18" rx="2" fill="#94A3B8" />
        <rect x="-40" y="44" width="12" height="18" rx="2" fill="#94A3B8" />
        <rect x="28" y="44" width="12" height="18" rx="2" fill="#94A3B8" />
      </g>

      {/* Resistor Pembatas Terintegrasi (di bawah LDR) */}
      <g transform="translate(100, 268)">
        {/* Resistor body */}
        <rect x="0" y="0" width="56" height="20" rx="4" fill="#D4A373" stroke="#8B5E3C" strokeWidth="2" />
        {/* Color bands */}
        <rect x="8" y="0" width="6" height="20" fill="#7C3AED" rx="1" />
        <rect x="18" y="0" width="6" height="20" fill="#EF4444" rx="1" />
        <rect x="28" y="0" width="6" height="20" fill="#F59E0B" rx="1" />
        <rect x="42" y="0" width="6" height="20" fill="#F59E0B" rx="1" />
        {/* Leads */}
        <rect x="-10" y="7" width="12" height="6" rx="1" fill="#94A3B8" />
        <rect x="54" y="7" width="12" height="6" rx="1" fill="#94A3B8" />
        <text
          x="90"
          y="14"
          fill="#BAE6FD"
          fontSize="10"
          fontWeight="800"
          dominantBaseline="middle"
          fontFamily="system-ui, sans-serif"
        >
          10kΩ
        </text>
      </g>

      {/* Light Level Indicator Bar */}
      <g transform="translate(248, 125)">
        <rect x="0" y="0" width="20" height="68" rx="6" fill="#1E293B" />
        <rect
          x="3"
          y={68 - resistanceHeight + 3}
          width="14"
          height={resistanceHeight - 6}
          rx="4"
          fill={clampedLight > 0.5 ? "#22C55E" : clampedLight > 0.2 ? "#FACC15" : "#EF4444"}
        />
        <text
          x="10"
          y="82"
          fill="#BAE6FD"
          fontSize="8"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          {clampedLight > 0.5 ? "LUX ↑" : "LUX ↓"}
        </text>
      </g>

      {/* PCB traces */}
      <g stroke="#7DD3FC" strokeWidth="3" opacity="0.4" strokeLinecap="round">
        <path d="M 120 240 V 260 H 100" />
        <path d="M 200 240 V 260 H 166" />
        <path d="M 160 240 V 252" />
      </g>
    </svg>
  );
};
