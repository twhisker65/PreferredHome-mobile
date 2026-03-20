// app/(tabs)/add.tsx — Build 3.2.11B
// Changes from 3.2.09:
// - unitType renamed to propertyType throughout. Default changed to "Apartment".
// - acType renamed to coolingType throughout.
// - 11 new fields added: numberOfFloors, heatingType, shortTermAvailable,
//   rentersInsuranceRequired, petFee, storageRent, brokerFee, moveInFee,
//   privateOutdoorSpaceTypes, storageTypes, roomTypes.
// - Option arrays updated: PROPERTY_TYPES, COOLING_TYPES, HEATING_TYPES,
//   PARKING, UNIT_FEATURES, BUILDING_AMENITIES, PRIVATE_OUTDOOR_SPACE,
//   STORAGE_TYPES, ROOM_TYPES, UTILITIES, CLOSE_BY.
// - PROPERTY section: propertyType moved to position 2; numberOfFloors added
//   after floorNumber; shortTermAvailable and rentersInsuranceRequired added
//   after furnished; floorNumber/bedrooms/bathrooms/squareFootage changed to
//   decimal-pad.
// - COSTS section: visual Monthly / Upfront sub-labels added; petFee (pets
//   gated), storageRent, brokerFee, moveInFee added.
// - FEATURES section: coolingType replaces acType; heatingType, roomTypes,
//   privateOutdoorSpaceTypes, storageTypes added; laundry and parkingType
//   moved up per new section order.
// - handleSave payload updated with all new and renamed fields.
// All toggle gating, ZIP auto-fill, picker logic, and sub-components unchanged.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
import { Calendar } from "react-native-calendars";
import { postListing, lookupZip } from "../../lib/api";
import { loadProfileToggles, type ProfileToggles } from "../../lib/profileStorage";

type Draft = {
  status: string;
  preferred: boolean;
  buildingName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  unitNumber: string;
  floorNumber: string;
  numberOfFloors: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  topFloor: boolean;
  cornerUnit: boolean;
  propertyType: string;
  furnished: boolean;
  shortTermAvailable: boolean;
  rentersInsuranceRequired: boolean;
  baseRent: string;
  amenityFee: string;
  adminFee: string;
  utilityFee: string;
  parkingFee: string;
  otherFee: string;
  petFee: string;
  storageRent: string;
  securityDeposit: string;
  applicationFee: string;
  brokerFee: string;
  moveInFee: string;
  utilitiesIncluded: string[];
  unitFeatures: string[];
  buildingAmenities: string[];
  petAmenities: string[];
  closeBy: string[];
  coolingType: string;
  heatingType: string;
  laundry: string;
  parkingType: string;
  roomTypes: string[];
  privateOutdoorSpaceTypes: string[];
  storageTypes: string[];
  commuteTime: string;
  walkScore: string;
  transitScore: string;
  bikeScore: string;
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
  listingSite: string;
  listingUrl: string;
  photoUrl: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  leaseLength: string;
  noBoardApproval: boolean;
  noBrokerFee: boolean;
  dateAvailable: string;
  contactedDate: string;
  viewingDate: string;
  viewingTime: string;
  appliedDate: string;
  pros: string;
  cons: string;
};

const BLANK_DRAFT: Draft = {
  status: "New",
  preferred: false,
  buildingName: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  neighborhood: "",
  unitNumber: "",
  floorNumber: "",
  numberOfFloors: "",
  bedrooms: "",
  bathrooms: "",
  squareFootage: "",
  topFloor: false,
  cornerUnit: false,
  propertyType: "Apartment",
  furnished: false,
  shortTermAvailable: false,
  rentersInsuranceRequired: false,
  baseRent: "",
  amenityFee: "",
  adminFee: "",
  utilityFee: "",
  parkingFee: "",
  otherFee: "",
  petFee: "",
  storageRent: "",
  securityDeposit: "",
  applicationFee: "",
  brokerFee: "",
  moveInFee: "",
  utilitiesIncluded: [],
  unitFeatures: [],
  buildingAmenities: [],
  petAmenities: [],
  closeBy: [],
  coolingType: "None",
  heatingType: "None",
  laundry: "None",
  parkingType: "None",
  roomTypes: [],
  privateOutdoorSpaceTypes: [],
  storageTypes: [],
  commuteTime: "",
  walkScore: "",
  transitScore: "",
  bikeScore: "",
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
  listingSite: "",
  listingUrl: "",
  photoUrl: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  leaseLength: "",
  noBoardApproval: false,
  noBrokerFee: false,
  dateAvailable: "",
  contactedDate: "",
  viewingDate: "",
  viewingTime: "11:00 AM",
  appliedDate: "",
  pros: "",
  cons: "",
};

