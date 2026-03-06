import React, { useMemo, useRef, useState } from "react";
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
import { router } from "expo-router";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { Calendar } from "react-native-calendars";
import { postListing } from "../../lib/api";

type Draft = {
  // Status & ID
  status: string;
  preferred: boolean;

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

  // Costs
  baseRent: string;
  amenityFee: string;
  adminFee: string;
  utilityFee: string;
  parkingFee: string;
  otherFee: string;
  securityDeposit: string;
  applicationFee: string;

  // Features (multi-select)
  utilitiesIncluded: string[];
  unitFeatures: string[];
  buildingAmenities: string[];
  petAmenities: string[];
  closeBy: string[];

  // Features (single select)
  acType: string;
  laundry: string;
  parkingType: string;

  // Transportation
  commuteTime: string;
  walkScore: string;
  transitScore: string;
  bikeScore: string;

  // Schools
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

  // Listing
  listingSite: string;
  listingUrl: string;
  photoUrl: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  leaseLength: string;
  noBoardApproval: boolean;
  noBrokerFee: boolean;

  // Timeline
  dateAvailable: string;
  contactedDate: string;
  viewingDate: string;
  viewingTime: string;
  appliedDate: string;

  // Notes
  pros: string;
  cons: string;
};

const STATUS = ["New", "Contacted", "Scheduled", "Viewed", "Shortlisted", "Applied", "Approved", "Signed", "Rejected", "Archived"];
const UNIT_TYPES = ["Condo", "Co-Op", "Rental"];
const AC_TYPES = ["Central", "Wall", "Window", "None"];
const LAUNDRY = ["In-Unit", "On Floor", "In Building", "None"];
const PARKING = ["Covered", "Uncovered", "None"];

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

// Clamp a school rating to max 10
function clampRating(value: string): string {
  const n = parseFloat(value);
  if (isNaN(n)) return value;
  if (n > 10) return "10";
  return value;
}

