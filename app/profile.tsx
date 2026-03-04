import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { TopBar } from "../components/TopBar";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => router.back()} title="Profile" />

      <View style={{ padding: spacing.lg, gap: 14 }}>
        <Text style={[typography.muted, { marginTop: spacing.md }]}>
          Profile settings coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
