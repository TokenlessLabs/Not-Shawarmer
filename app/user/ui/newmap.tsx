"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds, LatLngExpression } from "leaflet";
import { toTuple } from "../lib/utils";
import polyline from "@mapbox/polyline";
import { useMap } from "react-leaflet";

// Fix default Leaflet icon paths for Next.js
delete (
  L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Props = {
  location: LatLngExpression | null;
  onLocationChange: (loc: LatLngExpression) => void;
  editable?: boolean;
  userLocation?: LatLngExpression | null;
  showPath?: boolean;
};

export default function Map({
  location,
  onLocationChange,
  userLocation = null,
  showPath = false,
}: Props) {
  const [currentLocation, setCurrentLocation] =
    useState<LatLngExpression | null>(location);

  const [routePoints, setRoutePoints] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    if (!showPath || !userLocation || !currentLocation) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://graphhopper.com/api/1/route?point=${toTuple(
            currentLocation
          ).join(",")}&point=${toTuple(userLocation).join(
            ","
          )}&vehicle=car&locale=en&calc_points=true&points_encoded=true&key=bbc9a58c-f338-4623-afcf-f26301ab350a`
        );

        const data = await res.json();

        if (data.paths && data.paths.length > 0) {
          const decoded = polyline.decode(data.paths[0].points); // returns [lat, lng]
          const converted = decoded.map(
            (p: [number, number]) => [p[0], p[1]] as LatLngExpression
          );

          setRoutePoints(converted);
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
      }
    };

    fetchRoute();
  }, [showPath, userLocation, currentLocation]);

  return currentLocation ? (
    <div className="relative w-full h-full">
      <MapContainer
        key={toTuple(currentLocation).join("-")}
        center={currentLocation || [0, 0]}
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

        {/* Delivery Marker */}
        <Marker position={currentLocation}>
          <Popup>Delivery Location</Popup>
        </Marker>

        {/* User Address Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Address</Popup>
          </Marker>
        )}

        {/* Route Line */}
        {userLocation &&
          currentLocation &&
          showPath &&
          routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
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

function FitBoundsHandler({ points }: { points: LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length >= 2) {
      const bounds = new LatLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }, [points, map]);

  return null;
}
