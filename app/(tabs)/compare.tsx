// app/(tabs)/compare.tsx — Build 3.2.08
// Full Compare page implementation.
// - Loads selected listing IDs from compareStorage (persistent, max 3)
// - Fetches live listing data via useListings
// - Loads criteria from AsyncStorage via loadCriteriaData
// - Missing criteria banner opens CriteriaPanel on tap
// - Card view: one card per listing, color-coded fields, same font style as listing cards
// - Table view: horizontally + vertically scrollable grid with double-line borders

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
import { useListings } from "../../lib/useListings";
import { loadCompareIds } from "../../lib/compareStorage";
import { loadCriteriaData, type CriteriaData } from "../../lib/profileStorage";
import type { ListingUI } from "../../lib/types";

// ── Layout constants ──────────────────────────────────────────────
const LABEL_W = 134;
const COL_W   = 158;

// ── Compare colors ────────────────────────────────────────────────
const CC = {
  green:  "#10B981",
  yellow: "#D97706",
  red:    "#EF4444",
  grey:   "#475569",
};

// ── Helper functions ──────────────────────────────────────────────

function rawNum(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function rawBool(v: any): boolean {
  return String(v ?? "").trim().toUpperCase() === "TRUE";
}

function rawStr(v: any): string {
  return String(v ?? "").trim();
}

function joinMulti(v: any): string {
  if (Array.isArray(v)) return v.filter(Boolean).join(", ") || "—";
  const s = rawStr(v);
  return s || "—";
}

function fmtCurrency(v: number | null): string {
  if (v === null) return "—";
  return `$${Math.round(v).toLocaleString()}/mo`;
}

// ── Color logic ───────────────────────────────────────────────────

// Green if value <= limit, red if >, grey if no criteria set
function lteColor(value: number | null, criteriaStr: string): string {
  if (!criteriaStr) return CC.grey;
  if (value === null) return CC.grey;
  const limit = parseFloat(criteriaStr);
  if (isNaN(limit)) return CC.grey;
  return value <= limit ? CC.green : CC.red;
}

// Green if value >= limit, red if <, grey if no criteria set
function gteColor(value: number | null, criteriaStr: string): string {
  if (!criteriaStr) return CC.grey;
  if (value === null) return CC.grey;
  const limit = parseFloat(criteriaStr);
  if (isNaN(limit)) return CC.grey;
  return value >= limit ? CC.green : CC.red;
}

function acColor(v: string): string {
  const s = v.toLowerCase();
  if (s === "central") return CC.green;
  if (!s || s === "none") return CC.red;
  return CC.yellow;
}

function laundryColor(v: string): string {
  const s = v.toLowerCase();
  if (s === "in-unit") return CC.green;
  if (!s || s === "none") return CC.red;
  return CC.yellow;
}

function parkingColor(v: string): string {
  const s = v.toLowerCase();
  if (s === "covered") return CC.green;
  if (!s || s === "none") return CC.red;
  return CC.yellow;
}

// ── Cell data resolver ────────────────────────────────────────────

type CellData = {
  text: string;
  color: string | null; // null = plain text; CC.xxx = colored pill
  isBool: boolean;
  boolValue: boolean;
};

function getCellData(key: string, listing: ListingUI, criteria: CriteriaData): CellData {
  const raw = listing.raw ?? {};

  switch (key) {
    case "baseRent": {
      const v = listing.baseRent;
      return { text: fmtCurrency(v), color: lteColor(v, criteria.maxBaseRent), isBool: false, boolValue: false };
    }
    case "totalMonthly": {
      const apiTotal = rawNum(raw.totalMonthly);
      const fallback = listing.baseRent !== null
        ? (listing.baseRent ?? 0) + (listing.fees ?? 0)
        : null;
      const v = apiTotal ?? fallback;
      return { text: fmtCurrency(v), color: lteColor(v, criteria.maxTotalMonthly), isBool: false, boolValue: false };
    }
    case "unitType":
      return { text: rawStr(raw.unitType) || "—", color: null, isBool: false, boolValue: false };
    case "bedrooms": {
      const v = rawNum(raw.bedrooms);
      return { text: v !== null ? String(v) : "—", color: null, isBool: false, boolValue: false };
    }
    case "bathrooms": {
      const v = rawNum(raw.bathrooms);
      return { text: v !== null ? String(v) : "—", color: null, isBool: false, boolValue: false };
    }
    case "squareFootage": {
      const v = rawNum(raw.squareFootage);
      return {
        text: v !== null ? `${Math.round(v).toLocaleString()} sqft` : "—",
        color: gteColor(v, criteria.minSqFt),
        isBool: false,
        boolValue: false,
      };
    }
    case "noBoardApproval":
      return { text: "", color: null, isBool: true, boolValue: rawBool(raw.noBoardApproval) };
    case "noBrokerFee":
      return { text: "", color: null, isBool: true, boolValue: rawBool(raw.noBrokerFee) };
    case "topFloor":
      return { text: "", color: null, isBool: true, boolValue: rawBool(raw.topFloor) };
    case "cornerUnit":
      return { text: "", color: null, isBool: true, boolValue: rawBool(raw.cornerUnit) };
    case "furnished":
      return { text: "", color: null, isBool: true, boolValue: rawBool(raw.furnished) };
    case "acType": {
      const v = rawStr(raw.acType);
      return { text: v || "—", color: v ? acColor(v) : null, isBool: false, boolValue: false };
    }
    case "laundry": {
      const v = rawStr(raw.laundry);
      return { text: v || "—", color: v ? laundryColor(v) : null, isBool: false, boolValue: false };
    }
    case "parkingType": {
      const v = rawStr(raw.parkingType);
      return { text: v || "—", color: v ? parkingColor(v) : null, isBool: false, boolValue: false };
    }
    case "utilitiesIncluded":
      return { text: joinMulti(raw.utilitiesIncluded), color: null, isBool: false, boolValue: false };
    case "unitFeatures":
      return { text: joinMulti(raw.unitFeatures), color: null, isBool: false, boolValue: false };
    case "buildingAmenities":
      return { text: joinMulti(raw.buildingAmenities), color: null, isBool: false, boolValue: false };
    case "closeBy":
      return { text: joinMulti(raw.closeBy), color: null, isBool: false, boolValue: false };
    case "commuteTime": {
      const v = rawNum(raw.commuteTime);
      return {
        text: v !== null ? `${Math.round(v)} min` : "—",
        color: lteColor(v, criteria.maxCommuteTime),
        isBool: false,
        boolValue: false,
      };
    }
    default:
      return { text: "—", color: null, isBool: false, boolValue: false };
  }
}

// ── Table row definitions ─────────────────────────────────────────

const TABLE_ROWS: Array<{ label: string; key: string }> = [
  { label: "Base Rent",          key: "baseRent" },
  { label: "Total Rent",         key: "totalMonthly" },
  { label: "Unit Type",          key: "unitType" },
  { label: "Bedrooms",           key: "bedrooms" },
  { label: "Bathrooms",          key: "bathrooms" },
  { label: "Square Footage",     key: "squareFootage" },
  { label: "No Board Approval",  key: "noBoardApproval" },
  { label: "No Broker Fee",      key: "noBrokerFee" },
  { label: "Top Floor",          key: "topFloor" },
  { label: "Corner Unit",        key: "cornerUnit" },
  { label: "Furnished",          key: "furnished" },
  { label: "AC Type",            key: "acType" },
  { label: "Laundry",            key: "laundry" },
  { label: "Parking",            key: "parkingType" },
  { label: "Utilities Included", key: "utilitiesIncluded" },
  { label: "Unit Features",      key: "unitFeatures" },
  { label: "Building Amenities", key: "buildingAmenities" },
  { label: "Close By",           key: "closeBy" },
  { label: "Commute Time",       key: "commuteTime" },
];

// Card view rows — same as table but without the multi-select fields
const CARD_ROWS: Array<{ label: string; key: string }> = [
  { label: "Base Rent",          key: "baseRent" },
  { label: "Total Rent",         key: "totalMonthly" },
  { label: "Unit Type",          key: "unitType" },
  { label: "Bedrooms",           key: "bedrooms" },
  { label: "Bathrooms",          key: "bathrooms" },
  { label: "Square Footage",     key: "squareFootage" },
  { label: "No Board Approval",  key: "noBoardApproval" },
  { label: "No Broker Fee",      key: "noBrokerFee" },
  { label: "Top Floor",          key: "topFloor" },
  { label: "Corner Unit",        key: "cornerUnit" },
  { label: "Furnished",          key: "furnished" },
  { label: "AC Type",            key: "acType" },
  { label: "Laundry",            key: "laundry" },
  { label: "Parking",            key: "parkingType" },
  { label: "Commute Time",       key: "commuteTime" },
];

// ── Sub-components ────────────────────────────────────────────────

function CPill({ text, color, small = false }: { text: string; color: string; small?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: color + "22",
        borderRadius: small ? 5 : 8,
        paddingHorizontal: small ? 5 : 8,
        paddingVertical: small ? 2 : 4,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color, fontSize: small ? 11 : 13, fontWeight: "700" }}>{text}</Text>
    </View>
  );
}

