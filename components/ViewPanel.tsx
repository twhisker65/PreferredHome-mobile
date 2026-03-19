// components/ViewPanel.tsx — Build 3.2.10
// Changes from 3.2.09.1:
// - Added Linking to React Native imports.
// - Address: tapping opens Maps.
// - URL: tapping opens browser.
// - Phone: tapping opens dialer.
// - Email: tapping opens mail app.
// All other layout, fields, and animation logic unchanged.

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import type { ListingUI } from "../lib/types";
import { loadProfileToggles, type ProfileToggles } from "../lib/profileStorage";

// ── Panel geometry ────────────────────────────────────────────────
// Left edge of panel aligns with right edge of the listing card photo.
// Photo sits at: 16px screen padding + 6px card inner padding + 80px photo = 102px.
const PANEL_LEFT = 102;

type Props = {
  visible: boolean;
  listing: ListingUI | null;
  topOffset: number; // header bar bottom — panel starts here
  onClose: () => void;
};

// ── Field value helpers ───────────────────────────────────────────

function str(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function num(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function bool(v: any): boolean {
  if (v === true) return true;
  const s = str(v).toUpperCase();
  return s === "TRUE" || s === "YES";
}

function fmt$(v: any): string {
  const n = num(v);
  if (n === null) return "—";
  return "$" + Math.round(n).toLocaleString();
}

function fmtDate(v: any): string {
  const s = str(v);
  if (!s) return "—";
  // YYYY-MM-DD → Mar 20, 2025
  const parts = s.split("T")[0].split("-");
  if (parts.length !== 3) return s;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mo = parseInt(parts[1], 10) - 1;
  return `${months[mo]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
}

function fmtComma(v: any): string {
  const s = str(v);
  if (!s) return "—";
  return s.split(",").map(x => x.trim()).filter(Boolean).join(", ");
}

function fmtScore(v: any): number | null {
  const n = num(v);
  if (n === null) return null;
  return Math.round(n);
}

// ── Sub-components ────────────────────────────────────────────────

/** Section heading with rule beneath */
function SectionHead({ title }: { title: string }) {
  return (
    <View style={{ marginTop: 14, marginBottom: 6 }}>
      <Text style={headingLabel}>{title}</Text>
      <View style={{ height: 1, backgroundColor: colors.border, marginTop: 4 }} />
    </View>
  );
}

/** Bold label + regular value on one line */
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

/** Two FieldRows side by side in equal columns */
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

/** Comma-separated feature field: bold label, wrapping value */
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

/** Blue circle score badge with label below */
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
        <Text
          style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "900" }}
        >
          {score}
        </Text>
      </View>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 9,
          marginTop: 5,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/** School row: dark blue circle with rating, name bold, grades+distance */
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
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
    >
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
        <Text
          style={{ color: colors.textPrimary, fontSize: 12, fontWeight: "900" }}
        >
          {rating !== null ? String(rating) : "—"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 12,
            fontWeight: "700",
          }}
        >
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

/** Blue check if TRUE, em-dash if FALSE/missing */
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

  // Reload profile toggles every time the panel opens
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

  // ── Field values ─────────────────────────────────────────────────

  // PROPERTY
  const buildingName = str(raw.buildingName) || listing.buildingName;
  const street   = str(raw.streetAddress);
  const city     = str(raw.city);
  const stateVal = str(raw.state);
  const zip      = str(raw.zipCode);
  const unit     = str(raw.unitNumber);
  const addressParts = [street, [city, stateVal, zip].filter(Boolean).join(", "), unit].filter(Boolean);
  const fullAddress  = addressParts.join(", ") || "—";
  const unitType  = str(raw.unitType);
  const beds      = str(raw.bedrooms);
  const baths     = str(raw.bathrooms);
  const sqft      = str(raw.squareFootage);
  const hood      = str(raw.neighborhood);
  const unitLine  = [unitType, beds ? `${beds} bd` : null, baths ? `${baths} ba` : null, sqft ? `${sqft} sqft` : null, hood].filter(Boolean).join("  ·  ");
  const isPreferred = listing.preferred;
  const isTopFloor  = bool(raw.topFloor);
  const isCorner    = bool(raw.cornerUnit);
  const isFurnished = bool(raw.furnished);

  // COSTS
  const baseRent   = fmt$(raw.baseRent);
  const secDep     = fmt$(raw.securityDeposit);
  const amenity    = fmt$(raw.amenityFee);
  const appFee     = fmt$(raw.applicationFee);
  const adminFee   = fmt$(raw.adminFee);
  const secDepNum  = num(raw.securityDeposit) ?? 0;
  const appFeeNum  = num(raw.applicationFee) ?? 0;
  const totalStartup = "$" + Math.round(secDepNum + appFeeNum).toLocaleString();
  const utilFee    = fmt$(raw.utilityFee);
  const parkFee    = fmt$(raw.parkingFee);
  const otherFee   = fmt$(raw.otherFee);
  const totalMo    = fmt$(raw.totalMonthly);

  // FEATURES
  const utilities   = fmtComma(raw.utilitiesIncluded);
  const unitFeat    = fmtComma(raw.unitFeatures);
  const bldgAmen    = fmtComma(raw.buildingAmenities);
  const petAmen     = fmtComma(raw.petAmenities);
  const closeBy     = fmtComma(raw.closeBy);
  const acType      = str(raw.acType) || "—";
  const laundry     = str(raw.laundry) || "—";
  const parking     = str(raw.parkingType) || "—";

  // TRANSPORTATION
  const commute     = str(raw.commuteTime);
  const walkScore   = fmtScore(raw.walkScore);
  const transitScore = fmtScore(raw.transitScore);
  const bikeScore   = fmtScore(raw.bikeScore);
  const hasScores   = walkScore !== null || transitScore !== null || bikeScore !== null;

  // SCHOOLS
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

  // LISTING
  const site          = str(raw.listingSite) || "—";
  const url           = str(raw.listingUrl);
  const contact       = str(raw.contactName) || "—";
  const phone         = str(raw.contactPhone) || "—";
  const email         = str(raw.contactEmail) || "—";
  const lease         = str(raw.leaseLength) || "—";
  const noBrdApproval = bool(raw.noBoardApproval);
  const noBrkFee      = bool(raw.noBrokerFee);

  // TIMELINE
  const dateAvail = fmtDate(raw.dateAvailable);
  const contacted = fmtDate(raw.contactedDate);
  const viewing   = str(raw.viewingAppointment) ? fmtDate(raw.viewingAppointment) : "—";
  const applied   = fmtDate(raw.appliedDate);

  // NOTES
  const pros = str(raw.pros);
  const cons = str(raw.cons);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {/* Dim overlay on left — tap to close */}
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />

        {/* Sliding panel — anchored to right, starts below header */}
        <Animated.View
          style={{
            position: "absolute",
            top: topOffset,
            right: 0,
            bottom: 0,
            width: panelW,
            backgroundColor: colors.card,
            borderLeftWidth: 1,
            borderLeftColor: colors.border,
            transform: [{ translateX }],
          }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── PROPERTY ─────────────────────────────────────── */}
            <SectionHead title="Property" />

            {/* Building name — matches listing card large bold style */}
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 17,
                fontWeight: "900",
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {buildingName}
            </Text>

            {/* Address — tapping opens Maps */}
            {fullAddress !== "—" ? (
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
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
              <Text style={[styles.value, { marginBottom: 6 }]}>{unitLine}</Text>
            )}

            {/* Boolean badges */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              {/* Heart — shown if preferred */}
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
              <BoolBadge label="Top Floor" value={isTopFloor} />
              <BoolBadge label="Corner Unit" value={isCorner} />
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
              right={["", ""]}
            />
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

            {/* Total Monthly — rule above, label left, amount right-aligned */}
            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginTop: 4,
                marginBottom: 6,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                Total Monthly
              </Text>
              <Text
                style={{
                  color: colors.primaryBlue,
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                {totalMo}
              </Text>
            </View>

            {/* ── FEATURES ─────────────────────────────────────── */}
            <SectionHead title="Features" />
            <CommaField label="Utilities Included:" value={utilities} />
            <CommaField label="Unit Features:" value={unitFeat} />
            <CommaField label="Building Amenities:" value={bldgAmen} />
            {toggles.pets && (
              <CommaField label="Pet Amenities:" value={petAmen} />
            )}
            <CommaField label="Close By:" value={closeBy} />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 2,
                marginBottom: 4,
              }}
            >
              <Text style={styles.label}>AC Type: </Text>
              <Text style={[styles.value, { marginRight: 10 }]}>{acType}</Text>
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
            {!!commute && (
              <FieldRow label="Commute Time:" value={`${commute} minutes`} />
            )}
            {hasScores && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 4,
                }}
              >
                {walkScore !== null && (
                  <ScoreBadge score={walkScore} label="Walk Score" />
                )}
                {transitScore !== null && (
                  <ScoreBadge score={transitScore} label="Transit Score" />
                )}
                {bikeScore !== null && (
                  <ScoreBadge score={bikeScore} label="Bike Score" />
                )}
              </View>
            )}

            {/* ── SCHOOLS — shown only when Children toggle is ON ── */}
            {hasSchools && toggles.children && (
              <>
                <SectionHead title="Schools" />
                <SchoolRow
                  rating={elemRating}
                  name={elemName}
                  grades={elemGrades}
                  distance={elemDist}
                />
                <SchoolRow
                  rating={midRating}
                  name={midName}
                  grades={midGrades}
                  distance={midDist}
                />
                <SchoolRow
                  rating={highRating}
                  name={highName}
                  grades={highGrades}
                  distance={highDist}
                />
              </>
            )}

            {/* ── LISTING ───────────────────────────────────────── */}
            <SectionHead title="Listing" />
            <FieldRow label="Site:" value={site} />

            {/* URL — tapping opens browser */}
            {!!url && (
              <Pressable
                onPress={() => Linking.openURL(url)}
                style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 3 }}
              >
                <Text style={styles.label}>URL: </Text>
                <Text
                  style={[styles.value, { color: colors.primaryBlue }]}
                  numberOfLines={1}
                >
                  {url}
                </Text>
              </Pressable>
            )}

            <FieldRow label="Contact:" value={contact} />

            {/* Phone — tapping opens dialer */}
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

            {/* Email — tapping opens mail app */}
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
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              <BoolBadge label="No Board Approval" value={noBrdApproval} />
              <BoolBadge label="No Broker Fee" value={noBrkFee} />
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
                  <View>
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
      </View>
    </Modal>
  );
}

// ── Shared text styles ────────────────────────────────────────────
const styles = {
  label: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  value: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "400" as const,
  },
};
