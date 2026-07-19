export interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
}

/**
 * Search a place name → coordinates using OpenStreetMap's free Nominatim API.
 * Biased to Bangladesh. No API key required. Returns up to `limit` matches.
 */
export async function geocodePlace(
  query: string,
  limit = 5,
): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q,
      format: "json",
      addressdetails: "0",
      limit: String(limit),
      countrycodes: "bd",
    }).toString();

  const res = await fetch(url, {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) throw new Error("Location search failed");

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  return data.map((d) => ({
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
    label: d.display_name,
  }));
}
