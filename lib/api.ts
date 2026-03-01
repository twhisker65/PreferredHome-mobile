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
