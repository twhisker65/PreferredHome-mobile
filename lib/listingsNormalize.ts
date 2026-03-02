import type { ListingStatus, ListingUI } from "./types";

function str(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function num(v: any): number | null {
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normalizeStatus(v: any): ListingStatus {
  const s = str(v).toLowerCase();
  if (!s) return "Unknown";
  if (s.includes("avail")) return "Available";
  if (s.includes("inquir")) return "Inquired";
  if (s.includes("visit")) return "Visited";
  if (s.includes("appl")) return "Applied";
  if (s.includes("reject")) return "Rejected";
  return "Unknown";
}

// Tries multiple likely keys since sheet headers can vary.
function pick(raw: any, keys: string[]): any {
  for (const k of keys) {
    if (raw && Object.prototype.hasOwnProperty.call(raw, k)) return raw[k];
  }
  return undefined;
}

export function normalizeListing(raw: any): ListingUI {
  const buildingName =
    str(pick(raw, ["buildingName", "building", "Building", "Building Name", "building_name"])) ||
    "Unknown Building";

  const address =
    str(pick(raw, ["address", "Address", "streetAddress", "street_address"])) ||
    str(pick(raw, ["fullAddress", "full_address"])) ||
    "";

  const unit =
    str(pick(raw, ["unit", "Unit", "apt", "Apartment", "unitNumber", "unit_number"])) ||
    "";

  const addressLine = [address, unit].filter(Boolean).join(" ");

  const unitType = str(pick(raw, ["unitType", "Unit Type", "unit_type"])) || "Unit";
  const beds = num(pick(raw, ["beds", "Beds", "bedrooms"]));
  const baths = num(pick(raw, ["baths", "Baths", "bathrooms"]));
  const sqft = num(pick(raw, ["sqft", "Sqft", "squareFeet", "square_feet"]));

  const unitSummaryParts: string[] = [unitType];
  if (beds !== null) unitSummaryParts.push(`${beds} bd`);
  if (baths !== null) unitSummaryParts.push(`${baths} ba`);
  if (sqft !== null) unitSummaryParts.push(`${sqft} sqft`);
  const unitSummary = unitSummaryParts.join(" · ");

  const rent = num(pick(raw, ["rent", "Rent", "monthlyRent", "monthly_rent"]));
  const fees = num(pick(raw, ["fees", "Fees", "monthlyFees", "monthly_fees"])) ?? 0;
  const total = rent !== null ? rent + (fees ?? 0) : null;
  const priceSummary =
    total !== null
      ? `$${Math.round(total).toLocaleString()}/mo`
      : (rent !== null ? `$${Math.round(rent).toLocaleString()}/mo` : "—");

  const sourceLabel = str(pick(raw, ["source", "Source", "listingSource", "listing_source"])) || "—";

  const status = normalizeStatus(pick(raw, ["status", "Status"]));
  const preferredRaw = pick(raw, ["preferred", "Preferred", "isPreferred", "is_preferred"]);
  const preferred =
    preferredRaw === true ||
    str(preferredRaw).toLowerCase() === "true" ||
    str(preferredRaw).toLowerCase() === "yes";

  const photoUrl =
    str(pick(raw, ["photoUrl", "photo_url", "imageUrl", "image_url", "Photo"])) || null;

  // Build a stable ID
  const id =
    str(pick(raw, ["id", "ID", "listingId", "listing_id", "rowId", "row_id"])) ||
    [buildingName, addressLine, sourceLabel].filter(Boolean).join("|");

    return {
    id,
    status,
    preferred,
    buildingName,
    addressLine: addressLine || "—",
    unitSummary,
    priceSummary,
    sourceLabel,
    photoUrl,

    baseRent: rent,
    fees: fees ?? 0,
    sqft,

    raw,
  };


}
