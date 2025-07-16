"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

const DynamicMap = dynamic(() => import("../map"), { ssr: false });

type Props = {
  savedAddress?: string;
  onClose: () => void;
  onSave: (address: string, location: LatLngExpression | null) => void;
};
type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

const AddressModal = ({ savedAddress, onClose, onSave }: Props) => {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(savedAddress || "");
  const [location, setLocation] = useState<LatLngExpression | null>(null);
  const [humanLocation, setHumanLocation] = useState(savedAddress || "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Load initial savedAddress and geocode it into coordinates
  useEffect(() => {
    const loadSavedAddress = async () => {
      if (savedAddress && !location) {
        setHumanLocation(savedAddress);
        setAddress(savedAddress);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              savedAddress
            )}&limit=1&countrycodes=pk&accept-language=en`
          );
          const data = await res.json();
          if (data.length > 0) {
            setLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (err) {
          console.error("Error geocoding saved address", err);
        }
      }
    };

    loadSavedAddress();
  }, [savedAddress, location]);

  // Reverse geocode when coordinates change
  useEffect(() => {
    const fetchAddress = async () => {
      if (!location) return;
      const [lat, lng] = Array.isArray(location)
        ? location
        : [location.lat, location.lng];
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );
        const data = await res.json();
        if (data?.display_name) {
          setHumanLocation(data.display_name);
          setAddress(data.display_name);
        } else {
          setHumanLocation("Unable to retrieve address");
        }
      } catch (err) {
        setHumanLocation("Error fetching address");
      }
    };

    if (editing) fetchAddress();
  }, [location]);

  // Autocomplete suggestions
  useEffect(() => {
    if (!editing || humanLocation.trim() === "") {
      setSuggestions([]);
      setDropdownVisible(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            humanLocation
          )}&addressdetails=1&accept-language=en&countrycodes=pk`
        );
        const data = await res.json();
        setSuggestions(data);
        setDropdownVisible(true);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [humanLocation, editing]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl flex flex-col h-auto">
        {/* Map Section */}
        <div className="h-[300px] relative">
          <DynamicMap
            editable={editing}
            location={location}
            onLocationChange={(loc) => {
              if (editing) setLocation(loc);
            }}
          />
        </div>

        {/* Location Display */}
        <div className="px-4 pt-3 text-sm text-gray-600">
          <div className="relative">
            {editing ? (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={humanLocation}
                  onChange={(e) => {
                    setHumanLocation(e.target.value);
                  }}
                  placeholder="Search for a location..."
                  className="border rounded p-2 text-sm z-10 relative"
                />

                {dropdownVisible && suggestions.length > 0 && (
                  <ul className="mt-1 bg-white border border-gray-300 rounded shadow text-sm max-h-48 overflow-y-auto">
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setHumanLocation(item.display_name);
                          setAddress(item.display_name);
                          setLocation([
                            parseFloat(item.lat),
                            parseFloat(item.lon),
                          ]);
                          setDropdownVisible(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <>
                <strong>Selected Location:</strong>{" "}
                {humanLocation || "No location selected"}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-4 flex flex-col">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              Close
            </button>

            <button
              onClick={() => {
                if (editing) {
                  onSave(address, location);
                }
                setEditing(!editing);
              }}
              className="px-4 py-2 text-sm rounded bg-theme-blue text-white hover:bg-theme-bluehighlighted transition"
            >
              {editing ? "Set this Address" : "Edit Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
