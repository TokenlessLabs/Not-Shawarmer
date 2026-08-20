"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds } from "leaflet";
import polyline from "@mapbox/polyline";

// Fix default Leaflet icon paths for Next.js
delete (
  L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export type Coordinates = { latitude: number; longitude: number } | null;

function toLatLng(coord: Coordinates): [number, number] {
  return [coord!.latitude, coord!.longitude];
}

type Props = {
  location: Coordinates;
  onLocationChange: (loc: Coordinates) => void;
  editable?: boolean;
  userLocation?: Coordinates;
  showPath?: boolean;
  onEtaChange?: (eta: number | null) => void;
};

export default function Map({
  location,
  userLocation = null,
  showPath = false,
  onEtaChange,
}: Props) {
  const currentLocation = location;
  const [routePoints, setRoutePoints] = useState<Coordinates[]>([]);

  useEffect(() => {
    if (!showPath || !userLocation || !currentLocation) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://graphhopper.com/api/1/route?point=${toLatLng(userLocation).join(",")}&point=${toLatLng(currentLocation).join(",")}&vehicle=car&locale=en&calc_points=true&points_encoded=true&key=bbc9a58c-f338-4623-afcf-f26301ab350a`
        );

        const data = await res.json();

        if (data.paths && data.paths.length > 0) {
          const decoded = polyline.decode(data.paths[0].points);
          const converted = decoded.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));
          setRoutePoints(converted);

          // Set ETA in minutes
          const timeInMin = Math.round(data.paths[0].time / 60000);
          onEtaChange?.(timeInMin);
        } else {
          onEtaChange?.(null);
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
        onEtaChange?.(null);
      }
    };

    fetchRoute();
  }, [showPath, userLocation, currentLocation, onEtaChange]);

  return currentLocation ? (
    <div className="relative w-full h-full">
      <MapContainer
        key={toLatLng(currentLocation).join("-")}
        center={toLatLng(currentLocation)}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {userLocation && currentLocation && (
          <FitBoundsHandler points={[userLocation, currentLocation]} />
        )}

        <Marker position={toLatLng(currentLocation)}>
          <Popup>Delivery Location</Popup>
        </Marker>

        {userLocation && (
          <Marker position={toLatLng(userLocation)}>
            <Popup>Your Address</Popup>
          </Marker>
        )}

        {showPath && routePoints.length > 0 && (
          <Polyline
            positions={routePoints.map(toLatLng)}
            color="#058ccd"
            weight={4}
            dashArray="4"
          />
        )}
      </MapContainer>
    </div>
  ) : (
    <div className="h-64 flex items-center justify-center text-gray-500">
      Loading map...
    </div>
  );
}

function FitBoundsHandler({ points }: { points: Coordinates[] }) {
  const map = useMap();

  useEffect(() => {
    const latlngs = points.map(toLatLng);
    if (latlngs.length >= 2) {
      const bounds = new LatLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (latlngs.length === 1) {
      map.setView(latlngs[0], 13);
    }
  }, [points, map]);

  return null;
}
