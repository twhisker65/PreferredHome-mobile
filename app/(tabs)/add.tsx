<<<<<<< HEAD
// app/(tabs)/add.tsx — Build 3.2.15.1 Hotfix
// Fix: PROPERTY_TYPES, COOLING_TYPES, PARKING restored to exact 3.2.14.1 values.
// All other logic identical to 3.2.15.
=======
// app/(tabs)/add.tsx — Build 3.2.14
// Changes from 3.2.13.2:
// - Import: detectListingSite added from ../../lib/api
// - LISTING_SITES: replaced with new 13-item list
// - useEffect added: watches draft.listingUrl, auto-sets draft.listingSite via detectListingSite
// All other fields, sections, payload, and logic unchanged from 3.2.12.
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)

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
import { postListing, lookupZip, detectListingSite, calculateCommute } from "../../lib/api";
import {
  loadProfileToggles,
  loadProfileData,
  type ProfileToggles,
  type ProfileData,
} from "../../lib/profileStorage";

// ── Types ─────────────────────────────────────────────────────────

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
  elementaryGrades: string;
  elementaryRating: string;
  elementaryDistance: string;
  middleSchoolName: string;
  middleGrades: string;
  middleRating: string;
  middleDistance: string;
  highSchoolName: string;
  highGrades: string;
  highRating: string;
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

// ── Constants ─────────────────────────────────────────────────────

const BLANK_DRAFT: Draft = {
  status: "New", preferred: false, buildingName: "", streetAddress: "",
  city: "", state: "", zipCode: "", neighborhood: "", unitNumber: "",
  floorNumber: "", numberOfFloors: "", bedrooms: "", bathrooms: "",
  squareFootage: "", topFloor: false, cornerUnit: false, propertyType: "",
  furnished: false, shortTermAvailable: false, rentersInsuranceRequired: false,
  baseRent: "", amenityFee: "", adminFee: "", utilityFee: "", parkingFee: "",
  otherFee: "", petFee: "", storageRent: "", securityDeposit: "",
  applicationFee: "", brokerFee: "", moveInFee: "",
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

// ── Option arrays — FROZEN. Do not modify without explicit instruction. ──
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

// ── Helpers ───────────────────────────────────────────────────────

function boolStr(v: boolean): string { return v ? "TRUE" : "FALSE"; }
function clampRating(v: string): string { const n = parseFloat(v); if (isNaN(n)) return v; return String(Math.min(n, 10)); }

<<<<<<< HEAD
// ── Sub-components — defined OUTSIDE main function to prevent remount on re-render ──

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
    <View style={{ gap: 4 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.4 }}>{label}</Text>
      <TextInput
        ref={(r) => { if (r) inputRefs.current[fieldKey] = r; }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="next"
        onSubmitEditing={() => onNext(fieldKey)}
        blurOnSubmit={false}
        style={{
          backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border,
          borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
          color: colors.textPrimary, fontSize: 14, minHeight: multiline ? 72 : undefined,
        }}
      />
    </View>
  );
}

function SelectRow({ label, value, onPress }: { label: string; value: string; onPress: () => void; }) {
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

function Toggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void; }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.primaryBlue }} thumbColor="#fff" />
    </View>
  );
}

