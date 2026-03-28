// lib/api.ts — Build 3.2.15
// Added: recalculateAllCommutes()

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

export async function getListings(): Promise<any[]> {
  return fetchJson<any[]>(`${API_BASE_URL}/listings`);
}

export async function postListing(payload: Record<string, any>): Promise<any> {
  return fetchJson(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateListing(id: string, payload: Record<string, any>): Promise<any> {
  return fetchJson(`${API_BASE_URL}/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteListing(id: string): Promise<any> {
  return fetchJson(`${API_BASE_URL}/listings/${id}`, {
    method: "DELETE",
  });
}

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

export async function recalculateAllCommutes(params: {
  workAddress: string;
  commuteMethod: string;
  departureTime: string;
}): Promise<any> {
  return fetchJson(`${API_BASE_URL}/commute/recalculate-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}
