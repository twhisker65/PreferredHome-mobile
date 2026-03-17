// app/(tabs)/compare.tsx — Build 3.2.09.2
// Changes from 3.2.08.2:
// - Import loadProfileToggles + ProfileToggles from profileStorage.
// - Added toggles state in CompareTab; loaded in useFocusEffect alongside criteria.
// - TABLE_ROWS and CARD_ROWS extended with petAmenities, elemSchool, middleSchool, highSchool.
// - getCellData extended with cases for petAmenities and school composite rows.
// - CompareTable and CompareCard receive toggles prop; each filters its row list at render time.
// - rowHeights changed from index-based array to key-based Record to handle dynamic row count.
// - Parking row hidden when car=false. Pet Amenities shown when pets=true. Schools shown when children=true.
// All layout constants, color logic, frozen panes, and onLayout sync logic unchanged.

import React, { useCallback, useRef, useState } from "react";
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
import { loadCriteriaData, loadProfileToggles, type CriteriaData, type ProfileToggles } from "../../lib/profileStorage";
import type { ListingUI } from "../../lib/types";

// ── Layout constants ──────────────────────────────────────────────
const LABEL_W    = 100;
const COL_W      = 118;
const MIN_ROW_H  = 40;

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

function joinMultiLines(v: any): string {
  if (Array.isArray(v)) return v.filter(Boolean).join("\n") || "—";
  const s = rawStr(v);
  if (!s) return "—";
  return s.split(",").map((x: string) => x.trim()).filter(Boolean).join("\n") || "—";
}

function fmtCurrency(v: number | null): string {
  if (v === null) return "—";
  return `$${Math.round(v).toLocaleString()}/mo`;
}

// ── Color logic ───────────────────────────────────────────────────

function lteColor(value: number | null, criteriaStr: string): string {
  if (!criteriaStr) return CC.grey;
  if (value === null) return CC.grey;
  const limit = parseFloat(criteriaStr);
  if (isNaN(limit)) return CC.grey;
  return value <= limit ? CC.green : CC.red;
}

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
  color: string | null;
  isBool: boolean;
  boolValue: boolean;
  isMulti: boolean;
};

