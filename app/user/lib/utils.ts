import { LatLngExpression, LatLngTuple } from "leaflet";

export function toTuple(latlng: LatLngExpression): LatLngTuple {
  if (Array.isArray(latlng)) return latlng;
  if ("lat" in latlng && "lng" in latlng) return [latlng.lat, latlng.lng];
  throw new Error("Invalid LatLngExpression");
}

export function getImageUrl(image: string | null | undefined) {
  if (!image || image.trim() === "") {
    return "/images/placeholder.jpg";
  }
  return `http://localhost:3000${image}`;
}
