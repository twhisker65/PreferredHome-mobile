import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import type { ListingUI } from "../lib/types";
import { StatusPill } from "./StatusPill";

type Props = {
  listing?: ListingUI;
  compareSelected?: boolean;

  onTogglePreferred?: () => void;
  onToggleCompare?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ListingCard({
  listing,
  compareSelected,
  onTogglePreferred,
  onToggleCompare,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (!listing) return null;

  const preferredColor = listing.preferred ? colors.primaryBlue : colors.textSecondary;
  const compareColor = compareSelected ? colors.primaryBlue : colors.textSecondary;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", padding: 6, gap: 8 }}>
        {/* Photo + Status (status is under photo per instructions) */}
        <View style={{ width: 64 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.cardHover,
            }}
          >
            {listing.photoUrl ? (
              <Image source={{ uri: listing.photoUrl }} style={{ width: "100%", height: "100%" }} />
            ) : null}
          </View>

          <View style={{ marginTop: 6, alignItems: "flex-start" }}>
            <StatusPill status={listing.status} />
          </View>
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: "900" }} numberOfLines={1}>
            {listing.buildingName}
          </Text>

          <Text style={{ color: colors.textSecondary, marginTop: 3, fontSize: 12 }} numberOfLines={2}>
            {listing.addressLine}
          </Text>

          <Text style={{ color: colors.textSecondary, marginTop: 3, fontSize: 12 }} numberOfLines={1}>
            {listing.unitSummary}
          </Text>

          <Text style={{ color: colors.textPrimary, marginTop: 6, fontSize: 15, fontWeight: "900" }}>
            {listing.priceSummary}
          </Text>
        </View>
      </View>

      {/* Action Row (icons only, no labels) */}
      <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border }}>
        <IconBtn icon={listing.preferred ? "heart" : "heart-outline"} onPress={onTogglePreferred} color={preferredColor} />
        <IconBtn icon={"git-compare-outline"} onPress={onToggleCompare} color={compareColor} />
        <IconBtn icon={"eye-outline"} onPress={onView} color={colors.textSecondary} />
        <IconBtn icon={"pencil-outline"} onPress={onEdit} color={colors.textSecondary} />
        <IconBtn icon={"trash-outline"} onPress={onDelete} color={colors.textSecondary} />
      </View>
    </View>
  );
}

function IconBtn({
  icon,
  onPress,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed && onPress ? 0.75 : 1,
      })}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}
