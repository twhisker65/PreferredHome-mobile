// app/(tabs)/listings.tsx — Build 3.2.18.1 Hotfix
// Fixed: TopBar prop corrected from rightIcon → rightIconName (icon was silently ignored).
// Fixed: rightIconColor restored — icon turns blue when filters/sort active.
// Fixed: FILTERS ACTIVE banner restored (removed in error in 3.2.18).
// Carries: applySort() and sections useMemo from Build 3.2.18 — unchanged.

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
import { loadCompareIds, saveCompareIds } from "../../lib/compareStorage";
import type { ListingUI, ListingStatus } from "../../lib/types";

type Section = { title: string; data: ListingUI[] };

// ── Filter logic ──────────────────────────────────────────────────
// Applied before sort so sort order is preserved within each section.

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

// ── Sort logic ────────────────────────────────────────────────────
// Applied after filter. Nulls/NaN always sort last regardless of direction.

function applySort(
  items: ListingUI[],
  sortKey: string,
  sortOrder: string
): ListingUI[] {
  if (!sortKey) return items;
  const dir = sortOrder === "desc" ? -1 : 1;
  return [...items].sort((a, b) => {
    let aVal: any;
    let bVal: any;
    switch (sortKey) {
      case "Status":
        aVal = a.status ?? "";
        bVal = b.status ?? "";
        break;
      case "Square Footage":
        aVal = a.raw?.squareFootage != null ? Number(a.raw.squareFootage) : null;
        bVal = b.raw?.squareFootage != null ? Number(b.raw.squareFootage) : null;
        break;
      case "Commute Time":
        aVal = a.raw?.commuteTime != null ? Number(a.raw.commuteTime) : null;
        bVal = b.raw?.commuteTime != null ? Number(b.raw.commuteTime) : null;
        break;
      case "Base Rent":
        aVal = a.baseRent ?? null;
        bVal = b.baseRent ?? null;
        break;
      case "Total Monthly Cost":
        aVal = a.raw?.totalMonthly != null ? Number(a.raw.totalMonthly) : null;
        bVal = b.raw?.totalMonthly != null ? Number(b.raw.totalMonthly) : null;
        break;
      case "Date Added":
        aVal = a.id ?? "";
        bVal = b.id ?? "";
        break;
      default:
        return 0;
    }
    // Nulls and NaN always last
    const aNull =
      aVal === null ||
      aVal === undefined ||
      (typeof aVal === "number" && isNaN(aVal));
    const bNull =
      bVal === null ||
      bVal === undefined ||
      (typeof bVal === "number" && isNaN(bVal));
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    if (typeof aVal === "number") return dir * (aVal - bVal);
    return dir * String(aVal).localeCompare(String(bVal));
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

  // Auto-refresh and reload compareIds whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
      loadCompareIds().then((ids) => setCompareIds(new Set(ids)));
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

  // Build sections: filter first, then sort within each group
  const sections: Section[] = useMemo(
    () => [
      {
        title: "Preferred",
        data: applySort(
          applyFilters(preferred, appliedFilters),
          appliedFilters.sortKey,
          appliedFilters.sortOrder
        ),
      },
      {
        title: "Candidates",
        data: applySort(
          applyFilters(other, appliedFilters),
          appliedFilters.sortKey,
          appliedFilters.sortOrder
        ),
      },
    ],
    [preferred, other, appliedFilters]
  );

  function togglePreferred(id: string) {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    // optimistic update — full refresh will follow
    refresh();
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      } else {
        return prev; // max 3 — no change
      }
      saveCompareIds([...next]); // persist to AsyncStorage (fire and forget)
      return next;
    });
  }

  function deleteListing(id: string) {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
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
              Alert.alert("Error", "Could not delete listing.");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title="PreferredHome"
        onPressMenu={() => setMenuOpen(true)}
        rightIconName="filter"
        rightIconColor={filtersActive ? colors.primaryBlue : colors.textPrimary}
        onPressRight={() => setFilterOpen(true)}
      />

      {/* FILTERS ACTIVE banner — shown below header when filters or sort are active */}
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

      {loading && !refreshing ? (
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

      {/* Filter / Sort full-page panel — conditionally mounted when open */}
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
