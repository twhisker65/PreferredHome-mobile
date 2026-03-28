// lib/api.ts — Build 3.2.15
// Added: calculateCommute, recalculateAllCommutes
// All existing functions unchanged.

import { API_BASE_URL } from "./config";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  return (await res.json()) as T;
}

export async function getHealth(): Promise<any> {
  return fetchJson(`${API_BASE_URL}/health`);
}

// Backend returns rows from Google Sheets (schema can evolve).
// Keep typed as any[] and normalize downstream.
export async function getListings(): Promise<any[]> {
  return fetchJson<any[]>(`${API_BASE_URL}/listings`);
}

// Add a new listing. API auto-generates the id on save.
export async function postListing(payload: Record<string, any>): Promise<any> {
  return fetchJson(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Update an existing listing by id. Uses PUT /listings/{id}.
export async function updateListing(id: string, payload: Record<string, any>): Promise<any> {
  return fetchJson(`${API_BASE_URL}/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Delete a listing by id. Removes the row from Google Sheets.
export async function deleteListing(id: string): Promise<any> {
  return fetchJson(`${API_BASE_URL}/listings/${id}`, {
    method: "DELETE",
  });
}

// Look up city and state from a US ZIP code using a free public API.
// Returns { city: string, state: string } or { city: "", state: "" } on failure.
export async function lookupZip(zipCode: string): Promise<{ city: string; state: string }> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (!res.ok) return { city: "", state: "" };
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return { city: "", state: "" };
    return {
      city: place["place name"] ?? "",
      state: place["state abbreviation"] ?? "",
    };
  } catch {
    return { city: "", state: "" };
  }
}

// URL keyword patterns used to auto-detect listing site.
// Checked in order — first match wins.
const LISTING_SITE_PATTERNS: Array<[string, string]> = [
  ["zillow.com",          "Zillow"],
  ["realtor.com",         "Realtor.com"],
  ["redfin.com",          "Redfin"],
  ["homes.com",           "Homes.com"],
  ["apartments.com",      "Apartments.com"],
  ["streeteasy.com",      "StreetEasy"],
  ["hotpads.com",         "HotPads"],
  ["trulia.com",          "Trulia"],
  ["rent.com",            "Rent.com"],
  ["apartmentfinder.com", "Apartment Finder"],
  ["rentals.com",         "Rentals.com"],
  ["mls",                 "MLS / Broker"],
];

export function detectListingSite(url: string): string {
  if (!url) return "Other";
  const lower = url.toLowerCase();
  for (const [pattern, name] of LISTING_SITE_PATTERNS) {
    if (lower.includes(pattern)) return name;
  }
  return "Other";
}

// Calculate commute time for a single listing and store it.
// Called after Add or Edit save. Fire-and-forget — errors are silent.
// Returns { commuteTime: number } in minutes.
export async function calculateCommute(
  listingId: string,
  params: {
    workAddress: string;
    commuteMethod: string;
    departureTime: string;
    listingAddress: string;
  }
): Promise<{ commuteTime: number }> {
  return fetchJson(`${API_BASE_URL}/commute/calculate/${listingId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

// Recalculate commute for all listings. Called when profile commute
// fields change and the profile panel closes. Fire-and-forget.
// Returns { updated: number, skipped: number }.
export async function recalculateAllCommutes(params: {
  workAddress: string;
  commuteMethod: string;
  departureTime: string;
}): Promise<{ updated: number; skipped: number }> {
  return fetchJson(`${API_BASE_URL}/commute/recalculate-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}
