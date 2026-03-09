// components/FilterPanel.tsx — Build 3.2.04
// New component: drop-down filter panel anchored below TopBar on right side.
// Width = half screen. Slides down from filter icon. Apply + Clear buttons.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import type { ListingUI, ListingStatus } from "../lib/types";

// ── Filter state types ────────────────────────────────────────────

export type FilterState = {
  statuses: ListingStatus[];   // empty array = no filter (show all)
  unitTypes: string[];          // empty array = no filter (show all)
  brokerFee: "both" | "with" | "without";
  preferred: "both" | "yes";
  maxRent: string;              // "" = no limit
  zipCodes: string[];           // empty array = no filter (show all)
};

export const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  unitTypes: [],
  brokerFee: "both",
  preferred: "both",
  maxRent: "",
  zipCodes: [],
};

// ── Constants ─────────────────────────────────────────────────────

export const ALL_STATUSES: ListingStatus[] = [
  "New",
  "Contacted",
  "Scheduled",
  "Viewed",
  "Shortlisted",
  "Applied",
  "Approved",
  "Signed",
  "Rejected",
  "Archived",
];

const UNIT_TYPES = ["Rental", "Condo", "Co-op", "Townhouse", "House"];

// ── isFiltersActive ───────────────────────────────────────────────
// Returns true only when filters actually restrict results.
// Selecting all statuses or all unit types = no restriction = not active.

export function isFiltersActive(f: FilterState): boolean {
  const statusActive =
    f.statuses.length > 0 && f.statuses.length < ALL_STATUSES.length;
  const unitTypeActive =
    f.unitTypes.length > 0 && f.unitTypes.length < UNIT_TYPES.length;
  return (
    statusActive ||
    unitTypeActive ||
    f.brokerFee !== "both" ||
    f.preferred !== "both" ||
    f.maxRent !== "" ||
    f.zipCodes.length > 0
  );
}

// ── Props ─────────────────────────────────────────────────────────