function MultiRow({ label, values, onPress }: { label: string; values: string[]; onPress: () => void; }) {
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

function DateRow({ label, value, onPress, onClear }: { label: string; value: string; onPress: () => void; onClear: () => void; }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {value ? (
          <>
            <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{value}</Text>
            <Pressable onPress={onClear}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </Pressable>
          </>
        ) : (
          <Pressable onPress={onPress}>
            <Text style={{ color: colors.primaryBlue, fontSize: 14 }}>Set</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────

const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "", email: "", searchMode: "Rent",
  workAddress: "", commuteMethod: "Transit", departureTime: "",
};

=======
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
export default function AddTab() {
  const insets = useSafeAreaInsets();
  const inputRefs = useRef<Record<string, any>>({});
  const profileDataRef = useRef<ProfileData>(DEFAULT_PROFILE_DATA);
  const [draft, setDraft] = useState<Draft>(BLANK_DRAFT);
  const [open, setOpen] = useState({
    property: true, costs: true, features: true, transportation: true,
    schools: true, listing: true, timeline: true, notes: true,
  });
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });

  // Picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState("");
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [pickerSelected, setPickerSelected] = useState<string | string[]>("");
  const [pickerMulti, setPickerMulti] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<(v: any) => void>(() => () => {});

  // Date picker state
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerField, setDatePickerField] = useState<keyof Draft | null>(null);
  const [datePickerTitle, setDatePickerTitle] = useState("");

  // ZIP lookup
  const [zipLooking, setZipLooking] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfileToggles().then(setToggles);
      loadProfileData().then((d) => { profileDataRef.current = d; });
    }, [])
  );

  // ZIP auto-fill: triggers when ZIP reaches 5 digits
  useEffect(() => {
    const z = draft.zipCode;
    if (z.length !== 5) return;
    let cancelled = false;
    setZipLooking(true);
    lookupZip(z)
      .then((result) => {
        if (cancelled) return;
        if (result?.city && result?.state) {
          setDraft((d) => ({ ...d, city: result.city, state: result.state }));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setZipLooking(false); });
    return () => { cancelled = true; };
  }, [draft.zipCode]);

  // Listing Site auto-detect: triggers whenever Listing URL changes
  useEffect(() => {
    const detected = detectListingSite(draft.listingUrl);
    setDraft((d) => ({ ...d, listingSite: detected }));
  }, [draft.listingUrl]);

  function toggleSection(key: keyof typeof open) {
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  }

  function focusNext(currentKey: string) {
    const keys = Object.keys(inputRefs.current);
    const idx = keys.indexOf(currentKey);
    if (idx >= 0 && idx < keys.length - 1) {
      inputRefs.current[keys[idx + 1]]?.focus();
    }
  }

  function openSingle(title: string, options: string[], current: string, cb: (v: string) => void) {
    setPickerTitle(title); setPickerOptions(options); setPickerSelected(current);
    setPickerMulti(false); setPickerCallback(() => cb); setPickerVisible(true);
  }

  function openMulti(title: string, options: string[], current: string[], cb: (v: string[]) => void) {
    setPickerTitle(title); setPickerOptions(options); setPickerSelected(current);
    setPickerMulti(true); setPickerCallback(() => cb); setPickerVisible(true);
  }

  function openDatePicker(field: keyof Draft, title: string) {
    setDatePickerField(field); setDatePickerTitle(title); setDatePickerVisible(true);
  }

  function buildViewingAppointment(d: Draft): string | null {
    if (!d.viewingDate) return null;
    return `${d.viewingDate}T${d.viewingTime || "11:00 AM"}`;
  }

  async function handleSave() {
    if (!draft.buildingName.trim()) {
      Alert.alert("Required", "Building Name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        status: draft.status,
        preferred: boolStr(draft.preferred),
        buildingName: draft.buildingName,
        streetAddress: draft.streetAddress,
        city: draft.city,
        state: draft.state,
        zipCode: draft.zipCode,
        neighborhood: draft.neighborhood,
        propertyType: draft.propertyType,
        unitNumber: draft.unitNumber,
        floorNumber: draft.floorNumber ? Number(draft.floorNumber) : null,
        numberOfFloors: draft.numberOfFloors ? Number(draft.numberOfFloors) : null,
        bedrooms: draft.bedrooms ? Number(draft.bedrooms) : null,
        bathrooms: draft.bathrooms ? Number(draft.bathrooms) : null,
        squareFootage: draft.squareFootage ? Number(draft.squareFootage) : null,
        topFloor: boolStr(draft.topFloor),
        cornerUnit: boolStr(draft.cornerUnit),
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
        utilitiesIncluded: draft.utilitiesIncluded.join(", "),
        unitFeatures: draft.unitFeatures.join(", "),
        buildingAmenities: draft.buildingAmenities.join(", "),
        petAmenities: draft.petAmenities.join(", "),
        closeBy: draft.closeBy.join(", "),
        coolingType: draft.coolingType,
        heatingType: draft.heatingType,
        laundry: draft.laundry,
        parkingType: draft.parkingType,
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

      const saved = await postListing(payload);

      const pd = profileDataRef.current;
      if (pd.workAddress.trim() && draft.streetAddress.trim()) {
        const listingAddress = [draft.streetAddress, draft.city, draft.state, draft.zipCode]
          .filter(Boolean).join(", ");
        calculateCommute(saved.id, {
          workAddress: pd.workAddress,
          commuteMethod: pd.commuteMethod,
          departureTime: pd.departureTime,
          listingAddress,
        }).catch(() => {});
      }

      setDraft(BLANK_DRAFT);
      Alert.alert("Saved", "Listing added successfully.", [
        { text: "OK", onPress: () => router.push("/(tabs)/listings") },
      ]);
    } catch (err: any) {
      Alert.alert("Save Failed", err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Property type visibility helper
  const isAptCondoCoop = ["Apartment", "Condo", "Co-op"].includes(draft.propertyType);

  // ── Sub-component definitions ────────────────────────────────────

  function Section({ title, open: isOpen, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
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

  function Field({ label, fieldKey, value, onChangeText, keyboardType, placeholder, multiline }: {
    label: string; fieldKey: string; value: string; onChangeText: (t: string) => void;
    inputRefs?: any; onNext?: (k: string) => void;
    keyboardType?: any; placeholder?: string; multiline?: boolean;
  }) {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 3 }}>{label}</Text>
        <TextInput
          ref={(r) => { inputRefs.current[fieldKey] = r; }}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          placeholder={placeholder || ""}
          placeholderTextColor={colors.textSecondary}
          multiline={multiline}
          returnKeyType="next"
          onSubmitEditing={() => focusNext(fieldKey)}
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            color: colors.textPrimary,
            fontSize: 14,
            minHeight: multiline ? 80 : undefined,
          }}
        />
      </View>
    );
  }

  function SelectRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
    return (
      <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{value || "—"}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        </View>
      </Pressable>
    );
  }

  function Toggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primaryBlue }} />
      </View>
    );
  }

  function MultiRow({ label, values, onPress }: { label: string; values: string[]; onPress: () => void }) {
    return (
      <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1, justifyContent: "flex-end" }}>
          <Text style={{ color: colors.textPrimary, fontSize: 13, textAlign: "right", flexShrink: 1 }} numberOfLines={1}>
            {values.length > 0 ? values.join(", ") : "—"}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        </View>
      </Pressable>
    );
  }

  function DateRow({ label, value, onPress, onClear }: { label: string; value: string; onPress: () => void; onClear: () => void }) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {value ? (
            <>
              <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{value}</Text>
              <Pressable onPress={onClear}>
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={onPress}>
              <Text style={{ color: colors.primaryBlue, fontSize: 14 }}>Set</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // ── JSX ──────────────────────────────────────────────────────────

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
            <Field label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={(t) => setDraft((d) => ({ ...d, zipCode: t }))} keyboardType="number-pad" placeholder="e.g. 10001" />
            {(draft.city || draft.state || zipLooking) ? (
              <View style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 2 }}>City / State (from ZIP)</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>
                  {zipLooking ? "Looking up…" : `${draft.city}${draft.city && draft.state ? ", " : ""}${draft.state}`}
                </Text>
              </View>
            ) : null}
            <Field label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={(t) => setDraft((d) => ({ ...d, neighborhood: t }))} />