function BoolCell({ value, small = false }: { value: boolean; small?: boolean }) {
  return (
    <Text
      style={{
        color: value ? CC.green : colors.textSecondary,
        fontSize: small ? 14 : 16,
        fontWeight: "700",
      }}
    >
      {value ? "✓" : "—"}
    </Text>
  );
}

// Double horizontal rule — used under the building name header row in the table
function HDoubleRule() {
  return (
    <View>
      <View style={{ height: 1, backgroundColor: colors.border }} />
      <View style={{ height: 2 }} />
      <View style={{ height: 1, backgroundColor: colors.border }} />
    </View>
  );
}

// ── Table view ────────────────────────────────────────────────────

function CompareTable({ listings, criteria }: { listings: ListingUI[]; criteria: CriteriaData }) {
  const labelCell = {
    width: LABEL_W,
    paddingHorizontal: 8,
    paddingVertical: 9,
    justifyContent: "center" as const,
    minHeight: 40,
  };
  const dataCell = {
    width: COL_W,
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRightWidth: 1 as const,
    borderRightColor: colors.border,
    justifyContent: "center" as const,
    minHeight: 40,
  };

  return (
    // Outer: horizontal scroll for the whole table
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* ── Building name header row ── */}
        <View style={{ flexDirection: "row" }}>
          {/* Empty top-left corner cell */}
          <View style={[labelCell, { paddingVertical: 11 }]} />
          {/* Double vertical separator */}
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ width: 2 }} />
          <View style={{ width: 1, backgroundColor: colors.border }} />
          {/* Building name cells */}
          {listings.map((l) => (
            <View key={l.id} style={[dataCell, { paddingVertical: 11 }]}>
              <Text
                style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "900" }}
                numberOfLines={2}
              >
                {l.buildingName}
              </Text>
            </View>
          ))}
        </View>

        {/* Double horizontal rule under header */}
        <HDoubleRule />

        {/* ── Data rows ── */}
        {TABLE_ROWS.map((row, idx) => (
          <View
            key={row.key}
            style={{
              flexDirection: "row",
              backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            {/* Label cell */}
            <View style={labelCell}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 0.2,
                }}
              >
                {row.label}
              </Text>
            </View>

            {/* Double vertical separator */}
            <View style={{ width: 1, backgroundColor: colors.border }} />
            <View style={{ width: 2 }} />
            <View style={{ width: 1, backgroundColor: colors.border }} />

            {/* Data cells */}
            {listings.map((l) => {
              const cell = getCellData(row.key, l, criteria);
              return (
                <View key={l.id} style={dataCell}>
                  {cell.isBool ? (
                    <BoolCell value={cell.boolValue} small />
                  ) : cell.color ? (
                    <CPill text={cell.text} color={cell.color} small />
                  ) : (
                    <Text
                      style={{ color: colors.textPrimary, fontSize: 11 }}
                      numberOfLines={4}
                    >
                      {cell.text}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ── Card view ─────────────────────────────────────────────────────

function CompareCard({ listing, criteria }: { listing: ListingUI; criteria: CriteriaData }) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {/* Building name header */}
      <View
        style={{
          padding: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text
          style={{ color: colors.textPrimary, fontSize: 17, fontWeight: "900" }}
          numberOfLines={1}
        >
          {listing.buildingName}
        </Text>
        <Text
          style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}
          numberOfLines={1}
        >
          {listing.addressLine}
        </Text>
      </View>

      {/* Field rows */}
      {CARD_ROWS.map((row, idx) => {
        const cell = getCellData(row.key, listing, criteria);
        return (
          <View
            key={row.key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderBottomWidth: idx < CARD_ROWS.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
              backgroundColor:
                idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {row.label}
            </Text>
            <View style={{ alignItems: "flex-end", maxWidth: "56%" }}>
              {cell.isBool ? (
                <BoolCell value={cell.boolValue} />
              ) : cell.color ? (
                <CPill text={cell.text} color={cell.color} />
              ) : (
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 13,
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  {cell.text}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Icon toggle (card / table mode) ──────────────────────────────

function IconToggle({
  icon,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 44,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent",
      })}
    >
      <Ionicons
        name={icon}
        size={24}
        color={active ? colors.primaryBlue : colors.textSecondary}
      />
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────

export default function CompareTab() {
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;

  const { listings, loading } = useListings();

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<CriteriaData>({
    minSqFt: "",
    maxBaseRent: "",
    maxTotalMonthly: "",
    maxCommuteTime: "",
  });
  const [mode, setMode] = useState<"cards" | "table">("cards");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);

  // Reload compareIds and criteria every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompareIds().then(setCompareIds);
      loadCriteriaData().then(setCriteria);
    }, [])
  );

  const selectedListings = listings.filter((l) => compareIds.includes(l.id));

  // Determine which criteria values are missing
  const missingCriteria: string[] = [];
  if (!criteria.maxBaseRent)     missingCriteria.push("Max Base Rent");
  if (!criteria.maxTotalMonthly) missingCriteria.push("Max Total Monthly");
  if (!criteria.minSqFt)         missingCriteria.push("Min Square Footage");
  if (!criteria.maxCommuteTime)  missingCriteria.push("Max Commute Time");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      {/* ── Missing criteria banner — only shown when listings are selected ── */}
      {missingCriteria.length > 0 && selectedListings.length > 0 && (
        <Pressable
          onPress={() => setActiveSubPanel("criteria")}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? `${colors.primaryBlue}30`
              : `${colors.primaryBlue}20`,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.primaryBlue}66`,
            paddingVertical: 8,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          })}
        >
          <Ionicons name="alert-circle-outline" size={14} color={colors.primaryBlue} />
          <Text
            style={{
              color: colors.primaryBlue,
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 0.5,
              flex: 1,
            }}
            numberOfLines={2}
          >
            CRITERIA NOT SET: {missingCriteria.join(", ")} — TAP TO SET
          </Text>
          <Ionicons name="chevron-forward" size={12} color={colors.primaryBlue} />
        </Pressable>
      )}

      {/* ── Mode toggle (cards / table) ── */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          paddingTop: 10,
          paddingBottom: 4,
        }}
      >
        <IconToggle
          icon="grid-outline"
          active={mode === "cards"}
          onPress={() => setMode("cards")}
        />
        <IconToggle
          icon="list-outline"
          active={mode === "table"}
          onPress={() => setMode("table")}
        />
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
            Loading...
          </Text>
        </View>
      ) : selectedListings.length === 0 ? (
        /* Empty state */
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 36,
          }}
        >
          <Ionicons name="git-compare-outline" size={48} color={colors.textSecondary} />
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 16,
              fontWeight: "800",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            No listings selected
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              marginTop: 8,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Go to Listings and tap the compare icon on up to 3 listings to compare them here.
          </Text>
        </View>
      ) : mode === "cards" ? (
        /* Card view */
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {selectedListings.map((l) => (
            <CompareCard key={l.id} listing={l} criteria={criteria} />
          ))}
        </ScrollView>
      ) : (
        /* Table view — vertical scroll wraps the horizontal table */
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <CompareTable listings={selectedListings} criteria={criteria} />
        </ScrollView>
      )}

      {/* ── Menu dropdown ── */}
      {menuOpen && (
        <MenuPanel
          topOffset={topBarHeight}
          onSelectPanel={(p) => {
            setMenuOpen(false);
            setActiveSubPanel(p);
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* ── Sub-panels ── */}
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
