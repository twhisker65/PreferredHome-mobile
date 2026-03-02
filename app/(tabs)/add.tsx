import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { CalendarList } from "react-native-calendars";

type Draft = {
  // Status & ID
  status: string;
  preferred: boolean;
  listingUrl: string;
  listingSite: string;

  // Location
  buildingName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  unitNumber: string;
  floorNumber: string;
  topFloor: boolean;
  cornerUnit: boolean;

  // Unit details
  unitType: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  furnished: boolean;
  leaseLength: string;
  dateAvailable: string; // YYYY-MM-DD
  acType: string;
  laundry: string;
  parkingType: string;

  // Costs
  baseRent: string;
  parkingFee: string;
  amenityFee: string;
  adminFee: string;
  utilityFee: string;
  otherFee: string;
  securityDeposit: string;
  applicationFee: string;

  // Transportation
  commuteTime: string;
  walkScore: string;
  transitScore: string;
  bikeScore: string;

  // Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  noBoardApproval: boolean;
  noBrokerFee: boolean;

  // Timeline
  contactedDate: string; // YYYY-MM-DD
  viewingDate: string; // YYYY-MM-DD
  viewingTime: string; // HH:MM
  appliedDate: string; // YYYY-MM-DD

  // Schools (children)
  elementarySchoolName: string;
  elementaryRating: string;
  elementaryGrades: string;
  elementaryDistance: string;
  middleSchoolName: string;
  middleRating: string;
  middleGrades: string;
  middleDistance: string;
  highSchoolName: string;
  highRating: string;
  highGrades: string;
  highDistance: string;

  // Multi-selects
  utilitiesIncluded: string[];
  unitFeatures: string[];
  buildingAmenities: string[];
  petAmenities: string[];
  closeBy: string[];

  // Notes
  pros: string;
  cons: string;
};

const STATUS = ["Available", "Inquired", "Visited", "Applied", "Rejected", "Unknown"];
const UNIT_TYPES = ["Condo", "Co-Op", "Rental"];
const AC_TYPES = ["Central", "Wall", "Window", "None"];
const LAUNDRY = ["In-Unit", "On Floor", "In Building", "None"];
const PARKING = ["Covered", "Uncovered", "None"];

// Multi-select options (open for now; controlled lists later)
const UTILITIES = ["Gas", "Electric", "Internet", "Water", "Sewage", "Trash", "Parking"];
const UNIT_FEATURES = ["Hardwood floors", "Air conditioning", "Dishwasher", "Microwave", "Balcony/Terrace"];
const BUILDING_AMENITIES = ["Extra storage", "Rooftop space", "Common lounge", "Barbecue area", "Firepits", "Gym", "Pool"];
const PET_AMENITIES = ["Pet washing", "Dog park"];
const CLOSE_BY = ["Subway", "Bus stop", "Grocery store", "Park", "Restaurants", "Pharmacy", "Coffee shop", "Gym", "School"];

function todayYYYYMMDD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type SectionKey = "property" | "costs" | "features" | "contact" | "timeline" | "schools" | "notes";

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 18, marginBottom: 12, overflow: "hidden" }}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 15 }}>{title}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
      </Pressable>

      {open ? <View style={{ padding: 14, gap: 10 }}>{children}</View> : null}
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "800", letterSpacing: 0.6 }}>{children}</Text>;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Label>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={"rgba(148,163,184,0.6)"}
        keyboardType={keyboardType}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 12 : 10,
          color: colors.textPrimary,
          backgroundColor: colors.card,
        }}
      />
    </View>
  );
}

function Toggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colors.card }}>
      <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function SelectRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: colors.card,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Label>{label}</Label>
      <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{value || "—"}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function MultiRow({
  label,
  values,
  onPress,
}: {
  label: string;
  values: string[];
  onPress: () => void;
}) {
  const text = values.length ? values.join(", ") : "—";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: colors.card,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Label>{label}</Label>
      <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: colors.textPrimary, fontWeight: "800", flex: 1 }} numberOfLines={2}>
          {text}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

