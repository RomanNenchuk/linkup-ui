import { Close } from "@mui/icons-material";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

type SelectedImagesProps = {
  selectedImages: File[];
  existingImages?: PostPhoto[];
  handleRemoveSelectedImage: (index: number) => void;
  handleRemoveExistingImage?: (publicId: string) => void;
};

export default function SelectedImagesList({
  selectedImages,
  existingImages,
  handleRemoveSelectedImage,
  handleRemoveExistingImage = () => {},
}: SelectedImagesProps) {
  const [localExistingImages, setLocalExistingImages] = useState<PostPhoto[] | undefined>(existingImages);
  const totalImages = selectedImages.length + (localExistingImages?.length ?? 0);

  useEffect(() => {
    setLocalExistingImages(existingImages);
  }, [existingImages]);

  const onRemoveExistingImage = (publicId: string) => {
    setLocalExistingImages((prev) => prev?.filter((image) => image.publicId != publicId));
    handleRemoveExistingImage(publicId);
  };

  return (
    <>
      {totalImages > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Selected Images ({totalImages}/5)
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {/* Existing images */}
            {localExistingImages &&
              localExistingImages.map((postPhoto) => (
                <Box
                  key={postPhoto.id}
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
                    src={postPhoto.url}
                    alt={`Existing ${postPhoto.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onRemoveExistingImage(postPhoto.publicId)}
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

            {/* New selected images */}
            {selectedImages.map((file, index) => (
              <Box
                key={`new-${index}`}
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
                  onClick={() => handleRemoveSelectedImage(index)}
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
      )}
    </>
  );
}
