// app/(tabs)/listings.tsx — Build 3.2.05
// Changes:
// - Replace placeholder Alert on onView with ViewPanel slide-out panel
// - Added viewPanelListing state (ListingUI | null)
// - ViewPanel rendered with topOffset so panel starts below header bar
// - All filter and listing logic unchanged

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Alert,
  Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { ListingCard } from "../../components/ListingCard";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { ViewPanel } from "../../components/ViewPanel";
import {
  FilterPanel,
  FilterState,
  DEFAULT_FILTERS,
  isFiltersActive,
} from "../../components/FilterPanel";
import { useListings } from "../../lib/useListings";
import { applyOrder } from "../../lib/orderApply";
import { loadOrder } from "../../lib/orderStorage";
import { deleteListing as deleteListingApi } from "../../lib/api";
import type { ListingUI, ListingStatus } from "../../lib/types";

type Section = { title: string; data: ListingUI[] };

// ── Filter logic ──────────────────────────────────────────────────
// Applied after applyOrder so sort order is preserved within each section.

function applyFilters(items: ListingUI[], f: FilterState): ListingUI[] {
  return items.filter((item) => {
    // Status: if specific statuses are selected, filter to those only
    if (f.statuses.length > 0 && !f.statuses.includes(item.status)) {
      return false;
    }
    // Unit type: filter to selected types only
    if (
      f.unitTypes.length > 0 &&
      !f.unitTypes.includes(item.raw?.unitType || "")
    ) {
      return false;
    }
    // Broker fee: noBrokerFee === "TRUE" means no fee exists
    if (f.brokerFee === "without" && item.raw?.noBrokerFee !== "TRUE") {
      return false;
    }
    if (f.brokerFee === "with" && item.raw?.noBrokerFee !== "FALSE") {
      return false;
    }
    // Preferred: only show heart-flagged listings
    if (f.preferred === "yes" && !item.preferred) {
      return false;
    }
    // Max rent: show listings at or under the entered amount
    if (f.maxRent !== "") {
      const max = parseFloat(f.maxRent);
      if (!isNaN(max) && item.baseRent != null && item.baseRent > max) {
        return false;
      }
    }
    // Zip code: filter to selected zip codes only
    if (
      f.zipCodes.length > 0 &&
      !f.zipCodes.includes(String(item.raw?.zipCode || "").trim())
    ) {
      return false;
    }
    return true;
  });
}

// ── Section header ────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
      <Text style={headingLabel}>{title}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────

export default function ListingsScreen() {
  const { listings, loading, refreshing, error, refresh } = useListings();
  const insets = useSafeAreaInsets();

  const [preferred, setPreferred] = useState<ListingUI[]>([]);
  const [other, setOther] = useState<ListingUI[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [viewPanelListing, setViewPanelListing] = useState<ListingUI | null>(null);

  // Applied filters — committed when user taps Apply in the panel
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  // TopBar height: safe area inset + 52px row + 1px divider
  const topBarHeight = insets.top + 53;

  const filtersActive = isFiltersActive(appliedFilters);

  // Auto-refresh whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  useEffect(() => {
    (async () => {
      const saved = await loadOrder();
      const ordered = applyOrder(listings, saved);
      setPreferred(ordered.preferred);
      setOther(ordered.other);
    })();
  }, [listings]);

  // Build sections with filters applied
  const sections: Section[] = useMemo(
    () => [
      { title: "Preferred", data: applyFilters(preferred, appliedFilters) },
      { title: "Candidates", data: applyFilters(other, appliedFilters) },
    ],
    [preferred, other, appliedFilters]
  );

  // ── Listing interaction handlers ────────────────────────────────

  function togglePreferred(id: string) {
    const inPreferred = preferred.some((l) => l.id === id);
    const inOther = other.some((l) => l.id === id);

    if (inPreferred) {
      const item = preferred.find((l) => l.id === id);
      if (!item) return;
      const updated = { ...item, preferred: !item.preferred };
      setPreferred((p) => p.filter((l) => l.id !== id));
      setOther((o) => [updated, ...o]);
      return;
    }

    if (inOther) {
      const item = other.find((l) => l.id === id);
      if (!item) return;
      const updated = { ...item, preferred: !item.preferred };
      setOther((o) => o.filter((l) => l.id !== id));
      setPreferred((p) => [updated, ...p]);
      return;
    }
  }

  function toggleCompare(id: string) {
    setCompareIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= 4) return next;
        next.add(id);
      }
      return next;
    });
  }

  function removeLocally(id: string) {
    setPreferred((p) => p.filter((l) => l.id !== id));
    setOther((o) => o.filter((l) => l.id !== id));
    setCompareIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }

  function deleteListing(id: string) {
    Alert.alert(
      "Delete listing?",
      "This will permanently remove the listing.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            removeLocally(id);
            try {
              await deleteListingApi(id);
            } catch (err: any) {
              Alert.alert(
                "Delete Failed",
                err?.message ??
                  "The listing was removed from the screen but could not be deleted from the server. Pull to refresh to restore it.",
                [{ text: "OK", onPress: refresh }]
              );
            }
          },
        },
      ]
    );
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top bar — filter icon turns blue when filters are active */}
      <TopBar
        title="PreferredHome"
        onPressMenu={() => setMenuOpen(true)}
        rightIconName="filter"
        rightIconColor={filtersActive ? colors.primaryBlue : colors.textPrimary}
        onPressRight={() => setFilterOpen(true)}
      />

      {/* FILTERS ACTIVE banner — blue, shown below header when active */}
      {filtersActive && (
        <View
          style={{
            backgroundColor: `${colors.primaryBlue}20`,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.primaryBlue}66`,
            paddingVertical: 7,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.primaryBlue,
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 0.9,
            }}
          >
            FILTERS ACTIVE
          </Text>
        </View>
      )}

      {/* Hamburger left panel */}
      <SidePanel
        visible={menuOpen}
        side="left"
        onClose={() => setMenuOpen(false)}
      >
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

      {/* Main listings content */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
            Loading listings...
          </Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: colors.red, fontSize: 14, marginBottom: 8 }}>
            Load failed
          </Text>
          <Text style={{ color: colors.textSecondary }}>{error}</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <SectionHeader title={section.title} />
          )}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <ListingCard
                listing={item}
                compareSelected={compareIds.has(item.id)}
                onTogglePreferred={() => togglePreferred(item.id)}
                onToggleCompare={() => toggleCompare(item.id)}
                onView={() => setViewPanelListing(item)}
                onEdit={() =>
                  router.push({ pathname: "/edit", params: { id: item.id } })
                }
                onDelete={() => deleteListing(item.id)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* Filter drop-down panel — conditionally mounted when open */}
      {filterOpen && (
        <FilterPanel
          topOffset={topBarHeight}
          listings={listings}
          appliedFilters={appliedFilters}
          onApply={(f) => setAppliedFilters(f)}
          onClear={() => setAppliedFilters(DEFAULT_FILTERS)}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* View listing detail panel — slides in from right */}
      <ViewPanel
        visible={viewPanelListing !== null}
        listing={viewPanelListing}
        topOffset={topBarHeight}
        onClose={() => setViewPanelListing(null)}
      />
    </View>
  );
}
