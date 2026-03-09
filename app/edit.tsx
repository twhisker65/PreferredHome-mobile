// app/edit.tsx — Build 3.2.03 HOTFIX 2
// Fixes: no Unit section (fields in PROPERTY), City and State appear BEFORE Zip Code,
//         boolean fields sent as "TRUE"/"FALSE" strings.

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import { TopBar } from "../components/TopBar";
import { SidePanel } from "../components/SidePanel";
import { MenuSheet } from "../components/MenuSheet";
import { Calendar } from "react-native-calendars";
import { updateListing } from "../lib/api";
import { useListings } from "../lib/useListings";

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
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  topFloor: boolean;
  cornerUnit: boolean;
  unitType: string;
  furnished: boolean;
  baseRent: string;
  amenityFee: string;
  adminFee: string;
  utilityFee: string;
  parkingFee: string;
  otherFee: string;
  securityDeposit: string;
  applicationFee: string;
  utilitiesIncluded: string[];
  unitFeatures: string[];
  buildingAmenities: string[];
  petAmenities: string[];
  closeBy: string[];
  acType: string;
  laundry: string;
  parkingType: string;
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

const STATUS = ["New", "Contacted", "Scheduled", "Viewed", "Shortlisted", "Applied", "Approved", "Signed", "Rejected", "Archived"];
const UNIT_TYPES = ["Rental", "Condo", "Co-op", "Townhouse", "House"];
const AC_TYPES = ["None", "Central", "Window", "Split", "Other"];
const LAUNDRY = ["None", "In-Unit", "On Floor", "In Building"];
const PARKING = ["None", "Covered", "Uncovered", "Street"];
const UTILITIES = ["Gas", "Electric", "Internet", "Water", "Sewage", "Trash", "Parking"];
const UNIT_FEATURES = ["Hardwood Floors", "Air Conditioning", "Dishwasher", "Microwave", "Balcony/Terrace"];
const BUILDING_AMENITIES = ["Extra Storage", "Rooftop Space", "Common Lounge", "Barbecue Area", "Firepits", "Gym", "Pool"];
const PET_AMENITIES = ["Pet Washing", "Dog Park"];
const CLOSE_BY = ["Subway", "Bus Stop", "Grocery Store", "Park", "Restaurants", "Pharmacy", "Coffee Shop", "Gym", "School"];

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

function str(v: unknown): string {
  if (v == null) return "";
  const s = String(v).trim();
  // convert literal "nan", "null", "none" from corrupted sheet data
  if (s.toLowerCase() === "nan" || s.toLowerCase() === "null" || s.toLowerCase() === "none") return "";
  return s;
}

