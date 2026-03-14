// lib/compareStorage.ts — Build 3.2.08
// Persists the selected compare listing IDs (max 3) across navigation.
// Used by listings.tsx (write) and compare.tsx (read + reload on focus).

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "preferredhome.compare.v1";

export async function loadCompareIds(): Promise<string[]> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    if (!v) return [];
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export async function saveCompareIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(ids.slice(0, 3)));
  } catch {
    // silent fail — state is still correct in memory
  }
}
