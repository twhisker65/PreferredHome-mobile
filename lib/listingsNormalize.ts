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

export function normalizeListing(raw: any): ListingUI {
  // --- Location ---
  const buildingName = str(raw.buildingName) || "Unknown Building";
  const street = str(raw.streetAddress) || "";
  const city = str(raw.city) || "";
  const state = str(raw.state) || "";
  const zip = str(raw.zipCode) || "";
  const unit = str(raw.unitNumber) || "";

  const addressParts: string[] = [];
  if (street) addressParts.push(street);
  const cityStateZip = [city, state, zip].filter(Boolean).join(", ").replace(/,\s*,/g, ", ");
  if (cityStateZip) addressParts.push(cityStateZip);
  if (unit) addressParts.push(unit);
  const addressLine = addressParts.length ? addressParts.join(", ") : "—";

  // --- Unit details ---
  const unitType = str(raw.unitType) || "Unit";
  const beds = num(raw.bedrooms);
  const baths = num(raw.bathrooms);
  const sqft = num(raw.squareFootage);

  const bdText = beds !== null ? `${beds} bd` : "— bd";
  const baText = baths !== null ? `${baths} ba` : "— ba";
  const sqftText = sqft !== null ? `${sqft} sqft` : "— sqft";
  const unitSummary = [unitType, bdText, baText, sqftText].join(" · ");

  // --- Costs ---
  const baseRent = num(raw.baseRent);
  const parkingFee = num(raw.parkingFee) ?? 0;
  const amenityFee = num(raw.amenityFee) ?? 0;
  const adminFee = num(raw.adminFee) ?? 0;
  const utilityFee = num(raw.utilityFee) ?? 0;
  const otherFee = num(raw.otherFee) ?? 0;

  const fees = parkingFee + amenityFee + adminFee + utilityFee + otherFee;
  const hasFees = fees > 0;

  const priceSummary =
    baseRent !== null && Number.isFinite(baseRent)
      ? `$${Math.round(baseRent).toLocaleString()}/mo${hasFees ? ` +$${Math.round(fees).toLocaleString()} fees` : ""}`
      : "—";

  // --- Status / Preferred ---
  const status = normalizeStatus(raw.status);

  const preferredRaw = raw.preferred;
  const preferred =
    preferredRaw === true ||
    str(preferredRaw).toLowerCase() === "true" ||
    str(preferredRaw).toLowerCase() === "yes";

  const photoUrl = str(raw.photoUrl) || null;

  // Stable ID
  const id = str(raw.id) || [buildingName, addressLine].filter(Boolean).join("|");

  const sourceLabel = str(raw.listingSite) || "—";

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
