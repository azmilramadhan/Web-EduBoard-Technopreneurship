import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const badgeY = interpolate(frame, [0, 20], [-40, 0], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [45, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        opacity,
        fontFamily: "Inter, Montserrat, sans-serif",
      }}
    >
      <div
        style={{
          transform: `translateY(${badgeY}px) scale(${scale})`,
          backgroundColor: "#0284C7",
          color: "#FFFFFF",
          fontWeight: 800,
          fontSize: 26,
          padding: "10px 24px",
          borderRadius: 9999,
          boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.4)",
          letterSpacing: 2,
          marginBottom: 24,
        }}
      >
        EDU-BOARD
      </div>

      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: "center",
          maxWidth: 900,
          backgroundColor: "#FFFFFF",
          padding: "36px 56px",
          borderRadius: 28,
          boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
          border: "2px solid #E2E8F0",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, color: "#0F172A", lineHeight: 1.25 }}>
          Misi 1: Uji Keamanan &amp; LED Dasar
        </div>
        <p style={{ marginTop: 12, fontSize: 22, color: "#64748B", fontWeight: 500 }}>
          Panduan Langkah Interaktif EDU-BOARD
        </p>
      </div>
    </div>
  );
};
