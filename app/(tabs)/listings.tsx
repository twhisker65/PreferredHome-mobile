// app/(tabs)/listings.tsx — Build 3.2.06
// Change: replaced SidePanel+MenuSheet with MenuPanel+sub-panel system.
// Added activeSubPanel state. All filter, ViewPanel, and listing logic unchanged.

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
import { ViewPanel } from "../../components/ViewPanel";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
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
  return items.filter((l) => {
    const raw = l.raw ?? {};
    if (f.statuses.length > 0 && !f.statuses.includes(l.status as ListingStatus)) return false;
    if (f.unitTypes.length > 0 && !f.unitTypes.includes(String(raw.unitType ?? ""))) return false;
    if (f.brokerFee === "with"    && !boolVal(raw.noBrokerFee)) return false;
    if (f.brokerFee === "without" &&  boolVal(raw.noBrokerFee)) return false;
    if (f.preferred === "yes"     && !l.preferred) return false;
    if (f.maxRent !== "") {
      const max = Number(f.maxRent);
      if (!isNaN(max) && (l.baseRent ?? 0) > max) return false;
    }
    if (f.zipCodes.length > 0) {
      const zip = String(raw.zipCode ?? "").trim();
      if (!f.zipCodes.includes(zip)) return false;
    }
    return true;
  });
}

function boolVal(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toUpperCase();
  return s === "TRUE" || s === "1" || s === "YES";
}

// ── Section header ────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
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
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
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

  function togglePreferred(id: string) {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    const next = !listing.preferred;
    // optimistic update — full refresh will follow
    refresh();
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  }

  function deleteListing(id: string) {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListingApi(id);
              refresh();
            } catch {
              Alert.alert(
                "Delete Failed",
                "Could not delete listing. Pull to refresh to restore it.",
                [{ text: "OK", onPress: refresh }]
              );
            }
          },
        },
      ]
    );
  }

  // ── Render ────────────────────────────────────────────────────────

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
