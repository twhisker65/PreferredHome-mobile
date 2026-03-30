// components/FilterPanel.tsx — Build 3.2.20.9
// Change: font and color token references applied.
//   colors.primaryBlue → colors.accent (header chevron, DropdownButton, MultiSelectItem,
//     SingleSelectItem, MaxRent active state, Apply button background)
//   colors.card → colors.surface (panel wrapper, header bar, bottom bar)
//   colors.cardHover → colors.surfacePressed (DropdownButton inactive bg, Clear button bg,
//     pressed state items — all qualify as control container states per token rules)
//   Header title: fontSize 16 / fontWeight "700" → textStyles.subHeader
//   FilterRow label: [headingLabel, { fontSize: 11 }] → [textStyles.label]
//   FILTER / SORT section labels: [headingLabel, { marginBottom: 2 }]
//     → [textStyles.sectionTitle, { marginBottom: 2 }]
//   Clear text: fontWeight "700" / fontSize 13 → textStyles.button
//   Apply text: "#fff" → colors.textPrimary; fontWeight "700" / fontSize 13 → textStyles.button
// No logic, filter/sort state, or structural changes.
// All sub-components remain defined outside export function (DRIFT 10).

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";
import type { ListingStatus } from "../lib/types";

// ── Types & constants ─────────────────────────────────────────────

export type FilterState = {
  statuses: ListingStatus[];
  unitTypes: string[];
  brokerFee: "both" | "with" | "without";
  preferred: "both" | "yes";
  maxRent: string;
  sortKey: string;
  sortOrder: "asc" | "desc";
};

export const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  unitTypes: [],
  brokerFee: "both",
  preferred: "both",
  maxRent: "",
  sortKey: "",
  sortOrder: "asc",
};

export const ALL_STATUSES: ListingStatus[] = [
  "New","Contacted","Scheduled","Viewed","Shortlisted",
  "Applied","Approved","Signed","Rejected","Archived",
];

const UNIT_TYPES = ["Apartment", "Condo", "Co-op", "Townhouse", "House"];

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
    f.sortKey !== ""
  );
}

function statusIsActive(f: FilterState)    { return f.statuses.length > 0 && f.statuses.length < ALL_STATUSES.length; }
function unitTypeIsActive(f: FilterState)  { return f.unitTypes.length > 0; }
function brokerFeeIsActive(f: FilterState) { return f.brokerFee !== "both"; }
function preferredIsActive(f: FilterState) { return f.preferred !== "both"; }
function maxRentIsActive(f: FilterState)   { return f.maxRent !== ""; }

// ── Main component ────────────────────────────────────────────────