function getCellData(key: string, listing: ListingUI, criteria: CriteriaData): CellData {
  const raw = listing.raw ?? {};
  const plain = (text: string): CellData => ({ text, color: null, isBool: false, boolValue: false, isMulti: false });
  const pill  = (text: string, color: string): CellData => ({ text, color, isBool: false, boolValue: false, isMulti: false });
  const bool  = (val: boolean): CellData => ({ text: "", color: null, isBool: true, boolValue: val, isMulti: false });
  const multi = (text: string): CellData => ({ text, color: null, isBool: false, boolValue: false, isMulti: true });

  switch (key) {
    case "baseRent": {
      const v = listing.baseRent;
      return pill(fmtCurrency(v), lteColor(v, criteria.maxBaseRent));
    }
    case "totalMonthly": {
      const apiTotal = rawNum(raw.totalMonthly);
      const localTotal = listing.baseRent !== null
        ? (listing.baseRent ?? 0) + (listing.fees ?? 0)
        : null;
      const v = (apiTotal !== null && apiTotal > 0) ? apiTotal : localTotal;
      return pill(fmtCurrency(v), lteColor(v, criteria.maxTotalMonthly));
    }
    case "unitType":
      return plain(rawStr(raw.unitType) || "—");
    case "bedrooms": {
      const v = rawNum(raw.bedrooms);
      return plain(v !== null ? String(v) : "—");
    }
    case "bathrooms": {
      const v = rawNum(raw.bathrooms);
      return plain(v !== null ? String(v) : "—");
    }
    case "squareFootage": {
      const v = rawNum(raw.squareFootage);
      return pill(v !== null ? `${Math.round(v).toLocaleString()} sqft` : "—", gteColor(v, criteria.minSqFt));
    }
    case "noBoardApproval": return bool(rawBool(raw.noBoardApproval));
    case "noBrokerFee":     return bool(rawBool(raw.noBrokerFee));
    case "topFloor":        return bool(rawBool(raw.topFloor));
    case "cornerUnit":      return bool(rawBool(raw.cornerUnit));
    case "furnished":       return bool(rawBool(raw.furnished));
    case "acType": {
      const v = rawStr(raw.acType);
      return v ? pill(v, acColor(v)) : plain("—");
    }
    case "laundry": {
      const v = rawStr(raw.laundry);
      return v ? pill(v, laundryColor(v)) : plain("—");
    }
    case "parkingType": {
      const v = rawStr(raw.parkingType);
      return v ? pill(v, parkingColor(v)) : plain("—");
    }
    case "utilitiesIncluded": return multi(joinMultiLines(raw.utilitiesIncluded));
    case "unitFeatures":      return multi(joinMultiLines(raw.unitFeatures));
    case "buildingAmenities": return multi(joinMultiLines(raw.buildingAmenities));
    case "petAmenities":      return multi(joinMultiLines(raw.petAmenities));
    case "closeBy":           return multi(joinMultiLines(raw.closeBy));
    case "commuteTime": {
      const v = rawNum(raw.commuteTime);
      return pill(v !== null ? `${Math.round(v)} min` : "—", lteColor(v, criteria.maxCommuteTime));
    }
    case "elemSchool": {
      const name = rawStr(raw.elementarySchoolName);
      if (!name) return plain("—");
      const rating = rawNum(raw.elementaryRating);
      const grades = rawStr(raw.elementaryGrades);
      const dist   = rawStr(raw.elementaryDistance);
      const parts  = [name, rating !== null ? `Rating: ${rating}` : null, grades || null, dist ? `${dist} mi` : null].filter(Boolean);
      return plain(parts.join(" · "));
    }
    case "middleSchool": {
      const name = rawStr(raw.middleSchoolName);
      if (!name) return plain("—");
      const rating = rawNum(raw.middleRating);
      const grades = rawStr(raw.middleGrades);
      const dist   = rawStr(raw.middleDistance);
      const parts  = [name, rating !== null ? `Rating: ${rating}` : null, grades || null, dist ? `${dist} mi` : null].filter(Boolean);
      return plain(parts.join(" · "));
    }
    case "highSchool": {
      const name = rawStr(raw.highSchoolName);
      if (!name) return plain("—");
      const rating = rawNum(raw.highRating);
      const grades = rawStr(raw.highGrades);
      const dist   = rawStr(raw.highDistance);
      const parts  = [name, rating !== null ? `Rating: ${rating}` : null, grades || null, dist ? `${dist} mi` : null].filter(Boolean);
      return plain(parts.join(" · "));
    }
    default:
      return plain("—");
  }
}

// ── Row definitions ───────────────────────────────────────────────
// All rows are defined here. Toggle-gated rows are filtered at render time.

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
  { label: "Parking",            key: "parkingType" },     // car gated
  { label: "Utilities Included", key: "utilitiesIncluded" },
  { label: "Unit Features",      key: "unitFeatures" },
  { label: "Building Amenities", key: "buildingAmenities" },
  { label: "Pet Amenities",      key: "petAmenities" },    // pets gated
  { label: "Close By",           key: "closeBy" },
  { label: "Commute Time",       key: "commuteTime" },
  { label: "Elem. School",       key: "elemSchool" },      // children gated
  { label: "Middle School",      key: "middleSchool" },    // children gated
  { label: "High School",        key: "highSchool" },      // children gated
];

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
  { label: "Parking",            key: "parkingType" },     // car gated
  { label: "Pet Amenities",      key: "petAmenities" },    // pets gated
  { label: "Commute Time",       key: "commuteTime" },
  { label: "Elem. School",       key: "elemSchool" },      // children gated
  { label: "Middle School",      key: "middleSchool" },    // children gated
  { label: "High School",        key: "highSchool" },      // children gated
];

