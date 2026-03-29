// components/ListingForm.tsx — Build 3.2.16.1 Hotfix
// Shared form component used by both Add and Edit screens.
// All sub-components defined OUTSIDE the export function (DRIFT 10).
// Option arrays copied exactly from source — never rewritten from memory (DRIFT 13).

import React, { useEffect, useRef, useState } from "react";
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
import { Calendar } from "react-native-calendars";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import { lookupZip, detectListingSite } from "../lib/api";
import { type ProfileToggles } from "../lib/profileStorage";

// ── Draft type ─────────────────────────────────────────────────────

export type Draft = {
  status: string; preferred: boolean; buildingName: string; streetAddress: string;
  city: string; state: string; zipCode: string; neighborhood: string; unitNumber: string;
  floorNumber: string; numberOfFloors: string; bedrooms: string; bathrooms: string;
  squareFootage: string; topFloor: boolean; cornerUnit: boolean; propertyType: string;
  furnished: boolean; shortTermAvailable: boolean; rentersInsuranceRequired: boolean;
  baseRent: string; amenityFee: string; adminFee: string; utilityFee: string;
  parkingFee: string; otherFee: string; petFee: string; storageRent: string;
  securityDeposit: string; applicationFee: string; brokerFee: string; moveInFee: string;
  utilitiesIncluded: string[]; unitFeatures: string[]; buildingAmenities: string[];
  petAmenities: string[]; closeBy: string[]; coolingType: string; heatingType: string;
  laundry: string; parkingType: string; roomTypes: string[]; privateOutdoorSpaceTypes: string[];
  storageTypes: string[]; commuteTime: string; walkScore: string; transitScore: string;
  bikeScore: string; elementarySchoolName: string; elementaryGrades: string;
  elementaryRating: string; elementaryDistance: string; middleSchoolName: string;
  middleGrades: string; middleRating: string; middleDistance: string; highSchoolName: string;
  highGrades: string; highRating: string; highDistance: string; listingSite: string;
  listingUrl: string; photoUrl: string; contactName: string; contactPhone: string;
  contactEmail: string; leaseLength: string; noBoardApproval: boolean; noBrokerFee: boolean;
  dateAvailable: string; contactedDate: string; viewingDate: string; viewingTime: string;
  appliedDate: string; pros: string; cons: string;
};

// ── Blank draft ────────────────────────────────────────────────────

export const BLANK_DRAFT: Draft = {
  status: "New", preferred: false, buildingName: "", streetAddress: "",
  city: "", state: "", zipCode: "", neighborhood: "", unitNumber: "",
  floorNumber: "", numberOfFloors: "", bedrooms: "", bathrooms: "",
  squareFootage: "", topFloor: false, cornerUnit: false,
  propertyType: "Apartment", furnished: false, shortTermAvailable: false,
  rentersInsuranceRequired: false, baseRent: "", amenityFee: "", adminFee: "",
  utilityFee: "", parkingFee: "", otherFee: "", petFee: "", storageRent: "",
  securityDeposit: "", applicationFee: "", brokerFee: "", moveInFee: "",
  utilitiesIncluded: [], unitFeatures: [], buildingAmenities: [],
  petAmenities: [], closeBy: [], coolingType: "", heatingType: "",
  laundry: "", parkingType: "", roomTypes: [], privateOutdoorSpaceTypes: [],
  storageTypes: [], commuteTime: "", walkScore: "", transitScore: "",
  bikeScore: "", elementarySchoolName: "", elementaryGrades: "",
  elementaryRating: "", elementaryDistance: "", middleSchoolName: "",
  middleGrades: "", middleRating: "", middleDistance: "", highSchoolName: "",
  highGrades: "", highRating: "", highDistance: "", listingSite: "Other",
  listingUrl: "", photoUrl: "", contactName: "", contactPhone: "",
  contactEmail: "", leaseLength: "", noBoardApproval: false, noBrokerFee: false,
  dateAvailable: "", contactedDate: "", viewingDate: "", viewingTime: "11:00 AM",
  appliedDate: "", pros: "", cons: "",
};

// ── Option arrays — copied exactly from source (DRIFT 13) ──────────

