import React from "react";
import { View, Text } from "react-native";
import { colors } from "../styles/colors";
import type { ListingStatus } from "../lib/types";

function bgFor(status: ListingStatus): string {
  const map: Record<string, string> = {
    New: "#2563EB",
    Contacted: "#2563EB",
    Scheduled: "#2563EB",
    Viewed: "#2563EB",
    Shortlisted: "#D97706",
    Applied: "#2563EB",
    Approved: "#10B981",
    Signed: "#0D9488",
    Rejected: "#EF4444",
    Archived: "#475569",
    Unknown: "#475569",
  };
  return map[status] ?? "#475569";
}

export function StatusPill({ status, fullWidth }: { status?: ListingStatus; fullWidth?: boolean }) {
  const safeStatus: ListingStatus = status ?? "Unknown";
  return (
    <View
      style={{
        backgroundColor: bgFor(safeStatus),
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 999,
        height: 20,
        justifyContent: "center",
        ...(fullWidth ? { width: "100%", alignItems: "center" } : null),
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: "800" }}>{safeStatus}</Text>
    </View>
  );
}
