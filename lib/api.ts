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
const LISTING_SITE_PATTERNS: { keyword: string; site: string }[] = [
  { keyword: "zillow.com",          site: "Zillow" },
  { keyword: "realtor.com",         site: "Realtor.com" },
  { keyword: "redfin.com",          site: "Redfin" },
  { keyword: "homes.com",           site: "Homes.com" },
  { keyword: "apartments.com",      site: "Apartments.com" },
  { keyword: "streeteasy.com",      site: "StreetEasy" },
  { keyword: "hotpads.com",         site: "HotPads" },
  { keyword: "trulia.com",          site: "Trulia" },
  { keyword: "rent.com",            site: "Rent.com" },
  { keyword: "apartmentfinder.com", site: "Apartment Finder" },
  { keyword: "rentals.com",         site: "Rentals.com" },
  { keyword: "mls",                 site: "MLS / Broker" },
];

// Detect listing site from a URL string. Returns "Other" if no match.
export function detectListingSite(url: string): string {
  if (!url) return "Other";
  const lower = url.toLowerCase();
  for (const { keyword, site } of LISTING_SITE_PATTERNS) {
    if (lower.includes(keyword)) return site;
  }
  return "Other";
}
