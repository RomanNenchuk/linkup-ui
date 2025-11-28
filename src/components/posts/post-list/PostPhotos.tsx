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
                className="no-nav"
                component="img"
                src={photos[0].url}
                alt="Post image"
                loading="lazy"
                sx={{
                  maxHeight: isMobile ? 240 : 300,
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                  cursor: "pointer",
                  borderRadius: 1.2,
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
        <Box mt={1}>
          <PhotoProvider>
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                overflowX: "auto",
                pl: "60px",
                pr: 2,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {photos.map((photo, index) => (
                <PhotoView key={photo.id} src={photo.url}>
                  <Box
                    className="no-nav"
                    component="img"
                    src={photo.url}
                    alt={`Post image ${index + 1}`}
                    loading="lazy"
                    sx={{
                      flexShrink: 0,
                      width: isMobile ? 160 : 200,
                      height: isMobile ? 160 : 200,
                      borderRadius: 1,
                      objectFit: "cover",
                      cursor: "pointer",
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                </PhotoView>
              ))}
            </Box>
          </PhotoProvider>
        </Box>
      </PhotoProvider>
    </Box>
  );
}
