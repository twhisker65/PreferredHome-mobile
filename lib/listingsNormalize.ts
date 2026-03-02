import type { ListingStatus, ListingUI } from "./types";

function str(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function num(v: any): number | null {
  if (v === null || v === undefined) return null;
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

// Tries multiple likely keys since sheet headers can vary between prototypes.
function pick(raw: any, keys: string[]): any {
  for (const k of keys) {
    if (raw && Object.prototype.hasOwnProperty.call(raw, k)) return raw[k];
  }
  return undefined;
}

export function normalizeListing(raw: any): ListingUI {
  // --- Location ---
  const buildingName =
    str(pick(raw, ["buildingName", "building_name", "Building Name", "building", "Building"])) || "Unknown Building";

  const street =
    str(pick(raw, ["streetAddress", "street_address", "Street Address", "address", "Address"])) || "";

  const city = str(pick(raw, ["city", "City"])) || "";
  const state = str(pick(raw, ["state", "State"])) || "";
  const zip = str(pick(raw, ["zipCode", "zip_code", "Zip Code", "zip"])) || "";
  const unit = str(pick(raw, ["unitNumber", "unit_number", "Unit #", "unit", "apt"])) || "";

  // Card address format requirement:
  // Street, City, State, Zip, Unit
  const addressParts: string[] = [];
  if (street) addressParts.push(street);
  const cityStateZip = [city, state, zip].filter(Boolean).join(", ").replace(/,\s*,/g, ", ");
  if (cityStateZip) addressParts.push(cityStateZip);
  if (unit) addressParts.push(unit);

  const addressLine = addressParts.length ? addressParts.join(", ") : "—";

  // --- Unit details (always show beds/baths/sqft; use dash when missing) ---
  const unitType = str(pick(raw, ["unitType", "unit_type", "Unit Type"])) || "Unit";

  const beds = num(pick(raw, ["bedrooms", "Bedrooms", "beds", "Beds"]));
  const baths = num(pick(raw, ["bathrooms", "Bathrooms", "baths", "Baths"]));
  const sqft = num(pick(raw, ["squareFootage", "square_footage", "Square Footage", "sqft", "Sqft", "square_feet"]));

  const bdText = beds !== null ? `${beds} bd` : "— bd";
  const baText = baths !== null ? `${baths} ba` : "— ba";
  const sqftText = sqft !== null ? `${sqft} sqft` : "— sqft";

  const unitSummary = [unitType, bdText, baText, sqftText].join(" · ");

  // --- Costs ---
  const baseRent = num(pick(raw, ["baseRent", "base_rent", "Monthly Rent (Base Rent)", "monthly_rent", "rent", "Rent"]));

  const parkingFee = num(pick(raw, ["parkingFee", "parking_fee", "Parking Fee"])) ?? 0;
  const amenityFee = num(pick(raw, ["amenityFee", "amenity_fee", "Amenity Fee"])) ?? 0;
  const adminFee = num(pick(raw, ["adminFee", "admin_fee", "Admin Fee"])) ?? 0;
  const utilityFee = num(pick(raw, ["utilityFee", "utility_fee", "Utility Fee"])) ?? 0;
  const otherFee = num(pick(raw, ["otherFee", "other_fee", "Other Fee"])) ?? 0;

  const fees = parkingFee + amenityFee + adminFee + utilityFee + otherFee;
  const hasFees = fees > 0;

  const priceSummary =
    baseRent !== null && Number.isFinite(baseRent)
      ? `$${Math.round(baseRent).toLocaleString()}/mo${hasFees ? " +fees" : ""}`
      : "—";

  // --- Status / Preferred ---
  const status = normalizeStatus(pick(raw, ["status", "Status"]));

  const preferredRaw = pick(raw, ["preferred", "Preferred", "isPreferred", "is_preferred"]);
  const preferred =
    preferredRaw === true ||
    str(preferredRaw).toLowerCase() === "true" ||
    str(preferredRaw).toLowerCase() === "yes";

  const photoUrl = str(pick(raw, ["photoUrl", "photo_url", "imageUrl", "image_url", "Photo"])) || null;

  // Stable ID (sheet id preferred, fallback to composite)
  const id =
    str(pick(raw, ["id", "ID", "listingId", "listing_id", "rowId", "row_id"])) ||
    [buildingName, addressLine].filter(Boolean).join("|");

  // For muted provenance (not shown on card per latest direction, but kept for future)
  const sourceLabel = str(pick(raw, ["listingSite", "listing_site", "source", "Source", "listingSource"])) || "—";

  return {
    id,
    status,
    preferred,
    buildingName,
    addressLine,
    unitSummary,
    priceSummary,
    sourceLabel,
    photoUrl,
    baseRent,
    fees,
    sqft,
    raw,
  };
}
