export const colors = {
  background: "#0B1220",
  card: "#111827",
  cardHover: "#162033",
  border: "#1F2937",
  primaryBlue: "#2563EB",
  accentBlue: "#3B82F6",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",

  status: {
    Available: "#10B981",
    Inquired: "#F59E0B",
    Visited: "#8B5CF6",
    Applied: "#2563EB",
    Rejected: "#EF4444",
  },
} as const;

export type ListingStatus = keyof typeof colors.status;