type SectionKey = "property" | "costs" | "features" | "transportation" | "schools" | "listing" | "timeline" | "notes";

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
}) {
  return (
    <View style={{ gap: 6 }}>
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
        trackColor={{ false: colors.border, true: colors.card }}
        thumbColor={active ? colors.primaryBlue : colors.textSecondary}
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

// Date row with a clear (×) button when a date is set
function DateRow({
  label,
  value,
  onPress,
  onClear,
}: {
  label: string;
  value: string;
  onPress: () => void;
  onClear: () => void;
}) {
  return (
    <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: colors.card }}>
      <Label>{label}</Label>
      <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={onPress} style={{ flex: 1 }}>
          <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontWeight: "800" }}>{value || "Select"}</Text>
        </Pressable>
        {value ? (
          <Pressable onPress={onClear} hitSlop={10} style={{ marginLeft: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        ) : (
          <Pressable onPress={onPress}>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
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
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    property: true,
    costs: true,
    features: true,
    transportation: true,
    schools: true,
    listing: true,
    timeline: true,
    notes: true,
  });

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const inputOrder: string[] = [
    "buildingName", "streetAddress", "zipCode", "neighborhood", "unitNumber",
    "floorNumber", "bedrooms", "bathrooms", "squareFootage",
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
      const nextKey = inputOrder[j];
      const ref = inputRefs.current[nextKey];
      if (ref && typeof (ref as any).focus === "function") {
        (ref as any).focus();
        return;
      }
    }
  }

  const [draft, setDraft] = useState<Draft>(() => ({
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
    topFloor: false,
    cornerUnit: false,

    unitType: "Rental",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    furnished: false,

    baseRent: "",
    amenityFee: "",
    adminFee: "",
    utilityFee: "",
    parkingFee: "",
    otherFee: "",
    securityDeposit: "",
    applicationFee: "",

    utilitiesIncluded: [],
    unitFeatures: [],
    buildingAmenities: [],
    petAmenities: [],
    closeBy: [],

    acType: "None",
    laundry: "None",
    parkingType: "None",

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
  }));

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
        preferred: draft.preferred,

        buildingName: draft.buildingName,
        streetAddress: draft.streetAddress,
        city: draft.city,
        state: draft.state,
        zipCode: draft.zipCode,
        neighborhood: draft.neighborhood,
        unitNumber: draft.unitNumber,
        floorNumber: draft.floorNumber ? Number(draft.floorNumber) : null,
        topFloor: draft.topFloor,
        cornerUnit: draft.cornerUnit,

        unitType: draft.unitType,
        bedrooms: draft.bedrooms ? Number(draft.bedrooms) : null,
        bathrooms: draft.bathrooms ? Number(draft.bathrooms) : null,
        squareFootage: draft.squareFootage ? Number(draft.squareFootage) : null,
        furnished: draft.furnished,

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
        noBoardApproval: draft.noBoardApproval,
        noBrokerFee: draft.noBrokerFee,

        dateAvailable: draft.dateAvailable || null,
        contactedDate: draft.contactedDate || null,
        viewingAppointment: buildViewingAppointment() || null,
        appliedDate: draft.appliedDate || null,

        pros: draft.pros,
        cons: draft.cons,
      };

      await postListing(payload);
      Alert.alert("Saved", "Listing added successfully.", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/listings"),
        },
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

      {/*
        KeyboardAvoidingView + ScrollView combination:
        - On iOS (padding behaviour) the scroll area shrinks when the keyboard appears,
          keeping the active field visible above the keyboard.
        - keyboardShouldPersistTaps="handled" lets you tap a new field without first
          dismissing the keyboard.
        - The sections all start closed except PROPERTY so the screen is not crowded.
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 }}
        >
          {/* ── PROPERTY ── */}
          <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
            <SelectRow
              label="Status"
              value={draft.status}
              onPress={() => openSingle("Status", STATUS, draft.status, (v) => setDraft((d) => ({ ...d, status: v })))}
            />
            <SelectRow
              label="Unit Type"
              value={draft.unitType}
              onPress={() => openSingle("Unit Type", UNIT_TYPES, draft.unitType, (v) => setDraft((d) => ({ ...d, unitType: v })))}
            />
            <Toggle label="Preferred" value={draft.preferred} onValueChange={(v) => setDraft((d) => ({ ...d, preferred: v }))} />
            <Field label="Building Name" fieldKey="buildingName" inputRefs={inputRefs} onNext={focusNext} value={draft.buildingName} onChangeText={(t) => setDraft((d) => ({ ...d, buildingName: t }))} />
            <Field label="Street Address" fieldKey="streetAddress" inputRefs={inputRefs} onNext={focusNext} value={draft.streetAddress} onChangeText={(t) => setDraft((d) => ({ ...d, streetAddress: t }))} placeholder="Street only" />
            <Field label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={(t) => setDraft((d) => ({ ...d, zipCode: t }))} keyboardType="number-pad" />
            <Field label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={(t) => setDraft((d) => ({ ...d, neighborhood: t }))} />
            <Field label="Apartment / Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={(t) => setDraft((d) => ({ ...d, unitNumber: t }))} />
            <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={(t) => setDraft((d) => ({ ...d, floorNumber: t }))} keyboardType="number-pad" />
            <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bedrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bathrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={(t) => setDraft((d) => ({ ...d, squareFootage: t }))} keyboardType="number-pad" />
            <Toggle label="Top Floor" value={draft.topFloor} onValueChange={(v) => setDraft((d) => ({ ...d, topFloor: v }))} />
            <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={(v) => setDraft((d) => ({ ...d, cornerUnit: v }))} />
            <Toggle label="Furnished" value={draft.furnished} onValueChange={(v) => setDraft((d) => ({ ...d, furnished: v }))} />
          </Section>

          {/* ── COSTS ── */}
          <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
            <Field label="Monthly Rent" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={(t) => setDraft((d) => ({ ...d, baseRent: t }))} keyboardType="number-pad" />
            <Field label="Amenity Fee" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={(t) => setDraft((d) => ({ ...d, amenityFee: t }))} keyboardType="number-pad" />
            <Field label="Admin Fee" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={(t) => setDraft((d) => ({ ...d, adminFee: t }))} keyboardType="number-pad" />
            <Field label="Utility Fee" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={(t) => setDraft((d) => ({ ...d, utilityFee: t }))} keyboardType="number-pad" />
            <Field label="Parking Fee" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={(t) => setDraft((d) => ({ ...d, parkingFee: t }))} keyboardType="number-pad" />
            <Field label="Other Fee" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={(t) => setDraft((d) => ({ ...d, otherFee: t }))} keyboardType="number-pad" />
            <Field label="Security Deposit" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={(t) => setDraft((d) => ({ ...d, securityDeposit: t }))} keyboardType="number-pad" />
            <Field label="Application Fee" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={(t) => setDraft((d) => ({ ...d, applicationFee: t }))} keyboardType="number-pad" />
          </Section>

          {/* ── FEATURES ── */}
          <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
            <MultiRow label="Utilities Included" values={draft.utilitiesIncluded} onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, (v) => setDraft((d) => ({ ...d, utilitiesIncluded: v })))} />
            <MultiRow label="Unit Features" values={draft.unitFeatures} onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, (v) => setDraft((d) => ({ ...d, unitFeatures: v })))} />
            <MultiRow label="Building Amenities" values={draft.buildingAmenities} onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, (v) => setDraft((d) => ({ ...d, buildingAmenities: v })))} />
            <MultiRow label="Pet Amenities" values={draft.petAmenities} onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, (v) => setDraft((d) => ({ ...d, petAmenities: v })))} />
            <MultiRow label="Close By" values={draft.closeBy} onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, (v) => setDraft((d) => ({ ...d, closeBy: v })))} />
            <SelectRow label="AC Type" value={draft.acType} onPress={() => openSingle("AC Type", AC_TYPES, draft.acType, (v) => setDraft((d) => ({ ...d, acType: v })))} />
            <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, (v) => setDraft((d) => ({ ...d, laundry: v })))} />
            <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, (v) => setDraft((d) => ({ ...d, parkingType: v })))} />
          </Section>

          {/* ── TRANSPORTATION ── */}
          <Section title="Transportation" open={open.transportation} onToggle={() => toggleSection("transportation")}>
            <Field label="Commute Time (mins)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={(t) => setDraft((d) => ({ ...d, commuteTime: t }))} keyboardType="number-pad" />
            <Field label="Walk Score" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={(t) => setDraft((d) => ({ ...d, walkScore: t }))} keyboardType="number-pad" />
            <Field label="Transit Score" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={(t) => setDraft((d) => ({ ...d, transitScore: t }))} keyboardType="number-pad" />
            <Field label="Bike Score" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={(t) => setDraft((d) => ({ ...d, bikeScore: t }))} keyboardType="number-pad" />
          </Section>

          {/* ── SCHOOLS ── */}
          <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Elementary</Text>
            <Field label="Name" fieldKey="elementarySchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.elementarySchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, elementarySchoolName: t }))} />
            <Field label="Grades" fieldKey="elementaryGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryGrades} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryGrades: t }))} placeholder="e.g. K–5" />
            <Field label="Rating (0–10)" fieldKey="elementaryRating" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryRating} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryRating: clampRating(t) }))} keyboardType="number-pad" />
            <Field label="Distance (miles)" fieldKey="elementaryDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryDistance} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryDistance: t }))} keyboardType="decimal-pad" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>Middle</Text>
            <Field label="Name" fieldKey="middleSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.middleSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, middleSchoolName: t }))} />
            <Field label="Grades" fieldKey="middleGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.middleGrades} onChangeText={(t) => setDraft((d) => ({ ...d, middleGrades: t }))} placeholder="e.g. 6–8" />
            <Field label="Rating (0–10)" fieldKey="middleRating" inputRefs={inputRefs} onNext={focusNext} value={draft.middleRating} onChangeText={(t) => setDraft((d) => ({ ...d, middleRating: clampRating(t) }))} keyboardType="number-pad" />
            <Field label="Distance (miles)" fieldKey="middleDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.middleDistance} onChangeText={(t) => setDraft((d) => ({ ...d, middleDistance: t }))} keyboardType="decimal-pad" />

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />

            <Text style={{ color: colors.textPrimary, fontWeight: "900", marginBottom: 6 }}>High</Text>
            <Field label="Name" fieldKey="highSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.highSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, highSchoolName: t }))} />
            <Field label="Grades" fieldKey="highGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.highGrades} onChangeText={(t) => setDraft((d) => ({ ...d, highGrades: t }))} placeholder="e.g. 9–12" />
            <Field label="Rating (0–10)" fieldKey="highRating" inputRefs={inputRefs} onNext={focusNext} value={draft.highRating} onChangeText={(t) => setDraft((d) => ({ ...d, highRating: clampRating(t) }))} keyboardType="number-pad" />
            <Field label="Distance (miles)" fieldKey="highDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.highDistance} onChangeText={(t) => setDraft((d) => ({ ...d, highDistance: t }))} keyboardType="decimal-pad" />
          </Section>

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
            <DateRow
              label="Date Available"
              value={draft.dateAvailable}
              onPress={() => openDate("Date Available", draft.dateAvailable || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, dateAvailable: v })))}
              onClear={() => setDraft((d) => ({ ...d, dateAvailable: "" }))}
            />
            <DateRow
              label="Contacted Date"
              value={draft.contactedDate}
              onPress={() => openDate("Contacted Date", draft.contactedDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, contactedDate: v })))}
              onClear={() => setDraft((d) => ({ ...d, contactedDate: "" }))}
            />
            <DateRow
              label="Viewing Date"
              value={draft.viewingDate}
              onPress={() => openDate("Viewing Date", draft.viewingDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, viewingDate: v })))}
              onClear={() => setDraft((d) => ({ ...d, viewingDate: "" }))}
            />
            <SelectRow label="Viewing Time" value={draft.viewingTime} emptyLabel="Select" onPress={() => openTime(draft.viewingTime, (v) => setDraft((d) => ({ ...d, viewingTime: v })))} />
            <DateRow
              label="Applied Date"
              value={draft.appliedDate}
              onPress={() => openDate("Applied Date", draft.appliedDate || todayYYYYMMDD(), (v) => setDraft((d) => ({ ...d, appliedDate: v })))}
              onClear={() => setDraft((d) => ({ ...d, appliedDate: "" }))}
            />
          </Section>

          {/* ── NOTES ── */}
          <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
            <Field label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={(t) => setDraft((d) => ({ ...d, pros: t }))} multiline />
            <Field label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={(t) => setDraft((d) => ({ ...d, cons: t }))} multiline />
          </Section>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => ({
              marginTop: 6,
              borderRadius: 18,
              backgroundColor: colors.primaryBlue,
              paddingVertical: 14,
              alignItems: "center",
              opacity: pressed || saving ? 0.8 : 1,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            })}
          >
            {saving ? <ActivityIndicator size="small" color="#fff" /> : null}
            <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 16 }}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

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
