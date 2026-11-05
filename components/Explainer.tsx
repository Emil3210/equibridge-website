"use client";

/*
 * Animated explainer for the How It Works page.
 * Everything is drawn on a fixed 1280×720 canvas and scaled to fit, so it looks the same
 * on every screen and can be recorded frame by frame into an MP4 (see /explainer?record=1).
 * Edit the story text in CAPTIONS and the sample numbers in ACCOUNTS / SCORES below.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export const DURATION = 80; // seconds

// ---------- Story content (edit here) ----------
const SCENES = [
  { start: 0, end: 14, label: "The “almost” file" },
  { start: 14, end: 28, label: "Score simulator" },
  { start: 28, end: 43, label: "The bridge" },
  { start: 43, end: 57, label: "Rapid rescore" },
  { start: 57, end: 68, label: "Score updated" },
  { start: 68, end: 80, label: "The result" },
];

const CAPTIONS = [
  { at: 0, text: "Meet our sample borrower: on-time payments and solid equity in their home." },
  { at: 4, text: "But four credit cards are near their limits: 95% overall utilization." },
  { at: 8, text: "No lates, collections, liens or judgments. High utilization alone is pulling the score down." },
  { at: 11, text: "Their middle score is 592. The loan program they need requires 620." },
  { at: 14, text: "Before anything moves, the future lender runs a score simulation." },
  { at: 18, text: "If the card balances drop to near zero, utilization falls from 95% to about 3%." },
  { at: 22, text: "The projected middle score clears 620. Now there’s a plan, not “come back in a year.”" },
  { at: 28, text: "The lender brings the file to EquiBridge and requests a bridge loan." },
  { at: 32, text: "EquiBridge funds a closed-end second mortgage, and the proceeds go through escrow." },
  { at: 36, text: "Escrow pays each card company directly: $33,200 retired, and no cash goes to the borrower." },
  { at: 43, text: "Each card company provides a statement or letter showing the new $0 or low balance." },
  { at: 47, text: "The future lender sends that proof to the credit bureaus through a rapid rescore." },
  { at: 51, text: "Typical timing: about one to two weeks." },
  { at: 57, text: "The bureaus update. The new middle score is 648." },
  { at: 61, text: "That clears the 620 minimum, so the future lender closes the new loan." },
  { at: 64, text: "The new loan pays off the EquiBridge bridge. The process is complete." },
  { at: 68, text: "The homeowner gets the loan, or better terms, that high card balances were blocking." },
  { at: 72, text: "The lender closes a file that was “almost,” and EquiBridge is repaid." },
  { at: 76, text: "EquiBridge Capital. Intelligent Lending. Greater Possibilities." },
];

const ACCOUNTS = [
  { name: "Bank card 1", bal: 11640, limit: 12000, target: 0 },
  { name: "Bank card 2", bal: 9310, limit: 10000, target: 0 },
  { name: "Store card", bal: 4850, limit: 5000, target: 0 },
  { name: "Rewards card", bal: 8300, limit: 9000, target: 900 },
];
const SCORES_BEFORE = [584, 592, 601];
const SCORES_AFTER = [639, 648, 656];
const MINIMUM = 620;

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

// ---------- Scenes ----------
function Scene({ t, i, children }: { t: number; i: number; children: React.ReactNode }) {
  const s = SCENES[i];
  const last = i === SCENES.length - 1;
  const inScene = t >= s.start && (last ? t <= s.end : t < s.end);
  if (!inScene) return null;
  const fadeIn = i === 0 ? 1 : at(t, s.start, 0.6);
  const fadeOut = last ? 1 : 1 - prog(t, s.end - 0.5, 0.5);
  return <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut }}>{children}</div>;
}

function S1({ t }: { t: number }) {
  const fills = ACCOUNTS.map((_, k) => at(t, 3.6 + k * 0.35, 1.4));
  const overall = ACCOUNTS.reduce((s, a, k) => s + a.bal * fills[k], 0) / LIMIT_TOTAL;
  const clean = ["0 late payments", "No collections", "No liens or judgments", "No bankruptcies"];
  return (
    <>
      <Header t={t} a={0} eyebrow="Step 1 · The “almost” file" title="Sample Borrower’s credit report" />
      <Abs x={60} y={130} w={540} h={480} style={{ ...panel, ...fade(t, 0.3) }}>
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
                  border: `3px solid ${mid && t >= 9 ? C.deep : "transparent"}`,
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
        <p style={{ marginTop: 12, fontSize: 17, fontWeight: 700, color: C.teal, textAlign: "center", ...fade(t, 9) }}>
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
            ...fade(t, 11),
          }}
        >
          <span style={{ fontSize: 18 }}>
            Program minimum <b style={{ fontFamily: H }}>{MINIMUM}</b>
          </span>
          <Pill tone="warn">{MINIMUM - SCORES_BEFORE[1]} points short</Pill>
        </div>
        <Label style={{ marginTop: 24 }}>Payment history &amp; public records</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginTop: 12 }}>
          {clean.map((c, k) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, ...fade(t, 8 + k * 0.35) }}>
              <Check />
              {c}
            </div>
          ))}
        </div>
      </Abs>

      <Abs x={640} y={130} w={580} h={480} style={{ ...panel, ...fade(t, 2.5) }}>
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
  const s0 = 14;
  const drops = ACCOUNTS.map((_, k) => at(t, s0 + 4 + k * 0.4, 1.6));
  const bals = ACCOUNTS.map((a, k) => lerp(a.bal, a.target, drops[k]));
  const overall = bals.reduce((s, b) => s + b, 0) / LIMIT_TOTAL;
  const score = Math.round(lerp(SCORES_BEFORE[1], SCORES_AFTER[1], at(t, s0 + 8, 2.5)));
  const lo = 550;
  const hi = 700;
  const trackW = 470;
  const xOf = (v: number) => ((v - lo) / (hi - lo)) * trackW;
  return (
    <>
      <Header t={t} a={s0} eyebrow="Step 2 · At the future lender" title="Score simulator: what if the balances drop?" />
      <Abs x={60} y={130} w={600} h={480} style={{ ...panel, ...fade(t, s0 + 0.3) }}>
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

      <Abs x={690} y={130} w={530} h={480} style={{ ...panel, ...fade(t, s0 + 1.5) }}>
        <Label>Projected middle score</Label>
        <p style={{ fontFamily: H, fontSize: 104, fontWeight: 800, lineHeight: 1, marginTop: 22, color: score >= MINIMUM ? C.deep : C.navy }}>
          {score}
        </p>
        <p style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>Estimate from the lender’s score simulator</p>
        <div style={{ position: "relative", marginTop: 46, width: trackW, height: 60 }}>
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
        <div style={{ marginTop: 22, ...fade(t, s0 + 11) }}>
          <Pill tone="ok">✓ Clears the {MINIMUM} minimum</Pill>
        </div>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 18 }}>Simulation includes the new bridge loan and its credit inquiry.</p>
      </Abs>
    </>
  );
}

function S3({ t }: { t: number }) {
  const s0 = 28;
  const credX = [70, 365, 660, 955];
  const ex = 1060;
  const ey = 272;
  return (
    <>
      <Header t={t} a={s0} eyebrow="Step 3 · The bridge" title="The lender requests a bridge loan from EquiBridge" />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <Arrow x1={352} y1={210} x2={504} y2={210} p={at(t, s0 + 1.5, 1)} />
        <Arrow x1={772} y1={210} x2={924} y2={210} p={at(t, s0 + 4.5, 1)} />
        {credX.map((x, k) => (
          <Arrow key={k} x1={ex} y1={ey} x2={x + 127} y2={414} p={at(t, s0 + 7.6 + k * 0.15, 1)} color={C.aqua} />
        ))}
      </svg>
      <span style={{ position: "absolute", left: 352, top: 172, width: 152, textAlign: "center", fontSize: 15, fontWeight: 700, color: C.teal, ...fade(t, s0 + 2) }}>
        Bridge request
      </span>
      <span style={{ position: "absolute", left: 772, top: 172, width: 152, textAlign: "center", fontSize: 15, fontWeight: 700, color: C.teal, ...fade(t, s0 + 5) }}>
        Loan proceeds
      </span>
      <Node
        x={90}
        y={150}
        h={124}
        title="Future lender"
        sub="Exit loan conditionally approved, pending a 620+ middle score"
        style={fade(t, s0 + 0.3)}
      />
      <Node
        x={510}
        y={150}
        h={124}
        dark
        title="EquiBridge Capital"
        sub={`Closed-end second mortgage · ${money(PAYOFF)} card payoff`}
        style={fade(t, s0 + 2.6)}
      />
      <Node x={930} y={150} h={124} title="Escrow" sub="Pays each card company directly" style={fade(t, s0 + 5.5)} />

      {ACCOUNTS.map((a, k) => {
        const travel = prog(t, s0 + 8.8 + k * 0.25, 1.4);
        const dx = lerp(ex, credX[k] + 127, ease(travel));
        const dy = lerp(ey, 414, ease(travel));
        const paid = t >= s0 + 10.3 + k * 0.25;
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
            <Abs x={credX[k]} y={420} w={255} h={140} style={{ ...panel, padding: "18px 20px", ...fade(t, s0 + 6.8 + k * 0.15) }}>
              <p style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>{a.name}</p>
              <p style={{ fontSize: 15, color: C.body, marginTop: 4 }}>Paid {money(a.bal - a.target)}</p>
              <div style={{ marginTop: 12 }}>
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
      <div style={{ position: "absolute", left: 0, top: 584, width: 1280, textAlign: "center", ...fade(t, s0 + 11.5) }}>
        <Pill tone="info">No cash to the borrower: paid directly through escrow</Pill>
      </div>
    </>
  );
}

function S4({ t }: { t: number }) {
  const s0 = 43;
  const rowY = [140, 216, 292, 368];
  const bY = [140, 238, 336];
  const vx = 520;
  const vy = 200;
  const tl = prog(t, s0 + 4, 8);
  const marks = [
    { p: 0, label: "Day 1 · Balance letters requested" },
    { p: 0.45, label: "Rescore submitted" },
    { p: 0.95, label: "Days 7–14 · Bureaus update" },
  ];
  return (
    <>
      <Header t={t} a={s0} eyebrow="Step 4 · Rapid rescore" title="Proof of the new balances goes to the bureaus" />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        {rowY.map((y, k) => (
          <Arrow key={k} x1={334} y1={y + 31} x2={514} y2={275} p={at(t, s0 + 1.4 + k * 0.15, 0.8)} color={C.aqua} />
        ))}
        {bY.map((y, k) => (
          <Arrow key={k} x1={784} y1={275} x2={954} y2={y + 42} p={at(t, s0 + 5 + k * 0.15, 0.8)} />
        ))}
      </svg>
      {ACCOUNTS.map((a, k) => (
        <Abs
          key={a.name}
          x={60}
          y={rowY[k]}
          w={270}
          h={62}
          style={{ ...panel, padding: "10px 16px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", ...fade(t, s0 + 0.3 + k * 0.15) }}
        >
          <span style={{ fontFamily: H, fontSize: 17, fontWeight: 700 }}>{a.name}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.ok }}>{money(a.target)}</span>
        </Abs>
      ))}
      {ACCOUNTS.map((_, k) => {
        const p = prog(t, s0 + 2.2 + k * 0.3, 1.5);
        return (
          <Doc
            key={k}
            x={lerp(334, 514, ease(p))}
            y={lerp(rowY[k] + 31, 275, ease(p))}
            opacity={p > 0 && p < 1 ? 1 : 0}
          />
        );
      })}
      <Node
        x={vx}
        y={vy}
        w={260}
        h={150}
        title="Future lender’s credit vendor"
        sub="Rapid rescore submitted with the updated balance letters"
        style={{ border: `2px solid ${C.deep}`, ...fade(t, s0 + 1.2) }}
      />
      <div style={{ position: "absolute", left: vx, top: 364, width: 260, textAlign: "center", ...fade(t, s0 + 4.5) }}>
        <Pill tone="info" style={{ fontSize: 14, padding: "6px 12px" }}>
          Ordered &amp; paid for by the lender
        </Pill>
      </div>
      {bY.map((y, k) => {
        const done = t >= s0 + 10 + k * 0.4;
        return (
          <Abs
            key={k}
            x={960}
            y={y}
            w={260}
            h={84}
            style={{ ...panel, padding: "14px 18px", borderRadius: 14, ...fade(t, s0 + 5.4 + k * 0.15) }}
          >
            <p style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>Credit bureau {k + 1}</p>
            <p style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: done ? C.ok : C.muted }}>{done ? "✓ Updated" : "Updating…"}</p>
          </Abs>
        );
      })}
      <Abs x={80} y={450} w={1120} h={160} style={{ ...panel, padding: "22px 32px", ...fade(t, s0 + 3.5) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Label>Typical timeline</Label>
          <span style={{ fontFamily: H, fontSize: 26, fontWeight: 800, color: C.deep }}>About 1–2 weeks</span>
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

function S5({ t }: { t: number }) {
  const s0 = 57;
  const up = at(t, s0 + 0.8, 2.8);
  const xs = [145, 505, 865];
  return (
    <>
      <Header t={t} a={s0} eyebrow="Step 5 · Score updated" title="The middle score clears the minimum" />
      {SCORES_BEFORE.map((b, k) => {
        const mid = k === 1;
        const v = Math.round(lerp(b, SCORES_AFTER[k], up));
        return (
          <Abs
            key={k}
            x={xs[k]}
            y={140}
            w={270}
            h={170}
            style={{
              ...panel,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: mid ? `3px solid ${C.deep}` : `1px solid ${C.line}`,
              background: mid ? C.tint : "#fff",
              ...fade(t, s0 + 0.2 + k * 0.1),
            }}
          >
            <span style={{ fontSize: 17, color: C.muted }}>{mid ? "Bureau 2 · middle score" : `Bureau ${k + 1}`}</span>
            <span style={{ fontFamily: H, fontSize: 72, fontWeight: 800, lineHeight: 1.1, color: v >= MINIMUM ? C.deep : C.navy }}>{v}</span>
          </Abs>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 340, width: 1280, display: "flex", justifyContent: "center", gap: 16, ...fade(t, s0 + 4) }}>
        <Pill tone="warn">Before: {SCORES_BEFORE[1]}</Pill>
        <span style={{ fontFamily: H, fontSize: 24, fontWeight: 800, color: C.teal, alignSelf: "center" }}>→</span>
        <Pill tone="info">After: {SCORES_AFTER[1]}</Pill>
        <Pill tone="ok">✓ Above the {MINIMUM} minimum</Pill>
      </div>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <Arrow x1={594} y1={480} x2={684} y2={480} p={at(t, s0 + 6.4, 0.8)} />
      </svg>
      <Node x={260} y={425} w={330} h={110} dark title="New loan closes" sub="Approved, or better terms, now that the score qualifies" style={fade(t, s0 + 5.4)} />
      <Node x={690} y={425} w={330} h={110} title="Bridge paid off" sub="From the new loan’s proceeds" style={fade(t, s0 + 7.2)} />
      <div style={{ position: "absolute", left: 0, top: 568, width: 1280, textAlign: "center", ...fade(t, s0 + 8.4) }}>
        <Pill tone="ok">✓ Process complete</Pill>
      </div>
    </>
  );
}

function Icon({ kind }: { kind: "home" | "lender" | "bridge" }) {
  const paths = {
    home: (
      <>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
    lender: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        <path d="M3 13h18" />
      </>
    ),
    bridge: (
      <>
        <path d="M2 17h20" />
        <path d="M5 17V9M19 17V9" />
        <path d="M5 9c3 4 11 4 14 0" />
        <path d="M9 17v-4M12 17v-3M15 17v-4" />
      </>
    ),
  }[kind];
  return (
    <div style={{ width: 64, height: 64, borderRadius: 999, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.deep} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths}
      </svg>
    </div>
  );
}

function S6({ t }: { t: number }) {
  const s0 = 68;
  const tiles: { icon: "home" | "lender" | "bridge"; title: string; text: string; a: number }[] = [
    { icon: "home", title: "Homeowner", text: "Gets the loan, or better terms, that high card balances were blocking.", a: 0.5 },
    { icon: "lender", title: "Lender or broker", text: "Closes an “almost” file and keeps the client relationship.", a: 4.2 },
    { icon: "bridge", title: "EquiBridge", text: "The bridge is repaid when the new loan closes.", a: 4.8 },
  ];
  return (
    <>
      <Header t={t} a={s0} eyebrow="The result" title="Everyone moves forward" />
      {tiles.map((tile, k) => (
        <Abs key={tile.title} x={60 + k * 400} y={130} w={360} h={250} style={{ ...panel, ...fade(t, s0 + tile.a) }}>
          <Icon kind={tile.icon} />
          <p style={{ fontFamily: H, fontSize: 24, fontWeight: 800, marginTop: 18 }}>{tile.title}</p>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: C.body, marginTop: 8 }}>{tile.text}</p>
        </Abs>
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 410,
          width: 1280,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 22,
          ...fade(t, s0 + 8),
        }}
      >
        <Image src="/logo-mark.png" alt="" width={232} height={80} loading="eager" />
        <div>
          <p style={{ fontFamily: H, fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
            Equi<span style={{ color: C.teal }}>Bridge</span>{" "}
            <span style={{ fontSize: 18, letterSpacing: 6, color: C.deep }}>CAPITAL</span>
          </p>
          <p style={{ fontSize: 20, color: C.body, marginTop: 8 }}>Intelligent Lending. Greater Possibilities.</p>
        </div>
      </div>
      <p
        style={{
          position: "absolute",
          left: 140,
          top: 548,
          width: 1000,
          textAlign: "center",
          fontSize: 14,
          lineHeight: 1.5,
          color: C.muted,
          ...fade(t, s0 + 8.6),
        }}
      >
        Illustrative example with a fictional borrower. Not a commitment to lend. Credit score results vary and are not
        guaranteed. All loans are subject to credit approval and underwriting. The bridge loan is secured by the home.
      </p>
    </>
  );
}

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
          <Scene t={t} i={0}>
            <S1 t={t} />
          </Scene>
          <Scene t={t} i={1}>
            <S2 t={t} />
          </Scene>
          <Scene t={t} i={2}>
            <S3 t={t} />
          </Scene>
          <Scene t={t} i={3}>
            <S4 t={t} />
          </Scene>
          <Scene t={t} i={4}>
            <S5 t={t} />
          </Scene>
          <Scene t={t} i={5}>
            <S6 t={t} />
          </Scene>
          <span style={{ position: "absolute", right: 60, top: 36 }}>
            <Pill tone="info" style={{ fontSize: 14, padding: "6px 14px" }}>
              Illustrative example
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
