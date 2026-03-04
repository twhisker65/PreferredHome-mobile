import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { router } from "expo-router";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { Calendar } from "react-native-calendars";
import { loadProfileToggles, type ProfileToggles } from "../../lib/profileStorage";

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


function buildTimeOptions() {
  const out: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 15, 30, 45]) {
      const period = h < 12 ? "AM" : "PM";
      const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const mm = String(m).padStart(2, "0");
      out.push(`${display}:${mm} ${period}`);
    }
  }
  return out;
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
        <Text style={headingLabel}>{title}</Text>
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
  fieldKey,
  inputRefs,
  onNext,
  scrollRef,
  fieldY,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  fieldKey?: string;
  inputRefs?: React.MutableRefObject<Record<string, TextInput | null>>;
  onNext?: (key: string) => void;
  scrollRef?: React.RefObject<ScrollView>;
  fieldY?: React.MutableRefObject<Record<string, number>>;
}) {
  return (
    <View
      style={{ gap: 6 }}
      onLayout={(e) => {
        if (fieldKey && fieldY) fieldY.current[fieldKey] = e.nativeEvent.layout.y;
      }}
    >
      <Label>{label}</Label>
      <TextInput
        ref={(r) => {
          if (fieldKey && inputRefs) inputRefs.current[fieldKey] = r;
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={"rgba(148,163,184,0.6)"}
        keyboardType={keyboardType}
        returnKeyType={multiline ? "default" : "next"}
        enterKeyHint={multiline ? "enter" : "next"}
        blurOnSubmit={!!multiline}
        onSubmitEditing={() => {
          if (!multiline && fieldKey && onNext) onNext(fieldKey);
        }}
        onFocus={() => {
          if (!fieldKey || !scrollRef || !fieldY) return;
          const y = fieldY.current[fieldKey];
          if (typeof y === "number") scrollRef.current?.scrollTo({ y: Math.max(y - 20, 0), animated: true });
        }}
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
  const active = !!value;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: active ? colors.primaryBlue : colors.border,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.card,
      }}
    >
      <Text style={{ color: active ? colors.primaryBlue : colors.textPrimary, fontWeight: "800" }}>{label}</Text>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.card }} // white track when YES
        thumbColor={active ? colors.primaryBlue : colors.textSecondary} // blue dot when YES
      />
    </View>
  );
}

