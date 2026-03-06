import React from "react";
import { View, Text } from "react-native";
import type { ListingStatus } from "../lib/types";

// Build 3.2.2 — updated status pill colors
function bgFor(status: ListingStatus): string {
  const map: Record<string, string> = {
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
  };
  return map[status] ?? "#475569";
}

// New is white background — needs dark text. All others use white text.
function textFor(status: ListingStatus): string {
  return status === "New" ? "#111827" : "#FFFFFF";
}

export function StatusPill({ status, fullWidth }: { status?: ListingStatus; fullWidth?: boolean }) {
  const safeStatus: ListingStatus = status ?? "Unknown";
  const isNew = safeStatus === "New";

  return (
    <View
      style={{
        backgroundColor: bgFor(safeStatus),
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 999,
        height: 20,
        justifyContent: "center",
        // Border only on New (white bg) so it is visible against dark card
        ...(isNew ? { borderWidth: 1, borderColor: "#D1D5DB" } : {}),
        ...(fullWidth ? { width: "100%", alignItems: "center" } : null),
      }}
    >
      <Text style={{ color: textFor(safeStatus), fontSize: 12, fontWeight: "800" }}>
        {safeStatus}
      </Text>
    </View>
  );
}