// ── Helper to filter rows by toggles ─────────────────────────────

function filterRows<T extends { key: string }>(rows: T[], toggles: ProfileToggles): T[] {
  return rows.filter((r) => {
    if (r.key === "parkingType" && !toggles.car)      return false;
    if (r.key === "petAmenities" && !toggles.pets)    return false;
    if ((r.key === "elemSchool" || r.key === "middleSchool" || r.key === "highSchool") && !toggles.children) return false;
    return true;
  });
}

// ── Shared sub-components ─────────────────────────────────────────

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
    <Text style={{ color: value ? CC.green : colors.textSecondary, fontSize: small ? 14 : 16, fontWeight: "700" }}>
      {value ? "✓" : "—"}
    </Text>
  );
}

function HDoubleRule() {
  return (
    <View>
      <View style={{ height: 1, backgroundColor: colors.border }} />
      <View style={{ height: 2 }} />
      <View style={{ height: 1, backgroundColor: colors.border }} />
    </View>
  );
}

function VDoubleSep() {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: 1, backgroundColor: colors.border }} />
      <View style={{ width: 2 }} />
      <View style={{ width: 1, backgroundColor: colors.border }} />
    </View>
  );
}

// ── Table view ────────────────────────────────────────────────────
// Frozen header (building names). Unified rows — label + all data cells
// in a single flexDirection:"row" so React Native sizes each row to its
// tallest cell automatically. No height state, no onLayout, no measurement.
// Labels scroll horizontally with the data (no frozen label column).

