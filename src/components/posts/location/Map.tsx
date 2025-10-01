import { Box, type SxProps, type Theme } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "../create-post/LocationMarker";
import MapUpdater from "./MapUpdater";

export type MapProps = {
  mapCenter: [number, number];
  handleSelect: (coordinates: LocationCoordinates) => Promise<void>;
  zoom?: number;
  mapStyles?: React.CSSProperties;
  boxStyles?: SxProps<Theme>;
};

export default function Map({
  mapCenter,
  handleSelect,
  zoom = 12,
  mapStyles = { height: "100%", width: "100%" },
  boxStyles,
}: MapProps) {
  return (
    <Box sx={{ height: 400, mb: 2, ...boxStyles }}>
      <MapContainer center={mapCenter} zoom={zoom} style={mapStyles}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={mapCenter} />
        <LocationMarker onSelect={handleSelect} position={mapCenter} />
      </MapContainer>
    </Box>
  );
}
