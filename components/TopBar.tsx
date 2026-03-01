import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";

type Props = {
  onPressMenu: () => void;
  title?: string;
};

export function TopBar({ onPressMenu, title = "PreferredHome" }: Props) {
  return (
    <View
      style={{
        height: 54,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPress={onPressMenu}
        hitSlop={10}
        style={{ width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" }}
      >
        <Ionicons name="menu" size={26} color={colors.textPrimary} />
      </Pressable>

      <Text style={[typography.h1, { letterSpacing: 0.2 }]}>{title}</Text>

      {/* Right spacer to keep title centered */}
      <View style={{ width: 44, height: 44 }} />
    </View>
  );
}
