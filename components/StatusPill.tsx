import React from "react";
import { View, Text } from "react-native";
import { colors } from "../styles/colors";
import type { ListingStatus } from "../lib/types";

function bgFor(status: ListingStatus) {
  switch (status) {
    case "Available":
      return colors.green;
    case "Inquired":
      return colors.yellow;
    case "Visited":
      return colors.purple;
    case "Applied":
      return colors.primaryBlue;
    case "Rejected":
      return colors.red;
    default:
      return colors.border;
  }
}

export function StatusPill({ status }: { status?: ListingStatus }) {
  const safeStatus: ListingStatus = status ?? "Unknown";
  return (
    <View
      style={{
        backgroundColor: bgFor(safeStatus),
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: "700" }}>
        {safeStatus}
      </Text>
    </View>
  );
}
