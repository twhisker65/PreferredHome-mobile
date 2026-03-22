// app/(tabs)/compare.tsx — Build 3.2.12.4.1
// Hotfix — three issues from 3.2.12.4 testing:
// 1. LABEL_W increased from 120 to 150 — "Building Amenities" still truncated at 120.
// 2. ProfilePanel onClose now reloads toggles — Pet Amenities and Parking were hidden
//    even with toggles ON because profile panel close did not refresh toggle state.
// 3. rowHeights converted from useRef to useState — label column heights were not
//    updating to match multi-select data rows because ref changes do not trigger re-renders.
// All other logic unchanged.

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
import { loadCompareIds, saveCompareIds } from "../../lib/compareStorage";
import { loadCriteriaData, loadProfileToggles, type CriteriaData, type ProfileToggles } from "../../lib/profileStorage";
import type { ListingUI } from "../../lib/types";

// ── Layout constants ──────────────────────────────────────────────
const LABEL_W    = 150;   // increased from 120 — fits "Building Amenities" without truncation
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

function fmtCurrency(v: number | null): string {
  if (v === null) return "—";
  return "$" + Math.round(v).toLocaleString();
}

function joinMultiLines(v: any): string {
  const s = rawStr(v);
  if (!s) return "—";
  return s.split(",").map((x: string) => x.trim()).filter(Boolean).join(", ");
}

// ── Color helpers ─────────────────────────────────────────────────

function lteColor(v: number | null, threshold: number | null): string {
  if (v === null || threshold === null || threshold === 0) return CC.grey;
  return v <= threshold ? CC.green : CC.red;
}

function gteColor(v: number | null, threshold: number | null): string {
  if (v === null || threshold === null || threshold === 0) return CC.grey;
  return v >= threshold ? CC.green : CC.red;
}

function acColor(v: string): string {
  if (!v || v === "None") return CC.grey;
  return CC.green;
}

function laundryColor(v: string): string {
  if (!v || v === "None") return CC.grey;
  if (v === "In-Unit") return CC.green;
  return CC.yellow;
}

function parkingColor(v: string): string {
  if (!v || v === "None") return CC.grey;
  return CC.green;
}

// ── Cell data type ────────────────────────────────────────────────

type CellData = {
  text: string;
  color?: string;
  isBool?: boolean;
  boolValue?: boolean;
  isMulti?: boolean;
};

function plain(text: string): CellData { return { text }; }
function pill(text: string, color: string): CellData { return { text, color }; }
function bool(value: boolean): CellData { return { isBool: true, boolValue: value, text: "" }; }
function multi(text: string): CellData { return { text, isMulti: true }; }

// ── getCellData ───────────────────────────────────────────────────

