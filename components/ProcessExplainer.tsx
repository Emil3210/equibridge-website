"use client";

/*
 * "The EquiBridge Process: From Conditional Approval to Funding" — partner explainer (v1).
 * Same 1280×720 canvas, helpers and recording hook as components/Explainer.tsx.
 * Record with: python3 scripts/record-explainer.py http://localhost:3000 out/process.mp4 30 /process-explainer
 *
 * Timing: SCENES are on the master clock and each scene gets a LOCAL clock starting at 0.
 * Beat times inside scenes were taken from the recorded narration (ElevenLabs "Vino").
 * Narration lines (captions, SRT, transcript) and SCENES live in lib/process-video.ts.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACCOUNTS,
  Abs,
  Arrow,
  C,
  Doc,
  H,
  Header,
  LIMIT_TOTAL,
  Label,
  MINIMUM,
  Node,
  PAYOFF,
  Pill,
  REASON,
  SCORES_AFTER,
  SCORES_BEFORE,
  Bar,
  at,
  ease,
  fade,
  fmtTime,
  lerp,
  money,
  panel,
  pct,
  prog,
} from "@/components/Explainer";
import { CONTACT } from "@/lib/site";
import { CAPTIONS, DURATION, SCENES } from "@/lib/process-video";

const amber = { fg: "#8a5300", bg: "#fdf1dc", line: "#e8a33d" };

// ---------- Small pieces ----------
function Phase({ t, a, b, children }: { t: number; a: number; b?: number; children: React.ReactNode }) {
  // Visible from a (fade in) until b (fade out over 0.5s before b).
  const o = at(t, a, 0.5) * (b === undefined ? 1 : 1 - prog(t, b - 0.5, 0.5));
  if (o <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>{children}</div>;
}

function Dark({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.deep} 0%, ${C.teal} 70%, #227c84 100%)` }}>
      {children}
    </div>
  );
}

function ScoreTrack({ score, w = 470 }: { score: number; w?: number }) {
  const lo = 550;
  const hi = 700;
  const xOf = (v: number) => ((v - lo) / (hi - lo)) * w;
  return (
    <div style={{ position: "relative", width: w, height: 60 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 20,
          width: w,
          height: 14,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${C.warnBg} 0%, ${C.warnBg} ${(xOf(MINIMUM) / w) * 100}%, ${C.mint} ${(xOf(MINIMUM) / w) * 100}%, ${C.mint} 100%)`,
        }}
      />
      <div style={{ position: "absolute", left: xOf(MINIMUM) - 1, top: 6, width: 3, height: 42, background: C.navy }} />
      <span style={{ position: "absolute", left: xOf(MINIMUM) - 70, top: -22, width: 140, textAlign: "center", fontSize: 15, fontWeight: 700 }}>
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
          background: score >= MINIMUM ? C.deep : C.warn,
          border: "4px solid #fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      />
      <span style={{ position: "absolute", left: 0, top: 44, fontSize: 14, color: C.muted }}>{lo}</span>
      <span style={{ position: "absolute", right: 0, top: 44, fontSize: 14, color: C.muted }}>{hi}</span>
    </div>
  );
}

function Dot({ on, tone = "ok" }: { on: boolean; tone?: "ok" | "amber" }) {
  const bg = tone === "amber" ? amber.line : C.ok;
  return (
    <span
      style={{
        flex: "0 0 34px",
        height: 34,
        borderRadius: 999,
        background: on ? bg : "#fff",
        border: `3px solid ${on ? bg : C.line}`,
        color: "#fff",
        fontSize: 17,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {on ? (tone === "amber" ? "…" : "✓") : ""}
    </span>
  );
}

// ---------- Scenes (local clock: t = 0 at the start of each scene) ----------

// 1. The Catch-22
function S1({ t }: { t: number }) {
  const checks = [
    { title: "Documented income", a: 3.9 },
    { title: "Significant home equity", a: 5.4 },
    { title: "Strong mortgage payment history", a: 7.5 },
    { title: "No lates or collections", a: 9.6 },
  ];
  const fills = ACCOUNTS.map((_, k) => at(t, 11.8 + k * 0.3, 1.4));
  const overall = ACCOUNTS.reduce((s, a, k) => s + a.bal * fills[k], 0) / LIMIT_TOTAL;
  const dim = at(t, 20.4, 0.5);
  const card = at(t, 20.7, 0.7);
  const mark = ease(prog(t, 21.8, 1.6));
  return (
    <>
      <Header t={t} a={0.3} eyebrow="The Catch-22" title="Your borrower qualifies for almost everything" />
      <Abs x={60} y={130} w={430} h={480} style={{ ...panel, ...fade(t, 1.0) }}>
        <Label>Illustrative borrower</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 26 }}>
          {checks.map((c) => (
            <div key={c.title} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: H, fontSize: 21, fontWeight: 700, opacity: t >= c.a ? 1 : 0.35 }}>
              <Dot on={t >= c.a} />
              {c.title}
            </div>
          ))}
        </div>
      </Abs>
      <Abs x={520} y={130} w={700} h={270} style={{ ...panel, padding: "22px 28px", ...fade(t, 11.5) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Label>Revolving accounts</Label>
          <span style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>
            Overall utilization <b style={{ fontSize: 34, color: C.warn, marginLeft: 8 }}>{pct(overall)}</b>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 28px", marginTop: 14 }}>
          {ACCOUNTS.map((a, k) => (
            <div key={a.name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                <span style={{ fontFamily: H, fontWeight: 700 }}>{a.name}</span>
                <b style={{ color: C.warn }}>{pct((a.bal * fills[k]) / a.limit)}</b>
              </div>
              <Bar value={(a.bal * fills[k]) / a.limit} color={C.warn} />
            </div>
          ))}
        </div>
      </Abs>
      <Abs x={520} y={420} w={700} h={190} style={{ ...panel, padding: "22px 34px", ...fade(t, 14.5) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Label style={{ whiteSpace: "nowrap" }}>Middle score</Label>
            <p style={{ fontFamily: H, fontSize: 64, fontWeight: 800, lineHeight: 1, marginTop: 6, color: C.warn }}>{SCORES_BEFORE[1]}</p>
          </div>
          <div style={{ marginTop: 34, marginLeft: 30, marginRight: 30 }}>
            <ScoreTrack score={SCORES_BEFORE[1]} w={250} />
          </div>
          <div style={{ textAlign: "right", ...fade(t, 18.3) }}>
            <Label>Takeout lender needs</Label>
            <p style={{ fontFamily: H, fontSize: 64, fontWeight: 800, lineHeight: 1, marginTop: 6, color: C.deep }}>{MINIMUM}</p>
          </div>
        </div>
      </Abs>
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(242,248,251,${0.88 * dim})` }} /> : null}
      {card > 0 ? (
        <Abs
          x={140}
          y={170}
          w={1000}
          h={300}
          style={{
            ...panel,
            padding: "30px 44px",
            border: `2px solid ${C.warn}`,
            boxShadow: "0 24px 60px rgba(15,76,92,0.18)",
            opacity: card,
            transform: `scale(${0.92 + 0.08 * card})`,
          }}
        >
          <Label style={{ color: C.warn }}>Credit report · Key score factor</Label>
          <div style={{ height: 1, background: C.line, margin: "16px 0 24px" }} />
          <p style={{ fontFamily: H, fontSize: 40, fontWeight: 800, lineHeight: 1.3 }}>
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
          <div style={{ marginTop: 24, ...fade(t, 23.6) }}>
            <Pill tone="warn">High utilization can hold a score down, even with no missed payments</Pill>
          </div>
        </Abs>
      ) : null}
    </>
  );
}

// 2. The EquiBridge solution
function S2({ t }: { t: number }) {
  const arch = ease(prog(t, 2.6, 3.4));
  const tags = ["Closed-end second mortgage", "Designated payoffs only", "Documented exit"];
  // Arch path from left pillar to right pillar.
  const path = "M 250 420 Q 640 170 1030 420";
  const len = 900;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 50, width: 1280, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, ...fade(t, 0.3, 0.8) }}>
        <Image src="/logo-mark.png" alt="" width={174} height={60} loading="eager" />
        <p style={{ fontFamily: H, fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
          Equi<span style={{ color: C.teal }}>Bridge</span> <span style={{ fontSize: 18, letterSpacing: 7, color: C.deep }}>CAPITAL</span>
        </p>
      </div>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <path d={path} fill="none" stroke={C.aqua} strokeWidth={14} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - arch)} />
        <line x1={250} y1={420} x2={1030} y2={420} stroke={C.deep} strokeWidth={8} strokeLinecap="round" opacity={at(t, 2.2, 0.6)} />
      </svg>
      <Abs x={90} y={430} w={300} h={96} style={{ ...panel, padding: "16px 20px", textAlign: "center", ...fade(t, 1.6) }}>
        <Label style={{ color: C.warn }}>Today</Label>
        <p style={{ fontFamily: H, fontSize: 26, fontWeight: 800, marginTop: 4 }}>Middle score {SCORES_BEFORE[1]}</p>
      </Abs>
      <Abs x={870} y={430} w={320} h={96} style={{ ...panel, padding: "16px 20px", textAlign: "center", background: C.deep, border: "none", ...fade(t, 5.6) }}>
        <Label style={{ color: C.aqua }}>The exit</Label>
        <p style={{ fontFamily: H, fontSize: 24, fontWeight: 800, marginTop: 4, color: "#fff", whiteSpace: "nowrap" }}>Permanent refinance</p>
      </Abs>
      <p style={{ position: "absolute", left: 390, top: 444, width: 500, textAlign: "center", fontFamily: H, fontSize: 22, fontWeight: 800, color: C.deep, ...fade(t, 6.2) }}>
        Short-term EquiBridge bridge
      </p>
      <p style={{ position: "absolute", left: 390, top: 478, width: 500, textAlign: "center", fontSize: 17, color: C.body, ...fade(t, 8.5) }}>
        Pays down specifically identified revolving debts
      </p>
      <div style={{ position: "absolute", left: 0, top: 560, width: 1280, display: "flex", justifyContent: "center", gap: 14 }}>
        {tags.map((g, k) => (
          <Pill key={g} tone="info" style={fade(t, 12.4 + k * 0.5)}>
            ✓ {g}
          </Pill>
        ))}
        <Pill tone="warn" style={fade(t, 12.0)}>
          Not general debt consolidation
        </Pill>
      </div>
    </>
  );
}

// 3. Screening & score simulation
function S3({ t }: { t: number }) {
  const items = [
    ["Authorized credit report & scores", 2.4],
    ["Revolving utilization & balances", 3.6],
    ["Derogatory history", 4.4],
    ["Income & liabilities", 5.6],
    ["Homeownership & equity", 6.4],
    ["Lender’s minimum score", 7.8],
    ["Specific debts to pay off", 9.4],
    ["Bridge + costs fit the refinance", 11.0],
  ] as const;
  const drops = ACCOUNTS.map((_, k) => at(t, 21.2 + k * 0.35, 1.5));
  const bals = ACCOUNTS.map((a, k) => lerp(a.bal, a.target, drops[k]));
  const overall = bals.reduce((s, b) => s + b, 0) / LIMIT_TOTAL;
  const score = Math.round(lerp(SCORES_BEFORE[1], SCORES_AFTER[1], at(t, 26.4, 2.6)));
  const gain = score - SCORES_BEFORE[1];
  return (
    <>
      <Phase t={t} a={0} b={14.0}>
        <Header t={t} a={0.2} eyebrow="Step 1 · Screening" title="Is this file a fit?" />
        <Abs x={60} y={130} w={1160} h={400} style={{ ...panel, ...fade(t, 1.8) }}>
          <Label>EquiBridge screening</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 40px", marginTop: 22 }}>
            {items.map(([label, a]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: H, fontSize: 20, fontWeight: 700, opacity: t >= a ? 1 : 0.35 }}>
                <Dot on={t >= a} />
                {label}
              </div>
            ))}
          </div>
        </Abs>
        <div style={{ position: "absolute", left: 0, top: 556, width: 1280, textAlign: "center", ...fade(t, 12.0) }}>
          <Pill tone="ok" style={{ fontSize: 20, padding: "10px 22px" }}>
            ✓ Potential candidate · send to the takeout lender for simulation
          </Pill>
        </div>
      </Phase>

      <Phase t={t} a={14.0}>
        <Header t={t} a={14.0} eyebrow="At the takeout lender" title="Score simulation on the designated payoffs" />
        <Abs x={60} y={130} w={600} h={430} style={{ ...panel, ...fade(t, 14.3) }}>
          <Label>Simulated payoff</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 16 }}>
            {ACCOUNTS.map((a, k) => {
              const u = bals[k] / a.limit;
              return (
                <div key={a.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                    <span style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>{a.name}</span>
                    <span style={{ color: drops[k] >= 1 ? C.ok : C.body, fontWeight: drops[k] >= 1 ? 700 : 400 }}>
                      {drops[k] >= 1 ? `✓ ${money(a.target)}` : money(bals[k])}
                    </span>
                  </div>
                  <Bar value={u} color={u > 0.3 ? C.warn : C.teal} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
            <span style={{ fontFamily: H, fontSize: 20, fontWeight: 700 }}>Overall utilization</span>
            <span style={{ fontFamily: H, fontSize: 44, fontWeight: 800, color: overall > 0.3 ? C.warn : C.teal }}>{pct(overall)}</span>
          </div>
        </Abs>
        <Abs x={690} y={130} w={530} h={430} style={{ ...panel, ...fade(t, 15.0) }}>
          <Label>Projected middle score · hypothetical</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 16 }}>
            <p style={{ fontFamily: H, fontSize: 100, fontWeight: 800, lineHeight: 1, color: score >= MINIMUM ? C.deep : C.navy }}>{score}</p>
            {gain > 0 ? <span style={{ fontFamily: H, fontSize: 34, fontWeight: 800, color: C.ok }}>+{gain}</span> : null}
          </div>
          <div style={{ marginTop: 44 }}>
            <ScoreTrack score={score} />
          </div>
          <div style={{ marginTop: 26, ...fade(t, 31.6) }}>
            <Pill tone="warn" style={{ fontSize: 19 }}>
              A projection, not a guarantee
            </Pill>
          </div>
        </Abs>
        <p style={{ position: "absolute", left: 60, top: 584, width: 1160, textAlign: "center", fontSize: 16, color: C.muted, ...fade(t, 15.4) }}>
          Hypothetical. Actual results depend on the lender’s simulation for a real transaction.
        </p>
      </Phase>
    </>
  );
}

// 4. Underwrite the exit first (the key chapter)
function S4({ t }: { t: number }) {
  const tiles = [
    { title: "Income", sub: "Calculated & accepted", a: 9.9 },
    { title: "Employment", sub: "VOE as required", a: 10.8 },
    { title: "Appraisal", sub: "Value & LTV accepted", a: 11.7 },
    { title: "Title", sub: "Liens & vesting cleared", a: 12.7 },
    { title: "HOA", sub: "When applicable", a: 13.4 },
    { title: "Assets & reserves", sub: "Lender’s requirements", a: 15.9 },
    { title: "Insurance", sub: "Hazard & flood", a: 17.0 },
    { title: "Eligibility & DTI", sub: "After the payoffs", a: 18.4 },
  ];
  return (
    <>
      <Phase t={t} a={0} b={9.5}>
        <Dark>
          <div style={{ position: "absolute", left: 120, top: 150, width: 1040 }}>
            <p style={{ fontFamily: H, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.aqua, ...fade(t, 0.3) }}>
              What makes EquiBridge different
            </p>
            <p style={{ fontFamily: H, fontSize: 30, fontWeight: 700, color: "#cfe9e8", marginTop: 30, ...fade(t, 2.6) }}>
              We don’t fund because a borrower has equity.
            </p>
            <p style={{ fontFamily: H, fontSize: 52, fontWeight: 800, lineHeight: 1.2, color: "#fff", marginTop: 26, ...fade(t, 5.6, 0.8) }}>
              We fund after the exit loan is <span style={{ color: C.mint }}>substantially underwritten.</span>
            </p>
          </div>
        </Dark>
      </Phase>
      <Phase t={t} a={9.5}>
        <Header t={t} a={9.5} eyebrow="Step 2 · Permanent lender underwriting" title="Everything that can be cleared, cleared first" />
        {tiles.map((tile, k) => {
          const on = t >= tile.a;
          const col = k % 4;
          const row = Math.floor(k / 4);
          return (
            <Abs
              key={tile.title}
              x={60 + col * 295}
              y={135 + row * 158}
              w={275}
              h={140}
              style={{
                ...panel,
                padding: "20px 22px",
                borderTop: `6px solid ${on ? C.ok : C.line}`,
                ...fade(t, 9.7 + k * 0.08, 0.5),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Dot on={on} />
                <p style={{ fontFamily: H, fontSize: 22, fontWeight: 800, color: on ? C.navy : C.muted }}>{tile.title}</p>
              </div>
              <p style={{ fontSize: 16, color: C.body, marginTop: 12, opacity: on ? 1 : 0.5 }}>{tile.sub}</p>
            </Abs>
          );
        })}
        <Abs
          x={60}
          y={460}
          w={1160}
          h={96}
          style={{
            ...panel,
            padding: "18px 26px",
            background: amber.bg,
            border: `2px solid ${amber.line}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            ...fade(t, 21.3),
          }}
        >
          <Dot on tone="amber" />
          <div>
            <p style={{ fontFamily: H, fontSize: 24, fontWeight: 800, color: amber.fg }}>Middle FICO ≥ {MINIMUM}: pending</p>
            <p style={{ fontSize: 16, color: C.body, marginTop: 2 }}>Along with the designated payoffs, the only condition left open</p>
          </div>
        </Abs>
        <p style={{ position: "absolute", left: 60, top: 578, width: 1160, textAlign: "center", fontSize: 15, color: C.muted, ...fade(t, 22.2) }}>
          Routine pre-closing reverifications may still apply. HOA review depends on the property and program.
        </p>
      </Phase>
    </>
  );
}

// 5. Written underwriter confirmation
function S5({ t }: { t: number }) {
  const msgs = [
    { who: "Broker", text: "File submitted for EquiBridge review.", a: 0.9, right: false },
    { who: "EquiBridge", text: "Please confirm the remaining conditions in writing.", a: 2.4, right: true },
    { who: "Takeout underwriter", text: "Confirmation attached.", a: 4.2, right: false },
  ];
  const hi1 = ease(prog(t, 7.6, 1.2));
  const hi2 = ease(prog(t, 9.4, 1.2));
  const mark = (p: number): React.CSSProperties => ({
    backgroundImage: `linear-gradient(${C.mint}, ${C.mint})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${p * 100}% 100%`,
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
    padding: "1px 3px",
  });
  return (
    <>
      <Header t={t} a={0.2} eyebrow="Step 3 · Written confirmation" title="The underwriter confirms it in writing" />
      <Abs x={60} y={130} w={500} h={480} style={{ ...panel, padding: 24, ...fade(t, 0.5) }}>
        <Label>Secure messages</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
          {msgs.map((m) => (
            <div key={m.who} style={{ alignSelf: m.right ? "flex-end" : "flex-start", maxWidth: 380, ...fade(t, m.a) }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.muted, textAlign: m.right ? "right" : "left" }}>{m.who}</p>
              <div
                style={{
                  marginTop: 4,
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: m.right ? C.deep : C.tint,
                  color: m.right ? "#fff" : C.navy,
                  fontSize: 17,
                  lineHeight: 1.4,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {m.text}
                {m.who === "Takeout underwriter" ? (
                  <span style={{ position: "relative", width: 28, height: 36, flex: "0 0 28px" }}>
                    <Doc x={14} y={18} opacity={1} />
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Abs>
      <Abs
        x={590}
        y={130}
        w={630}
        h={360}
        style={{ ...panel, padding: "24px 30px", opacity: at(t, 4.8, 0.7), transform: `translateX(${(1 - at(t, 4.8, 0.7)) * 40}px)` }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label>Underwriter confirmation</Label>
          <span style={{ fontSize: 13, fontWeight: 700, color: amber.fg, background: amber.bg, padding: "4px 10px", borderRadius: 999 }}>
            Illustrative wording · not a lender commitment
          </span>
        </div>
        <div style={{ height: 1, background: C.line, margin: "14px 0 16px" }} />
        <p style={{ fontSize: 18, lineHeight: 1.6, color: C.navy }}>
          Based on the documentation reviewed, the borrower{" "}
          <span style={mark(hi1)}>satisfies the applicable income, asset, property valuation, title, and other material underwriting requirements</span>{" "}
          for the proposed refinance.
        </p>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: C.navy, marginTop: 12 }}>
          <span style={mark(hi2)}>The remaining conditions are the minimum middle score and verification of the designated payoffs.</span>
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: C.muted, marginTop: 12 }}>
          Final approval remains subject to updated credit, customary closing requirements, continued eligibility, and no material adverse change.
        </p>
      </Abs>
      <div style={{ position: "absolute", left: 590, top: 506, width: 630, ...fade(t, 13.1) }}>
        <Pill tone="ok" style={{ fontSize: 16 }}>
          ✓ We review the actual conditional approval and every open condition
        </Pill>
      </div>
      <Abs x={590} y={556} w={630} h={54} style={{ borderRadius: 14, background: C.warnBg, border: `2px solid ${C.warn}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, ...fade(t, 17.5) }}>
        <span style={{ fontFamily: H, fontSize: 19, fontWeight: 800, color: C.warn }}>Open material conditions → No funding</span>
      </Abs>
    </>
  );
}

// 6. EquiBridge's own underwriting
function S6({ t }: { t: number }) {
  const rows = [
    { label: "Property value & available equity", a: 1.6 },
    { label: "Combined loan-to-value", a: 2.8 },
    { label: "Lien priority", a: 3.9 },
    { label: "Lending law & compliance", a: 5.2 },
  ];
  const stack = at(t, 1.2, 0.8);
  const second = at(t, 3.9, 0.8);
  return (
    <>
      <Header t={t} a={0.2} eyebrow="Step 4 · EquiBridge underwriting" title="Our own review, built for a no-exit scenario" />
      <Abs x={60} y={130} w={620} h={480} style={{ ...panel, ...fade(t, 0.5) }}>
        <Label>EquiBridge credit &amp; collateral review</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 22 }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: H, fontSize: 20, fontWeight: 700, opacity: t >= r.a ? 1 : 0.35 }}>
              <Dot on={t >= r.a} />
              {r.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 26, padding: "16px 18px", borderRadius: 14, background: C.mint, border: `2px solid ${C.teal}`, ...fade(t, 6.7) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Dot on={t >= 7.4} />
            <p style={{ fontFamily: H, fontSize: 20, fontWeight: 800, color: C.deep }}>Independent repayment analysis</p>
          </div>
          <p style={{ fontSize: 16, color: C.body, marginTop: 6, marginLeft: 48 }}>Assumes the refinance might not close</p>
        </div>
      </Abs>
      <Abs x={710} y={130} w={510} h={250} style={{ ...panel, ...fade(t, 1.0) }}>
        <Label>Lien position</Label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26, marginTop: 18 }}>
          <div style={{ width: 150, height: 150, borderRadius: 12, background: C.tint, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: `${48 * stack}%`, background: C.teal }} />
            <div style={{ position: "absolute", left: 0, bottom: "48%", width: "100%", height: `${14 * second}%`, background: C.aqua }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 16 }}>
            <span style={{ ...fade(t, 4.4) }}>
              <b style={{ display: "inline-block", width: 14, height: 14, background: C.aqua, borderRadius: 3, marginRight: 8 }} />
              EquiBridge 2nd
            </span>
            <span style={{ ...fade(t, 1.6) }}>
              <b style={{ display: "inline-block", width: 14, height: 14, background: C.teal, borderRadius: 3, marginRight: 8 }} />
              Existing 1st mortgage
            </span>
            <span style={{ ...fade(t, 2.2) }}>
              <b style={{ display: "inline-block", width: 14, height: 14, background: C.tint, border: `1px solid ${C.line}`, borderRadius: 3, marginRight: 8 }} />
              Remaining equity
            </span>
          </div>
        </div>
      </Abs>
      <Abs x={710} y={398} w={510} h={212} style={{ ...panel, background: C.deep, border: "none", padding: "20px 24px", ...fade(t, 13.2) }}>
        <Label style={{ color: C.aqua }}>Bridge structure</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          {["Closed-end second", "Interest-only", "Term of 12 months or less", "Balloon at maturity"].map((p, k) => (
            <span
              key={p}
              style={{ padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "#fff", fontFamily: H, fontSize: 17, fontWeight: 700, ...fade(t, 13.6 + k * 0.9) }}
            >
              {p}
            </span>
          ))}
        </div>
      </Abs>
    </>
  );
}

// 7. Controlled disbursement & rescore
function S7({ t }: { t: number }) {
  const credX = [70, 365, 660, 955];
  const ex = 950;
  const ey = 260;
  const drop = at(t, 13.2, 1.6);
  const util = lerp(0.95, 0.03, drop);
  const score = Math.round(lerp(SCORES_BEFORE[1], SCORES_AFTER[1], at(t, 15.6, 2.4)));
  return (
    <>
      <Phase t={t} a={0} b={12.7}>
        <Header t={t} a={0.2} eyebrow="Step 5 · Controlled disbursement" title="Proceeds go to the creditors, not the borrower" />
        <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          <Arrow x1={546} y1={195} x2={734} y2={195} p={at(t, 2.2, 0.9)} />
          {credX.map((x, k) => (
            <Arrow key={k} x1={ex} y1={ey} x2={x + 127} y2={340} p={at(t, 4.2 + k * 0.12, 0.8)} color={C.aqua} />
          ))}
        </svg>
        <span style={{ position: "absolute", left: 546, top: 155, width: 188, textAlign: "center", fontFamily: H, fontSize: 22, fontWeight: 800, color: C.deep, ...fade(t, 8.0) }}>
          {money(PAYOFF)}
        </span>
        <Node x={120} y={130} w={420} h={130} dark title="EquiBridge Capital" sub="Funds the approved payoff amount" style={fade(t, 0.5)} />
        <Node x={740} y={130} w={420} h={130} title="Settlement / escrow" sub="Pays each designated creditor per the approved payoff schedule" style={fade(t, 2.6)} />
        {ACCOUNTS.map((a, k) => {
          const travel = prog(t, 5.0 + k * 0.25, 1.3);
          const dx = lerp(ex, credX[k] + 127, ease(travel));
          const dy = lerp(ey, 345, ease(travel));
          const paid = t >= 6.3 + k * 0.25;
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
              <Abs x={credX[k]} y={345} w={255} h={120} style={{ ...panel, padding: "16px 20px", ...fade(t, 3.8 + k * 0.12) }}>
                <p style={{ fontFamily: H, fontSize: 18, fontWeight: 700 }}>{a.name}</p>
                <p style={{ fontSize: 15, color: C.body, marginTop: 4 }}>Paid directly: {money(a.bal - a.target)}</p>
                <div style={{ marginTop: 8 }}>
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
        <div style={{ position: "absolute", left: 0, top: 500, width: 1280, display: "flex", justifyContent: "center", gap: 12 }}>
          <Pill tone="info" style={fade(t, 9.9)}>
            ✓ $0 cash to the borrower
          </Pill>
          <Pill tone="info" style={fade(t, 10.6)}>
            ✓ Settlement &amp; payoff documentation retained
          </Pill>
        </div>
      </Phase>

      <Phase t={t} a={12.7}>
        <Header t={t} a={12.7} eyebrow="Rapid rescore" title="New balances report. The lender requests a rescore." />
        <Abs x={60} y={130} w={540} h={430} style={{ ...panel, ...fade(t, 12.9) }}>
          <Label>Reported revolving utilization</Label>
          <p style={{ fontFamily: H, fontSize: 96, fontWeight: 800, lineHeight: 1, marginTop: 18, color: util > 0.3 ? C.warn : C.teal }}>{pct(util)}</p>
          <div style={{ marginTop: 18 }}>
            <Bar value={util} color={util > 0.3 ? C.warn : C.teal} />
          </div>
          <div style={{ marginTop: 34, padding: "16px 18px", borderRadius: 14, background: C.bg, ...fade(t, 14.0) }}>
            <Label>Estimated timeline</Label>
            <p style={{ fontFamily: H, fontSize: 30, fontWeight: 800, color: C.deep, marginTop: 6 }}>About 1–2 weeks</p>
            <p style={{ fontSize: 15, color: C.muted, marginTop: 2 }}>An estimate, not a guarantee</p>
          </div>
        </Abs>
        <Abs x={630} y={130} w={590} h={430} style={{ ...panel, ...fade(t, 13.5) }}>
          <Label>Updated middle score · hypothetical</Label>
          <p style={{ fontFamily: H, fontSize: 100, fontWeight: 800, lineHeight: 1, marginTop: 18, color: score >= MINIMUM ? C.deep : C.navy }}>{score}</p>
          <div style={{ marginTop: 44 }}>
            <ScoreTrack score={score} w={520} />
          </div>
          <div style={{ marginTop: 28, ...fade(t, 19.2) }}>
            <Pill tone="warn" style={{ fontSize: 18 }}>
              Actual timing and results vary
            </Pill>
          </div>
        </Abs>
      </Phase>
    </>
  );
}

// 8. Refinance & bridge payoff
function S8({ t }: { t: number }) {
  const swap = at(t, 5.0, 1.0);
  const checks = [
    { label: "Refinance closed", a: 5.2 },
    { label: "EquiBridge loan paid off", a: 7.4 },
    { label: "Lien released", a: 9.4 },
  ];
  return (
    <>
      <Header t={t} a={0.2} eyebrow="Step 6 · Refinance closes" title="The permanent loan replaces the bridge" />
      <Abs x={140} y={170} w={1000} h={230} style={{ ...fade(t, 0.5) }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1000,
            height: 200,
            borderRadius: 20,
            border: `3px dashed ${C.teal}`,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - swap,
            transform: `scale(${1 - 0.06 * swap})`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Label>Temporary</Label>
            <p style={{ fontFamily: H, fontSize: 36, fontWeight: 800, marginTop: 6 }}>EquiBridge bridge loan</p>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1000,
            height: 200,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${C.deep}, ${C.teal})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: swap,
            transform: `translateX(${(1 - swap) * 80}px)`,
            boxShadow: "0 18px 40px rgba(15,76,92,0.25)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Label style={{ color: C.aqua }}>Permanent</Label>
            <p style={{ fontFamily: H, fontSize: 40, fontWeight: 800, marginTop: 6, color: "#fff" }}>Permanent mortgage</p>
          </div>
        </div>
      </Abs>
      <div style={{ position: "absolute", left: 0, top: 450, width: 1280, display: "flex", justifyContent: "center", gap: 18 }}>
        {checks.map((c) => (
          <Pill key={c.label} tone="ok" style={{ fontSize: 20, padding: "10px 20px", ...fade(t, c.a) }}>
            ✓ {c.label}
          </Pill>
        ))}
      </div>
    </>
  );
}

// 9. If the exit doesn't close
function S9({ t }: { t: number }) {
  const risks = [
    { title: "Job or income change", a: 2.0 },
    { title: "New debt", a: 3.4 },
    { title: "Score falls short", a: 4.8 },
  ];
  return (
    <>
      <Header t={t} a={0.2} eyebrow="Know the risk" title="If the exit doesn’t close" />
      {risks.map((r, k) => (
        <Abs
          key={r.title}
          x={60 + k * 400}
          y={140}
          w={360}
          h={110}
          style={{ ...panel, background: amber.bg, border: `2px solid ${amber.line}`, display: "flex", alignItems: "center", gap: 14, ...fade(t, r.a) }}
        >
          <Dot on tone="amber" />
          <p style={{ fontFamily: H, fontSize: 22, fontWeight: 800, color: amber.fg }}>{r.title}</p>
        </Abs>
      ))}
      <Abs x={60} y={290} w={1160} h={300} style={{ ...panel, borderLeft: `8px solid ${C.teal}`, padding: "30px 38px", ...fade(t, 6.6) }}>
        <Label>The bridge stands on its own</Label>
        <p style={{ fontFamily: H, fontSize: 32, fontWeight: 800, lineHeight: 1.3, marginTop: 12 }}>
          The bridge remains an enforceable obligation under its terms.
        </p>
        <div style={{ marginTop: 26, ...fade(t, 10.4) }}>
          <Pill tone="ok" style={{ fontSize: 21, padding: "10px 22px" }}>
            ✓ Repayment underwritten before we lend
          </Pill>
        </div>
        <p style={{ fontSize: 16, color: C.muted, marginTop: 18, ...fade(t, 11.2) }}>
          Interest-only · term of 12 months or less · balloon due at maturity · no automatic extension or conversion
        </p>
      </Abs>
    </>
  );
}

// 10. What to send us + close
function S10({ t }: { t: number }) {
  const docs = [
    { title: "1003 & 1008", a: 2.6 },
    { title: "Credit report", a: 5.0 },
    { title: "Conditional approval", a: 6.3 },
  ];
  return (
    <>
      <Phase t={t} a={0} b={8.8}>
        <p style={{ position: "absolute", left: 0, top: 90, width: 1280, textAlign: "center", fontFamily: H, fontSize: 46, fontWeight: 800, color: C.navy, ...fade(t, 0.3) }}>
          Have a file that’s almost there?
        </p>
        <p style={{ position: "absolute", left: 0, top: 170, width: 1280, textAlign: "center", fontSize: 22, color: C.body, ...fade(t, 2.3) }}>
          Send us:
        </p>
        {docs.map((d, k) => (
          <Abs key={d.title} x={130 + k * 350} y={240} w={320} h={230} style={{ ...panel, textAlign: "center", padding: "34px 24px", ...fade(t, d.a) }}>
            <div style={{ position: "relative", width: 56, height: 72, margin: "0 auto" }}>
              <div style={{ transform: "scale(2)", transformOrigin: "0 0", position: "absolute", left: 0, top: 0 }}>
                <Doc x={14} y={18} opacity={1} />
              </div>
            </div>
            <p style={{ fontFamily: H, fontSize: 24, fontWeight: 800, marginTop: 34 }}>{d.title}</p>
          </Abs>
        ))}
      </Phase>
      <Phase t={t} a={8.8}>
        <div style={{ position: "absolute", left: 0, top: 60, width: 1280, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, ...fade(t, 8.8, 0.8) }}>
          <Image src="/logo-mark.png" alt="" width={232} height={80} loading="eager" />
          <div>
            <p style={{ fontFamily: H, fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
              Equi<span style={{ color: C.teal }}>Bridge</span> <span style={{ fontSize: 22, letterSpacing: 8, color: C.deep }}>CAPITAL</span>
            </p>
            <p style={{ fontSize: 19, color: C.body, marginTop: 8 }}>Intelligent Lending. Greater Possibilities.</p>
          </div>
        </div>
        <p style={{ position: "absolute", left: 60, top: 186, width: 1160, textAlign: "center", fontFamily: H, fontSize: 30, fontWeight: 800, color: C.teal, ...fade(t, 9.6) }}>
          Establish the exit first, then advance the bridge.
        </p>
        <Abs x={240} y={258} w={800} h={196} style={{ ...panel, textAlign: "center", padding: "30px 40px", borderTop: `6px solid ${C.aqua}`, ...fade(t, 10.6) }}>
          <span
            style={{
              display: "inline-block",
              padding: "14px 30px",
              borderRadius: 999,
              background: C.deep,
              color: "#fff",
              fontFamily: H,
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15,76,92,0.25)",
            }}
          >
            Send us your next “almost” file →
          </span>
          <p style={{ fontSize: 18, color: C.muted, marginTop: 18 }}>equibridgecapital.com · Submit a Scenario · {CONTACT.phone}</p>
        </Abs>
        <p style={{ position: "absolute", left: 120, top: 486, width: 1040, textAlign: "center", fontSize: 13, lineHeight: 1.5, color: C.muted, ...fade(t, 11.4) }}>
          Hypothetical example with a fictional borrower. Not a commitment to lend. Score changes, conditional approvals and refinance closings
          are not guaranteed. All loans are subject to credit approval, underwriting and applicable law. The bridge loan is secured by the home.
          NMLS # {CONTACT.nmls} · Licensed in {CONTACT.states}
        </p>
      </Phase>
    </>
  );
}

const SCENE_VIEWS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

function Scene({ t, i, children }: { t: number; i: number; children: (local: number) => React.ReactNode }) {
  const s = SCENES[i];
  const last = i === SCENES.length - 1;
  const inScene = t >= s.start && (last ? t <= s.end : t < s.end);
  if (!inScene) return null;
  const fadeIn = i === 0 ? 1 : at(t, s.start, 0.5);
  const fadeOut = last ? 1 : 1 - prog(t, s.end - 0.4, 0.4);
  return <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut }}>{children(t - s.start)}</div>;
}

function captionAt(t: number) {
  let c = CAPTIONS[0].text;
  for (const cap of CAPTIONS) if (t >= cap.at) c = cap.text;
  return c;
}

// ---------- Player (same behavior as the How It Works explainer) ----------
export default function ProcessExplainer({ record = false }: { record?: boolean }) {
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
      const s = Math.min(width / 1280, height / 720);
      setBox({ s, x: (width - 1280 * s) / 2, y: (height - 720 * s) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  // Recording hook: the MP4 script calls window.__ebSeek(seconds) for each frame.
  useEffect(() => {
    if (!record) return;
    const w = window as unknown as { __ebSeek?: (v: number) => void; __ebDuration?: number };
    w.__ebSeek = (v: number) => seek(v);
    w.__ebDuration = DURATION;
  }, [record, seek]);

  const caption = captionAt(t);

  return (
    <div className="xp">
      <div ref={stageRef} className={record ? "xp-stage xp-record" : "xp-stage"} aria-hidden="true">
        <div className="xp-canvas" style={{ transform: `translate(${box.x}px, ${box.y}px) scale(${box.s})`, opacity: box.s ? 1 : 0 }}>
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
        <div className="xp-controls">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setPlaying((p) => !p)} style={{ minWidth: 96 }}>
            {playing ? "Pause" : "Play"}
          </button>
          <input type="range" min={0} max={DURATION} step={0.1} value={t} onChange={(e) => seek(Number(e.target.value))} aria-label="Animation position" />
          <span className="small" style={{ fontVariantNumeric: "tabular-nums" }}>
            {fmtTime(t)} / {fmtTime(DURATION)}
          </span>
        </div>
      )}
    </div>
  );
}

