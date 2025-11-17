import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { reverseGeocode } from "@/api/posts";
import Map from "../location/Map";
import { SMALL_ZOOM } from "@/constants/posts";

type LocationModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (location: PostLocation) => void;
  initialLocation: PostLocation | null;
};

export default function LocationModal({ open, onClose, onSave, initialLocation }: LocationModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [location, setLocation] = useState<PostLocation | null>(initialLocation ?? null);
  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const mapCenter: [number, number] | undefined = location ? [location.latitude, location.longitude] : undefined;

  const handleSelect = async (coordinates: LocationCoordinates) => {
    const address = await reverseGeocode(coordinates);
    setLocation({ ...coordinates, address });
  };

  const updateAddress = (addr: string) => {
    setLocation((prev) => (prev ? { ...prev, address: addr } : { latitude: 0, longitude: 0, address: addr }));
  };

  const handleSave = () => {
    if (location) onSave(location);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <DialogTitle>Select Location</DialogTitle>
      <DialogContent>
        <Map handleSelect={handleSelect} mapCenter={mapCenter} zoom={SMALL_ZOOM} />

        <TextField
          fullWidth
          label="Address"
          value={location?.address ?? ""}
          onChange={(e) => updateAddress(e.target.value)}
        />
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
