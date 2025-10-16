import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { defaultMarkerIcon } from "@/utils/defaultMarkerIcon";
import { DEFAULT_ZOOM, LOCATION_DEFAULT_COORDINATES } from "@/constants/posts";

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={defaultMarkerIcon} /> : null;
}

export default function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  return (
    <MapContainer
      center={LOCATION_DEFAULT_COORDINATES}
      zoom={DEFAULT_ZOOM}
      style={{ height: "300px", width: "100%", borderRadius: "8px", marginBottom: "16px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
}
