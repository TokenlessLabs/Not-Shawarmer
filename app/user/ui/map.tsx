"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { toTuple } from "../lib/utils";

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
  editable?: boolean; // new prop
};

export default function Map({
  location,
  onLocationChange,
  editable = true,
}: Props) {
  const [currentLocation, setCurrentLocation] =
    useState<LatLngExpression | null>(location);

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc: LatLngExpression = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          setCurrentLocation(userLoc);
          onLocationChange(userLoc);
        },
        () => {
          const fallbackLoc: LatLngExpression = [31.5204, 74.3587]; // Lahore
          setCurrentLocation(fallbackLoc);
          onLocationChange(fallbackLoc);
        }
      );
    } else {
      setCurrentLocation(location);
    }
  }, [location, onLocationChange]);

  return currentLocation ? (
    <div className="w-full h-full">
      <MapContainer
        key={currentLocation ? toTuple(currentLocation).join("-") : "map"}
        center={currentLocation}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {editable && (
          <ClickToSetMarker
            setLocation={(loc) => {
              setCurrentLocation(loc);
              onLocationChange(loc);
            }}
          />
        )}

        <Marker position={currentLocation} />
      </MapContainer>
    </div>
  ) : (
    <div className="h-64 flex items-center justify-center text-gray-500">
      Loading map...
    </div>
  );
}

function ClickToSetMarker({
  setLocation,
}: {
  setLocation: (loc: LatLngExpression) => void;
}) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const newLoc: LatLngExpression = [e.latlng.lat, e.latlng.lng];
      console.log("Clicked location:", newLoc);
      setLocation(newLoc);
    },
  });
  return null;
}
