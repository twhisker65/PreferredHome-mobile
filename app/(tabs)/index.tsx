import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { ListingCard } from "../../components/ListingCard";
import { useListings } from "../../lib/useListings";
import { applyOrder } from "../../lib/orderApply";
import { loadOrder } from "../../lib/orderStorage";
import type { ListingUI } from "../../lib/types";

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 11, letterSpacing: 0.7 }}>{label.toUpperCase()}</Text>
      <Text style={{ color: colors.text, marginTop: 6, fontSize: 18, fontWeight: "800" }}>{value}</Text>
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

  useEffect(() => {
    (async () => {
      const saved = await loadOrder();
      const ordered = applyOrder(listings, saved);
      setPreferredTop(ordered.preferred.slice(0, 3));
    })();
  }, [listings]);

  const stats = useMemo(() => {
    const rents = listings.map((l) => l.baseRent ?? 0).filter((n) => n > 0);
    if (!rents.length) return null;
    const min = Math.min(...rents);
    const max = Math.max(...rents);
    const avg = rents.reduce((a, b) => a + b, 0) / rents.length;
    const sorted = [...rents].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return { min, max, avg, median, count: rents.length };
  }, [listings]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" />
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
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
            <Text style={{ color: colors.text, fontSize: 26, fontWeight: "900" }}>Home</Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }}>
              Quick view: top 3 preferred. Full sorting lives in Listings.
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>Base Rent Snapshot</Text>
              {!stats ? (
                <Text style={{ color: colors.textSecondary, marginTop: 8 }}>No rent data yet.</Text>
              ) : (
                <>
                  <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }}>
                    {stats.count} listings with base rent
                  </Text>
                  <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                    <StatPill label="Lowest" value={fmtMoney(stats.min)} />
                    <StatPill label="Baseline" value={fmtMoney(stats.median)} />
                  </View>
                  <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <StatPill label="Average" value={fmtMoney(stats.avg)} />
                    <StatPill label="Highest" value={fmtMoney(stats.max)} />
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12, letterSpacing: 0.8 }}>TOP PREFERRED</Text>
          </View>

          {preferredTop.map((item) => (
            <View key={item.id} style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <ListingCard listing={item} />
            </View>
          ))}

          {!preferredTop.length ? (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ color: colors.textSecondary }}>No preferred listings yet.</Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
