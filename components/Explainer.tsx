"use client";

/*
 * Animated explainer for the How It Works page (v3).
 * Everything is drawn on a fixed 1280×720 canvas and scaled to fit, so it looks the same
 * on every screen and can be recorded frame by frame into an MP4 (see /explainer?record=1
 * and scripts/record-explainer.mjs).
 *
 * Timing: each scene has a start/end on the master clock (SCENES). Every scene component
 * receives a LOCAL clock that starts at 0, so retiming to a new voiceover only means
 * changing the SCENES and CAPTIONS numbers below.
 * Edit the story text in CAPTIONS and the sample numbers in ACCOUNTS / SCORES below.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export const DURATION = 145.3; // seconds

// ---------- Story content (edit here) ----------
const SCENES = [
  { start: 0, end: 27.5, label: "The problem", anim: 27.5 },
  { start: 27.5, end: 43.99, label: "The file", anim: 10.5 },
  { start: 43.99, end: 60.08, label: "Score simulation", anim: 12.0 },
  { start: 60.08, end: 77.95, label: "Conditions first", anim: 15.5 },
  { start: 77.95, end: 97.18, label: "Controlled funding", anim: 15.2 },
  { start: 97.18, end: 106.4, label: "Rapid rescore", anim: 8.0 },
  { start: 106.4, end: 116.67, label: "Refinance closes", anim: 7.5 },
  { start: 116.67, end: 129.42, label: "Know the risk", anim: 8.0 },
  { start: 129.42, end: 145.3, label: "Let’s talk", anim: 10.5 },
];

// The narration script. Captions, the SRT file and the voiceover all come from this list.
export const CAPTIONS = [
  { at: 0.2, text: "Every mortgage broker knows this file." },
  { at: 2.77, text: "Your borrower has the income, the home equity, and a perfect payment history." },
  { at: 7.72, text: "But there’s one problem: their credit score falls just short of qualifying." },
  { at: 12.59, text: "The culprit? “Proportion of balances to credit limits is too high.”" },
  { at: 17.36, text: "What if paying down those credit cards could unlock the refinance?" },
  { at: 21.27, text: "And what if the takeout lender could project the improvement before funding a single dollar?" },
  { at: 27.9, text: "Here’s the file: four credit cards near their limits, and 95% overall utilization." },
  { at: 34.35, text: "No late payments, no collections, no derogatory history. Middle score: 592. The takeout lender needs 620." },
  { at: 44.39, text: "The takeout lender runs a credit score simulation." },
  { at: 47.68, text: "Pay those balances down, and utilization drops from 95% to about 3%." },
  { at: 53.64, text: "Projected middle score: 668. A 76-point projected improvement." },
  { at: 60.48, text: "We don’t fund the bridge and hope the refinance works. We identify the remaining conditions first." },
  { at: 67.23, text: "The takeout lender has already accepted income, assets, employment, appraisal, and title." },
  { at: 73.59, text: "Only the middle score and the designated card payoffs remain." },
  { at: 78.35, text: "Then EquiBridge funds a one-year, interest-only, closed-end second mortgage, with the balance due as a balloon payment at the end of the term." },
  { at: 87.4, text: "The $33,200 goes through escrow directly to the card companies." },
  { at: 92.67, text: "No cash to the borrower. Every payoff documented." },
  { at: 97.58, text: "The takeout lender submits proof of the new balances and requests a rapid rescore." },
  { at: 103.09, text: "That typically takes about one to two weeks." },
  { at: 106.8, text: "In this hypothetical example, the middle score updates to 668." },
  { at: 111.84, text: "The refinance closes and pays off the EquiBridge second mortgage." },
  { at: 117.07, text: "Conditional approval, score projections, and rapid rescoring don’t guarantee a refinance." },
  { at: 123.2, text: "Every bridge loan must independently meet legal, underwriting, and repayment requirements." },
  { at: 129.82, text: "EquiBridge Capital. Turning credit-constrained borrowers into refinance-ready opportunities." },
  { at: 136.11, text: "Have a borrower who qualifies for everything except the credit score? Let’s see if EquiBridge can help." },
];

const ACCOUNTS = [
  { name: "Bank card 1", bal: 11640, limit: 12000, target: 0 },
  { name: "Bank card 2", bal: 9310, limit: 10000, target: 0 },
  { name: "Store card", bal: 4850, limit: 5000, target: 0 },
  { name: "Rewards card", bal: 8300, limit: 9000, target: 900 },
];
const SCORES_BEFORE = [584, 592, 601];
const SCORES_AFTER = [659, 668, 676]; // hypothetical illustration, middle = 668
const MINIMUM = 620;
const REASON = "Proportion of balances to credit limits is too high";

// ---------- Helpers ----------
const C = {
  navy: "#2b2d42",
  deep: "#0f4c5c",
  teal: "#1b6b73",
  aqua: "#5bc0be",
  mint: "#d8f3dc",
  bg: "#f2f8fb",
  tint: "#e4f1f4",
  line: "#d5e3ea",
  body: "#4a5568",
  muted: "#56657a",
  warn: "#b93d0b",
  warnBg: "#fdeee4",
  ok: "#17714a",
  okBg: "#e3f5ea",
};
const H = "var(--font-heading)";
const LIMIT_TOTAL = ACCOUNTS.reduce((s, a) => s + a.limit, 0);
const PAYOFF = ACCOUNTS.reduce((s, a) => s + (a.bal - a.target), 0);

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const prog = (t: number, a: number, d: number) => clamp((t - a) / d);
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const at = (t: number, a: number, d = 0.6) => ease(prog(t, a, d));
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const pct = (n: number) => `${Math.round(n * 100)}%`;
const fade = (t: number, a: number, d = 0.6): React.CSSProperties => {
  const e = at(t, a, d);
  return { opacity: e, transform: `translateY(${(1 - e) * 14}px)` };
};
const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const panel: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${C.line}`,
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 12px 32px rgba(15,76,92,0.08)",
};

function Abs({
  x,
  y,
  w,
  h,
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", ...style }}>{children}</div>;
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.teal, ...style }}>
      {children}
    </p>
  );
}

function Pill({ tone, children, style }: { tone: "warn" | "ok" | "info"; children: React.ReactNode; style?: React.CSSProperties }) {
  const colors = {
    warn: [C.warnBg, C.warn],
    ok: [C.okBg, C.ok],
    info: [C.mint, C.deep],
  }[tone];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "8px 16px",
        borderRadius: 999,
        background: colors[0],
        color: colors[1],
        fontFamily: H,
        fontSize: 17,
        fontWeight: 700,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Header({ t, a, eyebrow, title }: { t: number; a: number; eyebrow: string; title: string }) {
  return (
    <Abs x={60} y={32} w={1000} style={fade(t, a)}>
      <Label>{eyebrow}</Label>
      <h3 style={{ fontFamily: H, fontSize: 34, fontWeight: 800, color: C.navy, marginTop: 6 }}>{title}</h3>
    </Abs>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 10, borderRadius: 999, background: C.tint, overflow: "hidden", marginTop: 8 }}>
      <div style={{ width: `${clamp(value) * 100}%`, height: "100%", borderRadius: 999, background: color }} />
    </div>
  );
}

function Arrow({ x1, y1, x2, y2, p, color = C.teal }: { x1: number; y1: number; x2: number; y2: number; p: number; color?: string }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const s = 13;
  const head = [
    [x2, y2],
    [x2 - s * Math.cos(ang - 0.45), y2 - s * Math.sin(ang - 0.45)],
    [x2 - s * Math.cos(ang + 0.45), y2 - s * Math.sin(ang + 0.45)],
  ]
    .map((q) => q.join(","))
    .join(" ");
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <polygon points={head} fill={color} opacity={p > 0.97 ? 1 : 0} />
    </g>
  );
}

function Node({
  x,
  y,
  w = 260,
  h = 120,
  title,
  sub,
  dark,
  style,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Abs
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        ...panel,
        padding: "18px 20px",
        background: dark ? C.deep : "#fff",
        border: dark ? "none" : `1px solid ${C.line}`,
        ...style,
      }}
    >
      <p style={{ fontFamily: H, fontSize: 20, fontWeight: 800, color: dark ? "#fff" : C.navy }}>{title}</p>
      {sub ? <div style={{ fontSize: 15, lineHeight: 1.45, marginTop: 6, color: dark ? "#cfe9e8" : C.body }}>{sub}</div> : null}
    </Abs>
  );
}

function Check({ ok = true }: { ok?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: 999,
        background: ok ? C.ok : C.muted,
        color: "#fff",
        fontSize: 15,
        fontWeight: 800,
        flex: "0 0 26px",
      }}
    >
      ✓
    </span>
  );
}

function Doc({ x, y, opacity }: { x: number; y: number; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 14,
        top: y - 18,
        width: 28,
        height: 36,
        borderRadius: 4,
        background: "#fff",
        border: `2px solid ${C.teal}`,
        opacity,
        padding: "6px 4px",
        boxSizing: "border-box",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 2, background: C.aqua, marginBottom: 5, width: i === 2 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

// ---------- Scenes (each gets a local clock: t = 0 at the start of its scene) ----------
function Scene({ t, i, children }: { t: number; i: number; children: (local: number) => React.ReactNode }) {
  const s = SCENES[i];
  const last = i === SCENES.length - 1;
  const inScene = t >= s.start && (last ? t <= s.end : t < s.end);
  if (!inScene) return null;
  const fadeIn = i === 0 ? 1 : at(t, s.start, 0.6);
  const fadeOut = last ? 1 : 1 - prog(t, s.end - 0.5, 0.5);
  // Each scene's animation was designed on an `anim`-second clock; stretch it to fit the voiceover.
  const local = ((t - s.start) * s.anim) / (s.end - s.start);
  return <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut }}>{children(local)}</div>;
}

function Hook({ t }: { t: number }) {
  const items = [
    { title: "Income", text: "Documented and stable", a: 2.8 },
    { title: "Home equity", text: "Plenty in the home", a: 4.2 },
    { title: "Payment history", text: "Perfect: no late payments", a: 5.6 },
  ];
  const lo = 550;
  const hi = 700;
  const trackW = 640;
  const xOf = (v: number) => ((v - lo) / (hi - lo)) * trackW;
  // Phase B: spotlight the reason code. Phase C: dark "What if…" wipe.
  const dim = at(t, 12.1, 0.5);
  const card = at(t, 12.4, 0.7);
  const mark = ease(prog(t, 13.4, 1.3));
  const wipe = ease(prog(t, 16.9, 0.9));
  return (
    <>
      <Header t={t} a={-1} eyebrow="The file every broker knows" title="Your borrower qualifies for almost everything" />
      {items.map((it, k) => (
        <Abs key={it.title} x={60 + k * 400} y={140} w={360} h={130} style={{ ...panel, display: "flex", gap: 18, alignItems: "center", ...fade(t, it.a) }}>
          <span
            style={{
              flex: "0 0 52px",
              height: 52,
              borderRadius: 999,
              background: C.ok,
              color: "#fff",
              fontSize: 26,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </span>
          <div>
            <p style={{ fontFamily: H, fontSize: 24, fontWeight: 800 }}>{it.title}</p>
            <p style={{ fontSize: 17, color: C.body, marginTop: 4 }}>{it.text}</p>
          </div>
        </Abs>
      ))}
      <Abs x={160} y={310} w={960} h={290} style={{ ...panel, padding: "28px 40px", ...fade(t, 8) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <Label>Middle credit score</Label>
            <p style={{ fontFamily: H, fontSize: 80, fontWeight: 800, lineHeight: 1, marginTop: 8, color: C.warn }}>{SCORES_BEFORE[1]}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label>Takeout lender minimum</Label>
            <p style={{ fontFamily: H, fontSize: 80, fontWeight: 800, lineHeight: 1, marginTop: 8, color: C.deep }}>{MINIMUM}</p>
          </div>
        </div>
        <div style={{ position: "relative", margin: "26px auto 0", width: trackW, height: 44 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 10,
              width: trackW,
              height: 14,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.warnBg} 0%, ${C.warnBg} ${(xOf(MINIMUM) / trackW) * 100}%, ${C.mint} ${(xOf(MINIMUM) / trackW) * 100}%, ${C.mint} 100%)`,
            }}
          />
          <div style={{ position: "absolute", left: xOf(MINIMUM) - 1, top: 0, width: 3, height: 34, background: C.navy }} />
          <div
            style={{
              position: "absolute",
              left: xOf(SCORES_BEFORE[1]) - 13,
              top: 4,
              width: 26,
              height: 26,
              borderRadius: 999,
              background: C.warn,
              border: "4px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 14, ...fade(t, 9.8) }}>
          <Pill tone="warn">Just short of qualifying: {MINIMUM - SCORES_BEFORE[1]} points</Pill>
        </div>
      </Abs>

      {/* Phase B: the reason code */}
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(242,248,251,${0.88 * dim})`, backdropFilter: `blur(${3 * dim}px)` }} /> : null}
      {card > 0 ? (
        <Abs
          x={140}
          y={150}
          w={1000}
          h={340}
          style={{
            ...panel,
            padding: "30px 44px",
            border: `2px solid ${C.warn}`,
            boxShadow: "0 24px 60px rgba(15,76,92,0.18)",
            opacity: card,
            transform: `scale(${0.92 + 0.08 * card})`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Label style={{ color: C.warn }}>Credit report · Key score factor</Label>
            <span style={{ fontSize: 15, color: C.muted }}>Sample Borrower · Bureau 2</span>
          </div>
          <div style={{ height: 1, background: C.line, margin: "16px 0 26px" }} />
          <p style={{ fontSize: 18, color: C.muted }}>Factor 1 of 4</p>
          <p style={{ fontFamily: H, fontSize: 40, fontWeight: 800, lineHeight: 1.25, marginTop: 8, position: "relative", display: "inline" }}>
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
          <div style={{ display: "flex", gap: 14, marginTop: 30, ...fade(t, 14.6) }}>
            <Pill tone="warn">Revolving utilization: 95%</Pill>
            <Pill tone="info">The only thing holding the score down</Pill>
          </div>
        </Abs>
      ) : null}

      {/* Phase C: “What if…” */}
      {wipe > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${C.deep} 0%, ${C.teal} 70%, #227c84 100%)`,
            clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)`,
          }}
        >
          <div style={{ position: "absolute", left: 120, top: 120, width: 1040 }}>
            <p style={{ fontFamily: H, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.aqua, ...fade(t, 17.3) }}>
              What if…
            </p>
            <p style={{ fontFamily: H, fontSize: 44, fontWeight: 800, lineHeight: 1.25, color: "#fff", marginTop: 18, ...fade(t, 17.6, 0.8) }}>
              …paying down those cards could unlock the refinance?
            </p>
            <p style={{ fontFamily: H, fontSize: 44, fontWeight: 800, lineHeight: 1.25, color: C.mint, marginTop: 28, ...fade(t, 22, 0.8) }}>
              …and the takeout lender could project the improvement before a single dollar is funded?
            </p>
          </div>
          <div style={{ position: "absolute", left: 0, top: 540, width: 1280, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, ...fade(t, 25.6) }}>
            <span style={{ height: 2, width: 80, background: C.aqua }} />
            <span style={{ fontFamily: H, fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#fff" }}>Here’s how EquiBridge works</span>
            <span style={{ height: 2, width: 80, background: C.aqua }} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function S1({ t }: { t: number }) {
  const fills = ACCOUNTS.map((_, k) => at(t, 1.3 + k * 0.3, 1.3));
  const overall = ACCOUNTS.reduce((s, a, k) => s + a.bal * fills[k], 0) / LIMIT_TOTAL;
  const clean = ["No late payments", "No collections", "No derogatory items", "No public records"];
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 1 · The “almost” file" title="Sample Borrower’s credit report" />
      <Abs x={60} y={130} w={540} h={480} style={{ ...panel, ...fade(t, 0.2) }}>
        <Label>Credit scores · tri-merge report</Label>
        <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
          {SCORES_BEFORE.map((s, k) => {
            const mid = k === 1;
            return (
              <div
                key={k}
                style={{
                  flex: 1,
                  height: 118,
                  borderRadius: 14,
                  background: mid ? C.tint : C.bg,
                  border: `3px solid ${mid && t >= 7 ? C.deep : "transparent"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 16, color: C.muted }}>Bureau {k + 1}</span>
                <span style={{ fontFamily: H, fontSize: 48, fontWeight: 800, color: C.navy, lineHeight: 1.1 }}>{s}</span>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: 12, fontSize: 17, fontWeight: 700, color: C.teal, textAlign: "center", ...fade(t, 7) }}>
          ▲ The middle score is the one lenders use
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
            padding: "12px 18px",
            background: C.bg,
            borderRadius: 12,
            ...fade(t, 8.6),
          }}
        >
          <span style={{ fontSize: 18 }}>
            Takeout lender minimum <b style={{ fontFamily: H }}>{MINIMUM}</b>
          </span>
          <Pill tone="warn">{MINIMUM - SCORES_BEFORE[1]} points short</Pill>
        </div>
        <Label style={{ marginTop: 24 }}>Payment history &amp; derogatory items</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginTop: 12 }}>
          {clean.map((c, k) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, ...fade(t, 5.2 + k * 0.3) }}>
              <Check />
              {c}
            </div>
          ))}
        </div>
      </Abs>

      <Abs x={640} y={130} w={580} h={480} style={{ ...panel, ...fade(t, 0.8) }}>
        <Label>Revolving accounts</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 18 }}>
          {ACCOUNTS.map((a, k) => (
            <div key={a.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>{a.name}</span>
                <span style={{ fontSize: 16, color: C.body }}>
                  {money(a.bal * fills[k])} of {money(a.limit)}
                  <b style={{ fontFamily: H, color: C.warn, marginLeft: 14, fontSize: 18 }}>{pct((a.bal * fills[k]) / a.limit)}</b>
                </span>
              </div>
              <Bar value={(a.bal * fills[k]) / a.limit} color={C.warn} />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 26,
            paddingTop: 18,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <span style={{ fontFamily: H, fontSize: 20, fontWeight: 700 }}>Overall utilization</span>
          <span style={{ fontFamily: H, fontSize: 44, fontWeight: 800, color: C.warn }}>{pct(overall)}</span>
        </div>
      </Abs>
    </>
  );
}

function S2({ t }: { t: number }) {
  const drops = ACCOUNTS.map((_, k) => at(t, 3.4 + k * 0.35, 1.4));
  const bals = ACCOUNTS.map((a, k) => lerp(a.bal, a.target, drops[k]));
  const overall = bals.reduce((s, b) => s + b, 0) / LIMIT_TOTAL;
  const score = Math.round(lerp(SCORES_BEFORE[1], SCORES_AFTER[1], at(t, 7.6, 2.2)));
  const gain = score - SCORES_BEFORE[1];
  const lo = 550;
  const hi = 700;
  const trackW = 470;
  const xOf = (v: number) => ((v - lo) / (hi - lo)) * trackW;
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 2 · At the takeout lender" title="Score simulation: what if the balances drop?" />
      <Abs x={60} y={130} w={600} h={480} style={{ ...panel, ...fade(t, 0.3) }}>
        <Label>Simulated payoff</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 18 }}>
          {ACCOUNTS.map((a, k) => {
            const u = bals[k] / a.limit;
            return (
              <div key={a.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>{a.name}</span>
                  <span style={{ fontSize: 16, color: C.body }}>
                    {drops[k] >= 1 ? (
                      <b style={{ color: C.ok }}>✓ {money(a.target)}</b>
                    ) : (
                      <>
                        {money(bals[k])} <span style={{ color: C.muted }}>→ {money(a.target)}</span>
                      </>
                    )}
                  </span>
                </div>
                <Bar value={u} color={u > 0.3 ? C.warn : C.teal} />
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 26,
            paddingTop: 18,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <span style={{ fontFamily: H, fontSize: 20, fontWeight: 700 }}>Overall utilization</span>
          <span style={{ fontFamily: H, fontSize: 44, fontWeight: 800, color: overall > 0.3 ? C.warn : C.teal }}>{pct(overall)}</span>
        </div>
      </Abs>

      <Abs x={690} y={130} w={530} h={480} style={{ ...panel, ...fade(t, 1.2) }}>
        <Label>Projected middle score · hypothetical</Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 18 }}>
          <p style={{ fontFamily: H, fontSize: 104, fontWeight: 800, lineHeight: 1, color: score >= MINIMUM ? C.deep : C.navy }}>{score}</p>
          {gain > 0 ? <span style={{ fontFamily: H, fontSize: 34, fontWeight: 800, color: C.ok }}>+{gain}</span> : null}
        </div>
        <div style={{ position: "relative", marginTop: 44, width: trackW, height: 60 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 20,
              width: trackW,
              height: 14,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.warnBg} 0%, ${C.warnBg} ${(xOf(MINIMUM) / trackW) * 100}%, ${C.mint} ${(xOf(MINIMUM) / trackW) * 100}%, ${C.mint} 100%)`,
            }}
          />
          <div style={{ position: "absolute", left: xOf(MINIMUM) - 1, top: 6, width: 3, height: 42, background: C.navy }} />
          <span style={{ position: "absolute", left: xOf(MINIMUM) - 60, top: -22, width: 120, textAlign: "center", fontSize: 15, fontWeight: 700 }}>
            Minimum {MINIMUM}
          </span>
          <div
            style={{
              position: "absolute",
              left: xOf(score) - 13,
              top: 14,
              width: 26,
              height: 26,
              borderRadius: 999,
              background: C.deep,
              border: "4px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          />
          <span style={{ position: "absolute", left: 0, top: 44, fontSize: 14, color: C.muted }}>{lo}</span>
          <span style={{ position: "absolute", right: 0, top: 44, fontSize: 14, color: C.muted }}>{hi}</span>
        </div>
        <div style={{ marginTop: 24, ...fade(t, 9.4) }}>
          <Pill tone="ok" style={{ fontSize: 20, padding: "10px 20px" }}>
            {SCORES_AFTER[1] - SCORES_BEFORE[1]}-Point Projected Improvement
          </Pill>
        </div>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 18, lineHeight: 1.5, ...fade(t, 9.8) }}>
          Simulation performed or accepted by the takeout lender. Hypothetical illustration, not an actual scoring result.
        </p>
      </Abs>
    </>
  );
}

function S3({ t }: { t: number }) {
  const flow = [
    { x: 60, title: "Takeout lender underwriting", sub: "Full file reviewed", a: 0.8 },
    { x: 475, title: "Conditional approval", sub: "Remaining conditions named", a: 2.2 },
    { x: 890, title: "EquiBridge funding", sub: "Only after approval", a: 3.6 },
  ];
  const accepted = ["Income", "Assets", "Employment", "Appraisal", "Title", "Property documentation"];
  const unlocked = t >= 13.4;
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 3 · Conditions first" title="We identify the remaining conditions first" />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <Arrow x1={396} y1={190} x2={469} y2={190} p={at(t, 1.6, 0.6)} />
        <Arrow x1={811} y1={190} x2={884} y2={190} p={at(t, 3, 0.6)} />
      </svg>
      {flow.map((f, k) => {
        const last = k === 2;
        return (
          <Node
            key={f.title}
            x={f.x}
            y={135}
            w={330}
            h={110}
            dark={!last || unlocked}
            title={f.title}
            sub={last ? (unlocked ? "✓ Conditions confirmed: cleared to fund" : "Waits for the takeout lender’s approval") : f.sub}
            style={{
              ...fade(t, f.a),
              ...(last && !unlocked ? { border: `2px dashed ${C.teal}` } : {}),
              ...(last && unlocked ? { boxShadow: `0 0 0 6px ${C.mint}, 0 12px 32px rgba(15,76,92,0.18)` } : {}),
            }}
          />
        );
      })}

      <Abs x={60} y={280} w={680} h={330} style={{ ...panel, ...fade(t, 6.2) }}>
        <Label>Reviewed &amp; accepted by the takeout lender</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px", marginTop: 20 }}>
          {accepted.map((c, k) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 19, ...fade(t, 6.8 + k * 0.45) }}>
              <Check />
              {c}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, color: C.muted, marginTop: 26, ...fade(t, 9.8) }}>
          Material underwriting requirements are satisfied before EquiBridge funds a dollar.
        </p>
      </Abs>

      <Abs x={770} y={280} w={450} h={330} style={{ ...panel, borderTop: `6px solid ${C.warn}`, ...fade(t, 11.4) }}>
        <Label style={{ color: C.warn }}>The only barriers left</Label>
        {[
          ["1", `Middle FICO of ${MINIMUM} or higher`],
          ["2", `Designated card payoffs · ${money(PAYOFF)}`],
        ].map(([n, text], k) => (
          <div
            key={n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: k === 0 ? 20 : 14,
              padding: "14px 16px",
              borderRadius: 14,
              background: C.warnBg,
              fontFamily: H,
              fontSize: 19,
              fontWeight: 700,
              ...fade(t, 11.8 + k * 0.5),
            }}
          >
            <span
              style={{
                flex: "0 0 32px",
                height: 32,
                borderRadius: 999,
                background: C.warn,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              {n}
            </span>
            {text}
          </div>
        ))}
        <p style={{ fontSize: 15, color: C.body, marginTop: 18, lineHeight: 1.45, ...fade(t, 13) }}>
          Confirmed in writing by the takeout lender. The bridge and the rescore are built to clear both.
        </p>
      </Abs>
    </>
  );
}

function S4({ t }: { t: number }) {
  const credX = [70, 365, 660, 955];
  const ex = 950;
  const ey = 270;
  const points = ["No cash to the borrower", "Card balances paid directly", "Payoff amounts & recipients documented", "Funds applied per the approved payoff plan"];
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 4 · Controlled funding" title="Proceeds go to the creditors, not the borrower" />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <Arrow x1={546} y1={200} x2={734} y2={200} p={at(t, 1.6, 0.9)} />
        {credX.map((x, k) => (
          <Arrow key={k} x1={ex} y1={ey} x2={x + 127} y2={340} p={at(t, 3.8 + k * 0.12, 0.8)} color={C.aqua} />
        ))}
      </svg>
      <span style={{ position: "absolute", left: 546, top: 160, width: 188, textAlign: "center", fontFamily: H, fontSize: 20, fontWeight: 800, color: C.deep, ...fade(t, 2) }}>
        {money(PAYOFF)}
      </span>
      <Node
        x={120}
        y={130}
        w={420}
        h={140}
        dark
        title="EquiBridge Capital"
        sub="1-year, interest-only, closed-end second mortgage · balloon due at maturity"
        style={fade(t, 0.2)}
      />
      <Node x={740} y={130} w={420} h={140} title="Escrow" sub="Disburses directly to each designated creditor, per the approved payoff plan" style={fade(t, 2.4)} />

      {ACCOUNTS.map((a, k) => {
        const travel = prog(t, 4.8 + k * 0.25, 1.3);
        const dx = lerp(ex, credX[k] + 127, ease(travel));
        const dy = lerp(ey, 345, ease(travel));
        const paid = t >= 6.1 + k * 0.25;
        return (
          <div key={a.name}>
            {travel > 0 && travel < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: dx - 16,
                  top: dy - 16,
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  background: C.deep,
                  color: "#fff",
                  fontFamily: H,
                  fontWeight: 800,
                  fontSize: 17,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                $
              </div>
            ) : null}
            <Abs x={credX[k]} y={345} w={255} h={130} style={{ ...panel, padding: "16px 20px", ...fade(t, 3.4 + k * 0.12) }}>
              <p style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>{a.name}</p>
              <p style={{ fontSize: 15, color: C.body, marginTop: 4 }}>Paid directly: {money(a.bal - a.target)}</p>
              <div style={{ marginTop: 10 }}>
                {paid ? (
                  <Pill tone="ok" style={{ fontSize: 15, padding: "6px 12px" }}>
                    {a.target === 0 ? "✓ Balance $0" : `✓ Down to ${money(a.target)}`}
                  </Pill>
                ) : (
                  <Pill tone="warn" style={{ fontSize: 15, padding: "6px 12px" }}>
                    Balance {money(a.bal)}
                  </Pill>
                )}
              </div>
            </Abs>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 90, top: 502, width: 1100, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {points.map((p, k) => (
          <Pill key={p} tone="info" style={{ fontSize: 16, padding: "8px 16px", ...fade(t, 9 + k * 0.45) }}>
            ✓ {p}
          </Pill>
        ))}
      </div>
    </>
  );
}

function S5({ t }: { t: number }) {
  const rowY = [140, 216, 292, 368];
  const bY = [140, 238, 336];
  const vx = 520;
  const vy = 200;
  const tl = prog(t, 2.4, 5);
  const marks = [
    { p: 0, label: "Proof of new balances" },
    { p: 0.45, label: "Rapid rescore requested" },
    { p: 0.95, label: "About 1–2 weeks · Bureaus update" },
  ];
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 5 · Rapid rescore" title="Proof of the new balances goes to the bureaus" />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        {rowY.map((y, k) => (
          <Arrow key={k} x1={334} y1={y + 31} x2={514} y2={275} p={at(t, 0.8 + k * 0.1, 0.6)} color={C.aqua} />
        ))}
        {bY.map((y, k) => (
          <Arrow key={k} x1={784} y1={275} x2={954} y2={y + 42} p={at(t, 3 + k * 0.12, 0.6)} />
        ))}
      </svg>
      {ACCOUNTS.map((a, k) => (
        <Abs
          key={a.name}
          x={60}
          y={rowY[k]}
          w={270}
          h={62}
          style={{ ...panel, padding: "10px 16px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", ...fade(t, 0.2 + k * 0.1) }}
        >
          <span style={{ fontFamily: H, fontSize: 17, fontWeight: 700 }}>{a.name}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.ok }}>{money(a.target)}</span>
        </Abs>
      ))}
      {ACCOUNTS.map((_, k) => {
        const p = prog(t, 1.2 + k * 0.2, 1.1);
        return <Doc key={k} x={lerp(334, 514, ease(p))} y={lerp(rowY[k] + 31, 275, ease(p))} opacity={p > 0 && p < 1 ? 1 : 0} />;
      })}
      <Node
        x={vx}
        y={vy}
        w={260}
        h={150}
        title="Takeout lender"
        sub="Requests a rapid rescore through its authorized credit reporting process"
        style={{ border: `2px solid ${C.deep}`, ...fade(t, 0.6) }}
      />
      {bY.map((y, k) => {
        const done = t >= 6.4 + k * 0.3;
        return (
          <Abs key={k} x={960} y={y} w={260} h={84} style={{ ...panel, padding: "14px 18px", borderRadius: 14, ...fade(t, 3.2 + k * 0.12) }}>
            <p style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>Credit bureau {k + 1}</p>
            <p style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: done ? C.ok : C.muted }}>{done ? "✓ Updated" : "Updating…"}</p>
          </Abs>
        );
      })}
      <Abs x={80} y={450} w={1120} h={160} style={{ ...panel, padding: "22px 32px", ...fade(t, 2) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Label>Illustrative timeline</Label>
          <span style={{ fontFamily: H, fontSize: 26, fontWeight: 800, color: C.deep }}>
            About 1–2 weeks <span style={{ fontSize: 15, fontWeight: 600, color: C.muted }}>· not guaranteed</span>
          </span>
        </div>
        <div style={{ position: "relative", marginTop: 20, height: 70 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 6, height: 12, borderRadius: 999, background: C.tint }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 6,
              height: 12,
              width: `${tl * 100}%`,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.teal}, ${C.aqua})`,
            }}
          />
          {marks.map((m, k) => (
            <div key={k}>
              <div
                style={{
                  position: "absolute",
                  left: `calc(${m.p * 100}% - 12px)`,
                  top: 0,
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: tl >= m.p ? C.deep : "#fff",
                  border: `3px solid ${C.deep}`,
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 34,
                  fontSize: 15,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: tl >= m.p ? C.navy : C.muted,
                  ...(k === 0 ? { left: 0 } : k === marks.length - 1 ? { right: 0 } : { left: `${m.p * 100}%`, transform: "translateX(-50%)" }),
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </Abs>
    </>
  );
}

function S6({ t }: { t: number }) {
  const up = at(t, 0.3, 2.2);
  const xs = [145, 505, 865];
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 6 · Score updated" title="The remaining conditions clear. The refinance closes." />
      {SCORES_BEFORE.map((b, k) => {
        const mid = k === 1;
        const v = Math.round(lerp(b, SCORES_AFTER[k], up));
        return (
          <Abs
            key={k}
            x={xs[k]}
            y={135}
            w={270}
            h={165}
            style={{
              ...panel,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: mid ? `3px solid ${C.deep}` : `1px solid ${C.line}`,
              background: mid ? C.tint : "#fff",
              ...fade(t, 0.1 + k * 0.08),
            }}
          >
            <span style={{ fontSize: 17, color: C.muted }}>{mid ? "Bureau 2 · middle score" : `Bureau ${k + 1}`}</span>
            <span style={{ fontFamily: H, fontSize: 72, fontWeight: 800, lineHeight: 1.1, color: v >= MINIMUM ? C.deep : C.navy }}>{v}</span>
          </Abs>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 324, width: 1280, display: "flex", justifyContent: "center", gap: 14, ...fade(t, 2.3) }}>
        <Pill tone="warn">Before: {SCORES_BEFORE[1]}</Pill>
        <span style={{ fontFamily: H, fontSize: 24, fontWeight: 800, color: C.teal, alignSelf: "center" }}>→</span>
        <Pill tone="info">Updated: {SCORES_AFTER[1]}</Pill>
        <Pill tone="ok">+{SCORES_AFTER[1] - SCORES_BEFORE[1]} points · {MINIMUM}+ cleared</Pill>
      </div>
      <p style={{ position: "absolute", left: 0, top: 376, width: 1280, textAlign: "center", fontSize: 15, color: C.muted, ...fade(t, 2.6) }}>
        Hypothetical illustration, not an actual scoring result. Real results can come in higher or lower.
      </p>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <Arrow x1={594} y1={470} x2={684} y2={470} p={at(t, 4.2, 0.6)} />
      </svg>
      <Node x={260} y={415} w={330} h={110} dark title="Refinance closes" sub="The takeout lender funds the permanent loan" style={fade(t, 3.5)} />
      <Node x={690} y={415} w={330} h={110} title="Bridge paid off" sub="The EquiBridge second mortgage is repaid at closing" style={fade(t, 4.7)} />
      <div style={{ position: "absolute", left: 0, top: 556, width: 1280, textAlign: "center", ...fade(t, 5.6) }}>
        <Pill tone="ok">✓ Refinance-ready, and refinanced</Pill>
      </div>
    </>
  );
}

function Risk({ t }: { t: number }) {
  const tiles = [
    { title: "Conditional approval", text: "Conditions or circumstances can change before closing." },
    { title: "Score projection", text: "An estimate. Actual updated scores can come in lower." },
    { title: "Rapid rescore", text: "Timing and results depend on the bureaus and creditors." },
  ];
  const facts = ["1-year, interest-only second mortgage", "Balloon payment due at the end of the term", "Repayment risk evaluated on every loan"];
  return (
    <>
      <Header t={t} a={0} eyebrow="Know the risk" title="None of these steps guarantees the refinance" />
      {tiles.map((tile, k) => (
        <Abs key={tile.title} x={60 + k * 400} y={130} w={360} h={176} style={{ ...panel, padding: 24, ...fade(t, 0.3 + k * 0.5) }}>
          <p style={{ fontFamily: H, fontSize: 22, fontWeight: 800 }}>{tile.title}</p>
          <p style={{ fontSize: 16, lineHeight: 1.45, color: C.body, marginTop: 8 }}>{tile.text}</p>
          <div style={{ marginTop: 12, ...fade(t, 1.6 + k * 0.4) }}>
            <Pill tone="warn" style={{ fontSize: 15, padding: "6px 12px" }}>
              Not a guarantee
            </Pill>
          </div>
        </Abs>
      ))}
      <Abs x={60} y={336} w={1160} h={270} style={{ ...panel, borderLeft: `8px solid ${C.teal}`, padding: "28px 36px", ...fade(t, 3.8) }}>
        <Label>The bridge has to stand on its own</Label>
        <p style={{ fontFamily: H, fontSize: 28, fontWeight: 800, lineHeight: 1.3, marginTop: 12 }}>
          Every EquiBridge loan must independently satisfy applicable legal, underwriting, and repayment requirements.
        </p>
        <p style={{ fontSize: 17, color: C.body, marginTop: 10, ...fade(t, 4.6) }}>
          An expected refinance never replaces evaluating the borrower’s repayment risk.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {facts.map((f, k) => (
            <Pill key={f} tone="info" style={{ fontSize: 15, padding: "7px 14px", ...fade(t, 5.2 + k * 0.35) }}>
              {f}
            </Pill>
          ))}
        </div>
      </Abs>
    </>
  );
}

function Close({ t }: { t: number }) {
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 70, width: 1280, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, ...fade(t, 0.1, 0.8) }}>
        <Image src="/logo-mark.png" alt="" width={232} height={80} loading="eager" />
        <div>
          <p style={{ fontFamily: H, fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
            Equi<span style={{ color: C.teal }}>Bridge</span>{" "}
            <span style={{ fontSize: 22, letterSpacing: 8, color: C.deep }}>CAPITAL</span>
          </p>
          <p style={{ fontSize: 19, color: C.body, marginTop: 8 }}>Intelligent Lending. Greater Possibilities.</p>
        </div>
      </div>
      <p style={{ position: "absolute", left: 60, top: 196, width: 1160, textAlign: "center", fontFamily: H, fontSize: 27, fontWeight: 800, color: C.teal, ...fade(t, 1.4) }}>
        Turning credit-constrained borrowers into refinance-ready opportunities.
      </p>
      <Abs x={190} y={276} w={900} h={232} style={{ ...panel, textAlign: "center", padding: "32px 48px", borderTop: `6px solid ${C.aqua}`, ...fade(t, 4.8) }}>
        <p style={{ fontFamily: H, fontSize: 30, fontWeight: 800, lineHeight: 1.3, color: C.navy }}>
          Have a borrower who qualifies for everything except the credit score?
        </p>
        <div style={{ marginTop: 22, ...fade(t, 7) }}>
          <span
            style={{
              display: "inline-block",
              padding: "14px 30px",
              borderRadius: 999,
              background: C.deep,
              color: "#fff",
              fontFamily: H,
              fontSize: 22,
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15,76,92,0.25)",
            }}
          >
            Let’s see if EquiBridge can help →
          </span>
        </div>
        <p style={{ fontSize: 17, color: C.muted, marginTop: 16, ...fade(t, 7.6) }}>equibridgecapital.com · Submit a Scenario</p>
      </Abs>
      <p
        style={{
          position: "absolute",
          left: 120,
          top: 538,
          width: 1040,
          textAlign: "center",
          fontSize: 13,
          lineHeight: 1.5,
          color: C.muted,
          ...fade(t, 1.8),
        }}
      >
        Hypothetical example with a fictional borrower; not a guarantee of credit score improvement, underwriting approval, or refinance
        closing. Projected and updated scores are illustrations, not actual scoring results. Not a commitment to lend. All loans are subject
        to credit approval, underwriting, and applicable law. The bridge loan is secured by the home.
      </p>
    </>
  );
}

const SCENE_VIEWS = [Hook, S1, S2, S3, S4, S5, S6, Risk, Close];

function captionAt(t: number) {
  let c = CAPTIONS[0].text;
  for (const cap of CAPTIONS) if (t >= cap.at) c = cap.text;
  return c;
}

// ---------- Player ----------
export default function Explainer({ record = false }: { record?: boolean }) {
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [box, setBox] = useState({ s: 0, x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const seek = useCallback((v: number) => {
    const n = Math.min(DURATION, Math.max(0, v));
    tRef.current = n;
    setT(n);
  }, []);

  // Fit the 1280×720 canvas inside the stage.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(width / 1280, height / 720);
      setBox({ s, x: (width - 1280 * s) / 2, y: (height - 720 * s) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Playback clock.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const n = Math.min(DURATION, tRef.current + dt);
      seek(n);
      if (n >= DURATION) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, seek]);

  // Start once when scrolled into view (unless the visitor prefers reduced motion).
  useEffect(() => {
    if (record) return;
    const el = stageRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [record]);

  // Recording hook: the MP4 script calls window.__ebSeek(seconds) for each frame.
  useEffect(() => {
    if (!record) return;
    const w = window as unknown as { __ebSeek?: (v: number) => void; __ebDuration?: number };
    w.__ebSeek = (v: number) => seek(v);
    w.__ebDuration = DURATION;
  }, [record, seek]);

  const toggle = () => {
    started.current = true;
    if (!playing && tRef.current >= DURATION) seek(0);
    setPlaying((p) => !p);
  };
  const fullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const caption = captionAt(t);
  const sceneIdx = SCENES.findIndex((s, i) => t >= s.start && (i === SCENES.length - 1 || t < s.end));

  return (
    <div className="xp">
      <div ref={stageRef} className={record ? "xp-stage xp-record" : "xp-stage"} aria-hidden="true">
        <div
          className="xp-canvas"
          style={{ transform: `translate(${box.x}px, ${box.y}px) scale(${box.s})`, opacity: box.s ? 1 : 0 }}
        >
          {SCENE_VIEWS.map((View, i) => (
            <Scene key={i} t={t} i={i}>
              {(local) => <View t={local} />}
            </Scene>
          ))}
          <span style={{ position: "absolute", right: 60, top: 36 }}>
            <Pill tone="info" style={{ fontSize: 14, padding: "6px 14px" }}>
              Hypothetical illustration
            </Pill>
          </span>
          <div className="xp-cap-in">{caption}</div>
        </div>
      </div>

      {record ? null : (
        <>
          <p className="xp-cap-out">{caption}</p>
          <div className="xp-controls">
            <button type="button" className="btn btn-primary btn-sm" onClick={toggle} style={{ minWidth: 96 }}>
              {playing ? "Pause" : t >= DURATION ? "Replay" : t > 0 ? "Resume" : "Play"}
            </button>
            <input
              type="range"
              min={0}
              max={DURATION}
              step={0.1}
              value={t}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Animation position"
              aria-valuetext={`${fmtTime(t)} of ${fmtTime(DURATION)}`}
            />
            <span className="small" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtTime(t)} / {fmtTime(DURATION)}
            </span>
            <button type="button" className="btn btn-outline btn-sm hide-sm" onClick={fullscreen}>
              Full screen
            </button>
          </div>
          <div className="xp-chapters" aria-label="Jump to a step">
            {SCENES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                className="xp-chapter"
                aria-current={i === sceneIdx ? "step" : undefined}
                onClick={() => {
                  started.current = true;
                  seek(s.start);
                  setPlaying(true);
                }}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>
          <details className="faq" style={{ marginTop: 16 }}>
            <summary>Read the transcript</summary>
            {CAPTIONS.map((c) => (
              <p key={c.at}>{c.text}</p>
            ))}
          </details>
        </>
      )}
    </div>
  );
}
