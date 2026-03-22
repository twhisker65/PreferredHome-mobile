// app/edit.tsx — Build 3.2.12.2
// Changes from 3.2.12.1:
// - FIXED: fetchListing (did not exist) replaced with getListings() + find by id.
// - FIXED: Option arrays restored to exact 3.2.11B values:
//   UTILITIES, UNIT_FEATURES, BUILDING_AMENITIES, PRIVATE_OUTDOOR_SPACE,
//   STORAGE_TYPES, ROOM_TYPES, CLOSE_BY, PET_AMENITIES.
// - FIXED: Costs section field order restored to exact 3.2.11B sequence.
// All other fields, sections, rawToDraft, payload, and logic unchanged from 3.2.12.

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
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import { TopBar } from "../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../components/MenuPanel";
import { ProfilePanel } from "../components/ProfilePanel";
import { CriteriaPanel } from "../components/CriteriaPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { Calendar } from "react-native-calendars";
import { getListings, updateListing } from "../lib/api";
import { loadProfileToggles, type ProfileToggles } from "../lib/profileStorage";

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

const STATUS = ["New", "Contacted", "Scheduled", "Viewed", "Shortlisted", "Applied", "Approved", "Signed", "Rejected", "Archived"];
const PROPERTY_TYPES = ["Apartment", "Condo", "Co-op", "Townhouse", "House"];
const COOLING_TYPES = ["Central Air", "Wall Unit", "Window Unit", "None"];
const HEATING_TYPES = ["Forced Air", "Baseboard", "Radiant", "Steam", "Electric", "Natural Gas", "Oil", "Propane", "None"];
const LAUNDRY = ["None", "In-Unit", "On Floor", "In Building"];
const PARKING = ["Shared Garage", "Shared Lot", "Covered Space", "Attached Garage", "Detached Garage", "Driveway", "Carport", "Street", "None", "Other"];
const UTILITIES = ["Electric", "Gas", "Heat", "Hot Water", "Water", "Sewer", "Trash", "Internet", "Cable", "Parking", "Lawn Care", "Snow Removal", "Pool Maintenance"];
const UNIT_FEATURES = ["Hardwood Floors", "Dishwasher", "Microwave", "Fireplace", "Views", "Large Windows"];
const BUILDING_AMENITIES = ["Rooftop Space", "Common Lounge", "Barbecue Area", "Firepits", "Gym", "Pool", "Doorman", "Elevator", "Game Room", "Theater Room", "Playground", "Tennis Court"];
const PRIVATE_OUTDOOR_SPACE = ["Balcony", "Patio", "Deck", "Porch", "Private Yard", "Fenced Yard", "Other"];
const PET_AMENITIES = ["Pet Washing", "Dog Park"];
const CLOSE_BY = ["Subway", "Bus Stop", "Grocery Store", "Park", "Restaurants", "Pharmacy", "Coffee Shop", "Gym", "School", "Hospital", "Library", "Dog Park", "Farmer's Market", "Shopping Mall", "Highway Access"];
const STORAGE_TYPES = ["Closet", "Walk-in Closet", "Basement", "Attic", "Garage", "Shed", "Locker", "Pantry", "Outdoor Storage", "Bike Storage", "Other"];
const ROOM_TYPES = ["Living Room", "Dining Room", "Kitchen", "Eat-in Kitchen", "Foyer", "Den", "Family Room", "TV Room", "Office", "Library", "Sunroom", "Mudroom", "Laundry Room", "Finished Basement", "Bonus Room", "Playroom", "Other"];
const LISTING_SITES = ["StreetEasy", "Zillow", "Apartments.com", "Realtor.com", "Craigslist", "Facebook Marketplace", "Direct", "Other"];
const TIME_OPTIONS = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM",
];

function boolStr(v: boolean): string {
  return v ? "TRUE" : "FALSE";
}

function boolVal(v: any): boolean {
  if (typeof v === "boolean") return v;
  return String(v ?? "").trim().toUpperCase() === "TRUE";
}

