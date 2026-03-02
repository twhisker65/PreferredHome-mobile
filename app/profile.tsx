import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Switch } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";
import { TopBar } from "../components/TopBar";
import { loadProfileToggles, saveProfileToggles, type ProfileToggles } from "../lib/profileStorage";

export default function ProfileScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });

  useEffect(() => {
    (async () => {
      const t = await loadProfileToggles();
      setToggles(t);
    })();
  }, []);

  async function setOne(key: keyof ProfileToggles, value: boolean) {
    const next = { ...toggles, [key]: value };
    setToggles(next);
    await saveProfileToggles(next);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => router.back()} title="Profile" />

      <View style={{ padding: spacing.lg, gap: 14 }}>
        <Text style={typography.h2}>Profile Toggles</Text>

        <Row label="Children" value={toggles.children} onValueChange={(v) => setOne("children", v)} />
        <Row label="Pets" value={toggles.pets} onValueChange={(v) => setOne("pets", v)} />
        <Row label="Car" value={toggles.car} onValueChange={(v) => setOne("car", v)} />

        <Text style={[typography.muted, { marginTop: spacing.md }]}>
          These toggles gate sections in Add Listing (Schools, Pet Amenities, Parking Fees).
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
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
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryBlue }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}