const STATUS = ["New", "Contacted", "Scheduled", "Viewed", "Shortlisted", "Applied", "Approved", "Signed", "Rejected", "Archived"];
const PROPERTY_TYPES = ["Apartment", "Condo", "Co-op", "Townhouse", "House"];
const COOLING_TYPES = ["Central Air", "Wall Unit", "Window Unit", "None"];
const HEATING_TYPES = ["Forced Air", "Baseboard", "Radiant", "Steam", "Electric", "Natural Gas", "Oil", "Propane", "None"];
const LAUNDRY = ["None", "In-Unit", "On Floor", "In Building"];
const PARKING = ["Shared Garage", "Shared Lot", "Covered Space", "Attached Garage", "Detached Garage", "Driveway", "Carport", "Street", "None", "Other"];
const ROOM_TYPES = ["Living Room", "Dining Room", "Kitchen", "Eat-in Kitchen", "Foyer", "Den", "Family Room", "TV Room", "Office", "Library", "Sunroom", "Mudroom", "Laundry Room", "Finished Basement", "Bonus Room", "Playroom", "Other"];
const BUILDING_AMENITIES = ["Rooftop Space", "Common Lounge", "Barbecue Area", "Firepits", "Gym", "Pool", "Doorman", "Elevator", "Game Room", "Theater Room", "Playground", "Tennis Court"];
const PRIVATE_OUTDOOR_SPACE = ["Balcony", "Patio", "Deck", "Porch", "Private Yard", "Fenced Yard", "Other"];
const PET_AMENITIES = ["Pet Washing", "Dog Park"];
const CLOSE_BY = ["Subway", "Bus Stop", "Grocery Store", "Park", "Restaurants", "Pharmacy", "Coffee Shop", "Gym", "School", "Hospital", "Library", "Dog Park", "Farmer's Market", "Shopping Mall", "Highway Access"];
const STORAGE_TYPES = ["Closet", "Walk-in Closet", "Basement", "Attic", "Garage", "Shed", "Locker", "Pantry", "Outdoor Storage", "Bike Storage", "Other"];
const UNIT_FEATURES = ["Hardwood Floors", "Dishwasher", "Microwave", "Fireplace", "Views", "Large Windows"];
const UTILITIES = ["Water", "Sewer", "Trash", "Internet", "Cable", "Parking", "Lawn Care", "Snow Removal", "Pool Maintenance"];
const LISTING_SITES = ["Zillow", "Realtor.com", "Redfin", "Homes.com", "Apartments.com", "StreetEasy", "HotPads", "Trulia", "Rent.com", "Apartment Finder", "Rentals.com", "MLS / Broker", "Other"];
const TIME_OPTIONS = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM",
];

// ── Utility functions ──────────────────────────────────────────────

export function boolStr(v: boolean): string { return v ? "TRUE" : "FALSE"; }
function boolVal(v: unknown): boolean { if (typeof v === "boolean") return v; const s = String(v ?? "").trim().toUpperCase(); return s === "TRUE" || s === "1" || s === "YES"; }
function str(v: unknown): string { if (v === null || v === undefined) return ""; return String(v); }
function numStr(v: unknown): string { if (v === null || v === undefined || v === "") return ""; const n = Number(v); return isNaN(n) ? "" : String(n); }
function multiVal(v: unknown): string[] { if (!v || v === "") return []; if (Array.isArray(v)) return v.map(String).filter(Boolean); return String(v).split(",").map((s) => s.trim()).filter(Boolean); }
function clampRating(v: string): string { const n = parseFloat(v); if (isNaN(n)) return v; return String(Math.min(n, 10)); }

