import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CaptionBarProps {
  badge?: string;
  text: string;
}

export const CaptionBar: React.FC<CaptionBarProps> = ({ badge = "VO", text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const translateY = interpolate(enter, [0, 1], [30, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 28px",
        borderRadius: 18,
        backgroundColor: "rgba(15, 23, 42, 0.94)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 14px 36px rgba(0, 0, 0, 0.4)",
        width: "92%",
        maxWidth: 1540,
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: "0.08em",
          padding: "6px 14px",
          borderRadius: 10,
          textTransform: "uppercase",
          fontFamily: "system-ui, -apple-system, sans-serif",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
        }}
      >
        {badge}
      </span>
      <p
        style={{
          margin: 0,
          color: "#F8FAFC",
          fontSize: 25,
          fontWeight: 700,
          lineHeight: 1.35,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {text}
      </p>
    </div>
  );
};
