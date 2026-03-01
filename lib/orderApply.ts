import type { ListingUI } from "./types";
import type { SavedOrder } from "./orderStorage";

function sortBySaved(ids: string[], items: ListingUI[]): ListingUI[] {
  const index = new Map<string, number>();
  ids.forEach((id, i) => index.set(id, i));

  return [...items].sort((a, b) => {
    const ai = index.has(a.id) ? index.get(a.id)! : Number.POSITIVE_INFINITY;
    const bi = index.has(b.id) ? index.get(b.id)! : Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;
    return a.buildingName.localeCompare(b.buildingName);
  });
}

export function applyOrder(
  listings: ListingUI[],
  saved: SavedOrder | null
): { preferred: ListingUI[]; other: ListingUI[] } {
  const preferred = listings.filter((l) => l.preferred);
  const other = listings.filter((l) => !l.preferred);

  if (!saved) return { preferred, other };

  return {
    preferred: sortBySaved(saved.preferredIds, preferred),
    other: sortBySaved(saved.otherIds, other),
  };
}
