import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet.heat";
import L from "leaflet";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHeatmapPoints } from "@/api/posts";
import { useMapBounds } from "@/hooks/useMapBounds";

function HeatmapLayer({
  points,
  onBoundsChange,
  onZoomChange,
}: {
  points?: [number, number, number?][];
  onBoundsChange: (bounds: BoundsType) => void;
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMapBounds(onBoundsChange, onZoomChange);

  useEffect(() => {
    if (!points?.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 15, // size of the heat spot in pixels
      blur: 4, // blur (smaller → sharper spots)
      maxZoom: 18, // zoom level at which the values are maximally detailed
      max: 1.0, // normalization (1.0 = count values interpreted "as is")
      minOpacity: 0.1, // minimum opacity of the heat spot
      gradient: {
        // set of colors for the gradient
        0.0: "red",
        0.5: "lime",
        1.0: "skyblue",
      },
    });
    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
}

export default function HeatMap() {
  const [bounds, setBounds] = useState<BoundsType | null>(null);
  const [zoom, setZoom] = useState<number>(3);

  const { data: heatmapPoints } = useQuery({
    queryKey: ["heatmap", bounds, zoom],
    queryFn: () => (bounds ? getHeatmapPoints({ ...bounds, zoom }) : Promise.resolve([])),
    enabled: !!bounds && !!zoom,
  });

  return (
    <MapContainer
      center={[50, 10]}
      zoom={zoom}
      worldCopyJump={true}
      style={{ height: "300px", width: "100%", outline: "none" }}
      className="no-outline"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatmapLayer
        points={heatmapPoints?.map((p: any) => [p.latitude, p.longitude, p.count])}
        onBoundsChange={setBounds}
        onZoomChange={setZoom}
      />
    </MapContainer>
  );
}
