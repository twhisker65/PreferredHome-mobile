import React, { useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";

export default function CalendarTab() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      <View style={{ padding: spacing.lg, gap: 12 }}>
        <Text style={typography.h2}>Calendar</Text>

        <View style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 14, padding: spacing.lg, gap: 8 }}>
          <Text style={typography.body}>First pass: UI shell.</Text>
          <Text style={typography.muted}>
            Next: calendar grid + schedule list (building, address, date/time, contact).
          </Text>
        </View>
      </View>

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet onGoProfile={() => setMenuOpen(false)} onGoSettings={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
      </SidePanel>
    </SafeAreaView>
  );
}
