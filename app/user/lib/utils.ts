export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  if (data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}

export function formatDateWithOffset(
  date: string | Date,
  hourOffset = 5,
  locale = "en-US"
): string {
  const d = new Date(date);
  d.setHours(d.getHours() + hourOffset);

  const formatted = d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatted.replace(/\bAM\b/, "am").replace(/\bPM\b/, "pm");
}

const reverseGeocodeCache = new Map<string, string>();

export async function reverseGeocode(
  latitude: number | string,
  longitude: number | string
): Promise<string> {
  const numericLatitude = Number(latitude);
  const numericLongitude = Number(longitude);

  if (!Number.isFinite(numericLatitude) || !Number.isFinite(numericLongitude)) {
    return "Unknown location";
  }

  const fallback = `${numericLatitude.toFixed(5)}, ${numericLongitude.toFixed(5)}`;
  const cacheKey = `${numericLatitude},${numericLongitude}`;
  const cachedAddress = reverseGeocodeCache.get(cacheKey);

  if (cachedAddress) return cachedAddress;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${numericLatitude}&lon=${numericLongitude}&accept-language=en`,
      {
        signal: AbortSignal.timeout(2500),
        headers: {
          Accept: "application/json",
          "User-Agent": "Not-Shawarmer/0.1",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      reverseGeocodeCache.set(cacheKey, fallback);
      return fallback;
    }

    const data = await res.json();
    const address = data?.display_name || fallback;
    reverseGeocodeCache.set(cacheKey, address);
    return address;
  } catch {
    reverseGeocodeCache.set(cacheKey, fallback);
    return fallback;
  }
}
