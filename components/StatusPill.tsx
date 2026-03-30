// components/StatusPill.tsx — Build 3.2.20.2
// Change: color token references applied.
//   bgFor() local map removed — replaced with colors.status[safeStatus] direct reference.
//   textFor() white return: "#FFFFFF" → colors.textPrimary
//   "#111827" (dark text on New/white pill) stays hardcoded — no token for dark-on-light.
//   "#D1D5DB" (New pill border) stays hardcoded — pill-specific edge case, not a layout border.
//   Pill text fontSize, fontWeight, letterSpacing unchanged — pill is not in textStyles library.
// No layout, sizing, padding, or structural changes.

import React from "react";
import { View, Text } from "react-native";
import { colors } from "../styles/colors";
import type { ListingStatus } from "../lib/types";

// New is white background — needs dark text. All others use textPrimary.
// "#111827" is intentionally hardcoded: it is dark text for a light pill background.
// There is no dark-on-light text token in the design system.
function textFor(status: ListingStatus): string {
  return status === "New" ? "#111827" : colors.textPrimary;
}

export function StatusPill({ status, fullWidth }: { status?: ListingStatus; fullWidth?: boolean }) {
  const safeStatus: ListingStatus = status ?? "Unknown";
  const isNew = safeStatus === "New";

  return (
    <View
      style={{
        backgroundColor: colors.status[safeStatus],
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 999,
        height: 20,
        justifyContent: "center",
        // Border only on New (white bg) so it is visible against dark card.
        // "#D1D5DB" is intentionally hardcoded: light grey border for white pill only.
        ...(isNew ? { borderWidth: 1, borderColor: "#D1D5DB" } : {}),
        ...(fullWidth ? { width: "100%", alignItems: "center" } : null),
      }}
    >
      <Text style={{ color: textFor(safeStatus), fontSize: 12, fontWeight: "800", letterSpacing: -0.4 }}>
        {safeStatus}
      </Text>
    </View>
  );
}
