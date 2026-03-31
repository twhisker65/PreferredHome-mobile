// components/MenuSheet.tsx — Build 3.2.20 Closeout
// NOTE: This file is a dead component — not rendered by any active screen.
// Replaced by MenuPanel in Build 3.2.06. Retained for reference only.
// Legacy token references updated to prevent TypeScript errors at Closeout.

import React from "react";
import { View, Text, Pressable } from "react-native";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";

type Props = {
  onGoProfile: () => void;
  onGoSettings: () => void;
  onClose: () => void;
};

export function MenuSheet({ onGoProfile, onGoSettings, onClose }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <Text style={textStyles.subHeader}>Menu</Text>
      <MenuBtn label="Profile" onPress={onGoProfile} />
      <MenuBtn label="Settings" onPress={onGoSettings} />
      <View style={{ flex: 1 }} />
      <Text style={{ color: colors.textSecondary, fontSize: textStyles.micro.fontSize, textAlign: "center", opacity: 0.6, marginBottom: 4 }}>
        PreferredHome v3.2.20
      </Text>
      <Pressable
        onPress={onClose}
        style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfacePressed, borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
      >
        <Text style={textStyles.button}>Close</Text>
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
        backgroundColor: pressed ? colors.surfacePressed : colors.surface,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
      })}
    >
      <Text style={textStyles.button}>{label}</Text>
    </Pressable>
  );
}
