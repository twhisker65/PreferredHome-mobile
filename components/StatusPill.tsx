import React from "react";
import { View, Text } from "react-native";
import { colors } from "../styles/colors";
import type { ListingStatus } from "../lib/types";

function bgFor(status: ListingStatus) {
  return (colors.status as any)[status] ?? colors.status.Unknown;
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
      <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: "800" }}>{safeStatus}</Text>
    </View>
  );
}
