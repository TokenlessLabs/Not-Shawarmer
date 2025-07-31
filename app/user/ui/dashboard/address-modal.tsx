"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { reverseGeocode } from "../../lib/utils";

const DynamicMap = dynamic(() => import("../map"), { ssr: false });

export type Coordinates = { latitude: number; longitude: number } | null;

type Props = {
  savedAddress?: Coordinates;
  onClose: () => void;
  onSave: (location: Coordinates) => void;
};

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

const AddressModal = ({ savedAddress, onClose, onSave }: Props) => {
  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState<Coordinates>(savedAddress || null);
  const [humanLocation, setHumanLocation] = useState("Loading...");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Reverse geocode on initial load
  useEffect(() => {
    if (!location) return;
    reverseGeocode(location.latitude, location.longitude).then(
      setHumanLocation
    );
  }, [location]);

  // Reverse geocode on location change while editing
  useEffect(() => {
    if (!editing || !location) return;
    reverseGeocode(location.latitude, location.longitude).then(
      setHumanLocation
    );
  }, [location, editing]);

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl flex flex-col h-auto">
        {/* Map Section */}
        <div className="h-[300px] relative">
          <DynamicMap
            editable={editing}
            location={location}
            onLocationChange={(loc) => {
              if (editing) {
                setLocation(loc);
              }
            }}
          />
        </div>

        {/* Address Input */}
        <div className="px-4 pt-3 text-sm text-gray-600">
          <div className="relative">
            {editing ? (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={humanLocation}
                  onChange={(e) => setHumanLocation(e.target.value)}
                  placeholder="Search for a location..."
                  className="border rounded p-2 text-sm z-10 relative"
                />
                {dropdownVisible && suggestions.length > 0 && (
                  <ul className="mt-1 bg-white border border-gray-300 rounded shadow text-sm max-h-48 overflow-y-auto">
                    {suggestions.map((item, index) => {
                      const lat = parseFloat(item.lat);
                      const lon = parseFloat(item.lon);
                      return (
                        <li
                          key={index}
                          onClick={() => {
                            const newLocation = {
                              latitude: lat,
                              longitude: lon,
                            };
                            setLocation(newLocation);
                            setHumanLocation(item.display_name);
                            setDropdownVisible(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {item.display_name}
                        </li>
                      );
                    })}
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

        {/* Action Buttons */}
        <div className="p-4 space-y-4 flex flex-col">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              Close
            </button>

            <button
              onClick={() => {
                if (editing && location) {
                  onSave(location);
                }
                setEditing(!editing);
              }}
              type="button"
              className="px-4 py-2 text-sm rounded bg-theme-blue text-white hover:bg-theme-bluehighlighted transition"
            >
              {editing ? "Set this Location" : "Edit Location"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
