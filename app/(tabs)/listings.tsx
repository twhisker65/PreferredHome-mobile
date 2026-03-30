// app/(tabs)/listings.tsx — Build 3.2.20.5
// Change: font and color token references applied.
//   colors.primaryBlue → colors.accent (rightIconColor, FILTERS ACTIVE banner x3)
//   colors.red → colors.compareFail (error state text)
//   error text fontSize: 14 → textStyles.bodyPrimary.fontSize
//   FILTERS ACTIVE banner fontSize:11/fontWeight:"700"/letterSpacing:0.9 kept as-is —
//     no matching token exists; existing style, not a new ad hoc value.
// No logic, layout, filter, sort, or structural changes.

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
import { headingLabel, textStyles } from "../../styles/typography";
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
import { deleteListing as deleteListingApi, updateListing } from "../../lib/api";
import { loadCompareIds, saveCompareIds } from "../../lib/compareStorage";
import type { ListingUI, ListingStatus } from "../../lib/types";

type Section = { title: string; data: ListingUI[] };

// ── Filter logic ──────────────────────────────────────────────────
// Applied before sort so sort order is preserved within each section.

function applyFilters(items: ListingUI[], f: FilterState): ListingUI[] {
  return items.filter((l) => {
    const raw = l.raw ?? {};
    if (f.statuses.length > 0 && !f.statuses.includes(l.status as ListingStatus)) return false;
    if (f.unitTypes.length > 0 && !f.unitTypes.includes(String(raw.propertyType ?? ""))) return false;
    if (f.brokerFee === "with"    &&  boolVal(raw.noBrokerFee)) return false;
    if (f.brokerFee === "without" && !boolVal(raw.noBrokerFee)) return false;
    if (f.preferred === "yes" && !l.preferred) return false;
    if (f.maxRent !== "") {
      const max = Number(f.maxRent);
      if (!isNaN(max) && (l.baseRent ?? 0) > max) return false;
    }
    return true;
  });
}

// ── Sort logic ────────────────────────────────────────────────────
// Applied after filter. Nulls/NaN always sort last regardless of direction.

function applySort(
  items: ListingUI[],
  sortKey: FilterState["sortKey"],
  sortOrder: FilterState["sortOrder"]
): ListingUI[] {
  if (!sortKey || sortKey === "none") return items;

  const dir = sortOrder === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    const rawA = a.raw ?? {};
    const rawB = b.raw ?? {};

    let valA: number | string | null = null;
    let valB: number | string | null = null;

    switch (sortKey) {
      case "status":
        valA = String(a.status ?? "");
        valB = String(b.status ?? "");
        break;
      case "squareFootage":
        valA = numOrNull(rawA.squareFootage);
        valB = numOrNull(rawB.squareFootage);
        break;
      case "commuteTime":
        valA = numOrNull(rawA.commuteTime);
        valB = numOrNull(rawB.commuteTime);
        break;
      case "baseRent":
        valA = numOrNull(a.baseRent);
        valB = numOrNull(b.baseRent);
        break;
      case "totalMonthly": {
        const feesA = typeof a.fees === "number" ? a.fees : 0;
        const feesB = typeof b.fees === "number" ? b.fees : 0;
        valA = numOrNull((a.baseRent ?? 0) + feesA);
        valB = numOrNull((b.baseRent ?? 0) + feesB);
        break;
      }
      case "dateAdded":
        valA = rawA.dateAdded ? String(rawA.dateAdded) : null;
        valB = rawB.dateAdded ? String(rawB.dateAdded) : null;
        break;
      default:
        return 0;
    }

    // Nulls always last
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    if (typeof valA === "string" && typeof valB === "string") {
      return dir * valA.localeCompare(valB);
    }
    return dir * ((valA as number) - (valB as number));
  });
}

function numOrNull(v: unknown): number | null {
  const n = Number(v);
  return isNaN(n) || v === "" || v === null || v === undefined ? null : n;
}

function boolVal(v: unknown): boolean {
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

  // Expanded card — only one card expanded at a time; null = all collapsed
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Applied filters — committed when user taps Apply in the panel
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  // TopBar height: safe area inset + 52px row + 1px divider
  const topBarHeight = insets.top + 53;

  const filtersActive = isFiltersActive(appliedFilters);

  // Auto-refresh and reload compareIds whenever this screen comes into focus.
  // Cleanup function resets expandedId when the tab loses focus.
  useFocusEffect(
    useCallback(() => {
      refresh();
      loadCompareIds().then((ids) => setCompareIds(new Set(ids)));
      return () => {
        setExpandedId(null);
      };
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

  async function togglePreferred(id: string) {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    const newPreferred = !listing.preferred;
    try {
      await updateListing(id, { preferred: newPreferred ? "TRUE" : "FALSE" });
      refresh();
    } catch {
      Alert.alert("Error", "Could not update preferred status.");
    }
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
        rightIconColor={filtersActive ? colors.accent : colors.textPrimary}
        onPressRight={() => setFilterOpen(true)}
      />

      {/* FILTERS ACTIVE banner — shown below header when filters or sort are active */}
      {filtersActive && (
        <View
          style={{
            backgroundColor: `${colors.accent}20`,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.accent}66`,
            paddingVertical: 7,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.accent,
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
          <Text style={{ color: colors.compareFail, fontSize: textStyles.bodyPrimary.fontSize, marginBottom: 8 }}>
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
                expanded={expandedId === item.id}
                onCardPress={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
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
