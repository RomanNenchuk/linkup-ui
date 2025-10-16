import { Marker, useMapEvents } from "react-leaflet";
import { defaultMarkerIcon } from "@/utils/defaultMarkerIcon";

type LocationMarkerProps = {
  onSelect: (coordinates: LocationCoordinates) => Promise<void>;
  position?: [number, number];
};

export default function LocationMarker({ onSelect, position }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      onSelect({ latitude: newPos[0], longitude: newPos[1] });
    },
  });

  return position ? <Marker position={position} icon={defaultMarkerIcon} /> : null;
}
