import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { type LatLngExpression } from "leaflet";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUserPostLocations } from "@/api/posts";
import { useMemo } from "react";
import { DEFAULT_ZOOM } from "@/constants/posts";
import { defaultMarkerIcon } from "@/utils/defaultMarkerIcon";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";

type UserPostLocationsProps = {
  userId: string;
};

type TimestampedPostLocation = {
  postId: string;
  createdAt: Date;
  position: [number, number];
};

export default function UserPostLocations({ userId }: UserPostLocationsProps) {
  const navigate = useNavigate();
  const { data: postLocations, isLoading } = useQuery({
    queryKey: ["user-post-locations", userId],
    queryFn: async () => getUserPostLocations(userId),
    enabled: !!userId,
  });

  const timestampedPositions = useMemo<TimestampedPostLocation[]>(() => {
    if (!postLocations) return [];
    return postLocations.map((p) => ({
      postId: p.postId,
      createdAt: p.createdAt,
      position: [p.latitude, p.longitude],
    }));
  }, [postLocations]);

  const positions = useMemo<LatLngExpression[]>(() => {
    return timestampedPositions.map((p) => p.position);
  }, [timestampedPositions]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={1}>
        <CircularProgress />
      </Box>
    );
  }

  if (!timestampedPositions.length)
    return (
      <Typography sx={{ width: "100%", mt: 4, color: "text.secondary" }} textAlign="center">
        User doesn't have posts with locations yet
      </Typography>
    );

  const center: LatLngExpression = timestampedPositions[0].position;

  return (
    <MapContainer center={center} zoom={DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }} worldCopyJump={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline positions={positions} pathOptions={{ color: "green", weight: 3, dashArray: "5, 8" }} />

      {timestampedPositions.map((item, i) => (
        <Marker key={i} position={item.position as LatLngExpression} icon={defaultMarkerIcon}>
          <Popup>
            <div style={{ minWidth: 150 }}>
              <b>Created at:</b> {format(new Date(item.createdAt), "dd MMM yyyy, HH:mm")}
              <br />
              <button
                onClick={() => navigate({ to: `/posts/${item.postId}` })}
                style={{
                  marginTop: "8px",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#fafafa",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Open post
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