function SelectRow({
  label,
  value,
  onPress,
  emptyLabel,
}: {
  label: string;
  value: string;
  onPress: () => void;
  emptyLabel?: string;
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
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontWeight: "800" }}>{value || emptyLabel || "—"}</Text>
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
  emptyLabel?: string;
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

  // Profile toggles live on the Profile page (hamburger menu).
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });

  useEffect(() => {
    (async () => {
      const t = await loadProfileToggles();
      setToggles(t);
    })();
  }, []);


  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    property: false,
    costs: false,
    features: false,
    contact: false,
    timeline: false,
    schools: false,
    notes: false,
  });
  // Keyboard "Next" behavior for text inputs (Enter advances to next field).
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const scrollRef = useRef<ScrollView>(null);
  const fieldY = useRef<Record<string, number>>({});

  const inputOrder: string[] = [
    // Property
    "buildingName",
    "streetAddress",
    "zipCode",
    "neighborhood",
    "unitNumber",
    "floorNumber",
    // Unit
    "bedrooms",
    "bathrooms",
    "squareFootage",
    "leaseLength",
    // Costs
    "baseRent",
    "parkingFee",
    "amenityFee",
    "adminFee",
    "utilityFee",
    "otherFee",
    "securityDeposit",
    "applicationFee",
    // Transportation
    "commuteTime",
    "walkScore",
    "transitScore",
    "bikeScore",
    // Contact
    "contactName",
    "contactPhone",
    "contactEmail",
    // Timeline
    "viewingTime",
    // Notes
    "pros",
    "cons",
  ];

  function focusNext(currentKey: string) {
    const i = inputOrder.indexOf(currentKey);
    if (i < 0) return;
    for (let j = i + 1; j < inputOrder.length; j++) {
      const nextKey = inputOrder[j];
      const ref = inputRefs.current[nextKey];
      if (ref && typeof (ref as any).focus === "function") {
        (ref as any).focus();
        return;
      }
    }
  }



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
    dateAvailable: "",
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

    contactedDate: "",
    viewingDate: "",
    viewingTime: "11:00 AM",
    appliedDate: "",

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

  const [timePicker, setTimePicker] = useState<{ open: boolean; value: string; onPick: (v: string) => void }>({
    open: false,
    value: "11:00 AM",
    onPick: () => {},
  });

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
  function openTime(current: string, onPick: (v: string) => void) {
    const initial = (current && /^\d{1,2}:\d{2} (AM|PM)$/i.test(current)) ? current : "11:00 AM";
    setTimePicker({ open: true, value: initial, onPick });
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
        <MenuSheet
          onGoProfile={() => {
            setMenuOpen(false);
            router.push("/profile");
          }}
          onGoSettings={() => {
            setMenuOpen(false);
            router.push("/settings");
          }}
          onClose={() => setMenuOpen(false)}
        />
      </SidePanel>

      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28 }}>

        <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
          <SelectRow
            label="Status"
            value={draft.status}
            onPress={() =>
              openSingle("Status", STATUS, draft.status, (v) => setDraft((d) => ({ ...d, status: v })))
            }
          />

          <Toggle label="Preferred" value={draft.preferred} onValueChange={(v) => setDraft((d) => ({ ...d, preferred: v }))} />

          <Field scrollRef={scrollRef} fieldY={fieldY} label="Listing URL" value={draft.listingUrl} onChangeText={(t) => setDraft((d) => ({ ...d, listingUrl: t }))} placeholder="https://..." />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Listing Site" value={draft.listingSite} onChangeText={(t) => setDraft((d) => ({ ...d, listingSite: t }))} placeholder="Streeteasy, Zillow, etc." />

          <Field scrollRef={scrollRef} fieldY={fieldY} label="Building Name" fieldKey="buildingName" inputRefs={inputRefs} onNext={focusNext} value={draft.buildingName} onChangeText={(t) => setDraft((d) => ({ ...d, buildingName: t }))} />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Street Address" fieldKey="streetAddress" inputRefs={inputRefs} onNext={focusNext} value={draft.streetAddress} onChangeText={(t) => setDraft((d) => ({ ...d, streetAddress: t }))} placeholder="Street only" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={(t) => setDraft((d) => ({ ...d, zipCode: t }))} keyboardType="number-pad" />

          {/* Not optional (must always be present in Add + View) */}
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={(t) => setDraft((d) => ({ ...d, neighborhood: t }))} />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Apartment / Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={(t) => setDraft((d) => ({ ...d, unitNumber: t }))} />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={(t) => setDraft((d) => ({ ...d, floorNumber: t }))} keyboardType="number-pad" />
          <Toggle label="Top Floor" value={draft.topFloor} onValueChange={(v) => setDraft((d) => ({ ...d, topFloor: v }))} />
          <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={(v) => setDraft((d) => ({ ...d, cornerUnit: v }))} />

          <SelectRow
            label="Unit Type"
            value={draft.unitType}
            onPress={() => openSingle("Unit Type", UNIT_TYPES, draft.unitType, (v) => setDraft((d) => ({ ...d, unitType: v })))}
          />

          <Field scrollRef={scrollRef} fieldY={fieldY} label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bedrooms: t }))} keyboardType="decimal-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bathrooms: t }))} keyboardType="decimal-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={(t) => setDraft((d) => ({ ...d, squareFootage: t }))} keyboardType="number-pad" />

          <Toggle label="Furnished" value={draft.furnished} onValueChange={(v) => setDraft((d) => ({ ...d, furnished: v }))} />

          <Field scrollRef={scrollRef} fieldY={fieldY} label="Lease Length" fieldKey="leaseLength" inputRefs={inputRefs} onNext={focusNext} value={draft.leaseLength} onChangeText={(t) => setDraft((d) => ({ ...d, leaseLength: t }))} placeholder="e.g. 12 months" />

          <SelectRow
            label="Date Available"
            value={draft.dateAvailable}
            onPress={() => openDate("Date Available", draft.dateAvailable || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, dateAvailable: v })))}
          />

          <SelectRow label="AC Type" value={draft.acType} onPress={() => openSingle("AC Type", AC_TYPES, draft.acType, (v) => setDraft((d) => ({ ...d, acType: v })))} />
          <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, (v) => setDraft((d) => ({ ...d, laundry: v })))} />

          {toggles.car ? (
            <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, (v) => setDraft((d) => ({ ...d, parkingType: v })))} />
          ) : null}
        </Section>

        <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Monthly Rent (Base Rent)" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={(t) => setDraft((d) => ({ ...d, baseRent: t }))} keyboardType="number-pad" />
          {toggles.car ? <Field scrollRef={scrollRef} fieldY={fieldY} label="Parking Fee" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={(t) => setDraft((d) => ({ ...d, parkingFee: t }))} keyboardType="number-pad" /> : null}
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Amenity Fee" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={(t) => setDraft((d) => ({ ...d, amenityFee: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Admin Fee" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={(t) => setDraft((d) => ({ ...d, adminFee: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Utility Fee" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={(t) => setDraft((d) => ({ ...d, utilityFee: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Other Fee" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={(t) => setDraft((d) => ({ ...d, otherFee: t }))} keyboardType="number-pad" />

          <Field scrollRef={scrollRef} fieldY={fieldY} label="Security Deposit" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={(t) => setDraft((d) => ({ ...d, securityDeposit: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Application Fee" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={(t) => setDraft((d) => ({ ...d, applicationFee: t }))} keyboardType="number-pad" />
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
          {toggles.pets ? (
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
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Contact Name" fieldKey="contactName" inputRefs={inputRefs} onNext={focusNext} value={draft.contactName} onChangeText={(t) => setDraft((d) => ({ ...d, contactName: t }))} />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Contact Phone" fieldKey="contactPhone" inputRefs={inputRefs} onNext={focusNext} value={draft.contactPhone} onChangeText={(t) => setDraft((d) => ({ ...d, contactPhone: t }))} keyboardType="phone-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Contact Email" fieldKey="contactEmail" inputRefs={inputRefs} onNext={focusNext} value={draft.contactEmail} onChangeText={(t) => setDraft((d) => ({ ...d, contactEmail: t }))} keyboardType="email-address" />

          <Toggle label="No Board Approval" value={draft.noBoardApproval} onValueChange={(v) => setDraft((d) => ({ ...d, noBoardApproval: v }))} />
          <Toggle label="No Broker Fee" value={draft.noBrokerFee} onValueChange={(v) => setDraft((d) => ({ ...d, noBrokerFee: v }))} />

          <Field scrollRef={scrollRef} fieldY={fieldY} label="Commute Time (mins)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={(t) => setDraft((d) => ({ ...d, commuteTime: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Walk Score" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={(t) => setDraft((d) => ({ ...d, walkScore: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Transit Score" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={(t) => setDraft((d) => ({ ...d, transitScore: t }))} keyboardType="number-pad" />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Bike Score" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={(t) => setDraft((d) => ({ ...d, bikeScore: t }))} keyboardType="number-pad" />
        </Section>

        <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
          <SelectRow label="Contacted Date" value={draft.contactedDate} emptyLabel="Select" onPress={() => openDate("Contacted Date", draft.contactedDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, contactedDate: v })))} />
          <SelectRow label="Viewing Date" value={draft.viewingDate} emptyLabel="Select" onPress={() => openDate("Viewing Date", draft.viewingDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, viewingDate: v })))} />
          <SelectRow label="Viewing Time" value={draft.viewingTime} emptyLabel="Select" onPress={() => openTime(draft.viewingTime, (v) => setDraft((d) => ({ ...d, viewingTime: v })))} />
          <SelectRow label="Applied Date" value={draft.appliedDate} emptyLabel="Select" onPress={() => openDate("Applied Date", draft.appliedDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, appliedDate: v })))} />
        </Section>

        {toggles.children ? (
          <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Elementary</Text>
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Name" value={draft.elementarySchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, elementarySchoolName: t }))} />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Rating" value={draft.elementaryRating} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryRating: t }))} keyboardType="number-pad" />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Grades" value={draft.elementaryGrades} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryGrades: t }))} />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Distance" value={draft.elementaryDistance} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryDistance: t }))} keyboardType="decimal-pad" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Middle</Text>
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Name" value={draft.middleSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, middleSchoolName: t }))} />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Rating" value={draft.middleRating} onChangeText={(t) => setDraft((d) => ({ ...d, middleRating: t }))} keyboardType="number-pad" />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Grades" value={draft.middleGrades} onChangeText={(t) => setDraft((d) => ({ ...d, middleGrades: t }))} />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Distance" value={draft.middleDistance} onChangeText={(t) => setDraft((d) => ({ ...d, middleDistance: t }))} keyboardType="decimal-pad" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>High</Text>
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Name" value={draft.highSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, highSchoolName: t }))} />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Rating" value={draft.highRating} onChangeText={(t) => setDraft((d) => ({ ...d, highRating: t }))} keyboardType="number-pad" />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Grades" value={draft.highGrades} onChangeText={(t) => setDraft((d) => ({ ...d, highGrades: t }))} />
            <Field scrollRef={scrollRef} fieldY={fieldY} label="Distance" value={draft.highDistance} onChangeText={(t) => setDraft((d) => ({ ...d, highDistance: t }))} keyboardType="decimal-pad" />
          </Section>
        ) : null}

        <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={(t) => setDraft((d) => ({ ...d, pros: t }))} multiline />
          <Field scrollRef={scrollRef} fieldY={fieldY} label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={(t) => setDraft((d) => ({ ...d, cons: t }))} multiline />
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
            style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: "hidden", alignSelf: "center", width: "100%", maxWidth: 420 }}
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
                <Calendar
                  current={picker.initialDate || todayYYYYMMDD()}
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
                />
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={timePicker.open} transparent animationType="fade" onRequestClose={() => setTimePicker((t) => ({ ...t, open: false }))}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", padding: 18, justifyContent: "center" }}
          onPress={() => setTimePicker((t) => ({ ...t, open: false }))}
        >
          <Pressable
            onPress={() => {}}
            style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: "hidden" }}
          >
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>Select Time</Text>
              <Pressable onPress={() => setTimePicker((t) => ({ ...t, open: false }))} hitSlop={10}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
              <ScrollView style={{ maxHeight: 320 }}>
                {buildTimeOptions().map((t) => {
                  const active = t === timePicker.value;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => {
                        const cb = timePicker.onPick;
                        setTimePicker((s) => ({ ...s, open: false, value: t }));
                        cb(t);
                      }}
                      style={({ pressed }) => ({
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        backgroundColor: active ? colors.cardHover : pressed ? colors.cardHover : colors.background,
                      })}
                    >
                      <Text style={{ color: active ? colors.primaryBlue : colors.textPrimary, fontWeight: "800" }}>{t}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
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
