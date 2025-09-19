import { Close } from "@mui/icons-material";
import { Box, Typography, Stack, IconButton } from "@mui/material";

type SelectedImagesProps = { selectedImages: File[]; handleRemoveImage: (index: number) => void };

export default function SelectedImagesList({ selectedImages, handleRemoveImage }: SelectedImagesProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Selected Images ({selectedImages.length}/5)
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {selectedImages.map((file, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: 80,
              height: 80,
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              component="img"
              src={URL.createObjectURL(file)}
              alt={`Selected ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