export default function AddScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  // local gating (profile wiring staged)
  const [useChildren, setUseChildren] = useState(true);
  const [usePets, setUsePets] = useState(true);
  const [useCar, setUseCar] = useState(true);

  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    property: true,
    costs: true,
    features: false,
    contact: false,
    timeline: false,
    schools: false,
    notes: false,
  });

  const [draft, setDraft] = useState<Draft>(() => ({
    status: "Available",
    preferred: false,
    listingUrl: "",
    listingSite: "",

    buildingName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    neighborhood: "",
    unitNumber: "",
    floorNumber: "",
    topFloor: false,
    cornerUnit: false,

    unitType: "Rental",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    furnished: false,
    leaseLength: "",
    dateAvailable: todayYYYYMMDD(),
    acType: "None",
    laundry: "None",
    parkingType: "None",

    baseRent: "",
    parkingFee: "",
    amenityFee: "",
    adminFee: "",
    utilityFee: "",
    otherFee: "",
    securityDeposit: "",
    applicationFee: "",

    commuteTime: "",
    walkScore: "",
    transitScore: "",
    bikeScore: "",

    contactName: "",
    contactPhone: "",
    contactEmail: "",
    noBoardApproval: false,
    noBrokerFee: false,

    contactedDate: todayYYYYMMDD(),
    viewingDate: todayYYYYMMDD(),
    viewingTime: "11:00",
    appliedDate: todayYYYYMMDD(),

    elementarySchoolName: "",
    elementaryRating: "",
    elementaryGrades: "",
    elementaryDistance: "",
    middleSchoolName: "",
    middleRating: "",
    middleGrades: "",
    middleDistance: "",
    highSchoolName: "",
    highRating: "",
    highGrades: "",
    highDistance: "",

    utilitiesIncluded: [],
    unitFeatures: [],
    buildingAmenities: [],
    petAmenities: [],
    closeBy: [],

    pros: "",
    cons: "",
  }));

  // Picker modal state (single select / multi select / date)
  const [picker, setPicker] = useState<{
    mode: "single" | "multi" | "date";
    title: string;
    options?: string[];
    value?: string;
    values?: string[];
    onPickSingle?: (v: string) => void;
    onPickMulti?: (v: string[]) => void;
    onPickDate?: (yyyyMMdd: string) => void;
    initialDate?: string;
  } | null>(null);

  const marked = useMemo(() => {
    if (!picker || picker.mode !== "date") return {};
    const d = picker.initialDate || todayYYYYMMDD();
    return { [d]: { selected: true, selectedColor: colors.primaryBlue } };
  }, [picker]);

  function toggleSection(k: SectionKey) {
    setOpen((o) => ({ ...o, [k]: !o[k] }));
  }

  function openSingle(title: string, options: string[], value: string, onPick: (v: string) => void) {
    setPicker({ mode: "single", title, options, value, onPickSingle: onPick });
  }

  function openMulti(title: string, options: string[], values: string[], onPick: (v: string[]) => void) {
    setPicker({ mode: "multi", title, options, values, onPickMulti: onPick });
  }

  function openDate(title: string, initialDate: string, onPick: (yyyyMMdd: string) => void) {
    setPicker({ mode: "date", title, initialDate, onPickDate: onPick });
  }

  function saveDraft() {
    // Backend save is staged; UI-only in 3.1.06.
    // Keeping this action for your workflow.
    // eslint-disable-next-line no-alert
    alert("Saved (UI only). Backend write is staged for later builds.");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet onGoProfile={() => setMenuOpen(false)} onGoSettings={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
      </SidePanel>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28 }}>
        {/* Local gating switches (profile wiring staged) */}
        <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14, marginBottom: 12, backgroundColor: colors.card }}>
          <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 15, marginBottom: 10 }}>Profile Toggles</Text>
          <View style={{ gap: 10 }}>
            <Toggle label="Children" value={useChildren} onValueChange={setUseChildren} />
            <Toggle label="Pets" value={usePets} onValueChange={setUsePets} />
            <Toggle label="Car" value={useCar} onValueChange={setUseCar} />
          </View>
        </View>

        <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
          <SelectRow
            label="Status"
            value={draft.status}
            onPress={() =>
              openSingle("Status", STATUS, draft.status, (v) => setDraft((d) => ({ ...d, status: v })))
            }
          />

          <Toggle label="Preferred" value={draft.preferred} onValueChange={(v) => setDraft((d) => ({ ...d, preferred: v }))} />

          <Field label="Listing URL" value={draft.listingUrl} onChangeText={(t) => setDraft((d) => ({ ...d, listingUrl: t }))} placeholder="https://..." />
          <Field label="Listing Site" value={draft.listingSite} onChangeText={(t) => setDraft((d) => ({ ...d, listingSite: t }))} placeholder="Streeteasy, Zillow, etc." />

          <Field label="Building Name" value={draft.buildingName} onChangeText={(t) => setDraft((d) => ({ ...d, buildingName: t }))} />
          <Field label="Street Address" value={draft.streetAddress} onChangeText={(t) => setDraft((d) => ({ ...d, streetAddress: t }))} placeholder="Street only" />
          <Field label="City" value={draft.city} onChangeText={(t) => setDraft((d) => ({ ...d, city: t }))} />
          <Field label="State" value={draft.state} onChangeText={(t) => setDraft((d) => ({ ...d, state: t }))} />
          <Field label="Zip Code" value={draft.zipCode} onChangeText={(t) => setDraft((d) => ({ ...d, zipCode: t }))} keyboardType="number-pad" />

          {/* Not optional (must always be present in Add + View) */}
          <Field label="Neighborhood" value={draft.neighborhood} onChangeText={(t) => setDraft((d) => ({ ...d, neighborhood: t }))} />
          <Field label="Apartment / Unit #" value={draft.unitNumber} onChangeText={(t) => setDraft((d) => ({ ...d, unitNumber: t }))} />
          <Field label="Floor Number" value={draft.floorNumber} onChangeText={(t) => setDraft((d) => ({ ...d, floorNumber: t }))} keyboardType="number-pad" />
          <Toggle label="Top Floor" value={draft.topFloor} onValueChange={(v) => setDraft((d) => ({ ...d, topFloor: v }))} />
          <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={(v) => setDraft((d) => ({ ...d, cornerUnit: v }))} />

          <SelectRow
            label="Unit Type"
            value={draft.unitType}
            onPress={() => openSingle("Unit Type", UNIT_TYPES, draft.unitType, (v) => setDraft((d) => ({ ...d, unitType: v })))}
          />

          <Field label="Bedrooms" value={draft.bedrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bedrooms: t }))} keyboardType="decimal-pad" />
          <Field label="Bathrooms" value={draft.bathrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bathrooms: t }))} keyboardType="decimal-pad" />
          <Field label="Square Footage" value={draft.squareFootage} onChangeText={(t) => setDraft((d) => ({ ...d, squareFootage: t }))} keyboardType="number-pad" />

          <Toggle label="Furnished" value={draft.furnished} onValueChange={(v) => setDraft((d) => ({ ...d, furnished: v }))} />

          <Field label="Lease Length" value={draft.leaseLength} onChangeText={(t) => setDraft((d) => ({ ...d, leaseLength: t }))} placeholder="e.g. 12 months" />

          <SelectRow
            label="Date Available"
            value={draft.dateAvailable}
            onPress={() => openDate("Date Available", draft.dateAvailable, (v) => setDraft((d) => ({ ...d, dateAvailable: v })))}
          />

          <SelectRow label="AC Type" value={draft.acType} onPress={() => openSingle("AC Type", AC_TYPES, draft.acType, (v) => setDraft((d) => ({ ...d, acType: v })))} />
          <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, (v) => setDraft((d) => ({ ...d, laundry: v })))} />

          {useCar ? (
            <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, (v) => setDraft((d) => ({ ...d, parkingType: v })))} />
          ) : null}
        </Section>

        <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
          <Field label="Monthly Rent (Base Rent)" value={draft.baseRent} onChangeText={(t) => setDraft((d) => ({ ...d, baseRent: t }))} keyboardType="number-pad" />
          {useCar ? <Field label="Parking Fee" value={draft.parkingFee} onChangeText={(t) => setDraft((d) => ({ ...d, parkingFee: t }))} keyboardType="number-pad" /> : null}
          <Field label="Amenity Fee" value={draft.amenityFee} onChangeText={(t) => setDraft((d) => ({ ...d, amenityFee: t }))} keyboardType="number-pad" />
          <Field label="Admin Fee" value={draft.adminFee} onChangeText={(t) => setDraft((d) => ({ ...d, adminFee: t }))} keyboardType="number-pad" />
          <Field label="Utility Fee" value={draft.utilityFee} onChangeText={(t) => setDraft((d) => ({ ...d, utilityFee: t }))} keyboardType="number-pad" />
          <Field label="Other Fee" value={draft.otherFee} onChangeText={(t) => setDraft((d) => ({ ...d, otherFee: t }))} keyboardType="number-pad" />

          <Field label="Security Deposit" value={draft.securityDeposit} onChangeText={(t) => setDraft((d) => ({ ...d, securityDeposit: t }))} keyboardType="number-pad" />
          <Field label="Application Fee" value={draft.applicationFee} onChangeText={(t) => setDraft((d) => ({ ...d, applicationFee: t }))} keyboardType="number-pad" />
        </Section>

        <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
          <MultiRow
            label="Utilities Included"
            values={draft.utilitiesIncluded}
            onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, (v) => setDraft((d) => ({ ...d, utilitiesIncluded: v })))}
          />
          <MultiRow
            label="Unit Features"
            values={draft.unitFeatures}
            onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, (v) => setDraft((d) => ({ ...d, unitFeatures: v })))}
          />
          <MultiRow
            label="Building Amenities"
            values={draft.buildingAmenities}
            onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, (v) => setDraft((d) => ({ ...d, buildingAmenities: v })))}
          />
          {usePets ? (
            <MultiRow
              label="Pet Amenities"
              values={draft.petAmenities}
              onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, (v) => setDraft((d) => ({ ...d, petAmenities: v })))}
            />
          ) : null}
          <MultiRow
            label="Close By"
            values={draft.closeBy}
            onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, (v) => setDraft((d) => ({ ...d, closeBy: v })))}
          />
        </Section>

        <Section title="Contact + Transportation" open={open.contact} onToggle={() => toggleSection("contact")}>
          <Field label="Contact Name" value={draft.contactName} onChangeText={(t) => setDraft((d) => ({ ...d, contactName: t }))} />
          <Field label="Contact Phone" value={draft.contactPhone} onChangeText={(t) => setDraft((d) => ({ ...d, contactPhone: t }))} keyboardType="phone-pad" />
          <Field label="Contact Email" value={draft.contactEmail} onChangeText={(t) => setDraft((d) => ({ ...d, contactEmail: t }))} keyboardType="email-address" />

          <Toggle label="No Board Approval" value={draft.noBoardApproval} onValueChange={(v) => setDraft((d) => ({ ...d, noBoardApproval: v }))} />
          <Toggle label="No Broker Fee" value={draft.noBrokerFee} onValueChange={(v) => setDraft((d) => ({ ...d, noBrokerFee: v }))} />

          <Field label="Commute Time (mins)" value={draft.commuteTime} onChangeText={(t) => setDraft((d) => ({ ...d, commuteTime: t }))} keyboardType="number-pad" />
          <Field label="Walk Score" value={draft.walkScore} onChangeText={(t) => setDraft((d) => ({ ...d, walkScore: t }))} keyboardType="number-pad" />
          <Field label="Transit Score" value={draft.transitScore} onChangeText={(t) => setDraft((d) => ({ ...d, transitScore: t }))} keyboardType="number-pad" />
          <Field label="Bike Score" value={draft.bikeScore} onChangeText={(t) => setDraft((d) => ({ ...d, bikeScore: t }))} keyboardType="number-pad" />
        </Section>

        <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
          <SelectRow label="Contacted Date" value={draft.contactedDate} onPress={() => openDate("Contacted Date", draft.contactedDate, (v) => setDraft((d) => ({ ...d, contactedDate: v })))} />
          <SelectRow label="Viewing Date" value={draft.viewingDate} onPress={() => openDate("Viewing Date", draft.viewingDate, (v) => setDraft((d) => ({ ...d, viewingDate: v })))} />
          <Field label="Viewing Time (HH:MM)" value={draft.viewingTime} onChangeText={(t) => setDraft((d) => ({ ...d, viewingTime: t }))} placeholder="11:00" />
          <SelectRow label="Applied Date" value={draft.appliedDate} onPress={() => openDate("Applied Date", draft.appliedDate, (v) => setDraft((d) => ({ ...d, appliedDate: v })))} />
        </Section>

        {useChildren ? (
          <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Elementary</Text>
            <Field label="Name" value={draft.elementarySchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, elementarySchoolName: t }))} />
            <Field label="Rating" value={draft.elementaryRating} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryRating: t }))} keyboardType="number-pad" />
            <Field label="Grades" value={draft.elementaryGrades} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryGrades: t }))} />
            <Field label="Distance" value={draft.elementaryDistance} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryDistance: t }))} keyboardType="decimal-pad" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Middle</Text>
            <Field label="Name" value={draft.middleSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, middleSchoolName: t }))} />
            <Field label="Rating" value={draft.middleRating} onChangeText={(t) => setDraft((d) => ({ ...d, middleRating: t }))} keyboardType="number-pad" />
            <Field label="Grades" value={draft.middleGrades} onChangeText={(t) => setDraft((d) => ({ ...d, middleGrades: t }))} />
            <Field label="Distance" value={draft.middleDistance} onChangeText={(t) => setDraft((d) => ({ ...d, middleDistance: t }))} keyboardType="decimal-pad" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>High</Text>
            <Field label="Name" value={draft.highSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, highSchoolName: t }))} />
            <Field label="Rating" value={draft.highRating} onChangeText={(t) => setDraft((d) => ({ ...d, highRating: t }))} keyboardType="number-pad" />
            <Field label="Grades" value={draft.highGrades} onChangeText={(t) => setDraft((d) => ({ ...d, highGrades: t }))} />
            <Field label="Distance" value={draft.highDistance} onChangeText={(t) => setDraft((d) => ({ ...d, highDistance: t }))} keyboardType="decimal-pad" />
          </Section>
        ) : null}

        <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
          <Field label="Pros" value={draft.pros} onChangeText={(t) => setDraft((d) => ({ ...d, pros: t }))} multiline />
          <Field label="Cons" value={draft.cons} onChangeText={(t) => setDraft((d) => ({ ...d, cons: t }))} multiline />
        </Section>

        <Pressable
          onPress={saveDraft}
          style={({ pressed }) => ({
            marginTop: 6,
            borderRadius: 18,
            backgroundColor: colors.primaryBlue,
            paddingVertical: 14,
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>Save</Text>
        </Pressable>
      </ScrollView>

      {/* Picker Modal */}
      <Modal visible={!!picker} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", padding: 18, justifyContent: "center" }} onPress={() => setPicker(null)}>
          <Pressable
            onPress={() => {}}
            style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: "hidden" }}
          >
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>{picker?.title ?? ""}</Text>
              <Pressable onPress={() => setPicker(null)} hitSlop={10}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {picker?.mode === "single" ? (
              <ScrollView style={{ maxHeight: 360 }}>
                {(picker.options ?? []).map((opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      picker.onPickSingle?.(opt);
                      setPicker(null);
                    }}
                    style={({ pressed }) => ({
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                      backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    })}
                  >
                    <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{opt}</Text>
                    {picker.value === opt ? <Ionicons name="checkmark" size={18} color={colors.primaryBlue} /> : null}
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}

            {picker?.mode === "multi" ? (
              <MultiPicker
                options={picker.options ?? []}
                initial={picker.values ?? []}
                onDone={(vals) => {
                  picker.onPickMulti?.(vals);
                  setPicker(null);
                }}
              />
            ) : null}

            {picker?.mode === "date" ? (
              <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                <CalendarList
                  horizontal
                  pagingEnabled
                  markedDates={marked}
                  onDayPress={(day) => {
                    picker.onPickDate?.(day.dateString);
                    setPicker(null);
                  }}
                  theme={{
                    calendarBackground: colors.background,
                    monthTextColor: colors.textPrimary,
                    dayTextColor: colors.textPrimary,
                    textDisabledColor: colors.textSecondary,
                    arrowColor: colors.textPrimary,
                    todayTextColor: colors.accentBlue,
                    selectedDayBackgroundColor: colors.primaryBlue,
                    selectedDayTextColor: colors.textPrimary,
                    textDayFontWeight: "700",
                    textMonthFontWeight: "800",
                    textDayHeaderFontWeight: "800",
                  }}
                  style={{ height: 360 }}
                />
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function MultiPicker({
  options,
  initial,
  onDone,
}: {
  options: string[];
  initial: string[];
  onDone: (vals: string[]) => void;
}) {
  const [vals, setVals] = useState<string[]>(initial);

  function toggle(opt: string) {
    setVals((v) => {
      const next = new Set(v);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return Array.from(next);
    });
  }

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
      <ScrollView style={{ maxHeight: 320 }}>
        {options.map((opt) => {
          const checked = vals.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              style={({ pressed }) => ({
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{opt}</Text>
              {checked ? <Ionicons name="checkmark-circle" size={18} color={colors.primaryBlue} /> : <Ionicons name="ellipse-outline" size={18} color={colors.textSecondary} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={() => onDone(vals)}
        style={({ pressed }) => ({
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: colors.primaryBlue,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ color: colors.textPrimary, fontWeight: "900" }}>Done</Text>
      </Pressable>
    </View>
  );
}