export function rawToDraft(raw: any): Draft {
  return {
    status: str(raw?.status) || "New", preferred: boolVal(raw?.preferred),
    buildingName: str(raw?.buildingName), streetAddress: str(raw?.streetAddress),
    city: str(raw?.city), state: str(raw?.state), zipCode: str(raw?.zipCode),
    neighborhood: str(raw?.neighborhood), unitNumber: str(raw?.unitNumber),
    floorNumber: numStr(raw?.floorNumber), numberOfFloors: numStr(raw?.numberOfFloors),
    bedrooms: numStr(raw?.bedrooms), bathrooms: numStr(raw?.bathrooms),
    squareFootage: numStr(raw?.squareFootage), topFloor: boolVal(raw?.topFloor),
    cornerUnit: boolVal(raw?.cornerUnit), propertyType: str(raw?.propertyType) || "Apartment",
    furnished: boolVal(raw?.furnished), shortTermAvailable: boolVal(raw?.shortTermAvailable),
    rentersInsuranceRequired: boolVal(raw?.rentersInsuranceRequired),
    baseRent: numStr(raw?.baseRent), amenityFee: numStr(raw?.amenityFee),
    adminFee: numStr(raw?.adminFee), utilityFee: numStr(raw?.utilityFee),
    parkingFee: numStr(raw?.parkingFee), otherFee: numStr(raw?.otherFee),
    petFee: numStr(raw?.petFee), storageRent: numStr(raw?.storageRent),
    securityDeposit: numStr(raw?.securityDeposit), applicationFee: numStr(raw?.applicationFee),
    brokerFee: numStr(raw?.brokerFee), moveInFee: numStr(raw?.moveInFee),
    utilitiesIncluded: multiVal(raw?.utilitiesIncluded), unitFeatures: multiVal(raw?.unitFeatures),
    buildingAmenities: multiVal(raw?.buildingAmenities), petAmenities: multiVal(raw?.petAmenities),
    closeBy: multiVal(raw?.closeBy), coolingType: str(raw?.coolingType) || "None",
    heatingType: str(raw?.heatingType) || "None", laundry: str(raw?.laundry) || "None",
    parkingType: str(raw?.parkingType) || "None", roomTypes: multiVal(raw?.roomTypes),
    privateOutdoorSpaceTypes: multiVal(raw?.privateOutdoorSpaceTypes),
    storageTypes: multiVal(raw?.storageTypes), commuteTime: numStr(raw?.commuteTime),
    walkScore: numStr(raw?.walkScore), transitScore: numStr(raw?.transitScore),
    bikeScore: numStr(raw?.bikeScore), elementarySchoolName: str(raw?.elementarySchoolName),
    elementaryRating: numStr(raw?.elementaryRating), elementaryGrades: str(raw?.elementaryGrades),
    elementaryDistance: numStr(raw?.elementaryDistance), middleSchoolName: str(raw?.middleSchoolName),
    middleRating: numStr(raw?.middleRating), middleGrades: str(raw?.middleGrades),
    middleDistance: numStr(raw?.middleDistance), highSchoolName: str(raw?.highSchoolName),
    highRating: numStr(raw?.highRating), highGrades: str(raw?.highGrades),
    highDistance: numStr(raw?.highDistance), listingSite: str(raw?.listingSite) || "Other",
    listingUrl: str(raw?.listingUrl), photoUrl: str(raw?.photoUrl),
    contactName: str(raw?.contactName), contactPhone: str(raw?.contactPhone),
    contactEmail: str(raw?.contactEmail), leaseLength: str(raw?.leaseLength),
    noBoardApproval: boolVal(raw?.noBoardApproval), noBrokerFee: boolVal(raw?.noBrokerFee),
    dateAvailable: str(raw?.dateAvailable), contactedDate: str(raw?.contactedDate),
    viewingDate: str(raw?.viewingDate), viewingTime: str(raw?.viewingTime) || "11:00 AM",
    appliedDate: str(raw?.appliedDate), pros: str(raw?.pros), cons: str(raw?.cons),
  };
}

