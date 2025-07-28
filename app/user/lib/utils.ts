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
