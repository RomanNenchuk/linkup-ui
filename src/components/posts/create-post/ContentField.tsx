import type { PostFormValues } from "@/schemas/postSchemas";
import { Box, TextField, Typography } from "@mui/material";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type ContentFieldProps = {
  control: Control<PostFormValues>;
  errors: FieldErrors<PostFormValues>;
  value: string;
};

export default function ContentField({ control, errors, value }: ContentFieldProps) {
  return (
    <>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            multiline
            rows={4}
            label="Content"
            placeholder="What's on your mind?"
            variant="outlined"
            error={!!errors.content}
            helperText={errors.content?.message}
            inputProps={{ maxLength: 300 }}
            sx={{ mb: 1 }}
          />
        )}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Typography variant="caption" color={value.length > 250 ? "error" : "text.secondary"}>
          {value.length}/300
        </Typography>
      </Box>
    </>
  );
}
