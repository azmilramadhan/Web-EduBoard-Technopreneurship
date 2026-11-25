import React from "react";

export type BaseBoardStatus = "off" | "safe" | "danger";

export interface BaseBoardSVGProps {
  status?: BaseBoardStatus;
  isCheckPressed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseBoardSVG: React.FC<BaseBoardSVGProps> = ({
  status = "off",
  isCheckPressed = false,
  className,
  style,
}) => {
  const isSafe = status === "safe";
  const isDanger = status === "danger";

  return (
    <svg
      viewBox="0 0 600 420"
      width="100%"
      height="100%"
      className={className}
      style={{ overflow: "visible", ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Shadow PCB */}
        <filter id="pcb-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>

        {/* Glow LED Aman */}
        <filter id="glow-safe" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Glow LED Bahaya */}
        <filter id="glow-danger" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="usb-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>

      {/* PCB Base Outline */}
      <rect
        x="30"
        y="30"
        width="540"
        height="360"
        rx="28"
        fill="#15803D"
        stroke="#166534"
        strokeWidth="10"
        filter="url(#pcb-shadow)"
      />
      {/* PCB Inner Mask */}
      <rect x="45" y="45" width="510" height="330" rx="20" fill="#16A34A" />

      {/* Screw Holes Corner */}
      {[
        [60, 60],
        [540, 60],
        [60, 360],
        [540, 360],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="14" fill="#CBD5E1" stroke="#64748B" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="7" fill="#0F172A" opacity="0.75" />
        </g>
      ))}

      {/* Traces PCB (Decorative circuits) */}
      <g stroke="#86EFAC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
        <path d="M 60 170 H 120 L 160 210 H 220" />
        <path d="M 120 250 L 160 210" />
        <path d="M 330 190 H 420 L 450 160 H 490" />
        <path d="M 330 250 H 420 L 450 280 H 490" />
      </g>

      {/* Header Label: EDU-BOARD */}
      <g transform="translate(300, 95)">
        <rect x="-130" y="-30" width="260" height="48" rx="24" fill="#0F172A" />
        <text
          x="0"
          y="3"
          fill="#FFFFFF"
          fontSize="24"
          fontWeight="900"
          letterSpacing="3"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          EDU-BOARD
        </text>
      </g>
      <text
        x="300"
        y="130"
        fill="#BBF7D0"
        fontSize="12"
        fontWeight="800"
        letterSpacing="2"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CORE CONTROLLER UNIT
      </text>

      {/* Port USB 5V (Left) */}
      <g transform="translate(18, 160)">
        {/* Metal Shell protruding */}
        <rect x="0" y="0" width="35" height="70" rx="6" fill="url(#usb-metal)" stroke="#475569" strokeWidth="3" />
        <rect x="6" y="10" width="16" height="50" rx="3" fill="#0F172A" />
        {/* USB Contacts */}
        <rect x="8" y="20" width="4" height="8" rx="1" fill="#FBBF24" />
        <rect x="8" y="42" width="4" height="8" rx="1" fill="#FBBF24" />
        {/* Label */}
        <rect x="42" y="12" width="62" height="46" rx="8" fill="#15803D" stroke="#86EFAC" strokeWidth="2" />
        <text
          x="73"
          y="30"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          USB 5V
        </text>
        <text
          x="73"
          y="48"
          fill="#86EFAC"
          fontSize="9"
          fontWeight="700"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          POWER
        </text>
      </g>

      {/* Button CHECK (Center-Left) */}
      <g transform={`translate(200, 240) ${isCheckPressed ? "scale(0.96)" : ""}`}>
        {/* Bezel */}
        <rect
          x="-45"
          y="-45"
          width="90"
          height="90"
          rx="18"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="5"
        />
        {/* Button top cap */}
        <circle
          cx="0"
          cy={isCheckPressed ? "2" : "-2"}
          r="32"
          fill={isCheckPressed ? "#020617" : "#0F172A"}
          stroke="#475569"
          strokeWidth="4"
        />
        <text
          x="0"
          y={isCheckPressed ? "4" : "0"}
          fill="#FFFFFF"
          fontSize="15"
          fontWeight="900"
          letterSpacing="1"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, sans-serif"
        >
          CHECK
        </text>
        <text
          x="0"
          y="62"
          fill="#DCFCE7"
          fontSize="11"
          fontWeight="800"
          letterSpacing="1"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          PRE-FLIGHT
        </text>
      </g>

      {/* Status Indicators: AMAN & BAHAYA */}
      <g transform="translate(325, 230)">
        {/* AMAN (Hijau) */}
        <g transform="translate(0, -32)">
          {isSafe && (
            <circle cx="0" cy="0" r="22" fill="#22C55E" opacity="0.5" filter="url(#glow-safe)" />
          )}
          <circle
            cx="0"
            cy="0"
            r="16"
            fill={isSafe ? "#22C55E" : "#14532D"}
            stroke={isSafe ? "#4ADE80" : "#166534"}
            strokeWidth="3.5"
          />
          {isSafe && <circle cx="-5" cy="-5" r="4.5" fill="#FFFFFF" opacity="0.8" />}
          <text
            x="32"
            y="4"
            fill={isSafe ? "#22C55E" : "#A7F3D0"}
            fontSize="14"
            fontWeight="900"
            dominantBaseline="middle"
            fontFamily="system-ui, sans-serif"
          >
            AMAN
          </text>
        </g>

        {/* BAHAYA (Merah) */}
        <g transform="translate(0, 32)">
          {isDanger && (
            <circle cx="0" cy="0" r="22" fill="#EF4444" opacity="0.5" filter="url(#glow-danger)" />
          )}
          <circle
            cx="0"
            cy="0"
            r="16"
            fill={isDanger ? "#EF4444" : "#7F1D1D"}
            stroke={isDanger ? "#F87171" : "#991B1B"}
            strokeWidth="3.5"
          />
          {isDanger && <circle cx="-5" cy="-5" r="4.5" fill="#FFFFFF" opacity="0.8" />}
          <text
            x="32"
            y="4"
            fill={isDanger ? "#EF4444" : "#FECACA"}
            fontSize="14"
            fontWeight="900"
            dominantBaseline="middle"
            fontFamily="system-ui, sans-serif"
          >
            BAHAYA
          </text>
        </g>
      </g>

      {/* 2 Soket JST Putih 4-Pin Asimetris (Kanan: Port Input & Port Output) */}
      {/* Port Input (Top Right) */}
      <g transform="translate(485, 120)">
        {/* Label Port */}
        <rect x="-8" y="-22" width="76" height="18" rx="5" fill="#0F172A" />
        <text
          x="30"
          y="-10"
          fill="#38BDF8"
          fontSize="10"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, sans-serif"
        >
          PORT INPUT
        </text>

        {/* White JST Asymmetrical Socket Housing */}
        <path
          d="M 0 0 H 60 V 80 H 0 V 62 H 6 V 52 H 0 V 28 H 6 V 18 H 0 Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="3"
        />
        {/* Asymmetrical polarization key/notch interior */}
        <path d="M 6 4 H 54 V 76 H 6 V 60 H 12 V 54 H 6 V 26 H 12 V 20 H 6 Z" fill="#F1F5F9" />

        {/* 4 Pin Contacts */}
        {[14, 30, 48, 64].map((py, idx) => (
          <g key={idx}>
            <rect x="24" y={py} width="16" height="6" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <rect x="18" y={py + 1} width="6" height="4" fill="#334155" />
          </g>
        ))}
      </g>

      {/* Port Output (Bottom Right) */}
      <g transform="translate(485, 250)">
        {/* Label Port */}
        <rect x="-8" y="-22" width="76" height="18" rx="5" fill="#0F172A" />
        <text
          x="30"
          y="-10"
          fill="#FACC15"
          fontSize="10"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, sans-serif"
        >
          PORT OUTPUT
        </text>

        {/* White JST Asymmetrical Socket Housing */}
        <path
          d="M 0 0 H 60 V 80 H 0 V 62 H 6 V 52 H 0 V 28 H 6 V 18 H 0 Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="3"
        />
        {/* Key/notch */}
        <path d="M 6 4 H 54 V 76 H 6 V 60 H 12 V 54 H 6 V 26 H 12 V 20 H 6 Z" fill="#F1F5F9" />

        {/* 4 Pin Contacts */}
        {[14, 30, 48, 64].map((py, idx) => (
          <g key={idx}>
            <rect x="24" y={py} width="16" height="6" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <rect x="18" y={py + 1} width="6" height="4" fill="#334155" />
          </g>
        ))}
      </g>
    </svg>
  );
};
