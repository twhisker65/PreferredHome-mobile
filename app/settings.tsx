import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { TopBar } from "../components/TopBar";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => router.back()} title="Settings" />

      <View style={{ padding: spacing.lg, gap: 12 }}>
        <Text style={typography.h2}>Settings</Text>
        <Text style={typography.muted}>
          Future: Buy/Rent selector (rent-only for now), notifications, data export, etc.
        </Text>
      </View>
    </SafeAreaView>
  );
}
