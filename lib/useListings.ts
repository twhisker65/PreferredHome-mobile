import { useCallback, useEffect, useMemo, useState } from "react";
import { getListings } from "./api";
import { normalizeListing } from "./listingsNormalize";
import type { ListingUI } from "./types";

export function useListings() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<any[]>([]);

  const listings: ListingUI[] = useMemo(() => raw.map(normalizeListing), [raw]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getListings();
      setRaw(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getListings();
      setRaw(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to refresh listings");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { listings, loading, refreshing, error, load, refresh };
}