function getCellData(key: string, listing: ListingUI, criteria: CriteriaData): CellData {
  const raw = listing.raw ?? {};
  switch (key) {
    case "baseRent": {
      const v = rawNum(raw.baseRent);
      return pill(fmtCurrency(v), lteColor(v, criteria.maxBaseRent));
    }
    case "totalMonthly": {
      const apiTotal = rawNum(raw.totalMonthly);
      const localTotal = (listing.baseRent !== undefined && listing.fees !== undefined)
        ? (listing.baseRent ?? 0) + (listing.fees ?? 0)
        : null;
      const v = (apiTotal !== null && apiTotal > 0) ? apiTotal : localTotal;
      return pill(fmtCurrency(v), lteColor(v, criteria.maxTotalMonthly));
    }
    case "propertyType":
      return plain(rawStr(raw.propertyType) || "—");
    case "unitNumber":
      return plain(rawStr(raw.unitNumber) || "—");
    case "floorNumber": {
      const v = rawNum(raw.floorNumber);
      return plain(v !== null ? String(v) : "—");
    }
    case "numberOfFloors": {
      const v = rawNum(raw.numberOfFloors);
      return plain(v !== null ? String(v) : "—");
    }
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
    case "petFee": {
      const v = rawNum(raw.petFee);
      return plain(fmtCurrency(v));
    }
    case "storageRent": {
      const v = rawNum(raw.storageRent);
      return plain(fmtCurrency(v));
    }
    case "brokerFee": {
      const v = rawNum(raw.brokerFee);
      return plain(fmtCurrency(v));
    }
    case "moveInFee": {
      const v = rawNum(raw.moveInFee);
      return plain(fmtCurrency(v));
    }
    case "coolingType": {
      const v = rawStr(raw.coolingType);
      return v ? pill(v, acColor(v)) : plain("—");
    }
    case "heatingType": {
      const v = rawStr(raw.heatingType);
      return v ? plain(v) : plain("—");
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
    case "roomTypes":         return multi(joinMultiLines(raw.roomTypes));
    case "privateOutdoorSpaceTypes": return multi(joinMultiLines(raw.privateOutdoorSpaceTypes));
    case "storageTypes":      return multi(joinMultiLines(raw.storageTypes));
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

const TABLE_ROWS: Array<{ label: string; key: string }> = [
  { label: "Base Rent",            key: "baseRent" },
  { label: "Total Rent",           key: "totalMonthly" },
  { label: "Pet Fee",              key: "petFee" },           // pets gated
  { label: "Storage Rent",         key: "storageRent" },
  { label: "Broker Fee",           key: "brokerFee" },
  { label: "Move-in Fee",          key: "moveInFee" },
  { label: "Property Type",        key: "propertyType" },
  { label: "Unit #",               key: "unitNumber" },       // apt/condo/coop gated
  { label: "Floor Number",         key: "floorNumber" },      // apt/condo/coop gated
  { label: "Number of Floors",     key: "numberOfFloors" },
  { label: "Bedrooms",             key: "bedrooms" },
  { label: "Bathrooms",            key: "bathrooms" },
  { label: "Square Footage",       key: "squareFootage" },
  { label: "No Board Approval",    key: "noBoardApproval" },
  { label: "No Broker Fee",        key: "noBrokerFee" },
  { label: "Top Floor",            key: "topFloor" },         // apt/condo/coop gated
  { label: "Corner Unit",          key: "cornerUnit" },       // apt/condo/coop gated
  { label: "Furnished",            key: "furnished" },
  { label: "Cooling Type",         key: "coolingType" },
  { label: "Heating Type",         key: "heatingType" },
  { label: "Laundry",              key: "laundry" },
  { label: "Parking",              key: "parkingType" },      // car gated
  { label: "Utilities Included",   key: "utilitiesIncluded" },
  { label: "Unit Features",        key: "unitFeatures" },
  { label: "Rooms",                key: "roomTypes" },
  { label: "Outdoor Space",        key: "privateOutdoorSpaceTypes" },
  { label: "Storage",              key: "storageTypes" },
  { label: "Building Amenities",   key: "buildingAmenities" },
  { label: "Pet Amenities",        key: "petAmenities" },     // pets gated
  { label: "Close By",             key: "closeBy" },
  { label: "Commute Time",         key: "commuteTime" },
  { label: "Elem. School",         key: "elemSchool" },       // children gated
  { label: "Middle School",        key: "middleSchool" },     // children gated
  { label: "High School",          key: "highSchool" },       // children gated
];

const CARD_ROWS: Array<{ label: string; key: string }> = [
  { label: "Base Rent",            key: "baseRent" },
  { label: "Total Rent",           key: "totalMonthly" },
  { label: "Pet Fee",              key: "petFee" },           // pets gated
  { label: "Storage Rent",         key: "storageRent" },
  { label: "Broker Fee",           key: "brokerFee" },
  { label: "Move-in Fee",          key: "moveInFee" },
  { label: "Property Type",        key: "propertyType" },
  { label: "Unit #",               key: "unitNumber" },       // apt/condo/coop gated (per card)
  { label: "Floor Number",         key: "floorNumber" },      // apt/condo/coop gated (per card)
  { label: "Number of Floors",     key: "numberOfFloors" },
  { label: "Bedrooms",             key: "bedrooms" },
  { label: "Bathrooms",            key: "bathrooms" },
  { label: "Square Footage",       key: "squareFootage" },
  { label: "No Board Approval",    key: "noBoardApproval" },
  { label: "No Broker Fee",        key: "noBrokerFee" },
  { label: "Top Floor",            key: "topFloor" },         // apt/condo/coop gated (per card)
  { label: "Corner Unit",          key: "cornerUnit" },       // apt/condo/coop gated (per card)
  { label: "Furnished",            key: "furnished" },
  { label: "Cooling Type",         key: "coolingType" },
  { label: "Heating Type",         key: "heatingType" },
  { label: "Laundry",              key: "laundry" },
  { label: "Parking",              key: "parkingType" },      // car gated
  { label: "Utilities Included",   key: "utilitiesIncluded" },
  { label: "Unit Features",        key: "unitFeatures" },
  { label: "Rooms",                key: "roomTypes" },
  { label: "Outdoor Space",        key: "privateOutdoorSpaceTypes" },
  { label: "Storage",              key: "storageTypes" },
  { label: "Building Amenities",   key: "buildingAmenities" },
  { label: "Pet Amenities",        key: "petAmenities" },     // pets gated
  { label: "Close By",             key: "closeBy" },
  { label: "Commute Time",         key: "commuteTime" },
  { label: "Elem. School",         key: "elemSchool" },       // children gated
  { label: "Middle School",        key: "middleSchool" },     // children gated
  { label: "High School",          key: "highSchool" },       // children gated
];

// ── Property type keys that are apt/condo/coop only ───────────────
const APT_ONLY_KEYS = new Set(["unitNumber", "floorNumber", "topFloor", "cornerUnit"]);

// ── Helper to filter rows by toggles and property type ────────────

function filterRows<T extends { key: string }>(
  rows: T[],
  toggles: ProfileToggles,
  showAptFields: boolean
): T[] {
  return rows.filter((r) => {
    if (r.key === "parkingType" && !toggles.car)      return false;
    if (r.key === "petFee" && !toggles.pets)          return false;
    if (r.key === "petAmenities" && !toggles.pets)    return false;
    if ((r.key === "elemSchool" || r.key === "middleSchool" || r.key === "highSchool") && !toggles.children) return false;
    if (APT_ONLY_KEYS.has(r.key) && !showAptFields)   return false;
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

function VDoubleSep() {
  return (
    <View style={{ width: 3, backgroundColor: colors.border, alignSelf: "stretch" }} />
  );
}

// ── Main tab component ────────────────────────────────────────────

export default function CompareTab() {
  const insets = useSafeAreaInsets();
  const { listings, loading } = useListings();

  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [criteria, setCriteria]     = useState<CriteriaData>({ maxBaseRent: 0, maxTotalMonthly: 0, minSqFt: 0, maxCommuteTime: 0 });
  const [toggles, setToggles]       = useState<ProfileToggles>({ children: false, pets: false, car: false });
  const [mode, setMode]             = useState<"cards" | "table">("cards");
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);

  const topBarHeight = insets.top + 52;

  useFocusEffect(
    useCallback(() => {
      loadCompareIds().then((ids) => setCompareIds(new Set(ids)));
      loadCriteriaData().then(setCriteria);
      loadProfileToggles().then(setToggles);
    }, [])
  );

  const selectedListings = listings.filter((l) => compareIds.has(l.id));

  function handleClear() {
    saveCompareIds([]);
    setCompareIds(new Set());
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Compare" onPressMenu={() => setMenuOpen(true)} />

      {/* Mode toggle row — icons centered, Clear button on the right */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 8, gap: 16 }}>
        <Pressable onPress={() => setMode("cards")}>
          <Ionicons name="grid" size={22} color={mode === "cards" ? colors.primaryBlue : colors.textSecondary} />
        </Pressable>
        <Pressable onPress={() => setMode("table")}>
          <Ionicons name="list" size={22} color={mode === "table" ? colors.primaryBlue : colors.textSecondary} />
        </Pressable>
        <Pressable onPress={handleClear} style={{ position: "absolute", right: 16 }}>
          <Text style={{ color: colors.primaryBlue, fontSize: 13 }}>Clear</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : selectedListings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center" }}>
            No listings selected for comparison.{"\n"}Tap the compare icon on a listing to add it.
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

      {activeSubPanel === "profile" && (
        <ProfilePanel
          topOffset={topBarHeight}
          onClose={() => {
            setActiveSubPanel(null);
            loadProfileToggles().then(setToggles);
          }}
        />
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

// ── Table view ────────────────────────────────────────────────────

function CompareTable({ listings, criteria, toggles }: { listings: ListingUI[]; criteria: CriteriaData; toggles: ProfileToggles }) {
  // useState (not useRef) so height changes trigger label column re-render
  const [rowHeights, setRowHeights] = useState<Record<string, number>>({});
  const labelScrollRef  = useRef<ScrollView>(null);
  const dataScrollRef   = useRef<ScrollView>(null);
  const syncingLabel    = useRef(false);
  const syncingData     = useRef(false);

  // Table shows apt-only rows if at least one listing is apt/condo/coop
  const showAptFields = listings.some((l) =>
    ["Apartment", "Condo", "Co-op"].includes(rawStr(l.raw?.propertyType))
  );

  const visibleRows = filterRows(TABLE_ROWS, toggles, showAptFields);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/* Frozen label column */}
      <ScrollView
        ref={labelScrollRef}
        scrollEnabled={false}
        style={{ width: LABEL_W }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header spacer */}
        <View style={{ height: 44, borderBottomWidth: 2, borderBottomColor: colors.border }} />
        {visibleRows.map((row, idx) => (
          <View
            key={row.key}
            style={{
              width: LABEL_W,
              paddingHorizontal: 8,
              paddingVertical: 9,
              justifyContent: "center",
              minHeight: rowHeights[row.key] ?? MIN_ROW_H,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
            }}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: "700" }}>
              {row.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      <VDoubleSep />

      {/* Scrollable data columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView
          ref={dataScrollRef}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            if (syncingData.current) return;
            syncingLabel.current = true;
            labelScrollRef.current?.scrollTo({ y: e.nativeEvent.contentOffset.y, animated: false });
            setTimeout(() => { syncingLabel.current = false; }, 50);
          }}
          scrollEventThrottle={16}
        >
          {/* Building name header row */}
          <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: colors.border }}>
            {listings.map((l) => (
              <View
                key={l.id}
                style={{
                  width: COL_W,
                  height: 44,
                  paddingHorizontal: 8,
                  justifyContent: "center",
                  borderLeftWidth: 1,
                  borderLeftColor: colors.border,
                }}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: "900" }} numberOfLines={2}>
                  {l.buildingName}
                </Text>
              </View>
            ))}
          </View>

          {/* Data rows */}
          {visibleRows.map((row, idx) => (
            <View
              key={row.key}
              style={{
                flexDirection: "row",
                minHeight: rowHeights[row.key] ?? MIN_ROW_H,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
              }}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                setRowHeights((prev) => {
                  if (prev[row.key] === h) return prev;
                  return { ...prev, [row.key]: h };
                });
              }}
            >
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
                      borderLeftWidth: 1,
                      borderLeftColor: colors.border,
                    }}
                  >
                    {cell.isBool ? (
                      <BoolCell value={cell.boolValue!} small />
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
        </ScrollView>
      </ScrollView>
    </View>
  );
}

// ── Card view ─────────────────────────────────────────────────────

function CompareCard({ listing, criteria, toggles }: { listing: ListingUI; criteria: CriteriaData; toggles: ProfileToggles }) {
  // Cards filter apt-only rows per individual listing's property type
  const isAptCondoCoop = ["Apartment", "Condo", "Co-op"].includes(rawStr(listing.raw?.propertyType));
  const visibleRows = filterRows(CARD_ROWS, toggles, isAptCondoCoop);

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
                <BoolCell value={cell.boolValue!} />
              ) : cell.color ? (
                <CPill text={cell.text} color={cell.color} />
              ) : (
                <Text style={{ color: colors.textPrimary, fontSize: 13 }} numberOfLines={cell.isMulti ? 0 : 3}>
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