export function buildPayload(draft: Draft): any {
  return {
    status: draft.status, preferred: boolStr(draft.preferred),
    buildingName: draft.buildingName, streetAddress: draft.streetAddress,
    city: draft.city, state: draft.state, zipCode: draft.zipCode,
    neighborhood: draft.neighborhood, propertyType: draft.propertyType,
    unitNumber: draft.unitNumber,
    floorNumber: draft.floorNumber ? Number(draft.floorNumber) : null,
    numberOfFloors: draft.numberOfFloors ? Number(draft.numberOfFloors) : null,
    bedrooms: draft.bedrooms ? Number(draft.bedrooms) : null,
    bathrooms: draft.bathrooms ? Number(draft.bathrooms) : null,
    squareFootage: draft.squareFootage ? Number(draft.squareFootage) : null,
    topFloor: boolStr(draft.topFloor), cornerUnit: boolStr(draft.cornerUnit),
    furnished: boolStr(draft.furnished), shortTermAvailable: boolStr(draft.shortTermAvailable),
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
    utilitiesIncluded: draft.utilitiesIncluded.join(", "),
    unitFeatures: draft.unitFeatures.join(", "),
    buildingAmenities: draft.buildingAmenities.join(", "),
    petAmenities: draft.petAmenities.join(", "),
    closeBy: draft.closeBy.join(", "),
    coolingType: draft.coolingType, heatingType: draft.heatingType,
    laundry: draft.laundry, parkingType: draft.parkingType,
    roomTypes: draft.roomTypes.join(", "),
    privateOutdoorSpaceTypes: draft.privateOutdoorSpaceTypes.join(", "),
    storageTypes: draft.storageTypes.join(", "),
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
    listingSite: draft.listingSite, listingUrl: draft.listingUrl,
    photoUrl: draft.photoUrl, contactName: draft.contactName,
    contactPhone: draft.contactPhone, contactEmail: draft.contactEmail,
    leaseLength: draft.leaseLength,
    noBoardApproval: boolStr(draft.noBoardApproval), noBrokerFee: boolStr(draft.noBrokerFee),
    dateAvailable: draft.dateAvailable || null, contactedDate: draft.contactedDate || null,
    viewingAppointment: buildViewingAppointment(draft) || null,
    appliedDate: draft.appliedDate || null, pros: draft.pros, cons: draft.cons,
  };
}

function buildViewingAppointment(d: Draft): string | null {
  if (!d.viewingDate) return null;
  return `${d.viewingDate}T${d.viewingTime || "11:00 AM"}`;
}

// ── Sub-components — defined OUTSIDE main export function (DRIFT 10) ──

function Section({ title, open: isOpen, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Pressable onPress={onToggle} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={headingLabel}>{title.toUpperCase()}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.textSecondary} />
      </Pressable>
      {isOpen && <View style={{ paddingTop: 4 }}>{children}</View>}
    </View>
  );
}

function Field({ label, fieldKey, inputRefs, onNext, value, onChangeText, keyboardType, multiline, placeholder }: {
  label: string; fieldKey: string; inputRefs: React.MutableRefObject<Record<string, any>>;
  onNext: (k: string) => void; value: string; onChangeText: (t: string) => void;
  keyboardType?: any; multiline?: boolean; placeholder?: string;
}) {
  return (
    <View style={{ gap: 3, marginBottom: 8 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>{label}</Text>
      <TextInput
        ref={(r) => { if (r) inputRefs.current[fieldKey] = r; }}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onNext(fieldKey)}
        returnKeyType="next"
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        style={{
          backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border,
          borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
          color: colors.textPrimary, fontSize: 14,
          ...(multiline ? { minHeight: 80, textAlignVertical: "top" } : {}),
        }}
      />
    </View>
  );
}

function Toggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.primaryBlue }} thumbColor="#fff" />
    </View>
  );
}

function SelectRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 13 }}>{value || "Select"}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function MultiRow({ label, values, onPress }: { label: string; values: string[]; onPress: () => void }) {
  const display = values.length === 0 ? "Select" : values.length === 1 ? values[0] : `${values.length} selected`;
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ color: values.length > 0 ? colors.textPrimary : colors.textSecondary, fontSize: 13 }}>{display}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function DateRow({ label, value, onPress, onClear }: { label: string; value: string; onPress: () => void; onClear: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      {value ? (
        <><Text style={{ color: colors.textPrimary, fontSize: 14 }}>{value}</Text><Pressable onPress={onClear}><Ionicons name="close-circle" size={16} color={colors.textSecondary} /></Pressable></>
      ) : (
        <Pressable onPress={onPress}><Text style={{ color: colors.primaryBlue, fontSize: 14 }}>Set</Text></Pressable>
      )}
    </View>
  );
}

// ── Props ──────────────────────────────────────────────────────────

type ListingFormProps = {
  initialDraft: Draft;
  toggles: ProfileToggles;
  saving: boolean;
  onSave: (payload: any, draft: Draft) => Promise<void>;
  insets: { bottom: number };
};

