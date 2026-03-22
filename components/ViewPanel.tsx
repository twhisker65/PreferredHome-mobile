// components/ViewPanel.tsx — Build 3.2.13
// Changes from 3.2.12.1:
// - COSTS section redesigned as 2-column layout: MONTHLY (left) | MOVE-IN (right).
// - Monthly column: Base Rent + all fees listed individually + Total row.
// - Move-In column: all upfront costs listed individually + Total row.
// - Both "Total" rows appear on the same horizontal line.
// - Values right-aligned within each column (label left, amount right).
// - totalMonthly and totalUpfront calculated locally — no longer uses API totalMonthly field.
// - New sub-component CostTwoCol added for the new layout.
// - secDepNum, appFeeNum, totalStartup, totalMo variables removed (replaced by local calc).
// All other sections (Features, Transportation, Schools, Listing, Timeline, Notes),
// animation, toggle loading, and tap-to-contact links are unchanged.

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../styles/colors";
import { loadProfileToggles, type ProfileToggles } from "../lib/profileStorage";
import type { ListingUI } from "../lib/types";

// ── Constants ─────────────────────────────────────────────────────
const PANEL_LEFT = 40;

// ── Props ─────────────────────────────────────────────────────────
interface Props {
  visible: boolean;
  listing: ListingUI | null;
  topOffset: number;
  onClose: () => void;
}

// ── Helper functions ──────────────────────────────────────────────

function str(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function num(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v: any): boolean {
  return String(v ?? "").trim().toUpperCase() === "TRUE";
}

function fmt$(v: any): string {
  const n = num(v);
  if (n === null) return "—";
  return "$" + Math.round(n).toLocaleString();
}

function fmtComma(v: any): string {
  const s = str(v);
  if (!s) return "—";
  return s.split(",").map((x) => x.trim()).filter(Boolean).join(", ");
}

function fmtDate(v: any): string {
  const s = str(v);
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtScore(v: any): number | null {
  const n = num(v);
  if (n === null) return null;
  return Math.round(n);
}

// ── Sub-components ────────────────────────────────────────────────

function SectionHead({ title }: { title: string }) {
  return (
    <Text
      style={{
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1,
        marginTop: 14,
        marginBottom: 6,
      }}
    >
      {title.toUpperCase()}
    </Text>
  );
}

function FieldRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  if (!value || value === "—") {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}>
        <Text style={styles.label}>{label} </Text>
        <Text style={[styles.value, { color: colors.textSecondary }]}>—</Text>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}>
      <Text style={styles.label}>{label} </Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

function TwoCol({
  left,
  right,
}: {
  left: [string, string, string?];
  right: [string, string, string?];
}) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 3 }}>
      <View style={{ flex: 1 }}>
        <FieldRow label={left[0]} value={left[1]} valueColor={left[2]} />
      </View>
      <View style={{ flex: 1 }}>
        <FieldRow label={right[0]} value={right[1]} valueColor={right[2]} />
      </View>
    </View>
  );
}

// CostTwoCol — label left, amount right-aligned within each half-column
function CostTwoCol({
  left,
  right,
}: {
  left: [string, string];
  right: [string, string];
}) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 3 }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingRight: 8 }}>
        {left[0] ? (
          <>
            <Text style={styles.label}>{left[0]}</Text>
            <Text style={styles.value}>{left[1] || "—"}</Text>
          </>
        ) : null}
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingLeft: 8 }}>
        {right[0] ? (
          <>
            <Text style={styles.label}>{right[0]}</Text>
            <Text style={styles.value}>{right[1] || "—"}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

function CommaField({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return null;
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>
        {label}{" "}
        <Text style={styles.value}>{value}</Text>
      </Text>
    </View>
  );
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primaryBlue,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "900" }}>
          {score}
        </Text>
      </View>
      <Text style={{ color: colors.textSecondary, fontSize: 9, marginTop: 5, textAlign: "center" }}>
        {label}
      </Text>
    </View>
  );
}

