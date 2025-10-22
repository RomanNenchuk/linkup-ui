import { MAX_IMAGES_COUNT } from "@/constants/posts";
import { PhotoCamera } from "@mui/icons-material";
import { Button } from "@mui/material";
import type React from "react";

type SelectImagesInputProps = {
  selectedImagesCount: number;
  handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxImages?: number;
};

export default function SelectImagesInput({
  selectedImagesCount,
  handleImageSelect,
  maxImages = MAX_IMAGES_COUNT,
}: SelectImagesInputProps) {
  const isMaxReached = selectedImagesCount >= maxImages;

  return (
    <Button
      variant="outlined"
      component="label"
      startIcon={<PhotoCamera />}
      disabled={isMaxReached}
      sx={{ textTransform: "none" }}
    >
      {isMaxReached ? "Max images reached" : "Add Photos"}
      <input type="file" hidden multiple accept="image/*" onChange={handleImageSelect} disabled={isMaxReached} />
    </Button>
  );
}
