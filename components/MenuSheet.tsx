// components/MenuSheet.tsx — Build 3.2.06
// Change: version label updated to v3.2.06.
// Note: MenuSheet is no longer rendered by main screens in 3.2.06 (replaced by MenuPanel).
// File retained in codebase for reference.

import React from "react";
import { View, Text, Pressable } from "react-native";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";

type Props = {
  onGoProfile: () => void;
  onGoSettings: () => void;
  onClose: () => void;
};

export function MenuSheet({ onGoProfile, onGoSettings, onClose }: Props) {
  return (
    <View style={{ flex: 1, padding: spacing.lg, gap: 14 }}>
      <Text style={typography.h2}>Menu</Text>

      <MenuBtn label="Profile" onPress={onGoProfile} />
      <MenuBtn label="Settings" onPress={onGoSettings} />

      <View style={{ flex: 1 }} />

      {/* Build version label — above Close so it is never cut off */}
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          textAlign: "center",
          opacity: 0.6,
          marginBottom: 4,
        }}
      >
        PreferredHome v3.2.06
      </Text>

      <Pressable
        onPress={onClose}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.cardHover,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <Text style={[typography.body, { fontWeight: "800" }]}>Close</Text>
      </Pressable>
    </View>
  );
}

function MenuBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: pressed ? colors.cardHover : colors.card,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
      })}
    >
      <Text style={[typography.body, { fontWeight: "800" }]}>{label}</Text>
    </Pressable>
  );
}
