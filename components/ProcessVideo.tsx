"use client";

import { useRef } from "react";
import { CAPTIONS, CHAPTERS } from "@/lib/process-video";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// The recorded MP4 of "The EquiBridge Process", with chapter buttons and the transcript.
export default function ProcessVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  const jump = (s: number) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = s + 0.05;
    v.play().catch(() => {});
  };

  return (
    <div className="stack" style={{ gap: 14 }}>
      <video
        ref={ref}
        controls
        playsInline
        preload="metadata"
        poster="/videos/equibridge-process-poster.jpg"
        style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 16, background: "#0f4c5c", boxShadow: "0 12px 32px rgba(15,76,92,0.12)" }}
      >
        <source src="/videos/equibridge-process.mp4" type="video/mp4" />
        Your browser can’t play this video. <a href="/videos/equibridge-process.mp4">Download it here</a>.
      </video>
      <div className="xp-chapters" aria-label="Jump to a chapter">
        {CHAPTERS.map((c, i) => (
          <button key={c.label} type="button" className="xp-chapter" onClick={() => jump(c.start)}>
            {i + 1}. {c.label} <span style={{ fontWeight: 500, opacity: 0.75 }}>{fmt(c.start)}</span>
          </button>
        ))}
      </div>
      <details className="faq">
        <summary>Read the transcript</summary>
        {CAPTIONS.map((c) => (
          <p key={c.at}>{c.text}</p>
        ))}
      </details>
    </div>
  );
}
