// Simple line icons in the brand's linear style. Decorative, so hidden from screen readers.
type P = { size?: number };
const base = (size = 40) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#1b6b73",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const HomeIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
);
export const ChartIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20H2" />
  </svg>
);
export const UsersIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M14 20c0-2.5 1.5-4.5 4-4.5s4 2 4 4.5" />
  </svg>
);
export const ShieldIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
export const EyeIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
  </svg>
);
export const HandshakeIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M8 12l3 3 5-6" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);
export const LockIcon = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
