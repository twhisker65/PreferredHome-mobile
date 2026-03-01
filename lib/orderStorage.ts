import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedOrder = {
  preferredIds: string[];
  otherIds: string[];
};

const KEY = "preferredhome.order.v1";

export async function loadOrder(): Promise<SavedOrder | null> {
  const v = await AsyncStorage.getItem(KEY);
  if (!v) return null;
  try {
    const parsed = JSON.parse(v);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      preferredIds: Array.isArray(parsed.preferredIds) ? parsed.preferredIds : [],
      otherIds: Array.isArray(parsed.otherIds) ? parsed.otherIds : [],
    };
  } catch {
    return null;
  }
}

export async function saveOrder(next: SavedOrder): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
