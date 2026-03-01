import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import type { ListingUI } from "../lib/types";
import { StatusPill } from "./StatusPill";

type Props = {
  listing?: ListingUI; // defensive: avoid crash if caller passes undefined
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

  const heart = listing.preferred ? "heart" : "heart-outline";
  const compareIcon = compareSelected ? "checkbox" : "square-outline";

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
      <View style={{ flexDirection: "row", padding: 14, gap: 12 }}>
        {/* Photo */}
        <View style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", position: "relative" }}>
          {listing.photoUrl ? (
            <Image source={{ uri: listing.photoUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={{ width: "100%", height: "100%", backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border }} />
          )}

          <View style={{ position: "absolute", left: 6, top: 6 }}>
            <StatusPill status={listing.status} />
          </View>

          <Pressable
            onPress={onTogglePreferred}
            disabled={!onTogglePreferred}
            hitSlop={10}
            style={({ pressed }) => ({
              position: "absolute",
              right: 6,
              top: 6,
              width: 30,
              height: 30,
              borderRadius: 999,
              backgroundColor: "rgba(0,0,0,0.35)",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed && onTogglePreferred ? 0.75 : 1,
            })}
          >
            <Ionicons name={heart as any} size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "900" }} numberOfLines={1}>
            {listing.buildingName}
          </Text>

          <Text style={{ color: colors.textSecondary, marginTop: 6 }} numberOfLines={2}>
            {listing.addressLine}
          </Text>

          <Text style={{ color: colors.textSecondary, marginTop: 6 }} numberOfLines={1}>
            {listing.unitSummary}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "900" }}>
              {listing.priceSummary}
            </Text>
            <Text style={{ color: colors.textSecondary }} numberOfLines={1}>
              {listing.sourceLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Row */}
      <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border }}>
        <ActionBtn icon={heart} label="Preferred" onPress={onTogglePreferred} />
        <ActionBtn icon={compareIcon} label="Compare" onPress={onToggleCompare} />
        <ActionBtn icon="eye-outline" label="View" onPress={onView} />
        <ActionBtn icon="pencil-outline" label="Edit" onPress={onEdit} />
        <ActionBtn icon="trash-outline" label="Delete" onPress={onDelete} danger />
      </View>
    </View>
  );
}

function ActionBtn({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  danger?: boolean;
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
      <Ionicons name={icon} size={18} color={danger ? colors.red : colors.textSecondary} />
      <Text style={{ marginTop: 4, fontSize: 11, color: danger ? colors.red : colors.textSecondary, fontWeight: "800" }}>
        {label}
      </Text>
    </Pressable>
  );
}