function CompareTable({ listings, criteria, toggles }: { listings: ListingUI[]; criteria: CriteriaData; toggles: ProfileToggles }) {
  const headerScrollRef = useRef<ScrollView>(null);

  function syncHeader(e: any) {
    headerScrollRef.current?.scrollTo({
      x: e.nativeEvent.contentOffset.x,
      animated: false,
    });
  }

  const visibleRows = filterRows(TABLE_ROWS, toggles);

  // Total content width = label + data columns
  const contentW = LABEL_W + COL_W * listings.length;

  return (
    <View style={{ flex: 1 }}>

      {/* ── FROZEN HEADER — building names ── */}
      <ScrollView
        horizontal
        ref={headerScrollRef}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Spacer aligns with label column in body rows */}
        <View style={{ width: LABEL_W, paddingHorizontal: 8, paddingVertical: 11, justifyContent: "center" }}>
          <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "900" }}>
            Criteria
          </Text>
        </View>
        {listings.map((l) => (
          <View
            key={l.id}
            style={{
              width: COL_W,
              paddingHorizontal: 8,
              paddingVertical: 11,
              borderLeftWidth: 1,
              borderLeftColor: colors.border,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "900" }} numberOfLines={2}>
              {l.buildingName}
            </Text>
          </View>
        ))}
      </ScrollView>

      <HDoubleRule />

      {/* ── BODY — vertical scroll wraps horizontal scroll ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={syncHeader}
          scrollEventThrottle={16}
        >
          <View style={{ width: contentW }}>
            {visibleRows.map((row, rowIdx) => (
              <View
                key={row.key}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  backgroundColor: rowIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
                  minHeight: MIN_ROW_H,
                }}
              >
                {/* Label cell */}
                <View
                  style={{
                    width: LABEL_W,
                    paddingHorizontal: 8,
                    paddingVertical: 9,
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderRightColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: "700" }}>
                    {row.label}
                  </Text>
                </View>

                {/* Data cells — one per listing */}
                {listings.map((listing) => {
                  const cell = getCellData(row.key, listing, criteria);
                  return (
                    <View
                      key={listing.id}
                      style={{
                        width: COL_W,
                        paddingHorizontal: 8,
                        paddingVertical: 9,
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderRightColor: colors.border,
                      }}
                    >
                      {cell.isBool ? (
                        <BoolCell value={cell.boolValue} small />
                      ) : cell.color ? (
                        <CPill text={cell.text} color={cell.color} small />
                      ) : (
                        <Text
                          style={{ color: colors.textSecondary, fontSize: 11 }}
                          numberOfLines={cell.isMulti ? 0 : 4}
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
      </ScrollView>

    </View>
  );
}

// ── Card view ─────────────────────────────────────────────────────

function CompareCard({ listing, criteria, toggles }: { listing: ListingUI; criteria: CriteriaData; toggles: ProfileToggles }) {
  const visibleRows = filterRows(CARD_ROWS, toggles);

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
      <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: "900" }} numberOfLines={1}>
          {listing.buildingName}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
          {listing.addressLine}
        </Text>
      </View>

      {visibleRows.map((row, idx) => {
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
              borderBottomWidth: idx < visibleRows.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
              backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600", flex: 1 }}>
              {row.label}
            </Text>
            <View style={{ alignItems: "flex-end", maxWidth: "56%" }}>
              {cell.isBool ? (
                <BoolCell value={cell.boolValue} />
              ) : cell.color ? (
                <CPill text={cell.text} color={cell.color} />
              ) : (
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "600", textAlign: "right" }}>
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

// ── Icon toggle ───────────────────────────────────────────────────

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
      <Ionicons name={icon} size={24} color={active ? colors.primaryBlue : colors.textSecondary} />
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
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });
  const [mode, setMode] = useState<"cards" | "table">("cards");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadCompareIds().then(setCompareIds);
      loadCriteriaData().then(setCriteria);
      loadProfileToggles().then(setToggles);
    }, [])
  );

  const selectedListings = listings.filter((l) => compareIds.includes(l.id));

  const missingCriteria: string[] = [];
  if (!criteria.maxBaseRent)     missingCriteria.push("Max Base Rent");
  if (!criteria.maxTotalMonthly) missingCriteria.push("Max Total Monthly");
  if (!criteria.minSqFt)         missingCriteria.push("Min Square Footage");
  if (!criteria.maxCommuteTime)  missingCriteria.push("Max Commute Time");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      {/* Missing criteria banner */}
      {missingCriteria.length > 0 && selectedListings.length > 0 && (
        <Pressable
          onPress={() => setActiveSubPanel("criteria")}
          style={({ pressed }) => ({
            backgroundColor: pressed ? `${colors.primaryBlue}30` : `${colors.primaryBlue}20`,
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
            style={{ color: colors.primaryBlue, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, flex: 1 }}
            numberOfLines={2}
          >
            CRITERIA NOT SET: {missingCriteria.join(", ")} — TAP TO SET
          </Text>
          <Ionicons name="chevron-forward" size={12} color={colors.primaryBlue} />
        </Pressable>
      )}

      {/* Mode toggle */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 18, paddingTop: 10, paddingBottom: 4 }}>
        <IconToggle icon="grid-outline" active={mode === "cards"} onPress={() => setMode("cards")} />
        <IconToggle icon="list-outline" active={mode === "table"} onPress={() => setMode("table")} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading...</Text>
        </View>
      ) : selectedListings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 36 }}>
          <Ionicons name="git-compare-outline" size={48} color={colors.textSecondary} />
          <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "800", marginTop: 16, textAlign: "center" }}>
            No listings selected
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8, textAlign: "center", lineHeight: 20 }}>
            Go to Listings and tap the compare icon on up to 3 listings to compare them here.
          </Text>
        </View>
      ) : mode === "cards" ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {selectedListings.map((l) => (
            <CompareCard key={l.id} listing={l} criteria={criteria} toggles={toggles} />
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 16 }}>
          <CompareTable listings={selectedListings} criteria={criteria} toggles={toggles} />
        </View>
      )}

      {/* Menu */}
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
        <CriteriaPanel
          topOffset={topBarHeight}
          onClose={() => {
            setActiveSubPanel(null);
            loadCriteriaData().then(setCriteria);
          }}
        />
      )}
      {activeSubPanel === "settings" && (
        <SettingsPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
    </View>
  );
}
