import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";
import LocationMarker from "./LocationMarker";
import axios from "axios";

const KYIV_COORDINATES: [number, number] = [50.4501, 30.5234];

export default function LocationModal({
  open,
  userCurrentLocation,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  userCurrentLocation: LocationCoordinates | null;
  onSave: (location: { lat: number; lng: number; address: string }) => void;
}) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const mapCenter: [number, number] = userCurrentLocation
    ? [userCurrentLocation.lat, userCurrentLocation.lng]
    : KYIV_COORDINATES;

  const handleSelect = async (lat: number, lng: number) => {
    setLocation({ lat, lng });

    // Reverse geocoding з Nominatim
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      setAddress(res.data.display_name || "");
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Location</DialogTitle>
      <DialogContent>
        <Box sx={{ height: 300, mb: 2 }}>
          <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onSelect={handleSelect} />
          </MapContainer>
        </Box>

        <TextField fullWidth label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            if (location) {
              onSave({ ...location, address });
            }
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