function str(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function multiVal(v: any): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  const s = str(v);
  if (!s) return [];
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function clampRating(v: string): string {
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return String(Math.min(n, 10));
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
    numberOfFloors: str(raw?.numberOfFloors),
    bedrooms: str(raw?.bedrooms),
    bathrooms: str(raw?.bathrooms),
    squareFootage: str(raw?.squareFootage),
    topFloor: boolVal(raw?.topFloor),
    cornerUnit: boolVal(raw?.cornerUnit),
    propertyType: str(raw?.propertyType) || "Apartment",
    furnished: boolVal(raw?.furnished),
    shortTermAvailable: boolVal(raw?.shortTermAvailable),
    rentersInsuranceRequired: boolVal(raw?.rentersInsuranceRequired),
    baseRent: str(raw?.baseRent),
    amenityFee: str(raw?.amenityFee),
    adminFee: str(raw?.adminFee),
    utilityFee: str(raw?.utilityFee),
    parkingFee: str(raw?.parkingFee),
    otherFee: str(raw?.otherFee),
    petFee: str(raw?.petFee),
    storageRent: str(raw?.storageRent),
    securityDeposit: str(raw?.securityDeposit),
    applicationFee: str(raw?.applicationFee),
    brokerFee: str(raw?.brokerFee),
    moveInFee: str(raw?.moveInFee),
    utilitiesIncluded: multiVal(raw?.utilitiesIncluded),
    unitFeatures: multiVal(raw?.unitFeatures),
    buildingAmenities: multiVal(raw?.buildingAmenities),
    petAmenities: multiVal(raw?.petAmenities),
    closeBy: multiVal(raw?.closeBy),
    coolingType: str(raw?.coolingType) || "None",
    heatingType: str(raw?.heatingType) || "None",
    laundry: str(raw?.laundry) || "None",
    parkingType: str(raw?.parkingType) || "None",
    roomTypes: multiVal(raw?.roomTypes),
    privateOutdoorSpaceTypes: multiVal(raw?.privateOutdoorSpaceTypes),
    storageTypes: multiVal(raw?.storageTypes),
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

function buildViewingAppointment(d: Draft): string | null {
  if (!d.viewingDate) return null;
  return `${d.viewingDate}T${d.viewingTime || "11:00 AM"}`;
}

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inputRefs = useRef<Record<string, any>>({});
  const [draft, setDraft] = useState<Draft | null>(null);
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

  useEffect(() => {
    loadProfileToggles().then(setToggles);
    if (id) {
      getListings()
        .then((all) => {
          const raw = all.find((r: any) => String(r.id) === String(id));
          if (raw) {
            setDraft(rawToDraft(raw));
          } else {
            Alert.alert("Error", "Could not load listing.");
          }
        })
        .catch(() => {
          Alert.alert("Error", "Could not load listing.");
        });
    }
  }, [id]);

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
    setPickerTitle(title);
    setPickerOptions(options);
    setPickerSelected(current);
    setPickerMulti(false);
    setPickerCallback(() => cb);
    setPickerVisible(true);
  }

  function openMulti(title: string, options: string[], current: string[], cb: (v: string[]) => void) {
    setPickerTitle(title);
    setPickerOptions(options);
    setPickerSelected(current);
    setPickerMulti(true);
    setPickerCallback(() => cb);
    setPickerVisible(true);
  }

  function openDatePicker(field: keyof Draft, title: string) {
    setDatePickerField(field);
    setDatePickerTitle(title);
    setDatePickerVisible(true);
  }

  async function handleSave() {
    if (!draft) return;
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

  // Property type visibility helper
  const isAptCondoCoop = ["Apartment", "Condo", "Co-op"].includes(draft.propertyType);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Edit Listing" onPressMenu={() => setMenuOpen(true)} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 }}>

          {/* ── PROPERTY ── City and State appear BEFORE Zip Code on Edit ── */}
          <Section title="Property" open={open.property} onToggle={() => toggleSection("property")}>
            <SelectRow label="Status" value={draft.status} onPress={() => openSingle("Status", STATUS, draft.status, set("status"))} />
            <SelectRow label="Property Type" value={draft.propertyType} onPress={() => openSingle("Property Type", PROPERTY_TYPES, draft.propertyType, set("propertyType"))} />
            <Toggle label="Preferred" value={draft.preferred} onValueChange={set("preferred")} />
            <Field label="Building Name" fieldKey="buildingName" inputRefs={inputRefs} onNext={focusNext} value={draft.buildingName} onChangeText={set("buildingName")} />
            <Field label="Street Address" fieldKey="streetAddress" inputRefs={inputRefs} onNext={focusNext} value={draft.streetAddress} onChangeText={set("streetAddress")} placeholder="Street only" />
            <Field label="City" fieldKey="city" inputRefs={inputRefs} onNext={focusNext} value={draft.city} onChangeText={set("city")} />
            <Field label="State" fieldKey="state" inputRefs={inputRefs} onNext={focusNext} value={draft.state} onChangeText={set("state")} placeholder="e.g. NY" />
            <Field label="Zip Code" fieldKey="zipCode" inputRefs={inputRefs} onNext={focusNext} value={draft.zipCode} onChangeText={set("zipCode")} keyboardType="number-pad" />
            <Field label="Neighborhood" fieldKey="neighborhood" inputRefs={inputRefs} onNext={focusNext} value={draft.neighborhood} onChangeText={set("neighborhood")} />
            {isAptCondoCoop && (
              <Field label="Unit #" fieldKey="unitNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.unitNumber} onChangeText={set("unitNumber")} />
            )}
            {isAptCondoCoop && (
              <Field label="Floor Number" fieldKey="floorNumber" inputRefs={inputRefs} onNext={focusNext} value={draft.floorNumber} onChangeText={set("floorNumber")} keyboardType="decimal-pad" />
            )}
            <Field label="Number of Floors" fieldKey="numberOfFloors" inputRefs={inputRefs} onNext={focusNext} value={draft.numberOfFloors} onChangeText={set("numberOfFloors")} keyboardType="decimal-pad" />
            <Field label="Bedrooms" fieldKey="bedrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bedrooms} onChangeText={set("bedrooms")} keyboardType="decimal-pad" />
            <Field label="Bathrooms" fieldKey="bathrooms" inputRefs={inputRefs} onNext={focusNext} value={draft.bathrooms} onChangeText={set("bathrooms")} keyboardType="decimal-pad" />
            <Field label="Square Footage" fieldKey="squareFootage" inputRefs={inputRefs} onNext={focusNext} value={draft.squareFootage} onChangeText={set("squareFootage")} keyboardType="decimal-pad" />
            {isAptCondoCoop && (
              <Toggle label="Top Floor" value={draft.topFloor} onValueChange={set("topFloor")} />
            )}
            {isAptCondoCoop && (
              <Toggle label="Corner Unit" value={draft.cornerUnit} onValueChange={set("cornerUnit")} />
            )}
            <Toggle label="Furnished" value={draft.furnished} onValueChange={set("furnished")} />
          </Section>

          {/* ── COSTS ── */}
          <Section title="Costs" open={open.costs} onToggle={() => toggleSection("costs")}>
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 }}>MONTHLY</Text>
            <Field label="Base Rent" fieldKey="baseRent" inputRefs={inputRefs} onNext={focusNext} value={draft.baseRent} onChangeText={set("baseRent")} keyboardType="number-pad" />
            <Field label="Utility Fee" fieldKey="utilityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.utilityFee} onChangeText={set("utilityFee")} keyboardType="number-pad" />
            <Field label="Amenity Fee" fieldKey="amenityFee" inputRefs={inputRefs} onNext={focusNext} value={draft.amenityFee} onChangeText={set("amenityFee")} keyboardType="number-pad" />
            {toggles.car && (
              <Field label="Parking Fee" fieldKey="parkingFee" inputRefs={inputRefs} onNext={focusNext} value={draft.parkingFee} onChangeText={set("parkingFee")} keyboardType="number-pad" />
            )}
            <Field label="Storage Rent" fieldKey="storageRent" inputRefs={inputRefs} onNext={focusNext} value={draft.storageRent} onChangeText={set("storageRent")} keyboardType="number-pad" />
            {toggles.pets && (
              <Field label="Pet Fee" fieldKey="petFee" inputRefs={inputRefs} onNext={focusNext} value={draft.petFee} onChangeText={set("petFee")} keyboardType="number-pad" />
            )}
            <Field label="Admin Fee" fieldKey="adminFee" inputRefs={inputRefs} onNext={focusNext} value={draft.adminFee} onChangeText={set("adminFee")} keyboardType="number-pad" />
            <Field label="Other Fee" fieldKey="otherFee" inputRefs={inputRefs} onNext={focusNext} value={draft.otherFee} onChangeText={set("otherFee")} keyboardType="number-pad" />
            <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>UPFRONT</Text>
            <Field label="Security Deposit" fieldKey="securityDeposit" inputRefs={inputRefs} onNext={focusNext} value={draft.securityDeposit} onChangeText={set("securityDeposit")} keyboardType="number-pad" />
            <Field label="Application Fee" fieldKey="applicationFee" inputRefs={inputRefs} onNext={focusNext} value={draft.applicationFee} onChangeText={set("applicationFee")} keyboardType="number-pad" />
            <Field label="Broker Fee" fieldKey="brokerFee" inputRefs={inputRefs} onNext={focusNext} value={draft.brokerFee} onChangeText={set("brokerFee")} keyboardType="number-pad" />
            <Field label="Move-in Fee" fieldKey="moveInFee" inputRefs={inputRefs} onNext={focusNext} value={draft.moveInFee} onChangeText={set("moveInFee")} keyboardType="number-pad" />
          </Section>

          {/* ── FEATURES ── */}
          <Section title="Features" open={open.features} onToggle={() => toggleSection("features")}>
            <MultiRow label="Utilities Included" values={draft.utilitiesIncluded} onPress={() => openMulti("Utilities Included", UTILITIES, draft.utilitiesIncluded, set("utilitiesIncluded"))} />
            <MultiRow label="Unit Features" values={draft.unitFeatures} onPress={() => openMulti("Unit Features", UNIT_FEATURES, draft.unitFeatures, set("unitFeatures"))} />
            <SelectRow label="Cooling Type" value={draft.coolingType} onPress={() => openSingle("Cooling Type", COOLING_TYPES, draft.coolingType, set("coolingType"))} />
            <SelectRow label="Heating Type" value={draft.heatingType} onPress={() => openSingle("Heating Type", HEATING_TYPES, draft.heatingType, set("heatingType"))} />
            <SelectRow label="Laundry" value={draft.laundry} onPress={() => openSingle("Laundry", LAUNDRY, draft.laundry, set("laundry"))} />
            <MultiRow label="Rooms" values={draft.roomTypes} onPress={() => openMulti("Rooms", ROOM_TYPES, draft.roomTypes, set("roomTypes"))} />
            <MultiRow label="Private Outdoor Space" values={draft.privateOutdoorSpaceTypes} onPress={() => openMulti("Private Outdoor Space", PRIVATE_OUTDOOR_SPACE, draft.privateOutdoorSpaceTypes, set("privateOutdoorSpaceTypes"))} />
            <MultiRow label="Storage" values={draft.storageTypes} onPress={() => openMulti("Storage", STORAGE_TYPES, draft.storageTypes, set("storageTypes"))} />
            <MultiRow label="Building Amenities" values={draft.buildingAmenities} onPress={() => openMulti("Building Amenities", BUILDING_AMENITIES, draft.buildingAmenities, set("buildingAmenities"))} />
            {toggles.pets && (
              <MultiRow label="Pet Amenities" values={draft.petAmenities} onPress={() => openMulti("Pet Amenities", PET_AMENITIES, draft.petAmenities, set("petAmenities"))} />
            )}
            {toggles.car && (
              <SelectRow label="Parking Type" value={draft.parkingType} onPress={() => openSingle("Parking Type", PARKING, draft.parkingType, set("parkingType"))} />
            )}
            <MultiRow label="Close By" values={draft.closeBy} onPress={() => openMulti("Close By", CLOSE_BY, draft.closeBy, set("closeBy"))} />
          </Section>

          {/* ── TRANSPORTATION ── */}
          <Section title="Transportation" open={open.transportation} onToggle={() => toggleSection("transportation")}>
            <Field label="Commute Time (mins)" fieldKey="commuteTime" inputRefs={inputRefs} onNext={focusNext} value={draft.commuteTime} onChangeText={set("commuteTime")} keyboardType="number-pad" />
            <Field label="Walk Score (0–100)" fieldKey="walkScore" inputRefs={inputRefs} onNext={focusNext} value={draft.walkScore} onChangeText={set("walkScore")} keyboardType="number-pad" />
            <Field label="Transit Score (0–100)" fieldKey="transitScore" inputRefs={inputRefs} onNext={focusNext} value={draft.transitScore} onChangeText={set("transitScore")} keyboardType="number-pad" />
            <Field label="Bike Score (0–100)" fieldKey="bikeScore" inputRefs={inputRefs} onNext={focusNext} value={draft.bikeScore} onChangeText={set("bikeScore")} keyboardType="number-pad" />
          </Section>

          {/* ── SCHOOLS ── */}
          {toggles.children && (
            <Section title="Schools" open={open.schools} onToggle={() => toggleSection("schools")}>
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 }}>ELEMENTARY</Text>
              <Field label="School Name" fieldKey="elementarySchoolName" inputRefs={inputRefs} onNext={focusNext} value={draft.elementarySchoolName} onChangeText={set("elementarySchoolName")} />
              <Field label="Grades" fieldKey="elementaryGrades" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryGrades} onChangeText={set("elementaryGrades")} />
              <Field label="Rating (0–10)" fieldKey="elementaryRating" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryRating} onChangeText={(t) => set("elementaryRating")(clampRating(t))} keyboardType="decimal-pad" />
              <Field label="Distance (mi)" fieldKey="elementaryDistance" inputRefs={inputRefs} onNext={focusNext} value={draft.elementaryDistance} onChangeText={set("elementaryDistance")} keyboardType="decimal-pad" />
              <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 6, marginBottom: 2 }}>MIDDLE</Text>
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

          {/* ── LISTING ── */}
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

          {/* ── TIMELINE ── */}
          <Section title="Timeline" open={open.timeline} onToggle={() => toggleSection("timeline")}>
            <DateRow label="Date Available" value={draft.dateAvailable} onPress={() => openDatePicker("dateAvailable", "Date Available")} onClear={() => set("dateAvailable")("")} />
            <DateRow label="Contacted Date" value={draft.contactedDate} onPress={() => openDatePicker("contactedDate", "Contacted Date")} onClear={() => set("contactedDate")("")} />
            <DateRow label="Viewing Date" value={draft.viewingDate} onPress={() => openDatePicker("viewingDate", "Viewing Date")} onClear={() => set("viewingDate")("")} />
            {!!draft.viewingDate && (
              <SelectRow label="Viewing Time" value={draft.viewingTime} onPress={() => openSingle("Viewing Time", TIME_OPTIONS, draft.viewingTime, set("viewingTime"))} />
            )}
            <DateRow label="Applied Date" value={draft.appliedDate} onPress={() => openDatePicker("appliedDate", "Applied Date")} onClear={() => set("appliedDate")("")} />
          </Section>

          {/* ── NOTES ── */}
          <Section title="Notes" open={open.notes} onToggle={() => toggleSection("notes")}>
            <Field label="Pros" fieldKey="pros" inputRefs={inputRefs} onNext={focusNext} value={draft.pros} onChangeText={set("pros")} multiline />
            <Field label="Cons" fieldKey="cons" inputRefs={inputRefs} onNext={focusNext} value={draft.cons} onChangeText={set("cons")} multiline />
          </Section>

          {/* ── SAVE BUTTON ── */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={{ backgroundColor: colors.primaryBlue, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 }}
          >
            {saving ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>Save Changes</Text>
            )}
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── PICKER MODAL ── */}
      <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setPickerVisible(false)} />
        <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "70%", paddingBottom: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>{pickerTitle}</Text>
            <Pressable onPress={() => { pickerCallback(pickerSelected); setPickerVisible(false); }}>
              <Text style={{ color: colors.primaryBlue, fontSize: 15, fontWeight: "700" }}>Done</Text>
            </Pressable>
          </View>
          <ScrollView>
            {pickerOptions.map((opt) => {
              const isSelected = pickerMulti
                ? (pickerSelected as string[]).includes(opt)
                : pickerSelected === opt;
              return (
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
            onDayPress={(day: { dateString: string }) => {
              if (datePickerField) {
                setDraft((d) => d ? { ...d, [datePickerField]: day.dateString } : d);
              }
              setDatePickerVisible(false);
            }}
            markedDates={
              datePickerField && draft[datePickerField] as string
                ? { [draft[datePickerField] as string]: { selected: true, selectedColor: colors.primaryBlue } }
                : {}
            }
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primaryBlue,
              selectedDayTextColor: colors.textPrimary,
              todayTextColor: colors.primaryBlue,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textSecondary,
              arrowColor: colors.primaryBlue,
              monthTextColor: colors.textPrimary,
            }}
          />
        </View>
      </Modal>

      {/* Menu */}
      {menuOpen && (
        <MenuPanel
          topOffset={0}
          onSelectPanel={(p) => { setMenuOpen(false); setActiveSubPanel(p); }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {activeSubPanel === "profile" && (
        <ProfilePanel topOffset={0} onClose={() => { setActiveSubPanel(null); loadProfileToggles().then(setToggles); }} />
      )}
      {activeSubPanel === "criteria" && (
        <CriteriaPanel topOffset={0} onClose={() => setActiveSubPanel(null)} />
      )}
      {activeSubPanel === "settings" && (
        <SettingsPanel topOffset={0} onClose={() => setActiveSubPanel(null)} />
      )}
    </View>
  );
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
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryBlue }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}

function SelectRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 14 }}>{value || "Select…"}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function MultiRow({ label, values, onPress }: { label: string; values: string[]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, maxWidth: "60%" }}>
        <Text style={{ color: values.length ? colors.textPrimary : colors.textSecondary, fontSize: 13, textAlign: "right" }} numberOfLines={2}>
          {values.length ? values.join(", ") : "Select…"}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function DateRow({ label, value, onPress, onClear }: { label: string; value: string; onPress: () => void; onClear: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 14 }}>{value || "Select…"}</Text>
        {!!value && (
          <Pressable onPress={onClear} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