<<<<<<< HEAD
            <Field label="Unit Number" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={(t) => setDraft((d) => ({ ...d, unitNumber: t }))} />
            <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={(t) => setDraft((d) => ({ ...d, floorNumber: t }))} keyboardType="number-pad" />
            {isAptCondoCoop && <Field label="Number of Floors in Building" fieldKey="numberOfFloors" inputRefs={inputRefs} onNext={focusNext} value={draft.numberOfFloors} onChangeText={(t) => setDraft((d) => ({ ...d, numberOfFloors: t }))} keyboardType="number-pad" />}
            <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bedrooms: t }))} keyboardType="number-pad" />
            <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bathrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={(t) => setDraft((d) => ({ ...d, squareFootage: t }))} keyboardType="number-pad" />
            <Toggle label="Top Floor" value={draft.topFloor} onValueChange={(v) => setDraft((d) => ({ ...d, topFloor: v }))} />
            <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={(v) => setDraft((d) => ({ ...d, cornerUnit: v }))} />
=======
            {isAptCondoCoop && (
              <Field label="Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={(t) => setDraft((d) => ({ ...d, unitNumber: t }))} />
            )}
            {isAptCondoCoop && (
              <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={(t) => setDraft((d) => ({ ...d, floorNumber: t }))} keyboardType="decimal-pad" />
            )}
            <Field label="Number of Floors" fieldKey="numberOfFloors" inputRefs={inputRefs} onNext={focusNext} value={draft.numberOfFloors} onChangeText={(t) => setDraft((d) => ({ ...d, numberOfFloors: t }))} keyboardType="decimal-pad" />
            <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bedrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={(t) => setDraft((d) => ({ ...d, bathrooms: t }))} keyboardType="decimal-pad" />
            <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={(t) => setDraft((d) => ({ ...d, squareFootage: t }))} keyboardType="decimal-pad" />
            {isAptCondoCoop && (
              <Toggle label="Top Floor" value={draft.topFloor} onValueChange={(v) => setDraft((d) => ({ ...d, topFloor: v }))} />
            )}
            {isAptCondoCoop && (
              <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={(v) => setDraft((d) => ({ ...d, cornerUnit: v }))} />
            )}
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
            <Toggle label="Furnished" value={draft.furnished} onValueChange={(v) => setDraft((d) => ({ ...d, furnished: v }))} />
          </Section>

          {/* ── COSTS ── */}
          <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
