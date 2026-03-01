import React from "react";
import { SafeAreaView, View, Text, Switch } from "react-native";
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
        <Text style={typography.h2}>Toggles</Text>

        <Row label="Children" />
        <Row label="Pets" />
        <Row label="Car" />

        <Text style={[typography.muted, { marginTop: spacing.md }]}>
          First pass: UI shell only. Next: wire to Baseline (toggleChildren/togglePets/toggleCar).
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Row({ label }: { label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        borderRadius: 14,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
      }}
    >
      <Text style={[typography.body, { fontWeight: "900" }]}>{label}</Text>
      <Switch />
    </View>
  );
}
