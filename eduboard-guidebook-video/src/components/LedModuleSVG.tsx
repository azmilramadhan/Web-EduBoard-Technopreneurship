import React from "react";

export interface LedModuleSVGProps {
  /**
   * true = LED menyala terang dengan efek glow, false = LED mati (redup)
   */
  isOn?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LedModuleSVG: React.FC<LedModuleSVGProps> = ({
  isOn = false,
  className,
  style,
}) => {
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
        {/* PCB drop shadow */}
        <filter id="led-board-shadow" x="-5%" y="-3%" width="110%" height="112%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.2" />
        </filter>

        {/* Glow effect untuk LED menyala */}
        <filter id="led-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Glow rays for brightness rays (subtle) */}
        <filter id="ray-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Module PCB Board */}
      <rect
        x="30"
        y="30"
        width="260"
        height="320"
        rx="20"
        fill="#1E3A5F"
        stroke="#1E40AF"
        strokeWidth="7"
        filter="url(#led-board-shadow)"
      />
      <rect x="44" y="44" width="232" height="292" rx="14" fill="#1D4ED8" />

      {/* Screw holes corners */}
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
        fill="#93C5FD"
        fontSize="13"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="2"
        fontFamily="system-ui, sans-serif"
      >
        MODUL LED
      </text>
      <text
        x="160"
        y="102"
        fill="#BFDBFE"
        fontSize="10"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="1"
        fontFamily="system-ui, sans-serif"
      >
        OUTPUT CAHAYA
      </text>

      {/* PCB Traces decorative */}
      <g stroke="#93C5FD" strokeWidth="3" opacity="0.3" strokeLinecap="round">
        <path d="M 160 230 V 260 H 110 V 268" />
        <path d="M 160 230 V 260 H 210 V 268" />
        <path d="M 70 190 H 108" />
        <path d="M 212 190 H 250" />
      </g>

      {/* LED Component — Bulb shape */}
      <g transform="translate(160, 180)">
        {/* Outer glow halo (only visible when on) */}
        {isOn && (
          <circle cx="0" cy="0" r="80" fill="#FDE047" opacity="0.18" />
        )}

        {/* LED outer ring */}
        <circle
          cx="0"
          cy="0"
          r="58"
          fill={isOn ? "#FBBF24" : "#1E3A5F"}
          stroke={isOn ? "#F59E0B" : "#334155"}
          strokeWidth="6"
          filter={isOn ? "url(#led-glow)" : undefined}
        />

        {/* LED lens dome */}
        <circle
          cx="0"
          cy="0"
          r="46"
          fill={isOn ? "#FEF08A" : "#1E293B"}
          stroke={isOn ? "#FBBF24" : "#1E40AF"}
          strokeWidth="3"
        />

        {/* LED filament cross (decorative detail) */}
        {isOn ? (
          <>
            {/* Bright light center */}
            <circle cx="0" cy="0" r="20" fill="#FFFDE7" />
            {/* Specular highlight */}
            <ellipse cx="-14" cy="-14" rx="8" ry="6" fill="#FFFFFF" opacity="0.9" transform="rotate(-25 -14 -14)" />

            {/* Emitted rays */}
            <g filter="url(#ray-glow)" stroke="#FDE047" strokeWidth="4" strokeLinecap="round">
              <line x1="0" y1="-58" x2="0" y2="-78" />
              <line x1="41" y1="-41" x2="56" y2="-56" />
              <line x1="58" y1="0" x2="78" y2="0" />
              <line x1="41" y1="41" x2="56" y2="56" />
              <line x1="0" y1="58" x2="0" y2="78" />
              <line x1="-41" y1="41" x2="-56" y2="56" />
              <line x1="-58" y1="0" x2="-78" y2="0" />
              <line x1="-41" y1="-41" x2="-56" y2="-56" />
            </g>
          </>
        ) : (
          <>
            {/* OFF: visible internal structure */}
            <circle cx="0" cy="0" r="20" fill="#334155" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* LED Legs / Leads bawah */}
        <rect x="-22" y="58" width="12" height="20" rx="2" fill="#94A3B8" />
        <rect x="10" y="58" width="12" height="20" rx="2" fill="#94A3B8" />
      </g>

      {/* Status badge bawah */}
      <g transform="translate(160, 310)">
        <rect
          x="-52"
          y="-14"
          width="104"
          height="24"
          rx="12"
          fill={isOn ? "#15803D" : "#1E293B"}
          stroke={isOn ? "#22C55E" : "#334155"}
          strokeWidth="2"
        />
        <text
          x="0"
          y="1"
          fill={isOn ? "#86EFAC" : "#64748B"}
          fontSize="12"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="1"
          fontFamily="system-ui, sans-serif"
        >
          {isOn ? "⚡ MENYALA" : "○ STANDBY"}
        </text>
      </g>

      {/* Resistor seri (R1) */}
      <g transform="translate(104, 268)">
        <rect x="0" y="0" width="48" height="16" rx="3" fill="#D4A373" stroke="#8B5E3C" strokeWidth="2" />
        <rect x="6" y="0" width="5" height="16" fill="#F59E0B" rx="1" />
        <rect x="15" y="0" width="5" height="16" fill="#0F172A" rx="1" />
        <rect x="24" y="0" width="5" height="16" fill="#F59E0B" rx="1" />
        <rect x="36" y="0" width="5" height="16" fill="#F59E0B" rx="1" />
        <rect x="-10" y="4" width="12" height="8" rx="2" fill="#94A3B8" />
        <rect x="46" y="4" width="12" height="8" rx="2" fill="#94A3B8" />
        <text
          x="24"
          y="30"
          fill="#BFDBFE"
          fontSize="10"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          220Ω
        </text>
      </g>
    </svg>
  );
};