function SchoolRow({
  rating,
  name,
  grades,
  distance,
}: {
  rating: number | null;
  name: string;
  grades: string;
  distance: string;
}) {
  if (!name) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#1E3A8A",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: "900" }}>
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
  const unitLine  = [propType, beds ? `${beds} bd` : null, baths ? `${baths} ba` : null, sqft ? `${sqft} sqft` : null, hood].filter(Boolean).join("  ·  ");

  const isPreferred  = listing.preferred;
  const isTopFloor   = bool(raw.topFloor);
  const isCorner     = bool(raw.cornerUnit);
  const isFurnished  = bool(raw.furnished);
  const isShortTerm  = bool(raw.shortTermAvailable);
  const isRentersIns = bool(raw.rentersInsuranceRequired);

  // ── COSTS — formatted display strings ─────────────────────────────
  const baseRent    = fmt$(raw.baseRent);
  const secDep      = fmt$(raw.securityDeposit);
  const amenity     = fmt$(raw.amenityFee);
  const appFee      = fmt$(raw.applicationFee);
  const adminFee    = fmt$(raw.adminFee);
  const utilFee     = fmt$(raw.utilityFee);
  const parkFee     = fmt$(raw.parkingFee);
  const otherFee    = fmt$(raw.otherFee);
  const storageRent = fmt$(raw.storageRent);
  const petFeeAmt   = fmt$(raw.petFee);
  const brokerFee   = fmt$(raw.brokerFee);
  const moveInFee   = fmt$(raw.moveInFee);

  // ── COSTS — local auto-calculations ───────────────────────────────
  const calcTotalMonthly = "$" + Math.round(
    (num(raw.baseRent)        ?? 0) +
    (num(raw.parkingFee)      ?? 0) +
    (num(raw.amenityFee)      ?? 0) +
    (num(raw.adminFee)        ?? 0) +
    (num(raw.utilityFee)      ?? 0) +
    (num(raw.storageRent)     ?? 0) +
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

  // ── TRANSPORTATION ─────────────────────────────────────────────────
  const commute      = str(raw.commuteTime);
  const walkScore    = fmtScore(raw.walkScore);
  const transitScore = fmtScore(raw.transitScore);
  const bikeScore    = fmtScore(raw.bikeScore);
  const hasScores    = walkScore !== null || transitScore !== null || bikeScore !== null;

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
  const site          = str(raw.listingSite) || "—";
  const url           = str(raw.listingUrl);
  const contact       = str(raw.contactName) || "—";
  const phone         = str(raw.contactPhone) || "—";
  const email         = str(raw.contactEmail) || "—";
  const lease         = str(raw.leaseLength) || "—";
  const noBrdApproval = bool(raw.noBoardApproval);
  const noBrkFee      = bool(raw.noBrokerFee);

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
  const applied   = fmtDate(raw.appliedDate);

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
                ♥
              </Text>
              <Text
                style={[
                  styles.label,
                  { color: isPreferred ? colors.primaryBlue : colors.textSecondary },
                ]}
              >
                Preferred
              </Text>
            </View>
            {isAptCondoCoop && <BoolBadge label="Top Floor" value={isTopFloor} />}
            {isAptCondoCoop && <BoolBadge label="Corner Unit" value={isCorner} />}
            <BoolBadge label="Furnished" value={isFurnished} />
          </View>

          {/* ── COSTS ────────────────────────────────────────── */}
          <SectionHead title="Costs" />

          {/* Column headers */}
          <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <Text style={{ flex: 1, color: colors.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 0.8 }}>
              MONTHLY
            </Text>
            <Text style={{ flex: 1, color: colors.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 0.8 }}>
              MOVE-IN
            </Text>
          </View>

          {/* Fee rows — left = Monthly fees, right = Move-In costs */}
          <CostTwoCol left={["Base Rent", baseRent]}     right={["Security Deposit", secDep]} />
          <CostTwoCol left={["Amenity Fee", amenity]}    right={["Application Fee", appFee]} />
          <CostTwoCol left={["Admin Fee", adminFee]}     right={["Broker Fee", brokerFee]} />
          <CostTwoCol left={["Utility Fee", utilFee]}    right={["Move-in Fee", moveInFee]} />
          <CostTwoCol left={["Storage Rent", storageRent]} right={["", ""]} />
          {toggles.pets && (
            <CostTwoCol left={["Pet Fee", petFeeAmt]} right={["", ""]} />
          )}
          {toggles.car && (
            <CostTwoCol left={["Parking Fee", parkFee]} right={["", ""]} />
          )}
          <CostTwoCol left={["Other Fee", otherFee]}     right={["", ""]} />

          {/* Total row — both on the same horizontal line */}
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
          <CommaField label="Close By:" value={closeBy} />
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

          {/* ── TRANSPORTATION ────────────────────────────────── */}
          <SectionHead title="Transportation" />
          {!commute && !hasScores ? (
            <Text style={[styles.value, { color: colors.textSecondary }]}>—</Text>
          ) : (
            <>
              {!!commute && <FieldRow label="Commute:" value={`${commute} min`} />}
              {hasScores && (
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  {walkScore !== null && <ScoreBadge score={walkScore} label="Walk" />}
                  {transitScore !== null && <ScoreBadge score={transitScore} label="Transit" />}
                  {bikeScore !== null && <ScoreBadge score={bikeScore} label="Bike" />}
                </View>
              )}
            </>
          )}

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
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4, marginBottom: 4 }}>
            <BoolBadge label="No Board Approval" value={noBrdApproval} />
            <BoolBadge label="No Broker Fee" value={noBrkFee} />
            <BoolBadge label="Short Term Available" value={isShortTerm} />
            <BoolBadge label="Renters Ins. Required" value={isRentersIns} />
          </View>

          {/* ── TIMELINE ──────────────────────────────────────── */}
          <SectionHead title="Timeline" />
          <TwoCol
            left={["Available:", dateAvail]}
            right={["Contacted:", contacted]}
          />
          <TwoCol
            left={["Viewing:", viewing]}
            right={["Applied:", applied]}
          />

          {/* ── NOTES ────────────────────────────────────────── */}
          {(!!pros || !!cons) && (
            <>
              <SectionHead title="Notes" />
              {!!pros && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={[styles.label, { marginBottom: 3 }]}>Pros:</Text>
                  {pros.split(/\r?\n/).filter(Boolean).map((line, i) => (
                    <Text key={i} style={[styles.value, { marginBottom: 2, paddingLeft: 6 }]}>
                      {line}
                    </Text>
                  ))}
                </View>
              )}
              {!!cons && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={[styles.label, { marginBottom: 3 }]}>Cons:</Text>
                  {cons.split(/\r?\n/).filter(Boolean).map((line, i) => (
                    <Text key={i} style={[styles.value, { marginBottom: 2, paddingLeft: 6 }]}>
                      {line}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}

        </ScrollView>
      </Animated.View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    backgroundColor: colors.card,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    marginRight: 10,
    padding: 4,
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
