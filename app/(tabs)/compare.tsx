import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";

export default function CompareTab() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<"cards" | "table">("cards");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      <View style={{ padding: spacing.lg, gap: 12 }}>
<View style={{ flexDirection: "row", gap: 10 }}>
          <ToggleBtn label="Card view" icon="grid-outline" active={mode === "cards"} onPress={() => setMode("cards")} />
          <ToggleBtn label="Table view" icon="list-outline" active={mode === "table"} onPress={() => setMode("table")} />
        </View>

        <View style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 14, padding: spacing.lg, gap: 8 }}>
          <Text style={typography.body}>First pass: UI shell.</Text>
          <Text style={typography.muted}>Selection limit 4 listings. Baseline indicators (green/yellow/red) next.</Text>
        </View>
      </View>

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet
          onGoProfile={() => {
            setMenuOpen(false);
            router.push("/profile");
          }}
          onGoSettings={() => {
            setMenuOpen(false);
            router.push("/settings");
          }}
          onClose={() => setMenuOpen(false)}
        />
      </SidePanel>
    </SafeAreaView>
  );
}

function ToggleBtn({ label, icon, active, onPress }: { label: string; icon: React.ComponentProps<typeof Ionicons>["name"]; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: active ? colors.primaryBlue : colors.border,
        backgroundColor: pressed ? colors.cardHover : colors.card,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
      })}
    >
      <Text style={[typography.muted, { fontWeight: "900", color: active ? colors.textPrimary : colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}
