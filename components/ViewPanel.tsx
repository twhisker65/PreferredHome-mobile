// components/ViewPanel.tsx — Build 3.2.12
// Changes from 3.2.10:
// - Property type show/hide: Unit #, Floor Number, Top Floor, Corner Unit hidden
//   for House / Townhouse. Shown for Apartment, Condo, Co-op.
// - raw.acType corrected to raw.coolingType throughout.
// - petFee now gated behind toggles.pets (matches Add / Edit behaviour).
// - New fields added to COSTS: storageRent, petFee, brokerFee, moveInFee.
// - New fields added to PROPERTY display: floorNumber (apt/condo/coop only),
//   numberOfFloors (all types).
// - New fields added to FEATURES: heatingType, roomTypes,
//   privateOutdoorSpaceTypes, storageTypes.
// - LISTING section: shortTermAvailable and rentersInsuranceRequired added.
// All tap-to-contact links, animation, toggle loading, and existing layout unchanged.

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

  // ── Field values — PROPERTY ──────────────────────────────────────
  const buildingName = str(raw.buildingName) || listing.buildingName;
  const street    = str(raw.streetAddress);
  const city      = str(raw.city);
  const stateVal  = str(raw.state);
  const zip       = str(raw.zipCode);
  const unit      = str(raw.unitNumber);
  const floorNum  = str(raw.floorNumber);
  const numFloors = str(raw.numberOfFloors);

  // Unit # only in address for apt/condo/coop
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

  const isPreferred = listing.preferred;
  const isTopFloor  = bool(raw.topFloor);
  const isCorner    = bool(raw.cornerUnit);
  const isFurnished = bool(raw.furnished);
  const isShortTerm = bool(raw.shortTermAvailable);
  const isRentersIns = bool(raw.rentersInsuranceRequired);

  // ── COSTS ──────────────────────────────────────────────────────
  const baseRent    = fmt$(raw.baseRent);
  const secDep      = fmt$(raw.securityDeposit);
  const amenity     = fmt$(raw.amenityFee);
  const appFee      = fmt$(raw.applicationFee);
  const adminFee    = fmt$(raw.adminFee);
  const secDepNum   = num(raw.securityDeposit) ?? 0;
  const appFeeNum   = num(raw.applicationFee) ?? 0;
  const totalStartup = "$" + Math.round(secDepNum + appFeeNum).toLocaleString();
  const utilFee     = fmt$(raw.utilityFee);
  const parkFee     = fmt$(raw.parkingFee);
  const otherFee    = fmt$(raw.otherFee);
  const storageRent = fmt$(raw.storageRent);
  const petFeeAmt   = fmt$(raw.petFee);
  const brokerFee   = fmt$(raw.brokerFee);
  const moveInFee   = fmt$(raw.moveInFee);
  const totalMo     = fmt$(raw.totalMonthly);

  // ── FEATURES ───────────────────────────────────────────────────
  const utilities    = fmtComma(raw.utilitiesIncluded);
  const unitFeat     = fmtComma(raw.unitFeatures);
  const bldgAmen     = fmtComma(raw.buildingAmenities);
  const petAmen      = fmtComma(raw.petAmenities);
  const closeBy      = fmtComma(raw.closeBy);
  const coolingType  = str(raw.coolingType) || "—";
  const heatingType  = str(raw.heatingType) || "—";
  const laundry      = str(raw.laundry) || "—";
  const parking      = str(raw.parkingType) || "—";
  const roomTypes    = fmtComma(raw.roomTypes);
  const privateOutdoor = fmtComma(raw.privateOutdoorSpaceTypes);
  const storageTypes = fmtComma(raw.storageTypes);

  // ── TRANSPORTATION ─────────────────────────────────────────────
  const commute      = str(raw.commuteTime);
  const walkScore    = fmtScore(raw.walkScore);
  const transitScore = fmtScore(raw.transitScore);
  const bikeScore    = fmtScore(raw.bikeScore);
  const hasScores    = walkScore !== null || transitScore !== null || bikeScore !== null;

  // ── SCHOOLS ────────────────────────────────────────────────────
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

  // ── LISTING ────────────────────────────────────────────────────
  const site          = str(raw.listingSite) || "—";
  const url           = str(raw.listingUrl);
  const contact       = str(raw.contactName) || "—";
  const phone         = str(raw.contactPhone) || "—";
  const email         = str(raw.contactEmail) || "—";
  const lease         = str(raw.leaseLength) || "—";
  const noBrdApproval = bool(raw.noBoardApproval);
  const noBrkFee      = bool(raw.noBrokerFee);

  // ── TIMELINE ───────────────────────────────────────────────────
  const dateAvail = fmtDate(raw.dateAvailable);
  const contacted = fmtDate(raw.contactedDate);
  const viewing   = str(raw.viewingAppointment)
    ? fmtDate(str(raw.viewingAppointment).split("T")[0]) + (str(raw.viewingAppointment).split("T")[1] ? " · " + str(raw.viewingAppointment).split("T")[1] : "")
    : "—";
  const applied   = fmtDate(raw.appliedDate);

  // ── NOTES ──────────────────────────────────────────────────────
  const pros = str(raw.pros);
  const cons = str(raw.cons);

  return (
    <>
      {/* Dim overlay */}
      {visible && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
        />
      )}

      <Animated.View
        style={[
          styles.panel,
          {
            top: topOffset,
            left: PANEL_LEFT,
            right: 0,
            bottom: 0,
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: colors.primaryBlue, fontSize: 15, fontWeight: "700" }}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>{buildingName}</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── ADDRESS ────────────────────────────────────────── */}
          {mapsAddress ? (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsAddress)}`
                )
              }
            >
              <Text style={[styles.value, { marginBottom: 3, color: colors.primaryBlue }]}>
                {fullAddress}
              </Text>
            </Pressable>
          ) : (
            <Text style={[styles.value, { marginBottom: 3 }]}>{fullAddress}</Text>
          )}

          {!!unitLine && (
            <Text style={[styles.value, { marginBottom: 3 }]}>{unitLine}</Text>
          )}

          {/* Number of Floors — all types */}
          {!!numFloors && (
            <FieldRow label="Floors:" value={numFloors} />
          )}

          {/* Floor Number — apt/condo/coop only */}
          {isAptCondoCoop && !!floorNum && (
            <FieldRow label="Floor #:" value={floorNum} />
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
          <TwoCol
            left={["Base Rent", baseRent]}
            right={["Security Deposit", secDep]}
          />
          <TwoCol
            left={["Amenity Fee", amenity]}
            right={["Application Fee", appFee]}
          />
          <TwoCol
            left={["Admin Fee", adminFee]}
            right={["Total Startup", totalStartup, colors.primaryBlue]}
          />
          <TwoCol
            left={["Utility Fee", utilFee]}
            right={["Storage Rent", storageRent]}
          />
          {toggles.pets && (
            <TwoCol
              left={["Pet Fee", petFeeAmt]}
              right={["", ""]}
            />
          )}
          {toggles.car && (
            <TwoCol
              left={["Parking Fee", parkFee]}
              right={["", ""]}
            />
          )}
          <TwoCol
            left={["Other Fee", otherFee]}
            right={["", ""]}
          />
          <TwoCol
            left={["Broker Fee", brokerFee]}
            right={["Move-in Fee", moveInFee]}
          />

          {/* Total Monthly */}
          <View style={{ height: 1, backgroundColor: colors.border, marginTop: 4, marginBottom: 6 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "900" }}>
              Total Monthly
            </Text>
            <Text style={{ color: colors.primaryBlue, fontSize: 13, fontWeight: "900" }}>
              {totalMo}
            </Text>
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
              {!!commute && (
                <FieldRow label="Commute:" value={`${commute} min`} />
              )}
              {hasScores && (
                <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 4 }}>
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
              <SchoolRow rating={midRating} name={midName} grades={midGrades} distance={midDist} />
              <SchoolRow rating={highRating} name={highName} grades={highGrades} distance={highDist} />
            </>
          )}

          {/* ── LISTING ───────────────────────────────────────── */}
          <SectionHead title="Listing" />
          <FieldRow label="Site:" value={site} />

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