// ── Main export ────────────────────────────────────────────────────

export default function ListingForm({ initialDraft, toggles, saving, onSave, insets }: ListingFormProps) {
  const inputRefs = useRef<Record<string, any>>({});
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [open, setOpen] = useState({ property: true, costs: true, features: true, transportation: true, schools: true, listing: true, timeline: true, notes: true });
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState("");
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [pickerSelected, setPickerSelected] = useState<string | string[]>("");
  const [pickerMulti, setPickerMulti] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<(v: any) => void>(() => () => {});
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerField, setDatePickerField] = useState<keyof Draft | null>(null);
  const [datePickerTitle, setDatePickerTitle] = useState("");
  const [zipLooking, setZipLooking] = useState(false);

  // Sync draft when initialDraft changes (edit screen: listing loads after mount)
  useEffect(() => { setDraft(initialDraft); }, [initialDraft]);

  // Zip lookup — fires when zip reaches 5 digits
  useEffect(() => {
    const z = draft.zipCode;
    if (z.length !== 5) return;
    let cancelled = false;
    setZipLooking(true);
    lookupZip(z).then((result) => {
      if (cancelled) return;
      if (result?.city && result?.state) setDraft((d) => ({ ...d, city: result.city, state: result.state }));
    }).catch(() => {}).finally(() => { if (!cancelled) setZipLooking(false); });
    return () => { cancelled = true; };
  }, [draft.zipCode]);

  // Listing site auto-detect from URL
  useEffect(() => {
    const detected = detectListingSite(draft.listingUrl);
    setDraft((d) => ({ ...d, listingSite: detected }));
  }, [draft.listingUrl]);

  function toggleSection(key: keyof typeof open) { setOpen((o) => ({ ...o, [key]: !o[key] })); }
  function focusNext(currentKey: string) { const keys = Object.keys(inputRefs.current); const idx = keys.indexOf(currentKey); if (idx >= 0 && idx < keys.length - 1) inputRefs.current[keys[idx + 1]]?.focus(); }
  function openSingle(title: string, options: string[], current: string, cb: (v: string) => void) { setPickerTitle(title); setPickerOptions(options); setPickerSelected(current); setPickerMulti(false); setPickerCallback(() => cb); setPickerVisible(true); }
  function openMulti(title: string, options: string[], current: string[], cb: (v: string[]) => void) { setPickerTitle(title); setPickerOptions(options); setPickerSelected(current); setPickerMulti(true); setPickerCallback(() => cb); setPickerVisible(true); }
  function openDatePicker(field: keyof Draft, title: string) { setDatePickerField(field); setDatePickerTitle(title); setDatePickerVisible(true); }
  function set(field: keyof Draft) { return (val: any) => setDraft((d) => ({ ...d, [field]: val })); }

  async function handleSave() {
    if (!draft.buildingName.trim()) { Alert.alert("Required", "Building Name is required."); return; }
    await onSave(buildPayload(draft), draft);
  }

  const isAptCondoCoop = ["Apartment", "Condo", "Co-op"].includes(draft.propertyType);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >

        {/* PROPERTY */}
        <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
          <SelectRow label="Status" value={draft.status} onPress={() => openSingle("Status", STATUS, draft.status, set("status"))} />
          <SelectRow label="Property Type" value={draft.propertyType} onPress={() => openSingle("Property Type", PROPERTY_TYPES, draft.propertyType, set("propertyType"))} />
          <Toggle label="Preferred" value={draft.preferred} onValueChange={set("preferred")} />
          <Field label="Building Name *" fieldKey="buildingName" inputRefs={inputRefs} onNext={focusNext} value={draft.buildingName} onChangeText={set("buildingName")} />
          <Field label="Street Address" fieldKey="streetAddress" inputRefs={inputRefs} onNext={focusNext} value={draft.streetAddress} onChangeText={set("streetAddress")} />
          <Field label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={set("zipCode")} keyboardType="number-pad" />
          <Field label={`City${zipLooking ? " …" : ""}`} fieldKey="city" inputRefs={inputRefs} onNext={focusNext} value={draft.city} onChangeText={set("city")} />
          <Field label="State" fieldKey="state" inputRefs={inputRefs} onNext={focusNext} value={draft.state} onChangeText={set("state")} />
          <Field label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={set("neighborhood")} />
          {isAptCondoCoop && <Field label="Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={set("unitNumber")} />}
          {isAptCondoCoop && <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={set("floorNumber")} keyboardType="number-pad" />}
          <Field label="Number of Floors" fieldKey="numberOfFloors" inputRefs={inputRefs} onNext={focusNext} value={draft.numberOfFloors} onChangeText={set("numberOfFloors")} keyboardType="decimal-pad" />
          <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={set("bedrooms")} keyboardType="number-pad" />
          <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={set("bathrooms")} keyboardType="decimal-pad" />
          <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={set("squareFootage")} keyboardType="number-pad" />
          {isAptCondoCoop && <Toggle label="Top Floor" value={draft.topFloor} onValueChange={set("topFloor")} />}
          {isAptCondoCoop && <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={set("cornerUnit")} />}
          <Toggle label="Furnished" value={draft.furnished} onValueChange={set("furnished")} />
          <Toggle label="Short Term Available" value={draft.shortTermAvailable} onValueChange={set("shortTermAvailable")} />
        </Section>

        {/* COSTS */}
        <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
          <Field label="Base Rent ($)" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={set("baseRent")} keyboardType="number-pad" />
          {toggles.car && <Field label="Parking Fee ($)" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={set("parkingFee")} keyboardType="number-pad" />}
          <Field label="Amenity Fee ($)" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={set("amenityFee")} keyboardType="number-pad" />
          <Field label="Admin Fee ($)" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={set("adminFee")} keyboardType="number-pad" />
          <Field label="Utility Fee ($)" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={set("utilityFee")} keyboardType="number-pad" />
          <Field label="Other Fee ($)" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={set("otherFee")} keyboardType="number-pad" />
          {toggles.pets && <Field label="Pet Fee ($)" fieldKey="petFee" inputRefs={inputRefs} onNext={focusNext} value={draft.petFee} onChangeText={set("petFee")} keyboardType="number-pad" />}
          <Field label="Storage Rent ($)" fieldKey="storageRent" inputRefs={inputRefs} onNext={focusNext} value={draft.storageRent} onChangeText={set("storageRent")} keyboardType="number-pad" />
          <Field label="Security Deposit ($)" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={set("securityDeposit")} keyboardType="number-pad" />
          <Field label="Application Fee ($)" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={set("applicationFee")} keyboardType="number-pad" />
          <Field label="Broker Fee ($)" fieldKey="brokerFee" inputRefs={inputRefs} onNext={focusNext} value={draft.brokerFee} onChangeText={set("brokerFee")} keyboardType="number-pad" />
          <Field label="Move-in Fee ($)" fieldKey="moveInFee" inputRefs={inputRefs} onNext={focusNext} value={draft.moveInFee} onChangeText={set("moveInFee")} keyboardType="number-pad" />
        </Section>

        {/* FEATURES */}
        <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
          <MultiRow label="Utilities Included" values={draft.utilitiesIncluded} onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, set("utilitiesIncluded"))} />
          <MultiRow label="Unit Features" values={draft.unitFeatures} onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, set("unitFeatures"))} />
          <SelectRow label="Cooling Type" value={draft.coolingType} onPress={() => openSingle("Cooling Type", COOLING_TYPES, draft.coolingType, set("coolingType"))} />
          <SelectRow label="Heating Type" value={draft.heatingType} onPress={() => openSingle("Heating Type", HEATING_TYPES, draft.heatingType, set("heatingType"))} />
          <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, set("laundry"))} />
          <MultiRow label="Rooms" values={draft.roomTypes} onPress={() => openMulti("Rooms", ROOM_TYPES, draft.roomTypes, set("roomTypes"))} />
          <MultiRow label="Building Amenities" values={draft.buildingAmenities} onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, set("buildingAmenities"))} />
          <MultiRow label="Private Outdoor Space" values={draft.privateOutdoorSpaceTypes} onPress={() => openMulti("Private Outdoor Space", PRIVATE_OUTDOOR_SPACE, draft.privateOutdoorSpaceTypes, set("privateOutdoorSpaceTypes"))} />
          <MultiRow label="Storage" values={draft.storageTypes} onPress={() => openMulti("Storage", STORAGE_TYPES, draft.storageTypes, set("storageTypes"))} />
          {toggles.car && <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, set("parkingType"))} />}
          {toggles.pets && <MultiRow label="Pet Amenities" values={draft.petAmenities} onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, set("petAmenities"))} />}
          <MultiRow label="Close By" values={draft.closeBy} onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, set("closeBy"))} />
        </Section>

        {/* TRANSPORTATION */}
        <Section title="Transportation" open={open.transportation} onToggle={() => toggleSection("transportation")}>
          <Field label="Commute Time (min)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={set("commuteTime")} keyboardType="number-pad" />
          <Field label="Walk Score (0–100)" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={set("walkScore")} keyboardType="number-pad" />
          <Field label="Transit Score (0–100)" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={set("transitScore")} keyboardType="number-pad" />
          <Field label="Bike Score (0–100)" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={set("bikeScore")} keyboardType="number-pad" />
        </Section>

        {/* SCHOOLS — children toggle gated */}
        {toggles.children && (
          <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 4, marginBottom: 2 }}>ELEMENTARY SCHOOL</Text>
            <Field label="School Name" fieldKey="elementarySchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.elementarySchoolName} onChangeText={set("elementarySchoolName")} />
            <Field label="Grades" fieldKey="elementaryGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryGrades} onChangeText={set("elementaryGrades")} />
            <Field label="Rating (0–10)" fieldKey="elementaryRating" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryRating} onChangeText={(t) => set("elementaryRating")(clampRating(t))} keyboardType="decimal-pad" />
            <Field label="Distance (mi)" fieldKey="elementaryDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryDistance} onChangeText={set("elementaryDistance")} keyboardType="decimal-pad" />
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>MIDDLE SCHOOL</Text>
            <Field label="School Name" fieldKey="middleSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.middleSchoolName} onChangeText={set("middleSchoolName")} />
            <Field label="Grades" fieldKey="middleGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.middleGrades} onChangeText={set("middleGrades")} />
            <Field label="Rating (0–10)" fieldKey="middleRating" inputRefs={inputRefs} onNext={focusNext} value={draft.middleRating} onChangeText={(t) => set("middleRating")(clampRating(t))} keyboardType="decimal-pad" />
            <Field label="Distance (mi)" fieldKey="middleDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.middleDistance} onChangeText={set("middleDistance")} keyboardType="decimal-pad" />
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>HIGH SCHOOL</Text>
            <Field label="School Name" fieldKey="highSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.highSchoolName} onChangeText={set("highSchoolName")} />
            <Field label="Grades" fieldKey="highGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.highGrades} onChangeText={set("highGrades")} />
            <Field label="Rating (0–10)" fieldKey="highRating" inputRefs={inputRefs} onNext={focusNext} value={draft.highRating} onChangeText={(t) => set("highRating")(clampRating(t))} keyboardType="decimal-pad" />
            <Field label="Distance (mi)" fieldKey="highDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.highDistance} onChangeText={set("highDistance")} keyboardType="decimal-pad" />
          </Section>
        )}

        {/* LISTING */}
        <Section title="Listing" open={open.listing} onToggle={() => toggleSection("listing")}>
          <SelectRow label="Listing Site" value={draft.listingSite} onPress={() => openSingle("Listing Site", LISTING_SITES, draft.listingSite, set("listingSite"))} />
          <Field label="Listing URL" fieldKey="listingUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.listingUrl} onChangeText={set("listingUrl")} />
          <Field label="Photo URL" fieldKey="photoUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.photoUrl} onChangeText={set("photoUrl")} />
          <Field label="Contact Name" fieldKey="contactName" inputRefs={inputRefs} onNext={focusNext} value={draft.contactName} onChangeText={set("contactName")} />
          <Field label="Contact Phone" fieldKey="contactPhone" inputRefs={inputRefs} onNext={focusNext} value={draft.contactPhone} onChangeText={set("contactPhone")} keyboardType="phone-pad" />
          <Field label="Contact Email" fieldKey="contactEmail" inputRefs={inputRefs} onNext={focusNext} value={draft.contactEmail} onChangeText={set("contactEmail")} keyboardType="email-address" />
          <Field label="Lease Length" fieldKey="leaseLength" inputRefs={inputRefs} onNext={focusNext} value={draft.leaseLength} onChangeText={set("leaseLength")} />
          <Toggle label="No Board Approval" value={draft.noBoardApproval} onValueChange={set("noBoardApproval")} />
          <Toggle label="No Broker Fee" value={draft.noBrokerFee} onValueChange={set("noBrokerFee")} />
          <Toggle label="Short Term Available" value={draft.shortTermAvailable} onValueChange={set("shortTermAvailable")} />
          <Toggle label="Renters Insurance Required" value={draft.rentersInsuranceRequired} onValueChange={set("rentersInsuranceRequired")} />
        </Section>

        {/* TIMELINE */}
        <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
          <DateRow label="Date Available" value={draft.dateAvailable} onPress={() => openDatePicker("dateAvailable", "Date Available")} onClear={() => set("dateAvailable")("")} />
          <DateRow label="Contacted Date" value={draft.contactedDate} onPress={() => openDatePicker("contactedDate", "Contacted Date")} onClear={() => set("contactedDate")("")} />
          <DateRow label="Viewing Date" value={draft.viewingDate} onPress={() => openDatePicker("viewingDate", "Viewing Date")} onClear={() => set("viewingDate")("")} />
          <SelectRow label="Viewing Time" value={draft.viewingTime} onPress={() => openSingle("Viewing Time", TIME_OPTIONS, draft.viewingTime, set("viewingTime"))} />
          <DateRow label="Applied Date" value={draft.appliedDate} onPress={() => openDatePicker("appliedDate", "Applied Date")} onClear={() => set("appliedDate")("")} />
        </Section>

        {/* NOTES */}
        <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
          <Field label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={set("pros")} multiline />
          <Field label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={set("cons")} multiline />
        </Section>

        {/* Save button */}
        <Pressable onPress={handleSave} disabled={saving} style={{ backgroundColor: colors.primaryBlue, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 }}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Save</Text>}
        </Pressable>

      </ScrollView>

      {/* Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setPickerVisible(false)} />
        <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60%", paddingBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>{pickerTitle}</Text>
            <Pressable onPress={() => setPickerVisible(false)}><Ionicons name="close" size={22} color={colors.textSecondary} /></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            {pickerOptions.map((opt) => {
              const isSelected = pickerMulti
                ? (Array.isArray(pickerSelected) ? pickerSelected.includes(opt) : false)
                : pickerSelected === opt;
              return (
                <Pressable key={opt} onPress={() => {
                  if (pickerMulti) {
                    const cur = Array.isArray(pickerSelected) ? pickerSelected : [];
                    const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
                    setPickerSelected(next);
                    pickerCallback(next);
                  } else {
                    setPickerSelected(opt);
                    pickerCallback(opt);
                    setPickerVisible(false);
                  }
                }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Text style={{ color: colors.textPrimary, fontSize: 15 }}>{opt}</Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color={colors.primaryBlue} />}
                </Pressable>
              );
            })}
          </ScrollView>
          {pickerMulti && (
            <Pressable onPress={() => setPickerVisible(false)} style={{ margin: 16, backgroundColor: colors.primaryBlue, borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Done</Text>
            </Pressable>
          )}
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={datePickerVisible} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setDatePickerVisible(false)} />
        <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>{datePickerTitle}</Text>
            <Pressable onPress={() => setDatePickerVisible(false)}><Ionicons name="close" size={22} color={colors.textSecondary} /></Pressable>
          </View>
          <Calendar
            onDayPress={(day: any) => {
              if (datePickerField) setDraft((d) => ({ ...d, [datePickerField]: day.dateString }));
              setDatePickerVisible(false);
            }}
            theme={{
              backgroundColor: colors.card, calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primaryBlue, selectedDayTextColor: "#fff",
              todayTextColor: colors.primaryBlue, dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textSecondary, arrowColor: colors.primaryBlue,
              monthTextColor: colors.textPrimary,
            }}
          />
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}
