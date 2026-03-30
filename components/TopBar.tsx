// components/TopBar.tsx — Build 3.2.20.1
// Change: font and color token references applied.
//   colors.primaryBlue → colors.accent (same hex — rename only)
//   styles.title fontSize, fontWeight, letterSpacing → textStyles.mainTitleWhite token
// No layout, sizing, padding, or structural changes.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";

type Props = {
  title?: string;
  onPressMenu?: () => void;

  rightIconName?: React.ComponentProps<typeof Ionicons>["name"];
  rightIconColor?: string;
  onPressRight?: () => void;
};

export function TopBar({
  title = "PreferredHome",
  onPressMenu,
  rightIconName,
  rightIconColor,
  onPressRight,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Pressable
          onPress={onPressMenu}
          disabled={!onPressMenu}
          hitSlop={12}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && onPressMenu ? { opacity: 0.75 } : null,
          ]}
        >
          {/* Hamburger +1.25x */}
          <Ionicons name="menu" size={30} color={colors.textPrimary} />
        </Pressable>

        {title === "PreferredHome" ? (
          <Text numberOfLines={1} style={styles.title}>
            <Text style={{ color: colors.accent }}>Preferred</Text>
            <Text style={{ color: colors.textPrimary }}>Home</Text>
          </Text>
        ) : (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}

        <Pressable
          onPress={onPressRight}
          disabled={!onPressRight || !rightIconName}
          hitSlop={12}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && onPressRight ? { opacity: 0.75 } : null,
          ]}
        >
          {rightIconName ? (
            <Ionicons
              name={rightIconName}
              size={26}
              color={rightIconColor ?? colors.textPrimary}
            />
          ) : null}
        </Pressable>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
  },
  row: {
    height: 52,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    color:         textStyles.mainTitleWhite.color,
    fontSize:      textStyles.mainTitleWhite.fontSize,
    fontWeight:    textStyles.mainTitleWhite.fontWeight,
    textAlign:     "center",
    letterSpacing: textStyles.mainTitleWhite.letterSpacing,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
