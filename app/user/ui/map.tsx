"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Coordinates } from "./dashboard/address-modal";

// Fix Leaflet default icon paths for Next.js
delete (
  L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Props = {
  location: Coordinates;
  onLocationChange: (coords: Coordinates) => void;
  editable?: boolean;
  userLocation?: Coordinates;
};

export default function Map({
  location,
  onLocationChange,
  editable = true,
  userLocation = null,
}: Props) {
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(location);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (location) {
      setCurrentLocation(location);
    }
  }, [location]);

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCurrentLocation(coords);
        mapRef.current?.setView([coords.latitude, coords.longitude], 16);
        onLocationChange(coords);
      },
      () => {
        alert("Unable to get your current location.");
      }
    );
  };

  return currentLocation ? (
    <div className="relative w-full h-full">
      {/* 📍 Use My Location Button */}
      {editable && (
        <button
          onClick={handleMyLocation}
          className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded shadow hover:bg-gray-100 transition"
          title="Use my current location"
        >
          📍
        </button>
      )}

      <MapContainer
        center={[currentLocation.latitude, currentLocation.longitude]}
        zoom={16}
        className="h-full w-full"
        zoomControl={editable}
        scrollWheelZoom={false}
      >
        <FixZoomCenter />

        <MapInitializer
          mapRef={mapRef}
          center={currentLocation}
          editable={editable}
        />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {!editable && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
          >
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Your Address</Popup>
          </Marker>
        )}

        {editable && (
          <MapDragHandler
            onLocationChange={(coords) => {
              setCurrentLocation(coords);
              onLocationChange(coords);
            }}
          />
        )}
      </MapContainer>

      {/* Center pin (visually fixed) */}
      {editable && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[999] -translate-x-1/2 -translate-y-full">
          <img
            src="/leaflet/marker-icon.png"
            alt="center marker"
            className="h-10 w-auto"
          />
        </div>
      )}
    </div>
  ) : (
    <div className="h-64 flex items-center justify-center text-gray-500">
      Loading map...
    </div>
  );
}

// Keeps the map reference and recenters on location updates
function MapInitializer({
  mapRef,
  center,
  editable,
}: {
  mapRef: React.MutableRefObject<L.Map | null>;
  center: Coordinates;
  editable: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useEffect(() => {
    if (center) {
      map.setView([center.latitude, center.longitude], map.getZoom());
    }
  }, [center, map]);

  useEffect(() => {
    if (editable) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
    }
  }, [editable, map]);

  return null;
}

// Updates coords when the map is dragged
function MapDragHandler({
  onLocationChange,
}: {
  onLocationChange: (coords: Coordinates) => void;
}) {
  const map = useMapEvents({
    dragend: () => {
      const center = map.getCenter();
      onLocationChange({ latitude: center.lat, longitude: center.lng });
    },
  });

  return null;
}

function FixZoomCenter() {
  const map = useMap();

  useEffect(() => {
    map.options.scrollWheelZoom = "center";
    map.scrollWheelZoom.enable();
  }, [map]);

  return null;
}
