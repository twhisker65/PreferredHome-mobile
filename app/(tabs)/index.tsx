import React, { useEffect, useMemo, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { getHealth } from "../../lib/api";

export default function HomeTab() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [healthErr, setHealthErr] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const json = await getHealth();
        if (live) setHealth(json);
      } catch (e: any) {
        if (live) setHealthErr(e?.message ?? String(e));
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const healthText = useMemo(() => {
    if (healthErr) return `API: ERROR (${healthErr})`;
    if (!health) return "API: loading…";
    return `API: ${JSON.stringify(health)}`;
  }, [health, healthErr]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: 12 }}>
        <Text style={[typography.h2, { marginTop: spacing.sm }]}>PREFERRED HOME IS LIVE</Text>
        <Text style={typography.muted}>{healthText}</Text>

        <View
          style={{
            marginTop: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: 14,
            padding: spacing.lg,
            gap: 8,
          }}
        >
          <Text style={typography.body}>Next: go to Listings to see draggable cards.</Text>
          <Text style={typography.muted}>
            First pass UI scaffolding is in place (tabs + top bar + panels).
          </Text>
        </View>
      </ScrollView>

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet
          onGoProfile={() => {
            setMenuOpen(false);
            // Profile lives under /profile (stack route)
          }}
          onGoSettings={() => {
            setMenuOpen(false);
            // Settings lives under /settings (stack route)
          }}
          onClose={() => setMenuOpen(false)}
        />
      </SidePanel>
    </SafeAreaView>
  );
}
