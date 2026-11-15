// Script and timing for "The EquiBridge Process" video. Used by the animation
// (components/ProcessExplainer.tsx), the /process page (chapters + transcript) and scripts/make-srt.py.

export const DURATION = 209.72; // seconds

export const SCENES = [
  { start: 0, end: 26.52, label: "The Catch-22" },
  { start: 26.52, end: 44.61, label: "The solution" },
  { start: 44.61, end: 78.78, label: "Screening & simulation" },
  { start: 78.78, end: 105.51, label: "Underwrite the exit first" },
  { start: 105.51, end: 126.17, label: "Written confirmation" },
  { start: 126.17, end: 146.35, label: "Our own underwriting" },
  { start: 146.35, end: 167.9, label: "Disbursement & rescore" },
  { start: 167.9, end: 179.14, label: "Refinance & payoff" },
  { start: 179.14, end: 192.99, label: "If the exit doesn’t close" },
  { start: 192.99, end: 209.72, label: "What to send us" },
];

// The narration script. Captions, the SRT file and the transcript all come from this list.
export const CAPTIONS = [
  { at: 0.3, text: "Meet a borrower your file almost approves." },
  { at: 3.72, text: "Documented income. Significant home equity." },
  { at: 7.22, text: "A strong mortgage payment history, with no lates or collections." },
  { at: 11.43, text: "But four credit cards sit at 95% utilization, and the middle score is 592." },
  { at: 18.16, text: "The takeout lender needs 620." },
  { at: 20.68, text: "The reason code tells the story: “Proportion of balances to credit limits is too high.”" },
  { at: 26.87, text: "EquiBridge Capital provides a short-term, closed-end second mortgage that pays down specifically identified revolving debts," },
  { at: 34.86, text: "so an otherwise qualified borrower can reach the permanent loan." },
  { at: 38.83, text: "It isn’t general debt consolidation. Every bridge is tied to a documented exit." },
  { at: 44.96, text: "It starts with screening." },
  { at: 46.76, text: "We review the authorized credit report, utilization, income and equity, the takeout lender’s minimum score," },
  { at: 53.78, text: "and whether the bridge and its costs fit inside the planned refinance." },
  { at: 58.43, text: "Then the permanent lender, or a credit provider it accepts, simulates paying down the designated balances." },
  { at: 65.61, text: "In this illustration, utilization falls from 95% to about 3%," },
  { at: 70.92, text: "and the projected middle score rises from 592 to 668." },
  { at: 76.09, text: "It’s a projection, not a guarantee." },
  { at: 79.13, text: "Here’s what makes EquiBridge different." },
  { at: 81.4, text: "We don’t fund because a borrower has equity." },
  { at: 84.36, text: "We fund after the exit loan is substantially underwritten." },
  { at: 88.58, text: "Income and employment. Appraisal. Title." },
  { at: 92.06, text: "HOA documents, when applicable. Assets, reserves, and insurance." },
  { at: 97.05, text: "Program eligibility, and debt-to-income after the payoffs." },
  { at: 100.0, text: "Everything that can be cleared before the score condition is cleared first." },
  { at: 105.86, text: "Next, we ask the takeout lender’s underwriter to confirm in writing that the file meets the material requirements," },
  { at: 112.96, text: "and that the only remaining conditions are the minimum middle score and the designated payoffs." },
  { at: 118.46, text: "We review the actual conditional approval and every open condition." },
  { at: 122.83, text: "If material conditions remain, we don’t fund." },
  { at: 126.52, text: "EquiBridge then completes its own review: equity, combined loan-to-value, lien priority, compliance," },
  { at: 132.72, text: "and an independent repayment analysis that assumes the refinance might not close." },
  { at: 139.3, text: "The bridge is interest-only, with a term of 12 months or less, and the principal is due as a balloon at maturity." },
  { at: 146.7, text: "At closing, funds flow from EquiBridge through settlement directly to the designated creditors." },
  { at: 153.95, text: "In this example, $33,200. No cash goes to the borrower." },
  { at: 158.93, text: "Once the new balances report, the lender can request a rapid rescore, estimated at one to two weeks." },
  { at: 165.51, text: "Actual timing and results vary." },
  { at: 168.25, text: "When the updated score meets the requirement and the remaining conditions clear," },
  { at: 172.92, text: "the permanent refinance closes, the EquiBridge loan is paid off, and the lien is released." },
  { at: 179.49, text: "And if the exit doesn’t close, because of a job change, new debt, or a score that falls short," },
  { at: 185.67, text: "the bridge is still a real obligation under its terms." },
  { at: 189.44, text: "That’s why we underwrite repayment before we lend." },
  { at: 193.34, text: "Have a file that’s almost there?" },
  { at: 195.42, text: "Send us the 1003 and 1008, the credit report, and the takeout lender’s conditional approval." },
  { at: 201.63, text: "EquiBridge Capital. Establish the exit first, then advance the bridge." },
];

// Chapter list for the page (start times on the video’s clock).
export const CHAPTERS = SCENES.map((s) => ({ start: s.start, label: s.label }));
