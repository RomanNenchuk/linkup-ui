import { Box, useMediaQuery, useTheme } from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function PostPhotos({ photos }: { photos: PostPhoto[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!photos || photos.length === 0) return null;
  if (photos.length === 1) {
    return (
      <Box mt={1}>
        <PhotoProvider>
          <PhotoView src={photos[0].url}>
            <Box
              sx={{
                pl: "60px",
                pr: "24px",
                display: "inline-block",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={photos[0].url}
                alt="Post image"
                loading="lazy"
                sx={{
                  maxHeight: isMobile ? 240 : 400,
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                  cursor: "pointer",
                  borderRadius: 1,
                }}
              />
            </Box>
          </PhotoView>
        </PhotoProvider>
      </Box>
    );
  }

  return (
    <Box mt={1}>
      <PhotoProvider>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            overflowX: "auto",
            pl: "60px",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {photos.map((photo, index) => (
            <Box
              key={photo.id}
              sx={{
                flex: "0 0 auto",
                position: "relative",
                height: 200,
                width: "auto",
                maxWidth: 260,
                overflow: "hidden",
                mr: index !== photos.length - 1 ? 1 : 0,
              }}
            >
              <PhotoView src={photo.url}>
                <Box
                  component="img"
                  src={photo.url}
                  alt={`Post image ${index + 1}`}
                  loading="lazy"
                  borderRadius={1}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }}
                />
              </PhotoView>
            </Box>
          ))}
          <Box sx={{ flex: "0 0 auto", width: "16px" }} />
        </Box>
      </PhotoProvider>
    </Box>
  );
}
