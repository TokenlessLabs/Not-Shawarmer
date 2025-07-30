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

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
    );
    const data = await res.json();
    return data?.display_name || "No Address Found";
  } catch (err) {
    console.error("Failed to reverse geocode:", err);
    return "Error retrieving address";
  }
}