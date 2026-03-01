import { API_BASE_URL } from "./config";

export async function getHealth(): Promise<any> {
  if (!API_BASE_URL) return { ok: "NO_API_BASE_URL_SET" };
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