<<<<<<< HEAD
            <Field label="Base Rent ($)" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={(t) => setDraft((d) => ({ ...d, baseRent: t }))} keyboardType="number-pad" />
            {toggles.car && <Field label="Parking Fee ($)" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={(t) => setDraft((d) => ({ ...d, parkingFee: t }))} keyboardType="number-pad" />}
            <Field label="Amenity Fee ($)" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={(t) => setDraft((d) => ({ ...d, amenityFee: t }))} keyboardType="number-pad" />
            <Field label="Admin Fee ($)" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={(t) => setDraft((d) => ({ ...d, adminFee: t }))} keyboardType="number-pad" />
            <Field label="Utility Fee ($)" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={(t) => setDraft((d) => ({ ...d, utilityFee: t }))} keyboardType="number-pad" />
            <Field label="Other Fee ($)" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={(t) => setDraft((d) => ({ ...d, otherFee: t }))} keyboardType="number-pad" />
            {toggles.pets && <Field label="Pet Fee ($)" fieldKey="petFee" inputRefs={inputRefs} onNext={focusNext} value={draft.petFee} onChangeText={(t) => setDraft((d) => ({ ...d, petFee: t }))} keyboardType="number-pad" />}
            <Field label="Storage Rent ($)" fieldKey="storageRent" inputRefs={inputRefs} onNext={focusNext} value={draft.storageRent} onChangeText={(t) => setDraft((d) => ({ ...d, storageRent: t }))} keyboardType="number-pad" />
            <Field label="Security Deposit ($)" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={(t) => setDraft((d) => ({ ...d, securityDeposit: t }))} keyboardType="number-pad" />
            <Field label="Application Fee ($)" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={(t) => setDraft((d) => ({ ...d, applicationFee: t }))} keyboardType="number-pad" />
            <Field label="Broker Fee ($)" fieldKey="brokerFee" inputRefs={inputRefs} onNext={focusNext} value={draft.brokerFee} onChangeText={(t) => setDraft((d) => ({ ...d, brokerFee: t }))} keyboardType="number-pad" />
            <Field label="Move-in Fee ($)" fieldKey="moveInFee" inputRefs={inputRefs} onNext={focusNext} value={draft.moveInFee} onChangeText={(t) => setDraft((d) => ({ ...d, moveInFee: t }))} keyboardType="number-pad" />
