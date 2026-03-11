// lib/profileStorage.ts — Build 3.2.06
// Expanded: added ProfileData and CriteriaData types + storage functions.
// Original ProfileToggles (children/pets/car) unchanged and backward-compatible.
// add.tsx continues to call loadProfileToggles() with no changes required.

import AsyncStorage from "@react-native-async-storage/async-storage";

// ── ProfileToggles (existing — unchanged) ────────────────────────

export type ProfileToggles = {
  children: boolean;
  pets: boolean;
  car: boolean;
};

const KEY_TOGGLES = "preferredhome.profileToggles.v1";
const DEFAULTS_TOGGLES: ProfileToggles = { children: false, pets: false, car: false };

export async function loadProfileToggles(): Promise<ProfileToggles> {
  const v = await AsyncStorage.getItem(KEY_TOGGLES);
  if (!v) return DEFAULTS_TOGGLES;
  try {
    const parsed = JSON.parse(v);
    return {
      children: !!parsed.children,
      pets: !!parsed.pets,
      car: !!parsed.car,
    };
  } catch {
    return DEFAULTS_TOGGLES;
  }
}

export async function saveProfileToggles(next: ProfileToggles): Promise<void> {
  await AsyncStorage.setItem(KEY_TOGGLES, JSON.stringify(next));
}

// ── ProfileData (new) ─────────────────────────────────────────────

export type ProfileData = {
  name: string;
  email: string;
  searchMode: "Buy" | "Rent";
  workAddress: string;
  commuteMethod: "Walk" | "Drive" | "Transit" | "Bike";
  departureTime: string;
};

const KEY_PROFILE = "preferredhome.profile.v1";
const DEFAULTS_PROFILE: ProfileData = {
  name: "",
  email: "",
  searchMode: "Rent",
  workAddress: "",
  commuteMethod: "Transit",
  departureTime: "",
};

export async function loadProfileData(): Promise<ProfileData> {
  const v = await AsyncStorage.getItem(KEY_PROFILE);
  if (!v) return DEFAULTS_PROFILE;
  try {
    const p = JSON.parse(v);
    return {
      name: typeof p.name === "string" ? p.name : "",
      email: typeof p.email === "string" ? p.email : "",
      searchMode: p.searchMode === "Buy" || p.searchMode === "Rent" ? p.searchMode : "Rent",
      workAddress: typeof p.workAddress === "string" ? p.workAddress : "",
      commuteMethod:
        ["Walk", "Drive", "Transit", "Bike"].includes(p.commuteMethod)
          ? p.commuteMethod
          : "Transit",
      departureTime: typeof p.departureTime === "string" ? p.departureTime : "",
    };
  } catch {
    return DEFAULTS_PROFILE;
  }
}

export async function saveProfileData(next: ProfileData): Promise<void> {
  await AsyncStorage.setItem(KEY_PROFILE, JSON.stringify(next));
}

// ── CriteriaData (new) ────────────────────────────────────────────

export type CriteriaData = {
  minSqFt: string;
  maxBaseRent: string;
  maxTotalMonthly: string;
  maxCommuteTime: string;
};

const KEY_CRITERIA = "preferredhome.criteria.v1";
const DEFAULTS_CRITERIA: CriteriaData = {
  minSqFt: "",
  maxBaseRent: "",
  maxTotalMonthly: "",
  maxCommuteTime: "",
};

export async function loadCriteriaData(): Promise<CriteriaData> {
  const v = await AsyncStorage.getItem(KEY_CRITERIA);
  if (!v) return DEFAULTS_CRITERIA;
  try {
    const p = JSON.parse(v);
    return {
      minSqFt: typeof p.minSqFt === "string" ? p.minSqFt : "",
      maxBaseRent: typeof p.maxBaseRent === "string" ? p.maxBaseRent : "",
      maxTotalMonthly: typeof p.maxTotalMonthly === "string" ? p.maxTotalMonthly : "",
      maxCommuteTime: typeof p.maxCommuteTime === "string" ? p.maxCommuteTime : "",
    };
  } catch {
    return DEFAULTS_CRITERIA;
  }
}

export async function saveCriteriaData(next: CriteriaData): Promise<void> {
  await AsyncStorage.setItem(KEY_CRITERIA, JSON.stringify(next));
}
