// components/FilterPanel.tsx — Build 3.2.18.2 Hotfix
// Changed: SORT BY converted from chip row to standard DropdownButton + DropdownList
//          with SingleSelectItem for each sort key — matching filter dropdown style.
// Changed: ORDER converted from two-button toggle to standard DropdownButton +
//          DropdownList with SingleSelectItem for Ascending / Descending.
// Removed: SortKeyChip and SortOrderButton sub-components (no longer used).
// All other logic and sub-components unchanged from Build 3.2.18.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import type { ListingUI, ListingStatus } from "../lib/types";

// ── Types & constants ─────────────────────────────────────────────

export type FilterState = {
  statuses: ListingStatus[];
  unitTypes: string[];
  brokerFee: "both" | "with" | "without";
  preferred: "both" | "yes";
  maxRent: string;
  zipCodes: string[];
  sortKey: string;
  sortOrder: "asc" | "desc";
};

export const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  unitTypes: [],
  brokerFee: "both",
  preferred: "both",
  maxRent: "",
  zipCodes: [],
  sortKey: "",
  sortOrder: "asc",
};

export const ALL_STATUSES: ListingStatus[] = [
  "New","Contacted","Scheduled","Viewed","Shortlisted",
  "Applied","Approved","Signed","Rejected","Archived",
];

const UNIT_TYPES = ["Rental", "Condo", "Co-op", "Townhouse", "House"];

export const SORT_KEYS = [
  "Status",
  "Square Footage",
  "Commute Time",
  "Base Rent",
  "Total Monthly Cost",
  "Date Added",
];

// ── Active-state helpers ──────────────────────────────────────────

export function isFiltersActive(f: FilterState): boolean {
  const statusActive = f.statuses.length > 0 && f.statuses.length < ALL_STATUSES.length;
  const unitTypeActive = f.unitTypes.length > 0;
  return (
    statusActive ||
    unitTypeActive ||
    f.brokerFee !== "both" ||
    f.preferred !== "both" ||
    f.maxRent !== "" ||
    f.zipCodes.length > 0 ||
    f.sortKey !== ""
  );
}

function statusIsActive(f: FilterState)    { return f.statuses.length > 0 && f.statuses.length < ALL_STATUSES.length; }
function unitTypeIsActive(f: FilterState)  { return f.unitTypes.length > 0; }
function brokerFeeIsActive(f: FilterState) { return f.brokerFee !== "both"; }
function preferredIsActive(f: FilterState) { return f.preferred !== "both"; }
function maxRentIsActive(f: FilterState)   { return f.maxRent !== ""; }
function zipIsActive(f: FilterState)       { return f.zipCodes.length > 0; }

// ── Main component ────────────────────────────────────────────────