=======
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 4, marginBottom: 2 }}>MONTHLY</Text>
            <Field label="Base Rent" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={(t) => setDraft((d) => ({ ...d, baseRent: t }))} keyboardType="number-pad" />
            <Field label="Amenity Fee" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={(t) => setDraft((d) => ({ ...d, amenityFee: t }))} keyboardType="number-pad" />
            <Field label="Admin Fee" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={(t) => setDraft((d) => ({ ...d, adminFee: t }))} keyboardType="number-pad" />
            <Field label="Utility Fee" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={(t) => setDraft((d) => ({ ...d, utilityFee: t }))} keyboardType="number-pad" />
            {toggles.car && (
              <Field label="Parking Fee" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={(t) => setDraft((d) => ({ ...d, parkingFee: t }))} keyboardType="number-pad" />
            )}
            {toggles.pets && (
              <Field label="Pet Fee" fieldKey="petFee" inputRefs={inputRefs} onNext={focusNext} value={draft.petFee} onChangeText={(t) => setDraft((d) => ({ ...d, petFee: t }))} keyboardType="number-pad" />
            )}
            <Field label="Storage Rent" fieldKey="storageRent" inputRefs={inputRefs} onNext={focusNext} value={draft.storageRent} onChangeText={(t) => setDraft((d) => ({ ...d, storageRent: t }))} keyboardType="number-pad" />
            <Field label="Other Fee" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={(t) => setDraft((d) => ({ ...d, otherFee: t }))} keyboardType="number-pad" />
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>UP FRONT</Text>
            <Field label="Security Deposit" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={(t) => setDraft((d) => ({ ...d, securityDeposit: t }))} keyboardType="number-pad" />
            <Field label="Application Fee" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={(t) => setDraft((d) => ({ ...d, applicationFee: t }))} keyboardType="number-pad" />
            <Field label="Broker Fee" fieldKey="brokerFee" inputRefs={inputRefs} onNext={focusNext} value={draft.brokerFee} onChangeText={(t) => setDraft((d) => ({ ...d, brokerFee: t }))} keyboardType="number-pad" />
            <Field label="Move-in Fee" fieldKey="moveInFee" inputRefs={inputRefs} onNext={focusNext} value={draft.moveInFee} onChangeText={(t) => setDraft((d) => ({ ...d, moveInFee: t }))} keyboardType="number-pad" />
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
          </Section>

          {/* ── FEATURES ── */}
          <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
            <MultiRow label="Utilities Included" values={draft.utilitiesIncluded} onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, (v) => setDraft((d) => ({ ...d, utilitiesIncluded: v })))} />
            <MultiRow label="Unit Features" values={draft.unitFeatures} onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, (v) => setDraft((d) => ({ ...d, unitFeatures: v })))} />
            <SelectRow label="Cooling Type" value={draft.coolingType} onPress={() => openSingle("Cooling Type", COOLING_TYPES, draft.coolingType, (v) => setDraft((d) => ({ ...d, coolingType: v })))} />
            <SelectRow label="Heating Type" value={draft.heatingType} onPress={() => openSingle("Heating Type", HEATING_TYPES, draft.heatingType, (v) => setDraft((d) => ({ ...d, heatingType: v })))} />
            <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, (v) => setDraft((d) => ({ ...d, laundry: v })))} />
            <MultiRow label="Rooms" values={draft.roomTypes} onPress={() => openMulti("Rooms", ROOM_TYPES, draft.roomTypes, (v) => setDraft((d) => ({ ...d, roomTypes: v })))} />
            <MultiRow label="Building Amenities" values={draft.buildingAmenities} onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, (v) => setDraft((d) => ({ ...d, buildingAmenities: v })))} />
            <MultiRow label="Private Outdoor Space" values={draft.privateOutdoorSpaceTypes} onPress={() => openMulti("Private Outdoor Space", PRIVATE_OUTDOOR_SPACE, draft.privateOutdoorSpaceTypes, (v) => setDraft((d) => ({ ...d, privateOutdoorSpaceTypes: v })))} />
            <MultiRow label="Storage" values={draft.storageTypes} onPress={() => openMulti("Storage", STORAGE_TYPES, draft.storageTypes, (v) => setDraft((d) => ({ ...d, storageTypes: v })))} />
            {toggles.car && (
              <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, (v) => setDraft((d) => ({ ...d, parkingType: v })))} />
            )}
            {toggles.pets && (
              <MultiRow label="Pet Amenities" values={draft.petAmenities} onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, (v) => setDraft((d) => ({ ...d, petAmenities: v })))} />
            )}
            <MultiRow label="Close By" values={draft.closeBy} onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, (v) => setDraft((d) => ({ ...d, closeBy: v })))} />
          </Section>

          {/* ── TRANSPORTATION ── */}
          <Section title="Transportation" open={open.transportation} onToggle={() => toggleSection("transportation")}>
            <Field label="Commute Time (min)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={(t) => setDraft((d) => ({ ...d, commuteTime: t }))} keyboardType="number-pad" />
            <Field label="Walk Score (0–100)" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={(t) => setDraft((d) => ({ ...d, walkScore: t }))} keyboardType="number-pad" />
            <Field label="Transit Score (0–100)" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={(t) => setDraft((d) => ({ ...d, transitScore: t }))} keyboardType="number-pad" />
            <Field label="Bike Score (0–100)" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={(t) => setDraft((d) => ({ ...d, bikeScore: t }))} keyboardType="number-pad" />
          </Section>

          {/* ── SCHOOLS ── */}
          {toggles.children && (
            <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 4, marginBottom: 2 }}>ELEMENTARY SCHOOL</Text>
              <Field label="School Name" fieldKey="elementarySchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.elementarySchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, elementarySchoolName: t }))} />
              <Field label="Grades" fieldKey="elementaryGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryGrades} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryGrades: t }))} />
              <Field label="Rating (0–10)" fieldKey="elementaryRating" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryRating} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryRating: clampRating(t) }))} keyboardType="decimal-pad" />
              <Field label="Distance (mi)" fieldKey="elementaryDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryDistance} onChangeText={(t) => setDraft((d) => ({ ...d, elementaryDistance: t }))} keyboardType="decimal-pad" />
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>MIDDLE SCHOOL</Text>
              <Field label="School Name" fieldKey="middleSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.middleSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, middleSchoolName: t }))} />
              <Field label="Grades" fieldKey="middleGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.middleGrades} onChangeText={(t) => setDraft((d) => ({ ...d, middleGrades: t }))} />
              <Field label="Rating (0–10)" fieldKey="middleRating" inputRefs={inputRefs} onNext={focusNext} value={draft.middleRating} onChangeText={(t) => setDraft((d) => ({ ...d, middleRating: clampRating(t) }))} keyboardType="decimal-pad" />
              <Field label="Distance (mi)" fieldKey="middleDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.middleDistance} onChangeText={(t) => setDraft((d) => ({ ...d, middleDistance: t }))} keyboardType="decimal-pad" />
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>HIGH SCHOOL</Text>
              <Field label="School Name" fieldKey="highSchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.highSchoolName} onChangeText={(t) => setDraft((d) => ({ ...d, highSchoolName: t }))} />
              <Field label="Grades" fieldKey="highGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.highGrades} onChangeText={(t) => setDraft((d) => ({ ...d, highGrades: t }))} />
              <Field label="Rating (0–10)" fieldKey="highRating" inputRefs={inputRefs} onNext={focusNext} value={draft.highRating} onChangeText={(t) => setDraft((d) => ({ ...d, highRating: clampRating(t) }))} keyboardType="decimal-pad" />
              <Field label="Distance (mi)" fieldKey="highDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.highDistance} onChangeText={(t) => setDraft((d) => ({ ...d, highDistance: t }))} keyboardType="decimal-pad" />
            </Section>
          )}

          {/* ── LISTING ── */}
          <Section title="Listing" open={open.listing} onToggle={() => toggleSection("listing")}>
            <SelectRow label="Listing Site" value={draft.listingSite} onPress={() => openSingle("Listing Site", LISTING_SITES, draft.listingSite, (v) => setDraft((d) => ({ ...d, listingSite: v })))} />
            <Field label="Listing URL" fieldKey="listingUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.listingUrl} onChangeText={(t) => setDraft((d) => ({ ...d, listingUrl: t }))} />
            <Field label="Photo URL" fieldKey="photoUrl" inputRefs={inputRefs} onNext={focusNext} value={draft.photoUrl} onChangeText={(t) => setDraft((d) => ({ ...d, photoUrl: t }))} />
            <Field label="Contact Name" fieldKey="contactName" inputRefs={inputRefs} onNext={focusNext} value={draft.contactName} onChangeText={(t) => setDraft((d) => ({ ...d, contactName: t }))} />
            <Field label="Contact Phone" fieldKey="contactPhone" inputRefs={inputRefs} onNext={focusNext} value={draft.contactPhone} onChangeText={(t) => setDraft((d) => ({ ...d, contactPhone: t }))} keyboardType="phone-pad" />
            <Field label="Contact Email" fieldKey="contactEmail" inputRefs={inputRefs} onNext={focusNext} value={draft.contactEmail} onChangeText={(t) => setDraft((d) => ({ ...d, contactEmail: t }))} keyboardType="email-address" />
            <Field label="Lease Length" fieldKey="leaseLength" inputRefs={inputRefs} onNext={focusNext} value={draft.leaseLength} onChangeText={(t) => setDraft((d) => ({ ...d, leaseLength: t }))} />
            <Toggle label="No Board Approval" value={draft.noBoardApproval} onValueChange={(v) => setDraft((d) => ({ ...d, noBoardApproval: v }))} />
            <Toggle label="No Broker Fee" value={draft.noBrokerFee} onValueChange={(v) => setDraft((d) => ({ ...d, noBrokerFee: v }))} />
            <Toggle label="Short Term Available" value={draft.shortTermAvailable} onValueChange={(v) => setDraft((d) => ({ ...d, shortTermAvailable: v }))} />
            <Toggle label="Renters Insurance Required" value={draft.rentersInsuranceRequired} onValueChange={(v) => setDraft((d) => ({ ...d, rentersInsuranceRequired: v }))} />
          </Section>

          {/* ── TIMELINE ── */}
          <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
            <DateRow label="Date Available" value={draft.dateAvailable} onPress={() => openDatePicker("dateAvailable", "Date Available")} onClear={() => setDraft((d) => ({ ...d, dateAvailable: "" }))} />
            <DateRow label="Contacted Date" value={draft.contactedDate} onPress={() => openDatePicker("contactedDate", "Contacted Date")} onClear={() => setDraft((d) => ({ ...d, contactedDate: "" }))} />
            <DateRow label="Viewing Date" value={draft.viewingDate} onPress={() => openDatePicker("viewingDate", "Viewing Date")} onClear={() => setDraft((d) => ({ ...d, viewingDate: "" }))} />
            {!draft.viewingDate && (
              <SelectRow label="Viewing Time" value={draft.viewingTime} onPress={() => openSingle("Viewing Time", TIME_OPTIONS, draft.viewingTime, (v) => setDraft((d) => ({ ...d, viewingTime: v })))} />
            )}
            <DateRow label="Applied Date" value={draft.appliedDate} onPress={() => openDatePicker("appliedDate", "Applied Date")} onClear={() => setDraft((d) => ({ ...d, appliedDate: "" }))} />
          </Section>

          {/* ── NOTES ── */}
          <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
            <Field label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={(t) => setDraft((d) => ({ ...d, pros: t }))} multiline />
            <Field label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={(t) => setDraft((d) => ({ ...d, cons: t }))} multiline />
          </Section>

