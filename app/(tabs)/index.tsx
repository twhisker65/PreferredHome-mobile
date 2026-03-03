import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { ListingCard } from "../../components/ListingCard";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
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
  const [preferredTop, setPreferredTop] = useState<ListingUI[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: colors.red, fontSize: 14, marginBottom: 8 }}>Load failed</Text>
          <Text style={{ color: colors.textSecondary }}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
<View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <StatPill label="Avg Base Rent" value={stats.avg !== null ? fmtMoney(stats.avg) : "—"} />
            <StatPill label="Min Base Rent" value={stats.min !== null ? fmtMoney(stats.min) : "—"} />
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <StatPill label="Max Base Rent" value={stats.max !== null ? fmtMoney(stats.max) : "—"} />
            <StatPill label="Listings" value={String(stats.count)} />
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "900" }}>Preferred</Text>
<View style={{ marginTop: 12, gap: 12 }}>
              {preferredTop.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
              {!preferredTop.length ? (
                <Text style={{ color: colors.textSecondary, marginTop: 8 }}>No preferred listings yet.</Text>
              ) : null}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