function boolVal(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

function multiVal(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  const s = str(v);
  if (!s) return [];
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function rawToDraft(raw: any): Draft {
  return {
    status: str(raw?.status) || "New",
    preferred: boolVal(raw?.preferred),
    buildingName: str(raw?.buildingName),
    streetAddress: str(raw?.streetAddress),
    city: str(raw?.city),
    state: str(raw?.state),
    zipCode: str(raw?.zipCode),
    neighborhood: str(raw?.neighborhood),
    unitNumber: str(raw?.unitNumber),
    floorNumber: str(raw?.floorNumber),
    bedrooms: str(raw?.bedrooms),
    bathrooms: str(raw?.bathrooms),
    squareFootage: str(raw?.squareFootage),
    topFloor: boolVal(raw?.topFloor),
    cornerUnit: boolVal(raw?.cornerUnit),
    unitType: str(raw?.unitType) || "Rental",
    furnished: boolVal(raw?.furnished),
    baseRent: str(raw?.baseRent),
    amenityFee: str(raw?.amenityFee),
    adminFee: str(raw?.adminFee),
    utilityFee: str(raw?.utilityFee),
    parkingFee: str(raw?.parkingFee),
    otherFee: str(raw?.otherFee),
    securityDeposit: str(raw?.securityDeposit),
    applicationFee: str(raw?.applicationFee),
    utilitiesIncluded: multiVal(raw?.utilitiesIncluded),
    unitFeatures: multiVal(raw?.unitFeatures),
    buildingAmenities: multiVal(raw?.buildingAmenities),
    petAmenities: multiVal(raw?.petAmenities),
    closeBy: multiVal(raw?.closeBy),
    acType: str(raw?.acType) || "None",
    laundry: str(raw?.laundry) || "None",
    parkingType: str(raw?.parkingType) || "None",
    commuteTime: str(raw?.commuteTime),
    walkScore: str(raw?.walkScore),
    transitScore: str(raw?.transitScore),
    bikeScore: str(raw?.bikeScore),
    elementarySchoolName: str(raw?.elementarySchoolName),
    elementaryRating: str(raw?.elementaryRating),
    elementaryGrades: str(raw?.elementaryGrades),
    elementaryDistance: str(raw?.elementaryDistance),
    middleSchoolName: str(raw?.middleSchoolName),
    middleRating: str(raw?.middleRating),
    middleGrades: str(raw?.middleGrades),
    middleDistance: str(raw?.middleDistance),
    highSchoolName: str(raw?.highSchoolName),
    highRating: str(raw?.highRating),
    highGrades: str(raw?.highGrades),
    highDistance: str(raw?.highDistance),
    listingSite: str(raw?.listingSite),
    listingUrl: str(raw?.listingUrl),
    photoUrl: str(raw?.photoUrl),
    contactName: str(raw?.contactName),
    contactPhone: str(raw?.contactPhone),
    contactEmail: str(raw?.contactEmail),
    leaseLength: str(raw?.leaseLength),
    noBoardApproval: boolVal(raw?.noBoardApproval),
    noBrokerFee: boolVal(raw?.noBrokerFee),
    dateAvailable: str(raw?.dateAvailable),
    contactedDate: str(raw?.contactedDate),
    viewingDate: str(raw?.viewingDate),
    viewingTime: str(raw?.viewingTime) || "11:00 AM",
    appliedDate: str(raw?.appliedDate),
    pros: str(raw?.pros),
    cons: str(raw?.cons),
  };
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
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 14, fontWeight: "700" }}>{value || emptyLabel || "Select"}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function MultiRow({ label, values, onPress }: { label: string; values: string[]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: pressed ? colors.cardHover : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10 })}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ color: values.length ? colors.textPrimary : colors.textSecondary, fontSize: 14, fontWeight: "700" }} numberOfLines={1}>{values.length ? values.join(", ") : "Select"}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function DateRow({ label, value, onPress, onClear }: { label: string; value: string; onPress: () => void; onClear: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: pressed ? colors.cardHover : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10 })}>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 14, fontWeight: "700" }}>{value || "Select"}</Text>
      </Pressable>
      {value ? <Pressable onPress={onClear} hitSlop={10}><Ionicons name="close-circle" size={20} color={colors.textSecondary} /></Pressable> : null}
    </View>
  );
}