<<<<<<< HEAD
          <Pressable onPress={handleSave} disabled={saving} style={{ backgroundColor: colors.primaryBlue, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 }}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Save Listing</Text>}
=======
          {/* ── SAVE BUTTON ── */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={{ backgroundColor: colors.primaryBlue, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 }}
          >
            {saving ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>Save Listing</Text>
            )}
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── PICKER MODAL ── */}
      <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => { if (pickerMulti) pickerCallback(pickerSelected); setPickerVisible(false); }} />
        <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32, maxHeight: "60%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>{pickerTitle}</Text>
            <Pressable onPress={() => { if (pickerMulti) pickerCallback(pickerSelected); setPickerVisible(false); }}>
              <Text style={{ color: colors.primaryBlue, fontSize: 15, fontWeight: "700" }}>Done</Text>
            </Pressable>
          </View>
          <ScrollView>
            {pickerOptions.map((opt) => {
              const isSelected = pickerMulti
                ? (pickerSelected as string[]).includes(opt)
                : pickerSelected === opt;
              return (
<<<<<<< HEAD
                <Pressable key={opt} onPress={() => {
                  if (pickerMulti) {
                    const cur = pickerSelected as string[];
                    setPickerSelected(cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt]);
                  } else { setPickerSelected(opt); pickerCallback(opt); setPickerVisible(false); }
                }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
=======
                <Pressable
                  key={opt}
                  onPress={() => {
                    if (pickerMulti) {
                      const cur = pickerSelected as string[];
                      setPickerSelected(cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt]);
                    } else {
                      setPickerSelected(opt);
                    }
                  }}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}
                >
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
                  <Text style={{ color: isSelected ? colors.primaryBlue : colors.textPrimary, fontSize: 15 }}>{opt}</Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color={colors.primaryBlue} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* ── DATE PICKER MODAL ── */}
      <Modal visible={datePickerVisible} transparent animationType="slide" onRequestClose={() => setDatePickerVisible(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setDatePickerVisible(false)} />
        <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>{datePickerTitle}</Text>
            <Pressable onPress={() => setDatePickerVisible(false)}>
              <Text style={{ color: colors.primaryBlue, fontSize: 15, fontWeight: "700" }}>Done</Text>
            </Pressable>
          </View>
          <Calendar
<<<<<<< HEAD
            onDayPress={(day: any) => { if (datePickerField) setDraft((d) => ({ ...d, [datePickerField]: day.dateString })); setDatePickerVisible(false); }}
            theme={{ backgroundColor: colors.card, calendarBackground: colors.card, textSectionTitleColor: colors.textSecondary, dayTextColor: colors.textPrimary, todayTextColor: colors.primaryBlue, selectedDayBackgroundColor: colors.primaryBlue, selectedDayTextColor: "#fff", monthTextColor: colors.textPrimary, arrowColor: colors.primaryBlue }}
=======
            onDayPress={(day: any) => {
              if (datePickerField) {
                setDraft((d) => ({ ...d, [datePickerField]: day.dateString }));
              }
              setDatePickerVisible(false);
            }}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              dayTextColor: colors.textPrimary,
              todayTextColor: colors.primaryBlue,
              selectedDayBackgroundColor: colors.primaryBlue,
              selectedDayTextColor: "#fff",
              monthTextColor: colors.textPrimary,
              arrowColor: colors.primaryBlue,
            }}
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
          />
        </View>
      </Modal>

