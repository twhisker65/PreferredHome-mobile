import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";

type Props = {
  title?: string;
  onPressMenu?: () => void;
};

export function TopBar({ title = "PreferredHome", onPressMenu }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <Pressable
          onPress={onPressMenu}
          disabled={!onPressMenu}
          hitSlop={12}
          style={({ pressed }) => [styles.iconBtn, pressed && onPressMenu ? { opacity: 0.75 } : null]}
        >
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </Pressable>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.iconBtn} />
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
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
