// components/ListingCard.tsx — Build 3.2.20.3
// Change: font and color token references applied.
//   colors.primaryBlue → colors.accent (preferredColor, compareColor)
//   colors.card        → colors.surface (card wrapper background)
//   colors.cardHover   → colors.surfacePressed (photo placeholder background — state token)
//   Building name: fontSize 17/fontWeight "900"/textPrimary → textStyles.cardTitle (16/700/textPrimary)
//   Address, unit summary: fontSize 12/textSecondary → textStyles.bodySmall (12/400/textSecondary)
//   Rent + fees: fontSize 15/fontWeight "900"/textPrimary → textStyles.cardSecondary (14/500/textSecondary)
// No layout, padding, margin, borderRadius, or structural changes.

import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";
import type { ListingUI } from "../lib/types";
import { StatusPill } from "./StatusPill";

type Props = {
  listing?: ListingUI;
  compareSelected?: boolean;
  hideActions?: boolean;
  expanded?: boolean;
  onCardPress?: () => void;

  onTogglePreferred?: () => void;
  onToggleCompare?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ListingCard({
  listing,
  compareSelected,
  hideActions,
  expanded,
  onCardPress,
  onTogglePreferred,
  onToggleCompare,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (!listing) return null;

  const preferredColor = listing.preferred ? colors.accent : colors.textSecondary;
  const compareColor = compareSelected ? colors.accent : colors.textSecondary;

  // Icon row is visible only when hideActions is not set AND card is expanded
  const showActions = !hideActions && expanded;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      {/* Tappable card body — pressing expands/collapses icon row */}
      <Pressable
        onPress={hideActions ? undefined : onCardPress}
        style={{ flexDirection: "row", padding: 6, gap: 8 }}
      >
        {/* Left column: Photo + Status Pill */}
        <View style={{ width: 80 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 14,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surfacePressed,
            }}
          >
            {listing.photoUrl ? (
              <Image source={{ uri: listing.photoUrl }} style={{ width: "100%", height: "100%" }} />
            ) : null}
          </View>

          <View style={{ marginTop: 6, alignSelf: "stretch" }}>
            <StatusPill status={listing.status} fullWidth />
          </View>
        </View>

        {/* Right column: Building name, address, unit info, rent pushed to bottom */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                color:      textStyles.cardTitle.color,
                fontSize:   textStyles.cardTitle.fontSize,
                fontWeight: textStyles.cardTitle.fontWeight,
              }}
              numberOfLines={1}
            >
              {listing.buildingName}
            </Text>

            <Text
              style={{
                color:     textStyles.bodySmall.color,
                fontSize:  textStyles.bodySmall.fontSize,
                marginTop: 3,
              }}
              numberOfLines={2}
            >
              {listing.addressLine}
            </Text>

            <Text
              style={{
                color:     textStyles.bodySmall.color,
                fontSize:  textStyles.bodySmall.fontSize,
                marginTop: 3,
              }}
              numberOfLines={1}
            >
              {listing.unitSummary}
            </Text>
          </View>

          {/* Rent + fees — pushed to bottom of right column, level with status pill */}
          <Text
            style={{
              color:      textStyles.cardSecondary.color,
              fontSize:   textStyles.cardSecondary.fontSize,
              fontWeight: textStyles.cardSecondary.fontWeight,
            }}
          >
            {listing.priceSummary}
          </Text>
        </View>
      </Pressable>

      {/* Action Row (icons only, no labels) — visible only when expanded */}
      {showActions ? (
        <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border }}>
          <IconBtn icon={listing.preferred ? "heart" : "heart-outline"} onPress={onTogglePreferred} color={preferredColor} />
          <IconBtn icon={"git-compare-outline"} onPress={onToggleCompare} color={compareColor} />
          <IconBtn icon={"eye-outline"} onPress={onView} color={colors.textSecondary} />
          <IconBtn icon={"pencil-outline"} onPress={onEdit} color={colors.textSecondary} />
          <IconBtn icon={"trash-outline"} onPress={onDelete} color={colors.textSecondary} />
        </View>
      ) : null}
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
        opacity: pressed && onPress ? 0.7 : 1,
      })}
    >
      <Ionicons name={icon} size={22} color={color} />
    </Pressable>
  );
}