type Props = {
  topOffset: number;            // pixels from top of screen to position panel
  listings: ListingUI[];        // used to derive unique zip codes
  appliedFilters: FilterState;  // current live filters (used to init draft on mount)
  onApply: (f: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
};

// ── Main component ────────────────────────────────────────────────

export function FilterPanel({
  topOffset,
  listings,
  appliedFilters,
  onApply,
  onClear,
  onClose,
}: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW = Math.floor(screenW / 2);

  // Draft state — local pending filters before Apply is tapped.
  // Initialized from appliedFilters on every mount (panel opens fresh each time).
  const [draft, setDraft] = useState<FilterState>({ ...appliedFilters });

  // ── Animation ──────────────────────────────────────────────────
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Unique zip codes from current listings data ─────────────────
  const uniqueZips = useMemo(() => {
    const s = new Set<string>();
    listings.forEach((l) => {
      const z = l.raw?.zipCode;
      if (z && String(z).trim() !== "") s.add(String(z).trim());
    });
    return Array.from(s).sort();
  }, [listings]);

  // ── Toggle helpers ─────────────────────────────────────────────

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

  // ── Render ─────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop — closes panel when tapping outside */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
        }}
      />

      {/* Panel */}
      <Animated.View
        style={{
          position: "absolute",
          top: topOffset,
          right: 0,
          width: panelW,
          zIndex: 100,
          opacity,
          transform: [{ translateY }],
          backgroundColor: colors.card,
          borderLeftWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
          borderBottomLeftRadius: 14,
          shadowColor: "#000",
          shadowOffset: { width: -3, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 10,
          maxHeight: "85%",
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14, gap: 16 }}
        >
          {/* ── STATUS ── */}
          <FilterSection label="STATUS">
            <View style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
              <MiniButton
                label="Select All"
                onPress={() =>
                  setDraft((d) => ({ ...d, statuses: [...ALL_STATUSES] }))
                }
              />
              <MiniButton
                label="Clear"
                onPress={() => setDraft((d) => ({ ...d, statuses: [] }))}
              />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
              {ALL_STATUSES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={draft.statuses.includes(s)}
                  onPress={() => toggleStatus(s)}
                />
              ))}
            </View>
          </FilterSection>

          {/* ── UNIT TYPE ── */}
          <FilterSection label="UNIT TYPE">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
              {UNIT_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={draft.unitTypes.includes(t)}
                  onPress={() => toggleUnitType(t)}
                />
              ))}
            </View>
          </FilterSection>

          {/* ── BROKER FEE ── */}
          <FilterSection label="BROKER FEE">
            <OptionRow
              options={[
                { label: "Both", value: "both" },
                { label: "No Fee", value: "without" },
                { label: "With Fee", value: "with" },
              ]}
              selected={draft.brokerFee}
              onSelect={(v) =>
                setDraft((d) => ({
                  ...d,
                  brokerFee: v as FilterState["brokerFee"],
                }))
              }
            />
          </FilterSection>

          {/* ── PREFERRED ── */}
          <FilterSection label="PREFERRED">
            <OptionRow
              options={[
                { label: "Both", value: "both" },
                { label: "Yes", value: "yes" },
              ]}
              selected={draft.preferred}
              onSelect={(v) =>
                setDraft((d) => ({
                  ...d,
                  preferred: v as FilterState["preferred"],
                }))
              }
            />
          </FilterSection>

          {/* ── MAX RENT ── */}
          <FilterSection label="MAX RENT">
            <TextInput
              value={draft.maxRent}
              onChangeText={(t) =>
                setDraft((d) => ({
                  ...d,
                  maxRent: t.replace(/[^0-9]/g, ""),
                }))
              }
              keyboardType="number-pad"
              placeholder="No limit"
              placeholderTextColor={colors.textSecondary}
              style={{
                backgroundColor: colors.cardHover,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 8,
                color: colors.textPrimary,
                fontSize: 13,
              }}
            />
          </FilterSection>

          {/* ── ZIP CODE ── only shown when listings have zip data */}
          {uniqueZips.length > 0 && (
            <FilterSection label="ZIP CODE">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                {uniqueZips.map((z) => (
                  <Chip
                    key={z}
                    label={z}
                    selected={draft.zipCodes.includes(z)}
                    onPress={() => toggleZip(z)}
                  />
                ))}
              </View>
            </FilterSection>
          )}

          {/* ── BUTTONS ── */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
            {/* Clear */}
            <Pressable
              onPress={() => {
                onClear();
                onClose();
              }}
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
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                Clear
              </Text>
            </Pressable>

            {/* Apply */}
            <Pressable
              onPress={() => {
                onApply(draft);
                onClose();
              }}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 11,
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: colors.primaryBlue,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Text
                style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
              >
                Apply
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={[headingLabel, { fontSize: 11 }]}>{label}</Text>
      {children}
    </View>
  );
}

function Chip({
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
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: selected ? colors.primaryBlue : colors.border,
        backgroundColor: selected
          ? `${colors.primaryBlue}25`
          : colors.cardHover,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text
        style={{
          color: selected ? colors.primaryBlue : colors.textSecondary,
          fontSize: 11,
          fontWeight: selected ? "700" : "400",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OptionRow({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 5 }}>
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => onSelect(o.value)}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 7,
            borderRadius: 8,
            borderWidth: 1,
            borderColor:
              selected === o.value ? colors.primaryBlue : colors.border,
            backgroundColor:
              selected === o.value
                ? `${colors.primaryBlue}25`
                : colors.cardHover,
            alignItems: "center",
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              color:
                selected === o.value
                  ? colors.primaryBlue
                  : colors.textSecondary,
              fontSize: 11,
              fontWeight: selected === o.value ? "700" : "400",
            }}
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function MiniButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardHover,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
        {label}
      </Text>
    </Pressable>
  );
}