type Props = {
  topOffset: number;
  listings: ListingUI[];
  appliedFilters: FilterState;
  onApply: (f: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
};

export function FilterPanel({
  topOffset,
  listings,
  appliedFilters,
  onApply,
  onClear,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<FilterState>({ ...appliedFilters });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  function toggleDropdown(key: string) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, []);

  const uniqueZips = useMemo(() => {
    const s = new Set<string>();
    listings.forEach((l) => {
      const z = l.raw?.zipCode;
      if (z && String(z).trim() !== "") s.add(String(z).trim());
    });
    return Array.from(s).sort();
  }, [listings]);

  function toggleStatus(s: ListingStatus) {
    setDraft((d) => ({
      ...d,
      statuses: d.statuses.includes(s)
        ? d.statuses.filter((x) => x !== s)
        : [...d.statuses, s],
    }));
  }
  function toggleUnitType(t: string) {
    setDraft((d) => ({
      ...d,
      unitTypes: d.unitTypes.includes(t)
        ? d.unitTypes.filter((x) => x !== t)
        : [...d.unitTypes, t],
    }));
  }
  function toggleZip(z: string) {
    setDraft((d) => ({
      ...d,
      zipCodes: d.zipCodes.includes(z)
        ? d.zipCodes.filter((x) => x !== z)
        : [...d.zipCodes, z],
    }));
  }

  function statusLabel() {
    if (!statusIsActive(draft)) return "All";
    if (draft.statuses.length === 1) return draft.statuses[0];
    return `${draft.statuses.length} selected`;
  }
  function unitTypeLabel() {
    if (draft.unitTypes.length === 0) return "All";
    if (draft.unitTypes.length === 1) return draft.unitTypes[0];
    return `${draft.unitTypes.length} selected`;
  }
  function zipLabel() {
    if (draft.zipCodes.length === 0) return "All";
    if (draft.zipCodes.length === 1) return draft.zipCodes[0];
    return `${draft.zipCodes.length} selected`;
  }

  const brokerLabel =
    draft.brokerFee === "both"
      ? "Both"
      : draft.brokerFee === "without"
      ? "No Fee"
      : "With Fee";
  const prefLabel = draft.preferred === "both" ? "Both" : "Yes";
  const sortKeyLabel = draft.sortKey === "" ? "None" : draft.sortKey;
  const sortOrderLabel = draft.sortOrder === "asc" ? "Ascending" : "Descending";

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: topOffset,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        opacity,
        transform: [{ translateY }],
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 10,
      }}
    >
      {/* ── Header bar — matches Edit Listing subtitle bar ──────── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", left: 16, zIndex: 1, padding: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primaryBlue} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Sort &amp; Filter Listings
        </Text>
      </View>

      {/* ── Scrollable content ───────────────────────────────────── */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {/* ── FILTER section label ─────────────────────────────── */}
        <Text style={[headingLabel, { marginBottom: 2 }]}>FILTER</Text>

        {/* STATUS */}
        <FilterRow label="STATUS">
          <DropdownButton
            label={statusLabel()}
            open={openDropdown === "status"}
            active={statusIsActive(draft)}
            onPress={() => toggleDropdown("status")}
          />
          {openDropdown === "status" && (
            <DropdownList>
              <MultiSelectItem
                label="Select All"
                selected={draft.statuses.length === ALL_STATUSES.length}
                onPress={() => setDraft((d) => ({ ...d, statuses: [...ALL_STATUSES] }))}
                isBold
              />
              <MultiSelectItem
                label="Clear All"
                selected={false}
                onPress={() => setDraft((d) => ({ ...d, statuses: [] }))}
                isBold
              />
              <ListDivider />
              {ALL_STATUSES.map((s) => (
                <MultiSelectItem
                  key={s}
                  label={s}
                  selected={draft.statuses.includes(s)}
                  onPress={() => toggleStatus(s)}
                />
              ))}
            </DropdownList>
          )}
        </FilterRow>

        {/* UNIT TYPE */}
        <FilterRow label="UNIT TYPE">
          <DropdownButton
            label={unitTypeLabel()}
            open={openDropdown === "unitType"}
            active={unitTypeIsActive(draft)}
            onPress={() => toggleDropdown("unitType")}
          />
          {openDropdown === "unitType" && (
            <DropdownList>
              {UNIT_TYPES.map((t) => (
                <MultiSelectItem
                  key={t}
                  label={t}
                  selected={draft.unitTypes.includes(t)}
                  onPress={() => toggleUnitType(t)}
                />
              ))}
            </DropdownList>
          )}
        </FilterRow>

        {/* BROKER FEE */}
        <FilterRow label="BROKER FEE">
          <DropdownButton
            label={brokerLabel}
            open={openDropdown === "brokerFee"}
            active={brokerFeeIsActive(draft)}
            onPress={() => toggleDropdown("brokerFee")}
          />
          {openDropdown === "brokerFee" && (
            <DropdownList>
              {(
                [
                  { label: "Both",     value: "both"    },
                  { label: "No Fee",   value: "without" },
                  { label: "With Fee", value: "with"    },
                ] as { label: string; value: FilterState["brokerFee"] }[]
              ).map((o) => (
                <SingleSelectItem
                  key={o.value}
                  label={o.label}
                  selected={draft.brokerFee === o.value}
                  onPress={() => {
                    setDraft((d) => ({ ...d, brokerFee: o.value }));
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownList>
          )}
        </FilterRow>

        {/* PREFERRED */}
        <FilterRow label="PREFERRED">
          <DropdownButton
            label={prefLabel}
            open={openDropdown === "preferred"}
            active={preferredIsActive(draft)}
            onPress={() => toggleDropdown("preferred")}
          />
          {openDropdown === "preferred" && (
            <DropdownList>
              {(
                [
                  { label: "Both", value: "both" },
                  { label: "Yes",  value: "yes"  },
                ] as { label: string; value: FilterState["preferred"] }[]
              ).map((o) => (
                <SingleSelectItem
                  key={o.value}
                  label={o.label}
                  selected={draft.preferred === o.value}
                  onPress={() => {
                    setDraft((d) => ({ ...d, preferred: o.value }));
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownList>
          )}
        </FilterRow>

        {/* MAX RENT */}
        <FilterRow label="MAX RENT">
          <TextInput
            value={draft.maxRent}
            onChangeText={(t) =>
              setDraft((d) => ({ ...d, maxRent: t.replace(/[^0-9]/g, "") }))
            }
            onFocus={() => setOpenDropdown(null)}
            keyboardType="number-pad"
            placeholder="No limit"
            placeholderTextColor={colors.textSecondary}
            style={{
              backgroundColor: maxRentIsActive(draft)
                ? `${colors.primaryBlue}15`
                : colors.cardHover,
              borderWidth: 1,
              borderColor: maxRentIsActive(draft)
                ? colors.primaryBlue
                : colors.border,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 8,
              color: maxRentIsActive(draft)
                ? colors.primaryBlue
                : colors.textPrimary,
              fontSize: 12,
              fontWeight: maxRentIsActive(draft) ? "700" : "400",
            }}
          />
        </FilterRow>

        {/* ZIP CODE */}
        {uniqueZips.length > 0 && (
          <FilterRow label="ZIP CODE">
            <DropdownButton
              label={zipLabel()}
              open={openDropdown === "zip"}
              active={zipIsActive(draft)}
              onPress={() => toggleDropdown("zip")}
            />
            {openDropdown === "zip" && (
              <DropdownList>
                {uniqueZips.map((z) => (
                  <MultiSelectItem
                    key={z}
                    label={z}
                    selected={draft.zipCodes.includes(z)}
                    onPress={() => toggleZip(z)}
                  />
                ))}
              </DropdownList>
            )}
          </FilterRow>
        )}

        {/* ── Divider between FILTER and SORT ─────────────────── */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginTop: 4,
            marginBottom: 2,
          }}
        />

        {/* ── SORT section label ───────────────────────────────── */}
        <Text style={[headingLabel, { marginBottom: 2 }]}>SORT</Text>

        {/* SORT BY — single-select dropdown */}
        <FilterRow label="SORT BY">
          <DropdownButton
            label={sortKeyLabel}
            open={openDropdown === "sortKey"}
            active={draft.sortKey !== ""}
            onPress={() => toggleDropdown("sortKey")}
          />
          {openDropdown === "sortKey" && (
            <DropdownList>
              <SingleSelectItem
                label="None"
                selected={draft.sortKey === ""}
                onPress={() => {
                  setDraft((d) => ({ ...d, sortKey: "" }));
                  setOpenDropdown(null);
                }}
              />
              <ListDivider />
              {SORT_KEYS.map((key) => (
                <SingleSelectItem
                  key={key}
                  label={key}
                  selected={draft.sortKey === key}
                  onPress={() => {
                    setDraft((d) => ({ ...d, sortKey: key }));
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownList>
          )}
        </FilterRow>

        {/* ORDER — single-select dropdown */}
        <FilterRow label="ORDER">
          <DropdownButton
            label={sortOrderLabel}
            open={openDropdown === "sortOrder"}
            active={draft.sortKey !== ""}
            onPress={() => toggleDropdown("sortOrder")}
          />
          {openDropdown === "sortOrder" && (
            <DropdownList>
              {(
                [
                  { label: "Ascending",  value: "asc"  },
                  { label: "Descending", value: "desc" },
                ] as { label: string; value: FilterState["sortOrder"] }[]
              ).map((o) => (
                <SingleSelectItem
                  key={o.value}
                  label={o.label}
                  selected={draft.sortOrder === o.value}
                  onPress={() => {
                    setDraft((d) => ({ ...d, sortOrder: o.value }));
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownList>
          )}
        </FilterRow>

      </ScrollView>

      {/* ── Fixed bottom bar — Clear + Apply ────────────────────── */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          padding: 14,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        <Pressable
          onPress={() => { onClear(); onClose(); }}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 11,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            backgroundColor: colors.cardHover,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 13 }}>
            Clear
          </Text>
        </Pressable>
        <Pressable
          onPress={() => { onApply(draft); onClose(); }}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 11,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: colors.primaryBlue,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Apply</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ── Sub-components — all defined outside export function ──────────

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={[headingLabel, { fontSize: 10 }]}>{label}</Text>
      {children}
    </View>
  );
}

function DropdownButton({
  label,
  open,
  active,
  onPress,
}: {
  label: string;
  open: boolean;
  active: boolean;
  onPress: () => void;
}) {
  const highlighted = open || active;
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rot, {
      toValue: open ? 1 : 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const rotate = rot.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: highlighted ? colors.primaryBlue : colors.border,
        backgroundColor: highlighted
          ? `${colors.primaryBlue}15`
          : colors.cardHover,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        style={{
          color: highlighted ? colors.primaryBlue : colors.textPrimary,
          fontSize: 12,
          fontWeight: highlighted ? "700" : "400",
          flex: 1,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons
          name="chevron-down"
          size={14}
          color={highlighted ? colors.primaryBlue : colors.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}

function DropdownList({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.background,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

function MultiSelectItem({
  label,
  selected,
  onPress,
  isBold,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  isBold?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 9,
        backgroundColor: pressed ? colors.cardHover : "transparent",
      })}
    >
      <Text
        style={{
          color: selected ? colors.primaryBlue : colors.textPrimary,
          fontSize: 12,
          fontWeight: isBold || selected ? "700" : "400",
          flex: 1,
        }}
      >
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={14} color={colors.primaryBlue} />
      )}
    </Pressable>
  );
}

function SingleSelectItem({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 9,
        backgroundColor: pressed ? colors.cardHover : "transparent",
      })}
    >
      <Text
        style={{
          color: selected ? colors.primaryBlue : colors.textPrimary,
          fontSize: 12,
          fontWeight: selected ? "700" : "400",
          flex: 1,
        }}
      >
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={14} color={colors.primaryBlue} />
      )}
    </Pressable>
  );
}

function ListDivider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 8,
      }}
    />
  );
}
