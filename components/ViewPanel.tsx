// components/ViewPanel.tsx — Build 3.2.17
// Transportation section renamed to Neighborhood.
// neighborhood field moved from Property display to Neighborhood section (first).
// closeBy moved from Features display to Neighborhood section (last).
// safetyScore and noiseScore added to score badge row in Neighborhood section.

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import { loadProfileToggles, type ProfileToggles } from "../lib/profileStorage";

const PANEL_LEFT = 48;

// ── Types ─────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  listing: any;
  topOffset: number;
  onClose: () => void;
};

// ── Helpers ───────────────────────────────────────────────────────

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function bool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  return String(v ?? "").trim().toUpperCase() === "TRUE";
}

function fmtComma(v: unknown): string {
  if (!v || v === "") return "";
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return String(v);
}

function fmtDate(v: unknown): string {
  const s = str(v);
  if (!s) return "";
  const parts = s.split("-");
  if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
  return s;
}

function fmtScore(v: unknown): number | null {
  const n = num(v);
  return n !== null ? Math.round(n) : null;
}

// ── Sub-components — defined OUTSIDE main export (DRIFT 10) ───────

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? colors.green ?? "#10B981" : score >= 40 ? "#F59E0B" : colors.red ?? "#EF4444";
  return (
    <View style={{ alignItems: "center", marginRight: 10, marginBottom: 4 }}>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{score}</Text>
      </View>
      <Text style={{ color: colors.textSecondary, fontSize: 9, fontWeight: "600", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}>
      <Text style={styles.label}>{label} </Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );
}

function CommaField({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 3 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { marginTop: 1 }]}>{value || "—"}</Text>
    </View>
  );
}

function CostTwoCol({ left, right }: { left: [string, string]; right: [string, string] }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 3 }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingRight: 8 }}>
        <Text style={styles.label}>{left[0]}</Text>
        <Text style={styles.value}>{left[1] || "—"}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingLeft: 8 }}>
        <Text style={styles.label}>{right[0]}</Text>
        <Text style={right[1] ? styles.value : [styles.value, { color: "transparent" }]}>{right[1] || "—"}</Text>
      </View>
    </View>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 12, marginBottom: 6 }}>
      <Text style={[headingLabel, { fontSize: 10, marginBottom: 4 }]}>{title.toUpperCase()}</Text>
    </View>
  );
}

function SchoolRow({ rating, name, grades, distance }: { rating: number | null; name: string | null; grades: string | null; distance: string | null }) {
  if (!name) return null;
  return (
    <View style={{ flexDirection: "row", marginBottom: 6, alignItems: "flex-start" }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
        <Text style={{ color: colors.primaryBlue, fontSize: 11, fontWeight: "800" }}>
          {rating !== null ? String(rating) : "—"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: "700" }}>
          {name}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 2 }}>
          <Text style={styles.label}>{"Grades: "}</Text>
          <Text style={styles.value}>{grades || "—"}</Text>
          <Text style={[styles.label, { marginLeft: 10 }]}>{"Distance: "}</Text>
          <Text style={styles.value}>{distance ? `${distance} mi` : "—"}</Text>
        </View>
      </View>
    </View>
  );
}

function BoolBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}>
      <Text style={styles.label}>{label} </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "900",
          color: value ? colors.primaryBlue : colors.textSecondary,
        }}
      >
        {value ? "✓" : "—"}
      </Text>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────

