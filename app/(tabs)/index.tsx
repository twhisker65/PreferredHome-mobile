// app/(tabs)/index.tsx — Build 3.2.06
// Change: replaced SidePanel+MenuSheet with MenuPanel+sub-panel system.
// Added useSafeAreaInsets + topBarHeight. Added activeSubPanel state.
// All other logic unchanged.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { ListingCard } from "../../components/ListingCard";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
import { useListings } from "../../lib/useListings";
import { applyOrder } from "../../lib/orderApply";
import { loadOrder } from "../../lib/orderStorage";
import type { ListingUI } from "../../lib/types";

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 11, letterSpacing: 0.7 }}>{label.toUpperCase()}</Text>
      <Text style={{ color: colors.textPrimary, marginTop: 6, fontSize: 18, fontWeight: "900" }}>{value}</Text>
    </View>
  );
}

function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `$${Math.round(n).toLocaleString()}`;
}

export default function HomeScreen() {
  const { listings, loading, refreshing, error, refresh } = useListings();
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;

  const [preferredTop, setPreferredTop] = useState<ListingUI[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);

  // Refresh whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  useEffect(() => {
    (async () => {
      const saved = await loadOrder();
      const ordered = applyOrder(listings, saved);
      setPreferredTop(ordered.preferred.slice(0, 3));
    })();
  }, [listings]);

  const stats = useMemo(() => {
    const rents = listings.map((l) => l.baseRent ?? 0).filter((n) => n > 0);
    const count = listings.length;
    const min = rents.length ? Math.min(...rents) : null;
    const max = rents.length ? Math.max(...rents) : null;
    const avg = rents.length ? rents.reduce((a, b) => a + b, 0) / rents.length : null;
    return { min, max, avg, count };
  }, [listings]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          contentContainerStyle={{ padding: 16, gap: 14 }}
        >
          {/* Stats row */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <StatPill label="Total" value={String(stats.count)} />
            <StatPill label="Min Rent" value={stats.min !== null ? fmtMoney(stats.min) : "—"} />
            <StatPill label="Avg Rent" value={stats.avg !== null ? fmtMoney(stats.avg) : "—"} />
          </View>

          {/* Top 3 preferred */}
          {preferredTop.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={headingLabel}>TOP 3</Text>
              {preferredTop.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  hideActions
                  compareSelected={false}
                  onTogglePreferred={() => {}}
                  onToggleCompare={() => {}}
                  onView={() => {}}
                  onEdit={() => router.push({ pathname: "/edit", params: { id: item.id } })}
                  onDelete={() => {}}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

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
