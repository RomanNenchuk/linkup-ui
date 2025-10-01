import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState } from "react";
import { reverseGeocode } from "@/api/posts";
import Map from "../location/Map";
import { KYIV_COORDINATES } from "@/constants/posts";

type LocationModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (location: PostLocation) => void;
  intialLocation: PostLocation | null;
};

export default function LocationModal({ open, onClose, onSave, intialLocation }: LocationModalProps) {
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
  const [address, setAddress] = useState(intialLocation?.address ?? "");
  const mapCenter: [number, number] = coordinates
    ? [coordinates.latitude, coordinates.longitude]
    : intialLocation
      ? [intialLocation.latitude, intialLocation.longitude]
      : KYIV_COORDINATES;

  const handleSelect = async (coordinates: LocationCoordinates) => {
    setCoordinates(coordinates);
    const address = await reverseGeocode(coordinates);
    setAddress(address);
  };

  const handleSave = () => {
    if (coordinates) onSave({ ...coordinates, address });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Location</DialogTitle>
      <DialogContent>
        <Map handleSelect={handleSelect} mapCenter={mapCenter} />

        <TextField fullWidth label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
