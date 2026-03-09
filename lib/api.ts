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
