import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProfileToggles = {
  children: boolean;
  pets: boolean;
  car: boolean;
};

const KEY = "preferredhome.profileToggles.v1";

const DEFAULTS: ProfileToggles = { children: false, pets: false, car: false };

export async function loadProfileToggles(): Promise<ProfileToggles> {
  const v = await AsyncStorage.getItem(KEY);
  if (!v) return DEFAULTS;
  try {
    const parsed = JSON.parse(v);
    return {
      children: !!parsed.children,
      pets: !!parsed.pets,
      car: !!parsed.car,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function saveProfileToggles(next: ProfileToggles): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
