import { PhotoCamera } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

type SelectImageInputProps = {
  selectedImages: File[];
  handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SelectImagesInput({ handleImageSelect, selectedImages }: SelectImageInputProps) {
  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="image-upload"
        multiple
        type="file"
        onChange={handleImageSelect}
        disabled={selectedImages.length >= 5}
      />
      <label htmlFor="image-upload">
        <IconButton color="primary" component="span" disabled={selectedImages.length >= 5}>
          <PhotoCamera />
        </IconButton>
      </label>
    </Box>
  );
}
