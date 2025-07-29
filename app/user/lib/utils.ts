import { LatLngExpression, LatLngTuple } from "leaflet";

export function toTuple(latlng: LatLngExpression): LatLngTuple {
  if (Array.isArray(latlng)) return latlng;
  if ("lat" in latlng && "lng" in latlng) return [latlng.lat, latlng.lng];
  throw new Error("Invalid LatLngExpression");
}

// utils/geocode.ts
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

  return d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