function MultiPicker({ options, initial, onDone }: { options: string[]; initial: string[]; onDone: (v: string[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));
  return (
    <View>
      <ScrollView style={{ maxHeight: 300 }}>
        {options.map((opt) => (
          <Pressable key={opt} onPress={() => setSelected((s) => { const n = new Set(s); n.has(opt) ? n.delete(opt) : n.add(opt); return n; })}
            style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" })}>
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

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings } = useListings();

  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    property: true, costs: true, features: true,
    transportation: true, schools: true, listing: true, timeline: true, notes: true,
  });

  const inputRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!id || listings.length === 0) return;
    const listing = listings.find((l) => l.id === id);
    if (listing) setDraft(rawToDraft(listing.raw ?? {}));
  }, [id, listings]);

  const inputOrder = [
    "buildingName", "streetAddress", "city", "state", "zipCode", "neighborhood", "unitNumber", "floorNumber",
    "bedrooms", "bathrooms", "squareFootage",
    "baseRent", "amenityFee", "adminFee", "utilityFee", "parkingFee", "otherFee", "securityDeposit", "applicationFee",
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

  function buildViewingAppointment(d: Draft): string {
    if (!d.viewingDate) return "";
    const timePart = d.viewingTime || "12:00 PM";
    const match = timePart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return `${d.viewingDate} 12:00:00`;
    let h = parseInt(match[1], 10);
    const min = match[2];
    const period = match[3].toUpperCase();
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${d.viewingDate} ${String(h).padStart(2, "0")}:${min}:00`;
  }

  async function handleSave() {
    if (!draft) return;
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
        bedrooms: draft.bedrooms ? Number(draft.bedrooms) : null,
        bathrooms: draft.bathrooms ? Number(draft.bathrooms) : null,
        squareFootage: draft.squareFootage ? Number(draft.squareFootage) : null,
        topFloor: boolStr(draft.topFloor),
        cornerUnit: boolStr(draft.cornerUnit),
        unitType: draft.unitType,
        furnished: boolStr(draft.furnished),
        baseRent: draft.baseRent ? Number(draft.baseRent) : null,
        amenityFee: draft.amenityFee ? Number(draft.amenityFee) : null,
        adminFee: draft.adminFee ? Number(draft.adminFee) : null,
        utilityFee: draft.utilityFee ? Number(draft.utilityFee) : null,
        parkingFee: draft.parkingFee ? Number(draft.parkingFee) : null,
        otherFee: draft.otherFee ? Number(draft.otherFee) : null,
        securityDeposit: draft.securityDeposit ? Number(draft.securityDeposit) : null,
        applicationFee: draft.applicationFee ? Number(draft.applicationFee) : null,
        utilitiesIncluded: draft.utilitiesIncluded.join(","),
        unitFeatures: draft.unitFeatures.join(","),
        buildingAmenities: draft.buildingAmenities.join(","),
        petAmenities: draft.petAmenities.join(","),
        closeBy: draft.closeBy.join(","),
        acType: draft.acType,
        laundry: draft.laundry,
        parkingType: draft.parkingType,
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
        viewingAppointment: buildViewingAppointment(draft) || null,
        appliedDate: draft.appliedDate || null,
        pros: draft.pros,
        cons: draft.cons,
      };

      await updateListing(id!, payload);
      Alert.alert("Saved", "Listing updated successfully.", [
        { text: "OK", onPress: () => router.push("/(tabs)/listings") },
      ]);
    } catch (err: any) {
      Alert.alert("Save Failed", err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!draft) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading listing...</Text>
      </View>
    );
  }

  const set = (field: keyof Draft) => (val: any) => setDraft((d) => d ? { ...d, [field]: val } : d);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Edit Listing" onPressMenu={() => setMenuOpen(true)} />
      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet onGoProfile={() => { setMenuOpen(false); router.push("/profile"); }} onGoSettings={() => { setMenuOpen(false); router.push("/settings"); }} onClose={() => setMenuOpen(false)} />
      </SidePanel>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 }}>

          {/* ── PROPERTY ── City and State appear BEFORE Zip Code on Edit ── */}
          <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
            <SelectRow label="Status" value={draft.status} onPress={() => openSingle("Status", STATUS, draft.status, set("status"))} />
            <SelectRow label="Unit Type" value={draft.unitType} onPress={() => openSingle("Unit Type", UNIT_TYPES, draft.unitType, set("unitType"))} />
            <Toggle label="Preferred" value={draft.preferred} onValueChange={set("preferred")} />
            <Field label="Building Name" fieldKey="buildingName" inputRefs={inputRefs} onNext={focusNext} value={draft.buildingName} onChangeText={set("buildingName")} />
            <Field label="Street Address" fieldKey="streetAddress" inputRefs={inputRefs} onNext={focusNext} value={draft.streetAddress} onChangeText={set("streetAddress")} placeholder="Street only" />
            <Field label="City" fieldKey="city" inputRefs={inputRefs} onNext={focusNext} value={draft.city} onChangeText={set("city")} />
            <Field label="State" fieldKey="state" inputRefs={inputRefs} onNext={focusNext} value={draft.state} onChangeText={set("state")} placeholder="e.g. NY" />
            <Field label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={set("zipCode")} keyboardType="number-pad" />
            <Field label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={set("neighborhood")} />
            <Field label="Apartment / Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={set("unitNumber")} />
            <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={set("floorNumber")} keyboardType="number-pad" />
            <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={set("bedrooms")} keyboardType="number-pad" />
            <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={set("bathrooms")} keyboardType="decimal-pad" />
            <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={set("squareFootage")} keyboardType="number-pad" />
            <Toggle label="Top Floor" value={draft.topFloor} onValueChange={set("topFloor")} />
            <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={set("cornerUnit")} />
            <Toggle label="Furnished" value={draft.furnished} onValueChange={set("furnished")} />
          </Section>

          {/* ── COSTS ── */}
          <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
            <Field label="Monthly Rent" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={set("baseRent")} keyboardType="number-pad" />
            <Field label="Amenity Fee" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={set("amenityFee")} keyboardType="number-pad" />
            <Field label="Admin Fee" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={set("adminFee")} keyboardType="number-pad" />
            <Field label="Utility Fee" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={set("utilityFee")} keyboardType="number-pad" />
            <Field label="Parking Fee" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={set("parkingFee")} keyboardType="number-pad" />
            <Field label="Other Fee" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={set("otherFee")} keyboardType="number-pad" />
            <Field label="Security Deposit" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={set("securityDeposit")} keyboardType="number-pad" />
            <Field label="Application Fee" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={set("applicationFee")} keyboardType="number-pad" />
          </Section>

          {/* ── FEATURES ── */}
          <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
            <MultiRow label="Utilities Included" values={draft.utilitiesIncluded} onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, set("utilitiesIncluded"))} />
            <MultiRow label="Unit Features" values={draft.unitFeatures} onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, set("unitFeatures"))} />
            <MultiRow label="Building Amenities" values={draft.buildingAmenities} onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, set("buildingAmenities"))} />
            <MultiRow label="Pet Amenities" values={draft.petAmenities} onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, set("petAmenities"))} />
            <MultiRow label="Close By" values={draft.closeBy} onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, set("closeBy"))} />
            <SelectRow label="AC Type" value={draft.acType} onPress={() => openSingle("AC Type", AC_TYPES, draft.acType, set("acType"))} />
            <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, set("laundry"))} />
            <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, set("parkingType"))} />
          </Section>

          {/* ── TRANSPORTATION ── */}
          <Section title="Transportation" open={open.transportation} onToggle={() => toggleSection("transportation")}>
            <Field label="Commute Time (mins)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={set("commuteTime")} keyboardType="number-pad" />
            <Field label="Walk Score" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={set("walkScore")} keyboardType="number-pad" />
            <Field label="Transit Score" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={set("transitScore")} keyboardType="number-pad" />
            <Field label="Bike Score" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={set("bikeScore")} keyboardType="number-pad" />
          </Section>

          {/* ── SCHOOLS ── */}
          <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Elementary</Text>
            <Field label="Name" fieldKey="elementarySchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.elementarySchoolName} onChangeText={set("elementarySchoolName")} />
            <Field label="Grades" fieldKey="elementaryGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryGrades} onChangeText={set("elementaryGrades")} placeholder="e.g. K–5" />
            <Field label="Rating (0–10)" fieldKey="elementaryRating" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryRating} onChangeText={(t) => set("elementaryRating")(clampRating(t))} keyboardType="decimal-pad" />
            <Field label="Distance (miles)" fieldKey="elementaryDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryDistance} onChangeText={set("elementaryDistance")} keyboardType="decimal-pad" />
            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginTop: 8, marginBottom: 6 }}>Middle</Text>
            <Field label="Name" fieldKey="middleSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.middleSchoolName} onChangeText={set("middleSchoolName")} />
            <Field label="Grades" fieldKey="middleGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.middleGrades} onChangeText={set("middleGrades")} placeholder="e.g. 6–8" />
            <Field label="Rating (0–10)" fieldKey="middleRating" inputRefs={inputRefs} onNext={focusNext} value={draft.middleRating} onChangeText={(t) => set("middleRating")(clampRating(t))} keyboardType="decimal-pad" />
            <Field label="Distance (miles)" fieldKey="middleDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.middleDistance} onChangeText={set("middleDistance")} keyboardType="decimal-pad" />
            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginTop: 8, marginBottom: 6 }}>High School</Text>
            <Field label="Name" fieldKey="highSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.highSchoolName} onChangeText={set("highSchoolName")} />
            <Field label="Grades" fieldKey="highGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.highGrades} onChangeText={set("highGrades")} placeholder="e.g. 9–12" />
            <Field label="Rating (0–10)" fieldKey="highRating" inputRefs={inputRefs} onNext={focusNext} value={draft.highRating} onChangeText={(t) => set("highRating")(clampRating(t))} keyboardType="decimal-pad" />
            <Field label="Distance (miles)" fieldKey="highDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.highDistance} onChangeText={set("highDistance")} keyboardType="decimal-pad" />
          </Section>

          {/* ── LISTING ── */}
          <Section title="Listing" open={open.listing} onToggle={() => toggleSection("listing")}>
            <Field label="Listing Site" fieldKey="listingSite" inputRefs={inputRefs} onNext={focusNext} value={draft.listingSite} onChangeText={set("listingSite")} placeholder="Streeteasy, Zillow, etc." />
            <Field label="Listing URL" fieldKey="listingUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.listingUrl} onChangeText={set("listingUrl")} placeholder="https://..." />
            <Field label="Photo URL" fieldKey="photoUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.photoUrl} onChangeText={set("photoUrl")} placeholder="https://..." />
            <Field label="Contact Name" fieldKey="contactName" inputRefs={inputRefs} onNext={focusNext} value={draft.contactName} onChangeText={set("contactName")} />
            <Field label="Contact Phone" fieldKey="contactPhone" inputRefs={inputRefs} onNext={focusNext} value={draft.contactPhone} onChangeText={set("contactPhone")} keyboardType="phone-pad" />
            <Field label="Contact Email" fieldKey="contactEmail" inputRefs={inputRefs} onNext={focusNext} value={draft.contactEmail} onChangeText={set("contactEmail")} keyboardType="email-address" />
            <Field label="Lease Length" fieldKey="leaseLength" inputRefs={inputRefs} onNext={focusNext} value={draft.leaseLength} onChangeText={set("leaseLength")} placeholder="e.g. 12 months" />
            <Toggle label="No Board Approval" value={draft.noBoardApproval} onValueChange={set("noBoardApproval")} />
            <Toggle label="No Broker Fee" value={draft.noBrokerFee} onValueChange={set("noBrokerFee")} />
          </Section>

          {/* ── TIMELINE ── */}
          <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
            <DateRow label="Date Available" value={draft.dateAvailable} onPress={() => openDate("Date Available", draft.dateAvailable || todayYYYYMMDD(), set("dateAvailable"))} onClear={() => set("dateAvailable")("")} />
            <DateRow label="Contacted Date" value={draft.contactedDate} onPress={() => openDate("Contacted Date", draft.contactedDate || todayYYYYMMDD(), set("contactedDate"))} onClear={() => set("contactedDate")("")} />
            <DateRow label="Viewing Date" value={draft.viewingDate} onPress={() => openDate("Viewing Date", draft.viewingDate || todayYYYYMMDD(), set("viewingDate"))} onClear={() => set("viewingDate")("")} />
            <SelectRow label="Viewing Time" value={draft.viewingTime} emptyLabel="Select" onPress={() => openTime(draft.viewingTime, set("viewingTime"))} />
            <DateRow label="Applied Date" value={draft.appliedDate} onPress={() => openDate("Applied Date", draft.appliedDate || todayYYYYMMDD(), set("appliedDate"))} onClear={() => set("appliedDate")("")} />
          </Section>

          {/* ── NOTES ── */}
          <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
            <Field label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={set("pros")} multiline />
            <Field label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={set("cons")} multiline />
          </Section>

          <Pressable onPress={handleSave} disabled={saving}
            style={({ pressed }) => ({ marginTop: 6, borderRadius: 18, backgroundColor: colors.primaryBlue, paddingVertical: 14, alignItems: "center", opacity: pressed || saving ? 0.8 : 1, flexDirection: "row", justifyContent: "center", gap: 8 })}>
            {saving ? <ActivityIndicator size="small" color="#fff" /> : null}
            <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>{saving ? "Saving..." : "Save Changes"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Picker Modal */}
      <Modal visible={!!picker} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", padding: 18, justifyContent: "center" }} onPress={() => setPicker(null)}>
          <Pressable onPress={() => {}} style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: "hidden", alignSelf: "center", width: "100%", maxWidth: 420 }}>
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>{picker?.title ?? ""}</Text>
              <Pressable onPress={() => setPicker(null)} hitSlop={10}><Ionicons name="close" size={20} color={colors.textSecondary} /></Pressable>
            </View>
            {picker?.mode === "single" ? (
              <ScrollView style={{ maxHeight: 360 }}>
                {(picker.options ?? []).map((opt) => (
                  <Pressable key={opt} onPress={() => { picker.onPickSingle?.(opt); setPicker(null); }}
                    style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" })}>
                    <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{opt}</Text>
                    {picker.value === opt ? <Ionicons name="checkmark" size={18} color={colors.primaryBlue} /> : null}
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            {picker?.mode === "multi" ? <MultiPicker options={picker.options ?? []} initial={picker.values ?? []} onDone={(vals) => { picker.onPickMulti?.(vals); setPicker(null); }} /> : null}
            {picker?.mode === "date" ? (
              <Calendar current={picker.initialDate || todayYYYYMMDD()} markedDates={marked}
                onDayPress={(day) => { picker.onPickDate?.(day.dateString); setPicker(null); }}
                theme={{ calendarBackground: colors.background, monthTextColor: colors.textPrimary, dayTextColor: colors.textPrimary, textDisabledColor: colors.textSecondary, todayTextColor: colors.primaryBlue, arrowColor: colors.textPrimary, selectedDayBackgroundColor: colors.primaryBlue, textDayFontWeight: "700", textMonthFontWeight: "800", textDayHeaderFontWeight: "800" }}
              />
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={timePicker.open} transparent animationType="fade" onRequestClose={() => setTimePicker((t) => ({ ...t, open: false }))}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", padding: 18, justifyContent: "center" }} onPress={() => setTimePicker((t) => ({ ...t, open: false }))}>
          <Pressable onPress={() => {}} style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: "hidden", alignSelf: "center", width: "100%", maxWidth: 420 }}>
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>Viewing Time</Text>
              <Pressable onPress={() => setTimePicker((t) => ({ ...t, open: false }))} hitSlop={10}><Ionicons name="close" size={20} color={colors.textSecondary} /></Pressable>
            </View>
            <ScrollView style={{ maxHeight: 340 }}>
              {PERIODS.flatMap((period) => HOURS.flatMap((h) => MINUTES.map((m) => {
                const val = `${h}:${m} ${period}`;
                return (
                  <Pressable key={val} onPress={() => { timePicker.onPick(val); setTimePicker((t) => ({ ...t, open: false })); }}
                    style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: pressed ? "rgba(255,255,255,0.03)" : "transparent", flexDirection: "row", alignItems: "center", justifyContent: "space-between" })}>
                    <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{val}</Text>
                    {timePicker.value === val ? <Ionicons name="checkmark" size={18} color={colors.primaryBlue} /> : null}
                  </Pressable>
                );
              })))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