const STATUS = ["New", "Contacted", "Scheduled", "Viewed", "Shortlisted", "Applied", "Approved", "Signed", "Rejected", "Archived"];
const PROPERTY_TYPES = ["Apartment", "Condo", "Co-op", "Townhouse", "House", "Other"];
const COOLING_TYPES = ["Central Air", "Wall Unit", "Window Unit", "None"];
const HEATING_TYPES = ["Forced Air", "Baseboard", "Radiant", "Steam", "Electric", "Natural Gas", "Oil", "Propane", "None"];
const LAUNDRY = ["None", "In-Unit", "On Floor", "In Building"];
const PARKING = ["Shared Garage", "Shared Lot", "Covered Space", "Attached Garage", "Detached Garage", "Driveway", "Carport", "Street", "None", "Other"];
const UTILITIES = ["Electric", "Gas", "Heat", "Hot Water", "Water", "Sewer", "Trash", "Internet", "Cable", "Parking", "Lawn Care", "Snow Removal", "Pool Maintenance"];
const UNIT_FEATURES = ["Hardwood Floors", "Dishwasher", "Microwave", "Fireplace", "Views", "Large Windows"];
const BUILDING_AMENITIES = ["Rooftop Space", "Common Lounge", "Barbecue Area", "Firepits", "Gym", "Pool", "Doorman", "Elevator", "Game Room", "Theater Room", "Playground", "Tennis Court"];
const PET_AMENITIES = ["Pet Washing", "Dog Park"];
const PRIVATE_OUTDOOR_SPACE = ["Balcony", "Patio", "Deck", "Porch", "Private Yard", "Fenced Yard", "Other"];
const STORAGE_TYPES = ["Closet", "Walk-in Closet", "Basement", "Attic", "Garage", "Shed", "Locker", "Pantry", "Outdoor Storage", "Bike Storage", "Other"];
const ROOM_TYPES = ["Living Room", "Dining Room", "Kitchen", "Eat-in Kitchen", "Foyer", "Den", "Family Room", "TV Room", "Office", "Library", "Sunroom", "Mudroom", "Laundry Room", "Finished Basement", "Bonus Room", "Playroom", "Other"];
const CLOSE_BY = ["Subway", "Bus Stop", "Grocery Store", "Park", "Restaurants", "Pharmacy", "Coffee Shop", "Gym", "School", "Hospital", "Library", "Dog Park", "Farmer's Market", "Shopping Mall", "Highway Access"];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

// 8 sections — no "unit" section
type SectionKey = "property" | "costs" | "features" | "transportation" | "schools" | "listing" | "timeline" | "notes";

function todayYYYYMMDD() {
  return new Date().toISOString().slice(0, 10);
}

function clampRating(v: string) {
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return String(Math.min(n, 10));
}

function boolStr(v: boolean): string {
  return v ? "TRUE" : "FALSE";
}

// ── Sub-components ────────────────────────────────────────────────

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Pressable onPress={onToggle} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 }}>
        <Text style={headingLabel}>{title.toUpperCase()}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
      </Pressable>
      {open ? <View style={{ gap: 10 }}>{children}</View> : null}
    </View>
  );
}

function Field({ label, fieldKey, value, onChangeText, inputRefs, onNext, keyboardType, placeholder, multiline }: {
  label: string; fieldKey: string; value: string; onChangeText: (t: string) => void;
  inputRefs: React.MutableRefObject<Record<string, any>>; onNext: (k: string) => void;
  keyboardType?: any; placeholder?: string; multiline?: boolean;
}) {
  return (
    <View>
      <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>{label}</Text>
      <TextInput
        ref={(r) => { if (r) inputRefs.current[fieldKey] = r; }}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onNext(fieldKey)}
        returnKeyType="next"
        keyboardType={keyboardType ?? "default"}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        style={{
          backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border,
          borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
          color: colors.textPrimary, fontSize: 14,
          minHeight: multiline ? 72 : undefined, textAlignVertical: multiline ? "top" : undefined,
        }}
      />
    </View>
  );
}

function Toggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 }}>
      <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.primaryBlue }} thumbColor={colors.textPrimary} />
    </View>
  );
}