export function ViewPanel({ visible, listing, topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW = screenW - PANEL_LEFT;

  const translateX = useRef(new Animated.Value(panelW)).current;

  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });
  useEffect(() => {
    if (visible) {
      loadProfileToggles().then(setToggles);
    }
  }, [visible]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : panelW,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible, panelW]);

  if (!listing) return null;
  const raw = listing.raw ?? {};

  // ── Property type visibility ──────────────────────────────────────
  const propType = str(raw.propertyType);
  const isAptCondoCoop = ["Apartment", "Condo", "Co-op"].includes(propType);

  // ── PROPERTY ──────────────────────────────────────────────────────
  const buildingName = str(raw.buildingName) || listing.buildingName;
  const street    = str(raw.streetAddress);
  const city      = str(raw.city);
  const stateVal  = str(raw.state);
  const zip       = str(raw.zipCode);
  const unit      = str(raw.unitNumber);
  const floorNum  = str(raw.floorNumber);
  const numFloors = str(raw.numberOfFloors);

  const addressParts = [
    street,
    [city, stateVal, zip].filter(Boolean).join(", "),
    isAptCondoCoop && unit ? unit : null,
  ].filter(Boolean);
  const fullAddress  = addressParts.join(", ") || "—";
  const mapsAddress  = [street, [city, stateVal, zip].filter(Boolean).join(", ")].filter(Boolean).join(", ");

  const beds      = str(raw.bedrooms);
  const baths     = str(raw.bathrooms);
  const sqft      = str(raw.squareFootage);
  const hood      = str(raw.neighborhood);
  const unitLine  = [propType, beds ? `${beds} bd` : null, baths ? `${baths} ba` : null, sqft ? `${sqft} sqft` : null].filter(Boolean).join(" · ") || "—";

  const isPreferred = bool(raw.preferred);
  const isFurnished = bool(raw.furnished);
  const isTopFloor  = bool(raw.topFloor);
  const isCorner    = bool(raw.cornerUnit);
  const isShortTerm = bool(raw.shortTermAvailable);
  const isRentersIns = bool(raw.rentersInsuranceRequired);
  const noBrdApproval = bool(raw.noBoardApproval);
  const noBrkFee      = bool(raw.noBrokerFee);

  // ── COSTS ──────────────────────────────────────────────────────────
  const fmt = (v: unknown) => v !== null && v !== undefined && v !== "" ? `$${Number(v).toLocaleString()}` : "";
  const baseRentAmt    = fmt(raw.baseRent);
  const amenityFeeAmt  = fmt(raw.amenityFee);
  const adminFeeAmt    = fmt(raw.adminFee);
  const utilityFeeAmt  = fmt(raw.utilityFee);
  const storageRent    = fmt(raw.storageRent);
  const petFeeAmt      = fmt(raw.petFee);
  const parkFee        = fmt(raw.parkingFee);
  const otherFee       = fmt(raw.otherFee);
  const secDep         = fmt(raw.securityDeposit);
  const appFee         = fmt(raw.applicationFee);
  const brkFee         = fmt(raw.brokerFee);
  const mvInFee        = fmt(raw.moveInFee);

  const calcTotalMonthly = "$" + Math.round(
    (num(raw.baseRent)        ?? 0) +
    (num(raw.amenityFee)      ?? 0) +
    (num(raw.adminFee)        ?? 0) +
    (num(raw.utilityFee)      ?? 0) +
    (num(raw.storageRent)     ?? 0) +
    (num(raw.parkingFee)      ?? 0) +
    (num(raw.petFee)          ?? 0) +
    (num(raw.otherFee)        ?? 0)
  ).toLocaleString();

  const calcTotalUpfront = "$" + Math.round(
    (num(raw.securityDeposit) ?? 0) +
    (num(raw.applicationFee)  ?? 0) +
    (num(raw.brokerFee)       ?? 0) +
    (num(raw.moveInFee)       ?? 0)
  ).toLocaleString();

  // ── FEATURES ──────────────────────────────────────────────────────
  const utilities      = fmtComma(raw.utilitiesIncluded);
  const unitFeat       = fmtComma(raw.unitFeatures);
  const bldgAmen       = fmtComma(raw.buildingAmenities);
  const petAmen        = fmtComma(raw.petAmenities);
  const closeBy        = fmtComma(raw.closeBy);
  const coolingType    = str(raw.coolingType) || "—";
  const heatingType    = str(raw.heatingType) || "—";
  const laundry        = str(raw.laundry) || "—";
  const parking        = str(raw.parkingType) || "—";
  const roomTypes      = fmtComma(raw.roomTypes);
  const privateOutdoor = fmtComma(raw.privateOutdoorSpaceTypes);
  const storageTypes   = fmtComma(raw.storageTypes);

  // ── NEIGHBORHOOD ───────────────────────────────────────────────────
  const commute      = str(raw.commuteTime);
  const walkScore    = fmtScore(raw.walkScore);
  const transitScore = fmtScore(raw.transitScore);
  const bikeScore    = fmtScore(raw.bikeScore);
  const safetyScore  = fmtScore(raw.safetyScore);
  const noiseScore   = fmtScore(raw.noiseScore);
  const hasScores    = walkScore !== null || transitScore !== null || bikeScore !== null || safetyScore !== null || noiseScore !== null;

  // ── SCHOOLS ────────────────────────────────────────────────────────
  const elemName   = str(raw.elementarySchoolName);
  const elemGrades = str(raw.elementaryGrades);
  const elemRating = num(raw.elementaryRating);
  const elemDist   = str(raw.elementaryDistance);
  const midName    = str(raw.middleSchoolName);
  const midGrades  = str(raw.middleGrades);
  const midRating  = num(raw.middleRating);
  const midDist    = str(raw.middleDistance);
  const highName   = str(raw.highSchoolName);
  const highGrades = str(raw.highGrades);
  const highRating = num(raw.highRating);
  const highDist   = str(raw.highDistance);
  const hasSchools = !!(elemName || midName || highName);

  // ── LISTING ────────────────────────────────────────────────────────
  const site    = str(raw.listingSite) || "—";
  const url     = str(raw.listingUrl);
  const contact = str(raw.contactName) || "—";
  const phone   = str(raw.contactPhone) || "—";
  const email   = str(raw.contactEmail) || "—";
  const lease   = str(raw.leaseLength) || "—";

  // ── TIMELINE ───────────────────────────────────────────────────────
  const dateAvail = fmtDate(raw.dateAvailable);
  const contacted = fmtDate(raw.contactedDate);
  const viewing   = str(raw.viewingAppointment)
    ? (() => {
        const parts = str(raw.viewingAppointment).split("T");
        const datePart = fmtDate(parts[0]);
        const timePart = parts[1] ? parts[1].substring(0, 5) : "";
        return timePart ? `${datePart} ${timePart}` : datePart;
      })()
    : "—";
  const applied = fmtDate(raw.appliedDate);

  // ── NOTES ──────────────────────────────────────────────────────────
  const pros = str(raw.pros);
  const cons = str(raw.cons);

  return (
    <>
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            top: topOffset,
            bottom: 0,
            left: PANEL_LEFT,
            right: 0,
            zIndex: 50,
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: colors.primaryBlue, fontSize: 22, lineHeight: 24 }}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {buildingName}
          </Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>

          {/* ── PROPERTY ─────────────────────────────────── */}
          {mapsAddress ? (
            <Pressable
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(mapsAddress)}`)}
              style={{ marginBottom: 3 }}
            >
              <Text style={[styles.value, { color: colors.primaryBlue }]}>{fullAddress}</Text>
            </Pressable>
          ) : (
            <Text style={[styles.value, { marginBottom: 3 }]}>{fullAddress}</Text>
          )}

          <Text style={[styles.value, { color: colors.textSecondary, marginBottom: 4 }]}>
            {unitLine}
          </Text>

          {isAptCondoCoop && !!floorNum && (
            <FieldRow label="Floor #:" value={floorNum} />
          )}
          {!!numFloors && (
            <FieldRow label="# of Floors:" value={numFloors} />
          )}

          {/* Boolean badges */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 4,
              marginTop: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: isPreferred ? colors.primaryBlue : colors.textSecondary,
                  marginRight: 4,
                }}
              >
                {isPreferred ? "♥" : "♡"}
              </Text>
              <Text style={styles.label}>Preferred</Text>
            </View>
            <BoolBadge label="Furnished" value={isFurnished} />
            {isAptCondoCoop && <BoolBadge label="Top Floor" value={isTopFloor} />}
            {isAptCondoCoop && <BoolBadge label="Corner" value={isCorner} />}
            <BoolBadge label="Short Term" value={isShortTerm} />
            <BoolBadge label="Renters Ins." value={isRentersIns} />
            <BoolBadge label="No Board" value={noBrdApproval} />
            <BoolBadge label="No Broker" value={noBrkFee} />
          </View>

          {/* ── COSTS ────────────────────────────────────── */}
          <SectionHead title="Costs" />
          <View style={{ flexDirection: "row", marginBottom: 2 }}>
            <Text style={[styles.label, { flex: 1, textAlign: "center", fontWeight: "800" }]}>Monthly</Text>
            <Text style={[styles.label, { flex: 1, textAlign: "center", fontWeight: "800" }]}>One-Time</Text>
          </View>
          <CostTwoCol left={["Base Rent", baseRentAmt]}    right={["Security Dep.", secDep]} />
          <CostTwoCol left={["Amenity Fee", amenityFeeAmt]} right={["Application Fee", appFee]} />
          <CostTwoCol left={["Admin Fee", adminFeeAmt]}    right={["Broker Fee", brkFee]} />
          <CostTwoCol left={["Utility Fee", utilityFeeAmt]} right={["Move-in Fee", mvInFee]} />
          <CostTwoCol left={["Storage Rent", storageRent]} right={["", ""]} />
          {toggles.pets && (
            <CostTwoCol left={["Pet Fee", petFeeAmt]} right={["", ""]} />
          )}
          {toggles.car && (
            <CostTwoCol left={["Parking Fee", parkFee]} right={["", ""]} />
          )}
          <CostTwoCol left={["Other Fee", otherFee]}     right={["", ""]} />

          {/* Total row */}
          <View style={{ height: 1, backgroundColor: colors.border, marginTop: 4, marginBottom: 6 }} />
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingRight: 8 }}>
              <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "900" }}>Total</Text>
              <Text style={{ color: colors.primaryBlue, fontSize: 13, fontWeight: "900" }}>{calcTotalMonthly}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingLeft: 8 }}>
              <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "900" }}>Total</Text>
              <Text style={{ color: colors.primaryBlue, fontSize: 13, fontWeight: "900" }}>{calcTotalUpfront}</Text>
            </View>
          </View>

          {/* ── FEATURES ─────────────────────────────────────── */}
          <SectionHead title="Features" />
          <CommaField label="Utilities Included:" value={utilities} />
          <CommaField label="Unit Features:" value={unitFeat} />
          <CommaField label="Rooms:" value={roomTypes} />
          <CommaField label="Private Outdoor Space:" value={privateOutdoor} />
          <CommaField label="Storage:" value={storageTypes} />
          <CommaField label="Building Amenities:" value={bldgAmen} />
          {toggles.pets && (
            <CommaField label="Pet Amenities:" value={petAmen} />
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 2, marginBottom: 4 }}>
            <Text style={styles.label}>Cooling: </Text>
            <Text style={[styles.value, { marginRight: 10 }]}>{coolingType}</Text>
            <Text style={styles.label}>Heating: </Text>
            <Text style={[styles.value, { marginRight: 10 }]}>{heatingType}</Text>
            <Text style={styles.label}>Laundry: </Text>
            <Text style={[styles.value, { marginRight: 10 }]}>{laundry}</Text>
            {toggles.car && (
              <>
                <Text style={styles.label}>Parking: </Text>
                <Text style={styles.value}>{parking}</Text>
              </>
            )}
          </View>

          {/* ── NEIGHBORHOOD ──────────────────────────────────── */}
          <SectionHead title="Neighborhood" />
          {!!hood && <FieldRow label="Neighborhood:" value={hood} />}
          {!!commute && <FieldRow label="Commute:" value={`${commute} min`} />}
          {hasScores && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
              {walkScore !== null && <ScoreBadge score={walkScore} label="Walk" />}
              {transitScore !== null && <ScoreBadge score={transitScore} label="Transit" />}
              {bikeScore !== null && <ScoreBadge score={bikeScore} label="Bike" />}
              {safetyScore !== null && <ScoreBadge score={safetyScore} label="Safety" />}
              {noiseScore !== null && <ScoreBadge score={noiseScore} label="Noise" />}
            </View>
          )}
          <CommaField label="Close By:" value={closeBy} />

          {/* ── SCHOOLS ───────────────────────────────────────── */}
          {hasSchools && toggles.children && (
            <>
              <SectionHead title="Schools" />
              <SchoolRow rating={elemRating} name={elemName} grades={elemGrades} distance={elemDist} />
              <SchoolRow rating={midRating}  name={midName}  grades={midGrades}  distance={midDist} />
              <SchoolRow rating={highRating} name={highName} grades={highGrades} distance={highDist} />
            </>
          )}

          {/* ── LISTING ───────────────────────────────────────── */}
          <SectionHead title="Listing" />
          <FieldRow label="Source:" value={site} />
          {url ? (
            <Pressable
              onPress={() => Linking.openURL(url)}
              style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}
            >
              <Text style={styles.label}>URL: </Text>
              <Text style={[styles.value, { color: colors.primaryBlue }]} numberOfLines={1}>{url}</Text>
            </Pressable>
          ) : (
            <FieldRow label="URL:" value="—" />
          )}
          <FieldRow label="Contact:" value={contact} />
          {phone !== "—" ? (
            <Pressable
              onPress={() => Linking.openURL(`tel:${phone}`)}
              style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}
            >
              <Text style={styles.label}>Phone: </Text>
              <Text style={[styles.value, { color: colors.primaryBlue }]}>{phone}</Text>
            </Pressable>
          ) : (
            <FieldRow label="Phone:" value={phone} />
          )}
          {email !== "—" ? (
            <Pressable
              onPress={() => Linking.openURL(`mailto:${email}`)}
              style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}
            >
              <Text style={styles.label}>Email: </Text>
              <Text style={[styles.value, { color: colors.primaryBlue }]}>{email}</Text>
            </Pressable>
          ) : (
            <FieldRow label="Email:" value={email} />
          )}
          <FieldRow label="Lease:" value={lease} />

          {/* ── TIMELINE ──────────────────────────────────────── */}
          <SectionHead title="Timeline" />
          <FieldRow label="Available:" value={dateAvail || "—"} />
          <FieldRow label="Contacted:" value={contacted || "—"} />
          <FieldRow label="Viewing:" value={viewing} />
          <FieldRow label="Applied:" value={applied || "—"} />

          {/* ── NOTES ─────────────────────────────────────────── */}
          {(!!pros || !!cons) && (
            <>
              <SectionHead title="Notes" />
              {!!pros && <CommaField label="Pros:" value={pros} />}
              {!!cons && <CommaField label="Cons:" value={cons} />}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  headerTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  value: {
    color: colors.textPrimary,
    fontSize: 12,
  },
});
