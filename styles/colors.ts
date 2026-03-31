// styles/colors.ts — Build 3.2.20 Closeout
// All legacy aliases removed. All components now use new token names.

export const colors = {

  // ── Core surfaces ──────────────────────────────────────────────
  background:     "#112240",   // app shell and screen background
  surface:        "#1B2A4A",   // cards, panels, sheets, selection boxes
  surfacePressed: "#162A45",   // state token — pressed rows, active control containers ONLY
  border:         "#223A70",   // dividers, outlines, section separators

  // ── Brand ──────────────────────────────────────────────────────
  accent: "#2563EB",           // links, active states, selected states, yes-checkmarks

  // ── Text ───────────────────────────────────────────────────────
  textPrimary:   "#F8FAFC",    // headings, values, primary information
  textSecondary: "#94A3B8",    // labels, muted text, no-data dash (-)

  // ── Compare logic only ─────────────────────────────────────────
  comparePass: "#22C55E",      // meets criteria — compare screen only
  compareWarn: "#F59E0B",      // borderline — compare screen only
  compareFail: "#DC2626",      // fails criteria — compare screen only

  // ── Status colors (unchanged) ──────────────────────────────────
  status: {
    New:         "#FFFFFF",
    Contacted:   "#EAB308",
    Scheduled:   "#F97316",
    Viewed:      "#7C3AED",
    Shortlisted: "#2563EB",
    Applied:     "#0D9488",
    Approved:    "#10B981",
    Signed:      "#D97706",
    Rejected:    "#EF4444",
    Archived:    "#475569",
    Unknown:     "#475569",
  },

} as const;

export type ListingStatus = keyof typeof colors.status;
