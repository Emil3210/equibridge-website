# EquiBridge Capital — website

Public marketing site for EquiBridge Capital (equibridgecapital.com), built with Next.js and deployed on Vercel.
Contact and waitlist forms save to the `equibridge-capital` Supabase project.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/solutions` | Combination Bridge Loan, Scenario Review, Partner Platform, FAQ |
| `/how-it-works` | Brokers / homeowners toggle (`?view=homeowners` opens the homeowner tab) |
| `/about` | Mission, leadership, contact form (`/about#contact`) |
| `/portal` | Partner portal "opening soon" page with early-access signup |
| `/privacy`, `/terms`, `/licensing` | Placeholders until counsel drafts the text |

## Where to edit common things

- Company email, phone, NMLS #, states, review turnaround: `lib/site.ts`
- Brand colors and fonts: top of `app/globals.css`
- Header menu: `components/Header.tsx`; footer: `components/Footer.tsx`

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values
npm run dev                  # http://localhost:3000
```

## Environment variables (set in Vercel → Project → Settings → Environment Variables)

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` — the publishable (public) key. Database row-level security only allows inserts into
  `contact_messages` and `waitlist_signups`, so this key cannot read submissions. View submissions in the Supabase
  dashboard (Table Editor).

## Before launch

- Fill every `[bracketed]` placeholder (NMLS #, licenses, phone, rate/term details).
- Have counsel draft Privacy, Terms and Licensing pages and approve all loan copy.
- The upload portal is a later phase: it needs partner login with MFA, private encrypted storage, access logs and an
  FTC Safeguards Rule information-security program before any borrower documents are collected.
