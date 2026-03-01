import React from "react";
import { View, Text } from "react-native";
import { colors, type ListingStatus } from "../styles/colors";
import { typography } from "../styles/typography";

export function StatusPill({ status }: { status: ListingStatus }) {
  const bg = colors.status[status] ?? colors.accentBlue;

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <Text style={[typography.muted, { color: colors.textPrimary, fontWeight: "700" }]}>{status}</Text>
    </View>
  );
}