type Props = {
  topOffset: number;
  appliedFilters: FilterState;
  onApply: (f: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
};

export function FilterPanel({
  topOffset,
  appliedFilters,
  onApply,
  onClear,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<FilterState>({ ...appliedFilters });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownLayout, setDropdownLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // One ref slot per dropdown key — used to measure button position for overlay
  const buttonRefs = useRef<Record<string, View | null>>({});

  function measureAndOpen(key: string) {
    if (openDropdown === key) {
      setOpenDropdown(null);
      setDropdownLayout(null);
      return;
    }
    const ref = buttonRefs.current[key];
    if (ref) {
      ref.measureInWindow((x, y, w, h) => {
        setDropdownLayout({ x, y, width: w, height: h });
        setOpenDropdown(key);
      });
    } else {
      setOpenDropdown(key);
    }
  }

  function closeDropdown() {
    setOpenDropdown(null);
    setDropdownLayout(null);
  }

  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, []);

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

  const statusLabel = () => {
    if (draft.statuses.length === 0 || draft.statuses.length === ALL_STATUSES.length) return "All";
    if (draft.statuses.length === 1) return draft.statuses[0];
    return `${draft.statuses.length} selected`;
  };
  const unitTypeLabel = () => {
    if (draft.unitTypes.length === 0) return "All";
    if (draft.unitTypes.length === 1) return draft.unitTypes[0];
    return `${draft.unitTypes.length} selected`;
  };
  const brokerLabel   = draft.brokerFee === "with" ? "With fee" : draft.brokerFee === "without" ? "No fee" : "Both";
  const prefLabel     = draft.preferred === "yes" ? "Yes only" : "Both";
  const sortKeyLabel  = draft.sortKey || "None";
  const sortOrderLabel = draft.sortOrder === "desc" ? "Descending" : "Ascending";

  function renderDropdownContent() {
    switch (openDropdown) {
      case "status":
        return (
          <>
            {ALL_STATUSES.map((s) => (
              <MultiSelectItem
                key={s}
                label={s}
                selected={draft.statuses.includes(s)}
                onPress={() => toggleStatus(s)}
              />
            ))}
          </>
        );
      case "unitType":
        return (
          <>
            {UNIT_TYPES.map((t) => (
              <MultiSelectItem
                key={t}
                label={t}
                selected={draft.unitTypes.includes(t)}
                onPress={() => toggleUnitType(t)}
              />
            ))}
          </>
        );
      case "brokerFee":
        return (
          <>
            {(
              [
                { label: "Both",     value: "both"    },
                { label: "With fee", value: "with"    },
                { label: "No fee",   value: "without" },
              ] as { label: string; value: FilterState["brokerFee"] }[]
            ).map((o) => (
              <SingleSelectItem
                key={o.value}
                label={o.label}
                selected={draft.brokerFee === o.value}
                onPress={() => {
                  setDraft((d) => ({ ...d, brokerFee: o.value }));
                  closeDropdown();
                }}
              />
            ))}
          </>
        );
      case "preferred":
        return (
          <>
            {(
              [
                { label: "Both",     value: "both" },
                { label: "Yes only", value: "yes"  },
              ] as { label: string; value: FilterState["preferred"] }[]
            ).map((o) => (
              <SingleSelectItem
                key={o.value}
                label={o.label}
                selected={draft.preferred === o.value}
                onPress={() => {
                  setDraft((d) => ({ ...d, preferred: o.value }));
                  closeDropdown();
                }}
              />
            ))}
          </>
        );
      case "sortKey":
        return (
          <>
            <SingleSelectItem
              label="None"
              selected={draft.sortKey === ""}
              onPress={() => {
                setDraft((d) => ({ ...d, sortKey: "" }));
                closeDropdown();
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
                  closeDropdown();
                }}
              />
            ))}
          </>
        );
      case "sortOrder":
        return (
          <>
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
                  closeDropdown();
                }}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  }

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
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 10,
      }}
    >
      {/* ── Header bar ───────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", left: 16, zIndex: 1, padding: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: colors.textPrimary,
            fontSize: textStyles.subHeader.fontSize,
            fontWeight: textStyles.subHeader.fontWeight,
          }}
        >
          Sort & Filter Listings
        </Text>
      </View>

      {/* ── Scrollable content ─────────────────────────────────────── */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {/* ── FILTER section label ──────────────────────────────── */}
        <Text style={[textStyles.sectionTitle, { marginBottom: 2 }]}>FILTER</Text>

        {/* STATUS */}
        <FilterRow label="STATUS">
          <View ref={(r) => { buttonRefs.current["status"] = r; }}>
            <DropdownButton
              label={statusLabel()}
              open={openDropdown === "status"}
              active={statusIsActive(draft)}
              onPress={() => measureAndOpen("status")}
            />
          </View>
        </FilterRow>

        {/* UNIT TYPE */}
        <FilterRow label="UNIT TYPE">
          <View ref={(r) => { buttonRefs.current["unitType"] = r; }}>
            <DropdownButton
              label={unitTypeLabel()}
              open={openDropdown === "unitType"}
              active={unitTypeIsActive(draft)}
              onPress={() => measureAndOpen("unitType")}
            />
          </View>
        </FilterRow>

        {/* BROKER FEE */}
        <FilterRow label="BROKER FEE">
          <View ref={(r) => { buttonRefs.current["brokerFee"] = r; }}>
            <DropdownButton
              label={brokerLabel}
              open={openDropdown === "brokerFee"}
              active={brokerFeeIsActive(draft)}
              onPress={() => measureAndOpen("brokerFee")}
            />
          </View>
        </FilterRow>

        {/* PREFERRED */}
        <FilterRow label="PREFERRED">
          <View ref={(r) => { buttonRefs.current["preferred"] = r; }}>
            <DropdownButton
              label={prefLabel}
              open={openDropdown === "preferred"}
              active={preferredIsActive(draft)}
              onPress={() => measureAndOpen("preferred")}
            />
          </View>
        </FilterRow>

        {/* MAX RENT */}
        <FilterRow label="MAX RENT">
          <TextInput
            value={draft.maxRent}
            onChangeText={(t) =>
              setDraft((d) => ({ ...d, maxRent: t.replace(/[^0-9]/g, "") }))
            }
            onFocus={() => closeDropdown()}
            keyboardType="number-pad"
            placeholder="No limit"
            placeholderTextColor={colors.textSecondary}
            style={{
              backgroundColor: maxRentIsActive(draft) ? `${colors.accent}15` : colors.surfacePressed,
              borderWidth: 1,
              borderColor: maxRentIsActive(draft) ? colors.accent : colors.border,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 8,
              color: maxRentIsActive(draft) ? colors.accent : colors.textPrimary,
              fontSize: 12,
              fontWeight: maxRentIsActive(draft) ? "700" : "400",
            }}
          />
        </FilterRow>

        {/* ── Divider between FILTER and SORT ───────────────────── */}
        <View style={{ height: 1, backgroundColor: colors.border, marginTop: 4, marginBottom: 2 }} />

        {/* ── SORT section label ─────────────────────────────────── */}
        <Text style={[textStyles.sectionTitle, { marginBottom: 2 }]}>SORT</Text>

        {/* SORT BY */}
        <FilterRow label="SORT BY">
          <View ref={(r) => { buttonRefs.current["sortKey"] = r; }}>
            <DropdownButton
              label={sortKeyLabel}
              open={openDropdown === "sortKey"}
              active={draft.sortKey !== ""}
              onPress={() => measureAndOpen("sortKey")}
            />
          </View>
        </FilterRow>

        {/* ORDER */}
        <FilterRow label="ORDER">
          <View ref={(r) => { buttonRefs.current["sortOrder"] = r; }}>
            <DropdownButton
              label={sortOrderLabel}
              open={openDropdown === "sortOrder"}
              active={draft.sortKey !== ""}
              onPress={() => measureAndOpen("sortOrder")}
            />
          </View>
        </FilterRow>

      </ScrollView>

      {/* ── Fixed bottom bar — Clear + Apply — always above nav ───── */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          padding: 14,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Pressable
          onPress={() => {
            setDraft({ ...DEFAULT_FILTERS });
            onClear();
          }}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 11,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            backgroundColor: colors.surfacePressed,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={textStyles.button}>
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
            backgroundColor: colors.accent,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={textStyles.button}>Apply</Text>
        </Pressable>
      </View>

      {/* ── Overlay dropdown — Modal so it floats above all content ─ */}
      <Modal
        visible={openDropdown !== null}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        {/* Full-screen backdrop — tap anywhere outside list to close */}
        <Pressable style={{ flex: 1 }} onPress={closeDropdown} />

        {/* Dropdown list — anchored below the tapped button */}
        {dropdownLayout && (
          <View
            style={{
              position: "absolute",
              top: dropdownLayout.y + dropdownLayout.height + 2,
              left: dropdownLayout.x,
              width: dropdownLayout.width,
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              maxHeight: 240,
              overflow: "hidden",
              elevation: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {renderDropdownContent()}
            </ScrollView>
          </View>
        )}
      </Modal>
    </Animated.View>
  );
}

// ── Sub-components — all defined outside export function ──────────

// Horizontal row: label left (flex 1), control right (flex 2).
function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Text style={[textStyles.label, { flex: 1 }]}>{label}</Text>
      <View style={{ flex: 2 }}>{children}</View>
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
        borderColor: highlighted ? colors.accent : colors.border,
        backgroundColor: highlighted ? `${colors.accent}15` : colors.surfacePressed,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text
        style={{
          color: highlighted ? colors.accent : colors.textPrimary,
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
          color={highlighted ? colors.accent : colors.textSecondary}
        />
      </Animated.View>
    </Pressable>
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
        backgroundColor: pressed ? colors.surfacePressed : "transparent",
      })}
    >
      <Text
        style={{
          color: selected ? colors.accent : colors.textPrimary,
          fontSize: 12,
          fontWeight: isBold || selected ? "700" : "400",
          flex: 1,
        }}
      >
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={14} color={colors.accent} />
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
        backgroundColor: pressed ? colors.surfacePressed : "transparent",
      })}
    >
      <Text
        style={{
          color: selected ? colors.accent : colors.textPrimary,
          fontSize: 12,
          fontWeight: selected ? "700" : "400",
          flex: 1,
        }}
      >
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={14} color={colors.accent} />
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
