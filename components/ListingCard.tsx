import React from "react";
import { View, Text, Pressable } from "react-native";
import { colors } from "../styles/colors";
import type { ListingUI } from "../lib/types";
import { StatusPill } from "./StatusPill";

type Props = {
  listing?: ListingUI; // defensive: avoid crash if caller passes undefined
  onLongPress?: () => void;
};

export function ListingCard({ listing, onLongPress }: Props) {
  if (!listing) {
    // Defensive guard: prevents runtime crash if a list item is undefined.
    return null;
  }

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={180}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "800", flex: 1, paddingRight: 10 }} numberOfLines={1}>
          {listing.buildingName}
        </Text>
        <StatusPill status={listing.status} />
      </View>

      <Text style={{ color: colors.textSecondary, marginTop: 6 }} numberOfLines={2}>
        {listing.addressLine}
      </Text>

      <Text style={{ color: colors.textSecondary, marginTop: 6 }} numberOfLines={1}>
        {listing.unitSummary}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "800" }}>
          {listing.priceSummary}
        </Text>
        <Text style={{ color: colors.textSecondary }} numberOfLines={1}>
          {listing.sourceLabel}
        </Text>
      </View>
    </Pressable>
  );
}
