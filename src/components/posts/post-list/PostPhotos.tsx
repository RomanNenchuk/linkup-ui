import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function PostPhotos({ photos }: { photos: PostPhoto[] }) {
  if (!photos || photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <PhotoProvider>
        <PhotoView src={photos[0].url}>
          <Box
            component="img"
            src={photos[0].url}
            alt="Post image"
            loading="lazy"
            sx={{
              width: "100%",
              height: 250,
              objectFit: "cover",
              borderRadius: 1,
              mb: 2,
              cursor: "pointer",
            }}
          />
        </PhotoView>
      </PhotoProvider>
    );
  }

  const previewPhotos = photos.slice(0, 5);

  return (
    <PhotoProvider>
      <ImageList sx={{ width: "100%", mb: 2 }} cols={3} rowHeight={200} gap={4}>
        {previewPhotos.map((photo, index) => {
          const isOverlay = index === 4 && photos.length > 5;

          return (
            <ImageListItem key={photo.id} cols={1}>
              <PhotoView src={photo.url}>
                <Box
                  component="img"
                  src={photo.url}
                  alt={`Post image ${index + 1}`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              </PhotoView>

              {isOverlay && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6" color="white" fontWeight={600}>
                    +{photos.length - 5}
                  </Typography>
                </Box>
              )}
            </ImageListItem>
          );
        })}
      </ImageList>
    </PhotoProvider>
  );
}