<<<<<<< HEAD
      {menuOpen && <MenuPanel topOffset={insets.top + 53} onSelectPanel={(p) => { setMenuOpen(false); setActiveSubPanel(p); }} onClose={() => setMenuOpen(false)} />}
      {activeSubPanel === "profile" && <ProfilePanel topOffset={insets.top + 53} onClose={() => { setActiveSubPanel(null); loadProfileToggles().then(setToggles); loadProfileData().then((d) => { profileDataRef.current = d; }); }} />}
      {activeSubPanel === "criteria" && <CriteriaPanel topOffset={insets.top + 53} onClose={() => setActiveSubPanel(null)} />}
      {activeSubPanel === "settings" && <SettingsPanel topOffset={insets.top + 53} onClose={() => setActiveSubPanel(null)} />}
=======
      {/* ── MENU ── */}
      {menuOpen && (
        <MenuPanel
          topOffset={insets.top + 53}
          onSelectPanel={(p) => { setMenuOpen(false); setActiveSubPanel(p); }}
          onClose={() => setMenuOpen(false)}
        />
      )}
      {activeSubPanel === "profile" && (
        <ProfilePanel
          topOffset={insets.top + 53}
          onClose={() => {
            setActiveSubPanel(null);
            loadProfileToggles().then(setToggles);
          }}
        />
      )}
      {activeSubPanel === "criteria" && (
        <CriteriaPanel topOffset={insets.top + 53} onClose={() => setActiveSubPanel(null)} />
      )}
      {activeSubPanel === "settings" && (
        <SettingsPanel topOffset={insets.top + 53} onClose={() => setActiveSubPanel(null)} />
      )}
>>>>>>> parent of 772dfa5 (Build 3.2.14.1 Hotfix)
    </View>
  );
}
