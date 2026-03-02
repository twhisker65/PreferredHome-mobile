export type ListingStatus =
  | "Available"
  | "Inquired"
  | "Visited"
  | "Applied"
  | "Rejected"
  | "Unknown";

// UI-facing listing model (not the full 66-column sheet schema).
export type ListingUI = {
  id: string;
  status: ListingStatus;
  preferred: boolean;

  buildingName: string;
  addressLine: string; // full address + unit
  unitSummary: string; // unit type · beds · baths · sqft
  priceSummary: string; // total monthly (rent + fees)
  sourceLabel: string; // listing source (muted)
  photoUrl?: string | null;

  // Numeric values (for stats / comparisons)
  baseRent?: number | null;
  fees?: number | null;
  sqft?: number | null;

  // Raw payload for detail panel (future use)
  raw?: any;
};