function SelectRow({ label, value, onPress, emptyLabel }: { label: string; value: string; onPress: () => void; emptyLabel?: string }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: pressed ? colors.cardHover : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10 })}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 14, fontWeight: value ? "700" : "400" }}>{value || emptyLabel || "Select"}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function MultiRow({ label, values, onPress }: { label: string; values: string[]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: pressed ? colors.cardHover : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10 })}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1, justifyContent: "flex-end" }}>
        <Text style={{ color: values.length ? colors.textPrimary : colors.textSecondary, fontSize: 13, fontWeight: values.length ? "700" : "400", textAlign: "right", flexShrink: 1 }} numberOfLines={2}>
          {values.length ? values.join(", ") : "None selected"}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function DateRow({ label, value, onPress, onClear }: { label: string; value: string; onPress: () => void; onClear: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: pressed ? colors.cardHover : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10 })}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 14, fontWeight: value ? "700" : "400" }}>{value || "Select date"}</Text>
        {value ? (
          <Pressable onPress={onClear} hitSlop={8} style={{ padding: 6 }}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

function MultiPicker({ options, initial, onDone }: { options: string[]; initial: string[]; onDone: (vals: string[]) => void }) {
  const [selected, setSelected] = useState(new Set(initial));
  function toggle(opt: string) { setSelected((prev) => { const n = new Set(prev); n.has(opt) ? n.delete(opt) : n.add(opt); return n; }); }
  return (
    <View>
      <ScrollView style={{ maxHeight: 300 }}>
        {options.map((opt) => (
          <Pressable key={opt} onPress={() => toggle(opt)} style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" })}>
            <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{opt}</Text>
            {selected.has(opt) ? <Ionicons name="checkmark" size={18} color={colors.primaryBlue} /> : null}
          </Pressable>
        ))}
      </ScrollView>
      <Pressable onPress={() => onDone(Array.from(selected))} style={{ margin: 12, backgroundColor: colors.primaryBlue, borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "900" }}>Done</Text>
      </Pressable>
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft>({ ...BLANK_DRAFT });
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    property: true, costs: true, features: true,
    transportation: true, schools: true, listing: true, timeline: true, notes: true,
  });
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });

  const inputRefs = useRef<Record<string, any>>({});

  // Load profile toggles on every focus so they stay in sync with Profile panel changes
  useFocusEffect(
    useCallback(() => {
      loadProfileToggles().then(setToggles);
    }, [])
  );

  // ZIP auto-fill: when ZIP reaches 5 digits, look up city and state
  useEffect(() => {
    if (draft.zipCode.length === 5) {
      lookupZip(draft.zipCode).then(({ city, state }) => {
        if (city) setDraft((d) => ({ ...d, city, state }));
      });
    }
    if (draft.zipCode.length === 0) {
      setDraft((d) => ({ ...d, city: "", state: "" }));
    }
  }, [draft.zipCode]);

  const inputOrder = [
    "buildingName", "streetAddress", "zipCode", "neighborhood", "unitNumber",
    "floorNumber", "numberOfFloors", "bedrooms", "bathrooms", "squareFootage",
    "baseRent", "utilityFee", "amenityFee", "parkingFee", "storageRent", "petFee",
    "adminFee", "otherFee", "securityDeposit", "applicationFee", "brokerFee", "moveInFee",
    "commuteTime", "walkScore", "transitScore", "bikeScore",
    "elementarySchoolName", "elementaryGrades", "elementaryRating", "elementaryDistance",
    "middleSchoolName", "middleGrades", "middleRating", "middleDistance",
    "highSchoolName", "highGrades", "highRating", "highDistance",
    "listingSite", "listingUrl", "photoUrl", "contactName", "contactPhone", "contactEmail", "leaseLength",
    "pros", "cons",
  ];

  function focusNext(currentKey: string) {
    const i = inputOrder.indexOf(currentKey);
    if (i < 0) return;
    for (let j = i + 1; j < inputOrder.length; j++) {
      const ref = inputRefs.current[inputOrder[j]];
      if (ref && typeof (ref as any).focus === "function") { (ref as any).focus(); return; }
    }
  }

  const [picker, setPicker] = useState<{
    mode: "single" | "multi" | "date";
    title: string; options?: string[]; value?: string; values?: string[];
    onPickSingle?: (v: string) => void; onPickMulti?: (v: string[]) => void;
    onPickDate?: (yyyyMMdd: string) => void; initialDate?: string;
  } | null>(null);

  const [timePicker, setTimePicker] = useState<{ open: boolean; value: string; onPick: (v: string) => void }>({
    open: false, value: "11:00 AM", onPick: () => {},
  });

  const marked = useMemo(() => {
    if (!picker || picker.mode !== "date") return {};
    const d = picker.initialDate || todayYYYYMMDD();
    return { [d]: { selected: true, selectedColor: colors.primaryBlue } };
  }, [picker]);

  function toggleSection(k: SectionKey) { setOpen((o) => ({ ...o, [k]: !o[k] })); }
  function openSingle(title: string, options: string[], value: string, onPick: (v: string) => void) { setPicker({ mode: "single", title, options, value, onPickSingle: onPick }); }
  function openMulti(title: string, options: string[], values: string[], onPick: (v: string[]) => void) { setPicker({ mode: "multi", title, options, values, onPickMulti: onPick }); }
  function openDate(title: string, initialDate: string, onPick: (yyyyMMdd: string) => void) { setPicker({ mode: "date", title, initialDate, onPickDate: onPick }); }
  function openTime(current: string, onPick: (v: string) => void) {
    const initial = current && /^\d{1,2}:\d{2} (AM|PM)$/i.test(current) ? current : "11:00 AM";
    setTimePicker({ open: true, value: initial, onPick });
  }

  function buildViewingAppointment(): string {
    if (!draft.viewingDate) return "";
    const timePart = draft.viewingTime || "12:00 PM";
    const match = timePart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return `${draft.viewingDate} 12:00:00`;
    let h = parseInt(match[1], 10);
    const min = match[2];
    const period = match[3].toUpperCase();
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${draft.viewingDate} ${String(h).padStart(2, "0")}:${min}:00`;
  }

  async function handleSave() {
    if (!draft.buildingName.trim()) {
      Alert.alert("Required", "Building Name is required before saving.");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        status: draft.status,
        preferred: boolStr(draft.preferred),
        buildingName: draft.buildingName,
        streetAddress: draft.streetAddress,
        city: draft.city,
        state: draft.state,
        zipCode: draft.zipCode,
        neighborhood: draft.neighborhood,
        unitNumber: draft.unitNumber,
        floorNumber: draft.floorNumber ? Number(draft.floorNumber) : null,
        numberOfFloors: draft.numberOfFloors ? Number(draft.numberOfFloors) : null,
        bedrooms: draft.bedrooms ? Number(draft.bedrooms) : null,
        bathrooms: draft.bathrooms ? Number(draft.bathrooms) : null,
        squareFootage: draft.squareFootage ? Number(draft.squareFootage) : null,
        topFloor: boolStr(draft.topFloor),
        cornerUnit: boolStr(draft.cornerUnit),
        propertyType: draft.propertyType,
        furnished: boolStr(draft.furnished),
        shortTermAvailable: boolStr(draft.shortTermAvailable),
        rentersInsuranceRequired: boolStr(draft.rentersInsuranceRequired),
        baseRent: draft.baseRent ? Number(draft.baseRent) : null,
        amenityFee: draft.amenityFee ? Number(draft.amenityFee) : null,
        adminFee: draft.adminFee ? Number(draft.adminFee) : null,
        utilityFee: draft.utilityFee ? Number(draft.utilityFee) : null,
        parkingFee: draft.parkingFee ? Number(draft.parkingFee) : null,
        otherFee: draft.otherFee ? Number(draft.otherFee) : null,
        petFee: draft.petFee ? Number(draft.petFee) : null,
        storageRent: draft.storageRent ? Number(draft.storageRent) : null,
        securityDeposit: draft.securityDeposit ? Number(draft.securityDeposit) : null,
        applicationFee: draft.applicationFee ? Number(draft.applicationFee) : null,
        brokerFee: draft.brokerFee ? Number(draft.brokerFee) : null,
        moveInFee: draft.moveInFee ? Number(draft.moveInFee) : null,
        utilitiesIncluded: draft.utilitiesIncluded.join(","),
        unitFeatures: draft.unitFeatures.join(","),
        buildingAmenities: draft.buildingAmenities.join(","),
        petAmenities: draft.petAmenities.join(","),
        closeBy: draft.closeBy.join(","),
        coolingType: draft.coolingType,
        heatingType: draft.heatingType,
        laundry: draft.laundry,
        parkingType: draft.parkingType,
        roomTypes: draft.roomTypes.join(","),
        privateOutdoorSpaceTypes: draft.privateOutdoorSpaceTypes.join(","),
        storageTypes: draft.storageTypes.join(","),
        commuteTime: draft.commuteTime ? Number(draft.commuteTime) : null,
        walkScore: draft.walkScore ? Number(draft.walkScore) : null,
        transitScore: draft.transitScore ? Number(draft.transitScore) : null,
        bikeScore: draft.bikeScore ? Number(draft.bikeScore) : null,
        elementarySchoolName: draft.elementarySchoolName,
        elementaryRating: draft.elementaryRating ? Math.min(Number(draft.elementaryRating), 10) : null,
        elementaryGrades: draft.elementaryGrades,
        elementaryDistance: draft.elementaryDistance ? Number(draft.elementaryDistance) : null,
        middleSchoolName: draft.middleSchoolName,
        middleRating: draft.middleRating ? Math.min(Number(draft.middleRating), 10) : null,
        middleGrades: draft.middleGrades,
        middleDistance: draft.middleDistance ? Number(draft.middleDistance) : null,
        highSchoolName: draft.highSchoolName,
        highRating: draft.highRating ? Math.min(Number(draft.highRating), 10) : null,
        highGrades: draft.highGrades,
        highDistance: draft.highDistance ? Number(draft.highDistance) : null,
        listingSite: draft.listingSite,
        listingUrl: draft.listingUrl,
        photoUrl: draft.photoUrl,
        contactName: draft.contactName,
        contactPhone: draft.contactPhone,
        contactEmail: draft.contactEmail,
        leaseLength: draft.leaseLength,
        noBoardApproval: boolStr(draft.noBoardApproval),
        noBrokerFee: boolStr(draft.noBrokerFee),
        dateAvailable: draft.dateAvailable || null,
        contactedDate: draft.contactedDate || null,
        viewingAppointment: buildViewingAppointment() || null,
        appliedDate: draft.appliedDate || null,
        pros: draft.pros,
        cons: draft.cons,
      };

      await postListing(payload);
      setDraft({ ...BLANK_DRAFT });
      Alert.alert("Saved", "Listing added successfully.", [
        { text: "OK", onPress: () => router.push("/(tabs)/listings") },
      ]);
    } catch (err: any) {
      Alert.alert("Save Failed", err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 }}>

          {/* ── PROPERTY ── */}
          <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
            <SelectRow label="Status" value={draft.status} onPress={() => openSingle("Status", STATUS, draft.status, (v) => setDraft((d) => ({ ...d, status: v })))} />
            <SelectRow label="Property Type" value={draft.propertyType} onPress={() => openSingle("Property Type", PROPERTY_TYPES, draft.propertyType, (v) => setDraft((d) => ({ ...d, propertyType: v })))} />
            <Toggle label="Preferred" value={draft.preferred} onValueChange={(v) => setDraft((d) => ({ ...d, preferred: v }))} />
            <Field label="Building Name" fieldKey="buildingName" inputRefs={inputRefs} onNext={focusNext} value={draft.buildingName} onChangeText={(t) => setDraft((d) => ({ ...d, buildingName: t }))} />
            <Field label="Street Address" fieldKey="streetAddress" inputRefs={inputRefs} onNext={focusNext} value={draft.streetAddress} onChangeText={(t) => setDraft((d) => ({ ...d, streetAddress: t }))} placeholder="Street only" />
            <Field label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={(t) => setDraft((d) => ({ ...d, zipCode: t }))} keyboardType="number-pad" />
            {(draft.city || draft.state) ? (
              <View style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 2 }}>City / State (from ZIP)</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>{draft.city}{draft.city && draft.state ? ", " : ""}{draft.state}</Text>
              </View>
            ) : null}
            <Field label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={(t) => setDraft((d) => ({ ...d, neighborhood: t }))} />
            <Field label="Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={(t) => setDraft((d) => ({ ...d, unitNumber: t }))} />
            <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={(t) => setDraft((d) => ({ ...d, floorNumber: t }))} keyboardType="decimal-pad" />
            <Field label="Number of Floors" fieldKey="numberOfFloors" inputRefs={inputRefs} onNext={focusNext} value={draft.numberOfFloors} onChangeText={(t) => setDraft((d) => ({ ...d, numberOfFloors: t }))} keyboardType="decimal-pad" />
            <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bedrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bathrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={(t) => setDraft((d) => ({ ...d, squareFootage: t }))} keyboardType="decimal-pad" />
            <Toggle label="Top Floor" value={draft.topFloor} onValueChange={(v) => setDraft((d) => ({ ...d, topFloor: v }))} />
            <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={(v) => setDraft((d) => ({ ...d, cornerUnit: v }))} />
            <Toggle label="Furnished" value={draft.furnished} onValueChange={(v) => setDraft((d) => ({ ...d, furnished: v }))} />
            <Toggle label="Short Term Available" value={draft.shortTermAvailable} onValueChange={(v) => setDraft((d) => ({ ...d, shortTermAvailable: v }))} />
            <Toggle label="Renters Insurance Required" value={draft.rentersInsuranceRequired} onValueChange={(v) => setDraft((d) => ({ ...d, rentersInsuranceRequired: v }))} />
          </Section>

          {/* ── COSTS ── */}
          <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 }}>MONTHLY</Text>
            <Field label="Base Rent" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={(t) => setDraft((d) => ({ ...d, baseRent: t }))} keyboardType="number-pad" />
            <Field label="Utility Fee" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={(t) => setDraft((d) => ({ ...d, utilityFee: t }))} keyboardType="number-pad" />
            <Field label="Amenity Fee" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={(t) => setDraft((d) => ({ ...d, amenityFee: t }))} keyboardType="number-pad" />
            {toggles.car && (
              <Field label="Parking Fee" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={(t) => setDraft((d) => ({ ...d, parkingFee: t }))} keyboardType="number-pad" />
            )}
            <Field label="Storage Rent" fieldKey="storageRent" inputRefs={inputRefs} onNext={focusNext} value={draft.storageRent} onChangeText={(t) => setDraft((d) => ({ ...d, storageRent: t }))} keyboardType="number-pad" />
            {toggles.pets && (
              <Field label="Pet Fee" fieldKey="petFee" inputRefs={inputRefs} onNext={focusNext} value={draft.petFee} onChangeText={(t) => setDraft((d) => ({ ...d, petFee: t }))} keyboardType="number-pad" />
            )}
            <Field label="Admin Fee" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={(t) => setDraft((d) => ({ ...d, adminFee: t }))} keyboardType="number-pad" />
            <Field label="Other Fee" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={(t) => setDraft((d) => ({ ...d, otherFee: t }))} keyboardType="number-pad" />
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>UPFRONT</Text>
            <Field label="Security Deposit" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={(t) => setDraft((d) => ({ ...d, securityDeposit: t }))} keyboardType="number-pad" />
            <Field label="Application Fee" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={(t) => setDraft((d) => ({ ...d, applicationFee: t }))} keyboardType="number-pad" />
            <Field label="Broker Fee" fieldKey="brokerFee" inputRefs={inputRefs} onNext={focusNext} value={draft.brokerFee} onChangeText={(t) => setDraft((d) => ({ ...d, brokerFee: t }))} keyboardType="number-pad" />
            <Field label="Move-in Fee" fieldKey="moveInFee" inputRefs={inputRefs} onNext={focusNext} value={draft.moveInFee} onChangeText={(t) => setDraft((d) => ({ ...d, moveInFee: t }))} keyboardType="number-pad" />
          </Section>

          {/* ── FEATURES ── */}
          <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
            <MultiRow label="Utilities Included" values={draft.utilitiesIncluded} onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, (v) => setDraft((d) => ({ ...d, utilitiesIncluded: v })))} />
            <MultiRow label="Unit Features" values={draft.unitFeatures} onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, (v) => setDraft((d) => ({ ...d, unitFeatures: v })))} />
            <SelectRow label="Cooling Type" value={draft.coolingType} onPress={() => openSingle("Cooling Type", COOLING_TYPES, draft.coolingType, (v) => setDraft((d) => ({ ...d, coolingType: v })))} />
            <SelectRow label="Heating Type" value={draft.heatingType} onPress={() => openSingle("Heating Type", HEATING_TYPES, draft.heatingType, (v) => setDraft((d) => ({ ...d, heatingType: v })))} />
            <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, (v) => setDraft((d) => ({ ...d, laundry: v })))} />
            <MultiRow label="Rooms" values={draft.roomTypes} onPress={() => openMulti("Rooms", ROOM_TYPES, draft.roomTypes, (v) => setDraft((d) => ({ ...d, roomTypes: v })))} />
            <MultiRow label="Private Outdoor Space" values={draft.privateOutdoorSpaceTypes} onPress={() => openMulti("Private Outdoor Space", PRIVATE_OUTDOOR_SPACE, draft.privateOutdoorSpaceTypes, (v) => setDraft((d) => ({ ...d, privateOutdoorSpaceTypes: v })))} />
            <MultiRow label="Storage" values={draft.storageTypes} onPress={() => openMulti("Storage", STORAGE_TYPES, draft.storageTypes, (v) => setDraft((d) => ({ ...d, storageTypes: v })))} />
            <MultiRow label="Building Amenities" values={draft.buildingAmenities} onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, (v) => setDraft((d) => ({ ...d, buildingAmenities: v })))} />
            {toggles.pets && (
              <MultiRow label="Pet Amenities" values={draft.petAmenities} onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, (v) => setDraft((d) => ({ ...d, petAmenities: v })))} />
            )}
            {toggles.car && (
              <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, (v) => setDraft((d) => ({ ...d, parkingType: v })))} />
            )}
            <MultiRow label="Close By" values={draft.closeBy} onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, (v) => setDraft((d) => ({ ...d, closeBy: v })))} />
          </Section>

          {/* ── TRANSPORTATION ── */}
          <Section title="Transportation" open={open.transportation} onToggle={() => toggleSection("transportation")}>
            <Field label="Commute Time (mins)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={(t) => setDraft((d) => ({ ...d, commuteTime: t }))} keyboardType="number-pad" />
            <Field label="Walk Score" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={(t) => setDraft((d) => ({ ...d, walkScore: t }))} keyboardType="number-pad" />
            <Field label="Transit Score" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={(t) => setDraft((d) => ({ ...d, transitScore: t }))} keyboardType="number-pad" />
            <Field label="Bike Score" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={(t) => setDraft((d) => ({ ...d, bikeScore: t }))} keyboardType="number-pad" />
          </Section>

          {/* ── SCHOOLS — shown only when Children toggle is ON ── */}
          {toggles.children && (
            <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Elementary</Text>
              <Field label="Name" fieldKey="elementarySchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.elementarySchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, elementarySchoolName: t }))} />
              <Field label="Grades" fieldKey="elementaryGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryGrades} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryGrades: t }))} placeholder="e.g. K–5" />
              <Field label="Rating (0–10)" fieldKey="elementaryRating" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryRating} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryRating: clampRating(t) }))} keyboardType="decimal-pad" />
              <Field label="Distance (miles)" fieldKey="elementaryDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryDistance} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryDistance: t }))} keyboardType="decimal-pad" />
              <Text style={{ color: colors.textPrimary, fontWeight: "900", marginTop: 8, marginBottom: 6 }}>Middle</Text>
              <Field label="Name" fieldKey="middleSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.middleSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, middleSchoolName: t }))} />
              <Field label="Grades" fieldKey="middleGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.middleGrades} onChangeText={(t) => setDraft((d) => ({ ...d, middleGrades: t }))} placeholder="e.g. 6–8" />
              <Field label="Rating (0–10)" fieldKey="middleRating" inputRefs={inputRefs} onNext={focusNext} value={draft.middleRating} onChangeText={(t) => setDraft((d) => ({ ...d, middleRating: clampRating(t) }))} keyboardType="decimal-pad" />
              <Field label="Distance (miles)" fieldKey="middleDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.middleDistance} onChangeText={(t) => setDraft((d) => ({ ...d, middleDistance: t }))} keyboardType="decimal-pad" />
              <Text style={{ color: colors.textPrimary, fontWeight: "900", marginTop: 8, marginBottom: 6 }}>High School</Text>
              <Field label="Name" fieldKey="highSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.highSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, highSchoolName: t }))} />
              <Field label="Grades" fieldKey="highGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.highGrades} onChangeText={(t) => setDraft((d) => ({ ...d, highGrades: t }))} placeholder="e.g. 9–12" />
              <Field label="Rating (0–10)" fieldKey="highRating" inputRefs={inputRefs} onNext={focusNext} value={draft.highRating} onChangeText={(t) => setDraft((d) => ({ ...d, highRating: clampRating(t) }))} keyboardType="decimal-pad" />
              <Field label="Distance (miles)" fieldKey="highDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.highDistance} onChangeText={(t) => setDraft((d) => ({ ...d, highDistance: t }))} keyboardType="decimal-pad" />
            </Section>
          )}

          {/* ── LISTING ── */}
          <Section title="Listing" open={open.listing} onToggle={() => toggleSection("listing")}>
            <Field label="Listing Site" fieldKey="listingSite" inputRefs={inputRefs} onNext={focusNext} value={draft.listingSite} onChangeText={(t) => setDraft((d) => ({ ...d, listingSite: t }))} placeholder="Streeteasy, Zillow, etc." />
            <Field label="Listing URL" fieldKey="listingUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.listingUrl} onChangeText={(t) => setDraft((d) => ({ ...d, listingUrl: t }))} placeholder="https://..." />
            <Field label="Photo URL" fieldKey="photoUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.photoUrl} onChangeText={(t) => setDraft((d) => ({ ...d, photoUrl: t }))} placeholder="https://..." />
            <Field label="Contact Name" fieldKey="contactName" inputRefs={inputRefs} onNext={focusNext} value={draft.contactName} onChangeText={(t) => setDraft((d) => ({ ...d, contactName: t }))} />
            <Field label="Contact Phone" fieldKey="contactPhone" inputRefs={inputRefs} onNext={focusNext} value={draft.contactPhone} onChangeText={(t) => setDraft((d) => ({ ...d, contactPhone: t }))} keyboardType="phone-pad" />
            <Field label="Contact Email" fieldKey="contactEmail" inputRefs={inputRefs} onNext={focusNext} value={draft.contactEmail} onChangeText={(t) => setDraft((d) => ({ ...d, contactEmail: t }))} keyboardType="email-address" />
            <Field label="Lease Length" fieldKey="leaseLength" inputRefs={inputRefs} onNext={focusNext} value={draft.leaseLength} onChangeText={(t) => setDraft((d) => ({ ...d, leaseLength: t }))} placeholder="e.g. 12 months" />
            <Toggle label="No Board Approval" value={draft.noBoardApproval} onValueChange={(v) => setDraft((d) => ({ ...d, noBoardApproval: v }))} />
            <Toggle label="No Broker Fee" value={draft.noBrokerFee} onValueChange={(v) => setDraft((d) => ({ ...d, noBrokerFee: v }))} />
          </Section>

          {/* ── TIMELINE ── */}
          <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
            <DateRow label="Date Available" value={draft.dateAvailable} onPress={() => openDate("Date Available", draft.dateAvailable || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, dateAvailable: v })))} onClear={() => setDraft((d) => ({ ...d, dateAvailable: "" }))} />
            <DateRow label="Contacted Date" value={draft.contactedDate} onPress={() => openDate("Contacted Date", draft.contactedDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, contactedDate: v })))} onClear={() => setDraft((d) => ({ ...d, contactedDate: "" }))} />
            <DateRow label="Viewing Date" value={draft.viewingDate} onPress={() => openDate("Viewing Date", draft.viewingDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, viewingDate: v })))} onClear={() => setDraft((d) => ({ ...d, viewingDate: "" }))} />
            <SelectRow label="Viewing Time" value={draft.viewingTime} emptyLabel="Select" onPress={() => openTime(draft.viewingTime, (v) => setDraft((d) => ({ ...d, viewingTime: v })))} />
            <DateRow label="Applied Date" value={draft.appliedDate} onPress={() => openDate("Applied Date", draft.appliedDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, appliedDate: v })))} onClear={() => setDraft((d) => ({ ...d, appliedDate: "" }))} />
          </Section>

          {/* ── NOTES ── */}
          <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
            <Field label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={(t) => setDraft((d) => ({ ...d, pros: t }))} multiline />
            <Field label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={(t) => setDraft((d) => ({ ...d, cons: t }))} multiline />
          </Section>

          <Pressable onPress={handleSave} disabled={saving}
            style={({ pressed }) => ({ marginTop: 6, borderRadius: 18, backgroundColor: colors.primaryBlue, paddingVertical: 14, alignItems: "center", opacity: pressed || saving ? 0.8 : 1, flexDirection: "row", justifyContent: "center", gap: 8 })}>
            {saving ? <ActivityIndicator size="small" color="#fff" /> : null}
            <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>{saving ? "Saving..." : "Save"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Picker Modal */}
      <Modal visible={!!picker} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setPicker(null)}>
          <Pressable style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 }} onPress={(e) => e.stopPropagation()}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>{picker?.title}</Text>
              <Pressable onPress={() => setPicker(null)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
            {picker?.mode === "single" && picker.options && (
              <ScrollView style={{ maxHeight: 300 }}>
                {picker.options.map((opt) => (
                  <Pressable key={opt} onPress={() => { picker.onPickSingle?.(opt); setPicker(null); }}
                    style={({ pressed }) => ({ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: pressed ? colors.cardHover : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" })}>
                    <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>{opt}</Text>
                    {picker.value === opt ? <Ionicons name="checkmark" size={18} color={colors.primaryBlue} /> : null}
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {picker?.mode === "multi" && picker.options && picker.values !== undefined && (
              <MultiPicker options={picker.options} initial={picker.values} onDone={(vals) => { picker.onPickMulti?.(vals); setPicker(null); }} />
            )}
            {picker?.mode === "date" && (
              <Calendar
                current={picker.initialDate || todayYYYYMMDD()}
                markedDates={marked}
                onDayPress={(day: any) => { picker.onPickDate?.(day.dateString); setPicker(null); }}
                theme={{ calendarBackground: colors.card, dayTextColor: colors.textPrimary, monthTextColor: colors.textPrimary, arrowColor: colors.primaryBlue, todayTextColor: colors.primaryBlue, selectedDayBackgroundColor: colors.primaryBlue, selectedDayTextColor: "#fff" }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={timePicker.open} transparent animationType="slide" onRequestClose={() => setTimePicker((t) => ({ ...t, open: false }))}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }} onPress={() => setTimePicker((t) => ({ ...t, open: false }))}>
          <Pressable style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 }} onPress={(e) => e.stopPropagation()}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>Viewing Time</Text>
              <Pressable onPress={() => setTimePicker((t) => ({ ...t, open: false }))}><Ionicons name="close" size={22} color={colors.textSecondary} /></Pressable>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, padding: 16 }}>
              {HOURS.map((h) => MINUTES.map((m) => PERIODS.map((p) => {
                const val = `${h}:${m} ${p}`;
                const active = timePicker.value === val;
                return (
                  <Pressable key={val} onPress={() => { timePicker.onPick(val); setTimePicker((t) => ({ ...t, open: false, value: val })); }}
                    style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: active ? colors.primaryBlue : colors.cardHover, margin: 3 }}>
                    <Text style={{ color: active ? "#fff" : colors.textPrimary, fontWeight: active ? "900" : "400", fontSize: 13 }}>{val}</Text>
                  </Pressable>
                );
              })))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Menu dropdown */}
      {menuOpen && (
        <MenuPanel
          topOffset={topBarHeight}
          onSelectPanel={(p) => { setMenuOpen(false); setActiveSubPanel(p); }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* Sub-panels */}
      {activeSubPanel === "profile" && (
        <ProfilePanel topOffset={topBarHeight} onClose={() => { setActiveSubPanel(null); loadProfileToggles().then(setToggles); }} />
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
