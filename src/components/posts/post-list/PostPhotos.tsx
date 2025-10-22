import { PREVIEW_IMAGES_COUNT } from "@/constants/posts";
import { Box, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function PostPhotos({ photos }: { photos: PostPhoto[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              height: isMobile ? 120 : 250,
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

  return (
    <PhotoProvider>
      <ImageList sx={{ width: "100%", mb: 2 }} cols={isMobile ? 2 : 3} rowHeight={isMobile ? 120 : 180} gap={4}>
        {photos.map((photo, index) => {
          const isHidden = index >= PREVIEW_IMAGES_COUNT;
          const isOverlay = index === PREVIEW_IMAGES_COUNT - 1 && photos.length > PREVIEW_IMAGES_COUNT;

          return (
            <ImageListItem
              key={photo.id}
              cols={1}
              sx={{
                display: isHidden ? "none" : "block",
                position: "relative",
              }}
            >
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
                    pointerEvents: "none",
                  }}
                >
                  <Typography variant="h6" color="white" fontWeight={600}>
                    +{photos.length - PREVIEW_IMAGES_COUNT}
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
