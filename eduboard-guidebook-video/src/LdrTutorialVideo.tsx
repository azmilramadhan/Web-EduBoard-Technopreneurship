import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CaptionBar } from "./components/CaptionBar";
import { TechBackground } from "./components/TechBackground";
import { Scene1_Teori } from "./scenes/Scene1_Teori";
import { Scene2_Rakit } from "./scenes/Scene2_Rakit";
import { Scene3_UjiCoba } from "./scenes/Scene3_UjiCoba";
import { Scene4_Aplikasi } from "./scenes/Scene4_Aplikasi";

/**
 * Wrapper transisi antar-babak: Crossfade halus + Subtle Cinematic Zoom
 */
const SceneTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}> = ({ children, durationInFrames, fadeInFrames = 14, fadeOutFrames = 14 }) => {
  const frame = useCurrentFrame();

  // Smooth Crossfade In/Out with Bezier Easing
  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const fadeOut = interpolate(frame, [durationInFrames - fadeOutFrames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const opacity = Math.min(fadeIn, fadeOut);

  // Subtle Organic Zoom (1.025 -> 1.00 -> 0.985)
  const scale = interpolate(
    frame,
    [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
    [1.025, 1, 1, 0.985],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Komposisi Penuh LdrTutorialVideo
 * Resolusi: 1920x1080 (30 fps)
 * Total durasi: 1770 frame (~59 detik)
 *
 * Alur Sequence:
 * 1. Scene1_Teori:    frame    0 –  450 (15 detik)
 * 2. Scene2_Rakit:    frame  450 – 1020 (19 detik / 570 frame)
 * 3. Scene3_UjiCoba:  frame 1020 – 1440 (14 detik / 420 frame)
 * 4. Scene4_Aplikasi: frame 1440 – 1770 (11 detik / 330 frame)
 */
export const LdrTutorialVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
      {/* Dynamic STEM Tech Dot-Grid Background (Global Fallback) */}
      <TechBackground />

      {/* Background Music Loop */}
      <Audio src={staticFile("audio/bgm-tech-loop.wav")} volume={0.12} loop />

      {/* Scene 1: Teori Sensor Cahaya LDR (450 frame) */}
      <Sequence from={0} durationInFrames={450}>
        <SceneTransition durationInFrames={450} fadeInFrames={1} fadeOutFrames={14}>
          <Scene1_Teori />
        </SceneTransition>
        <CaptionBar
          badge="TEORI LDR"
          text="Sensor LDR: Hambatan mengecil saat terang dan melonjak tinggi saat gelap."
        />
      </Sequence>

      {/* Scene 2: Rakit & Pre-Flight Check (570 frame) */}
      <Sequence from={450} durationInFrames={570}>
        <SceneTransition durationInFrames={570} fadeInFrames={14} fadeOutFrames={14}>
          <Scene2_Rakit />
        </SceneTransition>
        <CaptionBar
          badge="PERAKITAN"
          text="Hubungkan modul LDR & LED via kabel JST, lalu tekan tombol Check untuk verifikasi sirkuit aman."
        />
      </Sequence>

      {/* Scene 3: Uji Coba Sensor & Logika (420 frame) */}
      <Sequence from={1020} durationInFrames={420}>
        <SceneTransition durationInFrames={420} fadeInFrames={14} fadeOutFrames={14}>
          <Scene3_UjiCoba />
        </SceneTransition>
        <CaptionBar
          badge="UJI COBA"
          text="Tutup sensor LDR untuk menaikkan resistansi hingga LED menyala; buka kembali untuk memadamkannya."
        />
      </Sequence>

      {/* Scene 4: Aplikasi Dunia Nyata & Outro (330 frame) */}
      <Sequence from={1440} durationInFrames={330}>
        <SceneTransition durationInFrames={330} fadeInFrames={14} fadeOutFrames={8}>
          <Scene4_Aplikasi />
        </SceneTransition>
        <CaptionBar
          badge="APLIKASI"
          text="Otomatisasi LDR: Prinsip dasar pengontrol lampu penerangan jalan dan taman pintar."
        />
      </Sequence>
    </AbsoluteFill>
  );
};
