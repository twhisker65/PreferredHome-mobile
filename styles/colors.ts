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

  // Status colors
  status: {
    Available: "#10B981",
    Inquired: "#F59E0B",
    Visited: "#8B5CF6",
    Applied: "#2563EB",
    Rejected: "#EF4444",
    Unknown: "#475569",
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
