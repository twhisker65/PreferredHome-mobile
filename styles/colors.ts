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

  // Status colors — all 10 statuses
  status: {
    New: "#2563EB",        // blue
    Contacted: "#2563EB",  // blue
    Scheduled: "#2563EB",  // blue
    Viewed: "#2563EB",     // blue
    Shortlisted: "#D97706", // amber
    Applied: "#2563EB",    // blue
    Approved: "#10B981",   // green
    Signed: "#0D9488",     // teal
    Rejected: "#EF4444",   // red
    Archived: "#475569",   // grey
    Unknown: "#475569",    // grey
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
