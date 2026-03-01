import type { ListingStatus } from "../styles/colors";

export type Listing = {
  id: string;
  preferred: boolean;
  status: ListingStatus;
  buildingName: string;
  addressLine: string; // full address + unit
  unitSummary: string; // unit type · beds · baths · sqft
  monthlyTotal: number; // rent + fees
  source: string;
};
