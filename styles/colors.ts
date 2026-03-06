export const colors = {
  // Core surfaces
  background: "#0B1220",
  card: "#111827",
  cardHover: "#162033",
  border: "#1F2937",

  // Brand
  primaryBlue: "#2563EB",
  accentBlue: "#3B82F6",

  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",

  // Status colors — Build 3.2.2 updated palette
  status: {
    New:         "#FFFFFF",   // white
    Contacted:   "#EAB308",   // yellow
    Scheduled:   "#F97316",   // orange
    Viewed:      "#7C3AED",   // purple
    Shortlisted: "#2563EB",   // blue
    Applied:     "#0D9488",   // teal
    Approved:    "#10B981",   // green
    Signed:      "#D97706",   // amber
    Rejected:    "#EF4444",   // red
    Archived:    "#475569",   // grey
    Unknown:     "#475569",   // grey
  },

  // Legacy aliases (older files/components)
  text: "#F8FAFC",
  primary: "#2563EB",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  red: "#EF4444",
} as const;

export type ListingStatus = keyof typeof colors.status;
