import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SceneIntro } from "./SceneIntro";
import { SceneConnector } from "./SceneConnector";
import { SceneCheck } from "./SceneCheck";
import { SceneFlow } from "./SceneFlow";

export const EduBoardGuide: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F8FAFC" }}>
      {/* Detik 0–2: Intro Judul (60 frame) */}
      <Sequence from={0} durationInFrames={60}>
        <SceneIntro />
      </Sequence>

      {/* Detik 2–5: Konektor Fool-Proof (90 frame) */}
      <Sequence from={60} durationInFrames={90}>
        <SceneConnector />
      </Sequence>

      {/* Detik 5–7: Pre-Flight Check (60 frame) */}
      <Sequence from={150} durationInFrames={60}>
        <SceneCheck />
      </Sequence>

      {/* Detik 7–10: Aliran Arus & Hasil (90 frame) */}
      <Sequence from={210} durationInFrames={90}>
        <SceneFlow />
      </Sequence>
    </AbsoluteFill>
  );
};
