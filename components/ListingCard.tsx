import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import type { Listing } from "../lib/types";
import { StatusPill } from "./StatusPill";

type Props = {
  item: Listing;
  onPressView: () => void;
  onPressCompare: () => void;
  onPressEdit: () => void;
  onPressDelete: () => void;
};

export function ListingCard({ item, onPressView, onPressCompare, onPressEdit, onPressDelete }: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      {/* Photo placeholder (square on left per spec, but keeping first pass simple & responsive) */}
      <View
        style={{
          height: 110,
          backgroundColor: "#0F172A",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          justifyContent: "flex-end",
          padding: spacing.md,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <StatusPill status={item.status} />
          <Ionicons
            name={item.preferred ? "heart" : "heart-outline"}
            size={22}
            color={item.preferred ? colors.accentBlue : colors.textSecondary}
          />
        </View>
      </View>

      <View style={{ padding: spacing.md, gap: 6 }}>
        <Text style={typography.h2}>{item.buildingName}</Text>
        <Text style={typography.muted}>{item.addressLine}</Text>
        <Text style={typography.muted}>{item.unitSummary}</Text>

        <Text style={[typography.body, { fontWeight: "800", marginTop: 4 }]}>
          ${item.monthlyTotal.toLocaleString()} / mo
        </Text>
        <Text style={typography.muted}>{item.source}</Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.sm }}>
          <ActionBtn label="Compare" onPress={onPressCompare} />
          <ActionBtn label="View" onPress={onPressView} />
          <IconBtn icon="create-outline" onPress={onPressEdit} />
          <IconBtn icon="trash-outline" onPress={onPressDelete} />
        </View>
      </View>
    </View>
  );
}

function ActionBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.accentBlue : colors.primaryBlue,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
      })}
    >
      <Text style={[typography.muted, { color: colors.textPrimary, fontWeight: "800" }]}>{label}</Text>
    </Pressable>
  );
}

function IconBtn({ icon, onPress }: { icon: any; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: pressed ? colors.cardHover : colors.card,
      })}
    >
      <Ionicons name={icon} size={18} color={colors.textPrimary} />
    </Pressable>
  );
}
