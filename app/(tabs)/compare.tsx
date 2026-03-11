// app/(tabs)/compare.tsx — Build 3.2.06
// Change: replaced SidePanel+MenuSheet with MenuPanel+sub-panel system.
// Added useSafeAreaInsets + topBarHeight. Added activeSubPanel state.
// All other logic unchanged.

import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";

export default function CompareTab() {
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
  const [mode, setMode] = useState<"cards" | "table">("cards");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      <View style={{ padding: spacing.lg, gap: 12, flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 6, marginBottom: 10 }}>
          <IconToggle icon="grid-outline" active={mode === "cards"} onPress={() => setMode("cards")} />
          <IconToggle icon="list-outline" active={mode === "table"} onPress={() => setMode("table")} />
        </View>

        <View style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 14, padding: spacing.lg, gap: 8 }}>
          <Text style={typography.body}>First pass: UI shell.</Text>
          <Text style={typography.muted}>Selection limit 4 listings. Baseline indicators (green/yellow/red) next.</Text>
        </View>
      </View>

      {/* Menu dropdown */}
      {menuOpen && (
        <MenuPanel
          topOffset={topBarHeight}
          onSelectPanel={(p) => { setMenuOpen(false); setActiveSubPanel(p); }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* Sub-panels */}
      {activeSubPanel === "profile" && (
        <ProfilePanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
      {activeSubPanel === "criteria" && (
        <CriteriaPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
      {activeSubPanel === "settings" && (
        <SettingsPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
    </View>
  );
}

function IconToggle({
  icon,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 44,
        height: 34,
        borderRadius: 12,
        borderWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent",
      })}
    >
      <Ionicons name={icon} size={24} color={active ? colors.primaryBlue : colors.textSecondary} />
    </Pressable>
  );
}
