import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

export function useMapBounds(onBoundsChange: (b: BoundsType) => void, onZoomChange: (z: number) => void) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      if (!b) return;
      onBoundsChange({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLon: b.getWest(),
        maxLon: b.getEast(),
      });
    },
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    const b = map.getBounds();
    if (b) {
      onBoundsChange({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLon: b.getWest(),
        maxLon: b.getEast(),
      });
      onZoomChange(map.getZoom());
    }
  }, [map, onBoundsChange, onZoomChange]);

  return map;
}
