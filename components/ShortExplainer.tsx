"use client";

/*
 * 35-second social cut of the How It Works explainer, in two shapes:
 *   wide  = 1280×720 canvas (16:9)  → /explainer-30?record=1
 *   tall  = 720×1280 canvas (9:16)  → /explainer-30?record=1&format=tall
 * Narration: ElevenLabs "Vino" (tightened, 1.15× tempo). Beat times below come from that recording.
 * Shared helpers and sample numbers come from components/Explainer.tsx.
 * The disclaimer strip shows only at the start (0–STRIP_END) and on the end card.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACCOUNTS,
  Abs,
  Bar,
  C,
  Check,
  H,
  LIMIT_TOTAL,
  Label,
  MINIMUM,
  PAYOFF,
  Pill,
  REASON,
  SCORES_AFTER,
  SCORES_BEFORE,
  at,
  ease,
  fade,
  lerp,
  money,
  panel,
  pct,
  prog,
} from "@/components/Explainer";
import { CONTACT } from "@/lib/site";

export const DURATION = 35.6;
const STRIP_END = 5.4;

const SCENES = [
  { start: 0, end: 11.5 }, // the file
  { start: 11.5, end: 19.9 }, // simulation
  { start: 19.9, end: 28.5 }, // conditions first, controlled funding
  { start: 28.5, end: 32.6 }, // rescore, refinance, payoff
  { start: 32.6, end: DURATION }, // end card (no narration)
];

export const CAPTIONS = [
  { at: 0.17, text: "Every broker knows this file: solid income, plenty of equity," },
  { at: 3.65, text: "and no late payments or collections." },
  { at: 5.59, text: "But the middle score is 592, and the lender needs 620." },
  { at: 9.29, text: "The culprit? Maxed-out credit cards." },
  { at: 11.69, text: "The takeout lender simulates the payoff:" },
  { at: 13.81, text: "utilization drops from 95% to about 3%," },
  { at: 17.44, text: "and the projected score hits 668." },
  { at: 20.16, text: "Once the lender’s conditional approval is in," },
  { at: 22.35, text: "EquiBridge funds a short-term second mortgage," },
  { at: 24.91, text: "paid through escrow directly to the cards." },
  { at: 27.21, text: "No cash to the borrower." },
  { at: 28.67, text: "After a rapid rescore, the refinance closes and pays off the bridge." },
  { at: 32.6, text: "" },
];

export const DISCLAIMER =
  "Hypothetical example; fictional borrower. Projected and updated scores are illustrations, not actual results. Not a guarantee of score improvement, underwriting approval, or refinance closing. Not a commitment to lend. Loans subject to credit approval, underwriting and applicable law. Secured by the home.";

type L = { tall: boolean; W: number; Hh: number; area: { x: number; y: number; w: number; h: number } };

const wide: L = { tall: false, W: 1280, Hh: 720, area: { x: 60, y: 128, w: 1160, h: 440 } };
const tall: L = { tall: true, W: 720, Hh: 1280, area: { x: 40, y: 250, w: 640, h: 710 } };

// ---------- Pieces ----------
function Heading({ l, t, eyebrow, title }: { l: L; t: number; eyebrow: string; title: string }) {
  return (
    <Abs x={l.area.x} y={l.tall ? 92 : 32} w={l.area.w} style={fade(t, 0)}>
      <Label style={{ fontSize: l.tall ? 16 : 14 }}>{eyebrow}</Label>
      <h3 style={{ fontFamily: H, fontSize: l.tall ? 36 : 34, lineHeight: 1.2, fontWeight: 800, color: C.navy, marginTop: 6 }}>{title}</h3>
    </Abs>
  );
}

function Area({ l, children, style }: { l: L; children: React.ReactNode; style?: React.CSSProperties }) {
  const a = l.area;
  return (
    <Abs
      x={a.x}
      y={a.y}
      w={a.w}
      h={a.h}
      style={{ display: "flex", flexDirection: l.tall ? "column" : "row", gap: l.tall ? 20 : 28, alignItems: "stretch", ...style }}
    >
      {children}
    </Abs>
  );
}

function ScoreTrack({ score, w }: { score: number; w: number }) {
  const lo = 550;
  const hi = 700;
  const xOf = (v: number) => ((v - lo) / (hi - lo)) * w;
  const cut = (xOf(MINIMUM) / w) * 100;
  return (
    <div style={{ position: "relative", width: w, height: 44, marginTop: 30 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 12,
          width: w,
          height: 14,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${C.warnBg} 0%, ${C.warnBg} ${cut}%, ${C.mint} ${cut}%, ${C.mint} 100%)`,
        }}
      />
      <div style={{ position: "absolute", left: xOf(MINIMUM) - 1, top: 0, width: 3, height: 38, background: C.navy }} />
      <span style={{ position: "absolute", left: xOf(MINIMUM) - 60, top: -24, width: 120, textAlign: "center", fontSize: 14, fontWeight: 700 }}>
        Minimum {MINIMUM}
      </span>
      <div
        style={{
          position: "absolute",
          left: xOf(score) - 13,
          top: 6,
          width: 26,
          height: 26,
          borderRadius: 999,
          background: score >= MINIMUM ? C.deep : C.warn,
          border: "4px solid #fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}

function Strip({ l, y, h, opacity }: { l: L; y: number; h: number; opacity: number }) {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: l.W,
        height: h,
        boxSizing: "border-box",
        padding: l.tall ? "10px 28px" : "8px 60px",
        background: "rgba(255,255,255,0.96)",
        borderTop: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        fontSize: l.tall ? 15 : 13.5,
        lineHeight: 1.4,
        color: C.body,
        opacity,
      }}
    >
      {DISCLAIMER}
    </div>
  );
}

// ---------- Scenes (local clock: t = 0 at scene start) ----------
function SFile({ l, t }: { l: L; t: number }) {
  const checks = [
    { title: "Income", text: "Solid and documented", a: 1.5 },
    { title: "Home equity", text: "Plenty in the home", a: 2.5 },
    { title: "Payment history", text: "No lates · No collections", a: 3.5 },
  ];
  const dim = at(t, 9.1, 0.5);
  const card = at(t, 9.3, 0.6);
  const mark = ease(prog(t, 10, 1.1));
  const trackW = l.tall ? 520 : 500;
  return (
    <>
      <Heading l={l} t={t} eyebrow="The file every broker knows" title="Qualifies for everything… almost" />
      <Area l={l}>
        <div style={{ flex: l.tall ? "0 0 auto" : "0 0 470px", display: "flex", flexDirection: "column", gap: l.tall ? 14 : 18 }}>
          {checks.map((c) => (
            <div key={c.title} style={{ ...panel, padding: "18px 22px", display: "flex", gap: 16, alignItems: "center", ...fade(t, c.a) }}>
              <span
                style={{
                  flex: "0 0 44px",
                  height: 44,
                  borderRadius: 999,
                  background: C.ok,
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓
              </span>
              <div>
                <p style={{ fontFamily: H, fontSize: 22, fontWeight: 800 }}>{c.title}</p>
                <p style={{ fontSize: 17, color: C.body, marginTop: 2 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...panel, flex: l.tall ? "0 0 auto" : 1, padding: "26px 36px", ...fade(t, 5.4) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <Label>Middle credit score</Label>
              <p style={{ fontFamily: H, fontSize: 76, fontWeight: 800, lineHeight: 1, marginTop: 8, color: C.warn }}>{SCORES_BEFORE[1]}</p>
            </div>
            <div style={{ textAlign: "right", ...fade(t, 7.4) }}>
              <Label>Lender needs</Label>
              <p style={{ fontFamily: H, fontSize: 76, fontWeight: 800, lineHeight: 1, marginTop: 8, color: C.deep }}>{MINIMUM}</p>
            </div>
          </div>
          <div style={fade(t, 7.6)}>
            <ScoreTrack score={SCORES_BEFORE[1]} w={trackW} />
          </div>
          <div style={{ marginTop: 18, ...fade(t, 8.2) }}>
            <Pill tone="warn">{MINIMUM - SCORES_BEFORE[1]} points short</Pill>
          </div>
        </div>
      </Area>

      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(242,248,251,${0.9 * dim})` }} /> : null}
      {card > 0 ? (
        <Abs
          x={l.tall ? 40 : 140}
          y={l.tall ? 330 : 140}
          w={l.tall ? 640 : 1000}
          style={{
            ...panel,
            padding: l.tall ? "28px 30px" : "30px 44px",
            border: `2px solid ${C.warn}`,
            boxShadow: "0 24px 60px rgba(15,76,92,0.18)",
            opacity: card,
            transform: `scale(${0.92 + 0.08 * card})`,
          }}
        >
          <Label style={{ color: C.warn }}>Credit report · Key score factor</Label>
          <div style={{ height: 1, background: C.line, margin: "14px 0 22px" }} />
          <p style={{ fontFamily: H, fontSize: l.tall ? 34 : 38, fontWeight: 800, lineHeight: 1.3 }}>
            <span
              style={{
                backgroundImage: `linear-gradient(${C.warnBg}, ${C.warnBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${mark * 100}% 100%`,
                padding: "2px 6px",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              “{REASON}.”
            </span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26, ...fade(t, 10.4) }}>
            <Pill tone="warn">Revolving utilization: 95%</Pill>
            <Pill tone="warn">Maxed-out credit cards</Pill>
          </div>
        </Abs>
      ) : null}
    </>
  );
}

function SSim({ l, t }: { l: L; t: number }) {
  const drops = ACCOUNTS.map((_, k) => at(t, 2.3 + k * 0.3, 1.5));
  const bals = ACCOUNTS.map((a, k) => lerp(a.bal, a.target, drops[k]));
  const overall = bals.reduce((s, b) => s + b, 0) / LIMIT_TOTAL;
  const score = Math.round(lerp(SCORES_BEFORE[1], SCORES_AFTER[1], at(t, 5.9, 1.8)));
  const gain = score - SCORES_BEFORE[1];
  return (
    <>
      <Heading l={l} t={t} eyebrow="Step 1 · Takeout lender simulation" title="Pay the cards down. Project the score." />
      <Area l={l}>
        <div style={{ ...panel, flex: 1, padding: "22px 28px", ...fade(t, 0.2) }}>
          <Label>Simulated payoff</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: l.tall ? 12 : 14, marginTop: 14 }}>
            {ACCOUNTS.map((a, k) => {
              const u = bals[k] / a.limit;
              return (
                <div key={a.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: H, fontSize: 17, fontWeight: 700 }}>{a.name}</span>
                    <b style={{ fontFamily: H, fontSize: 17, color: u > 0.3 ? C.warn : C.ok }}>{pct(u)}</b>
                  </div>
                  <Bar value={u} color={u > 0.3 ? C.warn : C.teal} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
            <span style={{ fontFamily: H, fontSize: 19, fontWeight: 700 }}>Overall utilization</span>
            <span style={{ fontFamily: H, fontSize: 42, fontWeight: 800, color: overall > 0.3 ? C.warn : C.teal }}>{pct(overall)}</span>
          </div>
        </div>
        <div style={{ ...panel, flex: l.tall ? "0 0 auto" : "0 0 470px", padding: "22px 30px", ...fade(t, 0.6) }}>
          <Label>Projected middle score</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 10 }}>
            <p style={{ fontFamily: H, fontSize: l.tall ? 92 : 100, fontWeight: 800, lineHeight: 1, color: score >= MINIMUM ? C.deep : C.warn }}>{score}</p>
            {gain > 0 ? <span style={{ fontFamily: H, fontSize: 34, fontWeight: 800, color: C.ok }}>+{gain}</span> : null}
          </div>
          <ScoreTrack score={score} w={l.tall ? 560 : 405} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, ...fade(t, 7.4) }}>
            <Pill tone="ok">{MINIMUM}+ cleared</Pill>
            <Pill tone="info">Projected · hypothetical</Pill>
          </div>
        </div>
      </Area>
    </>
  );
}

function FlowNode({ title, sub, dark, done, style }: { title: string; sub: string; dark?: boolean; done?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        ...panel,
        flex: 1,
        padding: "16px 20px",
        background: dark ? C.deep : "#fff",
        border: dark ? "none" : `1px solid ${C.line}`,
        ...style,
      }}
    >
      <p style={{ fontFamily: H, fontSize: 20, fontWeight: 800, color: dark ? "#fff" : C.navy }}>
        {done ? "✓ " : ""}
        {title}
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.4, marginTop: 4, color: dark ? "#cfe9e8" : C.body }}>{sub}</p>
    </div>
  );
}

function Chevron({ l, p }: { l: L; p: number }) {
  return (
    <span
      style={{
        alignSelf: "center",
        fontFamily: H,
        fontSize: 28,
        fontWeight: 800,
        color: C.teal,
        opacity: p,
        transform: l.tall ? "rotate(90deg)" : undefined,
        lineHeight: 1,
      }}
    >
      →
    </span>
  );
}

function SFund({ l, t }: { l: L; t: number }) {
  const cardsIn = 4.6;
  return (
    <>
      <Heading l={l} t={t} eyebrow="Step 2 · Conditions first. Then funding." title="Proceeds go to the cards, not the borrower" />
      <Abs x={l.area.x} y={l.area.y} w={l.area.w} h={l.area.h} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: l.tall ? 18 : 24 }}>
        <div style={{ display: "flex", flexDirection: l.tall ? "column" : "row", gap: l.tall ? 6 : 14 }}>
          <FlowNode done title="Conditional approval" sub="From the takeout lender: only the score and payoffs remain" style={fade(t, 0.3)} />
          <Chevron l={l} p={at(t, 1.6)} />
          <FlowNode dark title="EquiBridge funds" sub="Short-term second mortgage" style={fade(t, 2.4)} />
          <Chevron l={l} p={at(t, 3.8)} />
          <FlowNode title={`Escrow · ${money(PAYOFF)}`} sub="Paid directly to each card" style={fade(t, 4)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: l.tall ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}>
          {ACCOUNTS.map((a, k) => {
            const paid = t >= cardsIn + 0.9 + k * 0.25;
            return (
              <div key={a.name} style={{ ...panel, padding: "14px 18px", ...fade(t, cardsIn + k * 0.15) }}>
                <p style={{ fontFamily: H, fontSize: 17, fontWeight: 700 }}>{a.name}</p>
                <div style={{ marginTop: 8 }}>
                  {paid ? (
                    <Pill tone="ok" style={{ fontSize: 15, padding: "5px 12px" }}>
                      {a.target === 0 ? "✓ Paid · $0" : `✓ Down to ${money(a.target)}`}
                    </Pill>
                  ) : (
                    <Pill tone="warn" style={{ fontSize: 15, padding: "5px 12px" }}>
                      {money(a.bal)}
                    </Pill>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", ...fade(t, 7.2) }}>
          <Pill tone="info" style={{ fontSize: 19, padding: "10px 22px" }}>
            ✓ No cash to the borrower
          </Pill>
        </div>
      </Abs>
    </>
  );
}

function SClose({ l, t }: { l: L; t: number }) {
  const up = at(t, 0.2, 1.4);
  return (
    <>
      <Heading l={l} t={t} eyebrow="Step 3 · Rapid rescore" title="The refinance closes. The bridge is paid off." />
      <Abs x={l.area.x} y={l.area.y} w={l.area.w} h={l.area.h} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: l.tall ? 22 : 26 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {SCORES_BEFORE.map((b, k) => {
            const mid = k === 1;
            const v = Math.round(lerp(b, SCORES_AFTER[k], up));
            return (
              <div
                key={k}
                style={{
                  ...panel,
                  flex: 1,
                  padding: "16px 10px",
                  textAlign: "center",
                  border: mid ? `3px solid ${C.deep}` : `1px solid ${C.line}`,
                  background: mid ? C.tint : "#fff",
                }}
              >
                <p style={{ fontSize: 15, color: C.muted }}>{mid ? "Middle score" : `Bureau ${k + 1}`}</p>
                <p style={{ fontFamily: H, fontSize: l.tall ? 52 : 60, fontWeight: 800, lineHeight: 1.1, color: v >= MINIMUM ? C.deep : C.navy }}>{v}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: up >= 1 ? C.ok : C.muted }}>{up >= 1 ? "✓ Updated" : "Updating…"}</p>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: l.tall ? "column" : "row", gap: l.tall ? 6 : 14 }}>
          <FlowNode dark done title="Refinance closes" sub="The takeout lender funds the permanent loan" style={fade(t, 1.7)} />
          <Chevron l={l} p={at(t, 2.4)} />
          <FlowNode done title="Bridge paid off" sub="EquiBridge is repaid at closing" style={fade(t, 2.6)} />
        </div>
      </Abs>
    </>
  );
}

function SEnd({ l, t }: { l: L; t: number }) {
  const W = l.W;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: l.tall ? 280 : 56, width: W, textAlign: "center", ...fade(t, 0, 0.5) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 20 }}>
          <Image src="/logo-mark.png" alt="" width={l.tall ? 174 : 203} height={l.tall ? 60 : 70} loading="eager" />
          <p style={{ fontFamily: H, fontSize: l.tall ? 40 : 46, fontWeight: 800, lineHeight: 1 }}>
            Equi<span style={{ color: C.teal }}>Bridge</span> <span style={{ fontSize: l.tall ? 17 : 20, letterSpacing: 7, color: C.deep }}>CAPITAL</span>
          </p>
        </div>
        <p style={{ fontSize: l.tall ? 18 : 18, color: C.body, marginTop: 10 }}>Intelligent Lending. Greater Possibilities.</p>
      </div>
      <Abs
        x={l.tall ? 40 : 160}
        y={l.tall ? 480 : 196}
        w={l.tall ? 640 : 960}
        style={{ ...panel, textAlign: "center", padding: l.tall ? "40px 30px" : "34px 48px", borderTop: `6px solid ${C.aqua}`, ...fade(t, 0.3) }}
      >
        <p style={{ fontFamily: H, fontSize: l.tall ? 44 : 46, fontWeight: 800, lineHeight: 1.2, color: C.navy }}>
          Send us your next <span style={{ color: C.teal }}>“almost”</span> file.
        </p>
        <div style={{ marginTop: 24, ...fade(t, 0.8) }}>
          <span
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 999,
              background: C.deep,
              color: "#fff",
              fontFamily: H,
              fontSize: 22,
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15,76,92,0.25)",
            }}
          >
            Submit a Scenario →
          </span>
        </div>
        <p style={{ fontSize: 19, color: C.body, marginTop: 18, ...fade(t, 1.1) }}>
          equibridgecapital.com{l.tall ? <br /> : " · "}
          {CONTACT.phone}
        </p>
      </Abs>
    </>
  );
}

const VIEWS = [SFile, SSim, SFund, SClose, SEnd];

function captionAt(t: number) {
  let c = "";
  for (const cap of CAPTIONS) if (t >= cap.at) c = cap.text;
  return c;
}

// ---------- Player ----------
export default function ShortExplainer({ record = false, format = "wide" }: { record?: boolean; format?: "wide" | "tall" }) {
  const l = format === "tall" ? tall : wide;
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [box, setBox] = useState({ s: 0, x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const seek = useCallback((v: number) => {
    const n = Math.min(DURATION, Math.max(0, v));
    tRef.current = n;
    setT(n);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(width / l.W, height / l.Hh);
      setBox({ s, x: (width - l.W * s) / 2, y: (height - l.Hh * s) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [l.W, l.Hh]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const n = Math.min(DURATION, tRef.current + Math.min(0.1, (now - last) / 1000));
      last = now;
      seek(n);
      if (n >= DURATION) return setPlaying(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, seek]);

  useEffect(() => {
    if (!record) return;
    const w = window as unknown as { __ebSeek?: (v: number) => void; __ebDuration?: number };
    w.__ebSeek = (v: number) => seek(v);
    w.__ebDuration = DURATION;
  }, [record, seek]);

  const caption = captionAt(t);
  const endStart = SCENES[SCENES.length - 1].start;
  const startStrip = 1 - prog(t, STRIP_END - 0.5, 0.5);
  const endStrip = at(t, endStart + 0.4, 0.5);
  const capY = l.tall ? 990 : 640;
  const capH = l.tall ? 120 : 80;

  return (
    <div className="xp">
      <div
        ref={stageRef}
        className={record ? "xp-stage xp-record" : "xp-stage"}
        style={record ? undefined : { aspectRatio: l.tall ? "9 / 16" : "16 / 9", maxWidth: l.tall ? 420 : undefined, margin: l.tall ? "0 auto" : undefined }}
        aria-hidden="true"
      >
        <div className="xp-canvas" style={{ width: l.W, height: l.Hh, transform: `translate(${box.x}px, ${box.y}px) scale(${box.s})`, opacity: box.s ? 1 : 0 }}>
          {VIEWS.map((View, i) => {
            const s = SCENES[i];
            const last = i === SCENES.length - 1;
            if (!(t >= s.start && (last ? t <= s.end : t < s.end))) return null;
            const o = (i === 0 ? 1 : at(t, s.start, 0.45)) * (last ? 1 : 1 - prog(t, s.end - 0.35, 0.35));
            return (
              <div key={i} style={{ position: "absolute", inset: 0, opacity: o }}>
                <View l={l} t={t - s.start} />
              </div>
            );
          })}
          {t < endStart ? (
            <span style={{ position: "absolute", right: l.tall ? 40 : 60, top: l.tall ? 40 : 36 }}>
              <Pill tone="info" style={{ fontSize: 14, padding: "6px 14px" }}>
                Hypothetical illustration
              </Pill>
            </span>
          ) : null}
          {caption ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: capY,
                width: l.W,
                height: capH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: l.tall ? "0 36px" : "0 80px",
                boxSizing: "border-box",
                background: C.deep,
                color: "#fff",
                fontSize: l.tall ? 30 : 25,
                fontWeight: 600,
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              {caption}
            </div>
          ) : null}
          {/* Disclaimer strip: start of the video (above the captions) and the end card (bottom edge). */}
          <Strip l={l} y={l.tall ? capY + capH : capY - 64} h={l.tall ? 120 : 64} opacity={t < STRIP_END ? startStrip : 0} />
          <Strip l={l} y={l.tall ? 1100 : 632} h={l.tall ? 140 : 88} opacity={t >= endStart ? endStrip : 0} />
        </div>
      </div>
      {record ? null : (
        <div className="xp-controls">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => (t >= DURATION ? (seek(0), setPlaying(true)) : setPlaying((p) => !p))}>
            {playing ? "Pause" : "Play"}
          </button>
          <input type="range" min={0} max={DURATION} step={0.1} value={t} onChange={(e) => seek(Number(e.target.value))} aria-label="Position" />
        </div>
      )}
    </div>
  );
}
