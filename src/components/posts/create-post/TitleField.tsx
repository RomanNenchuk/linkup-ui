import { Box, TextField, Typography } from "@mui/material";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { PostFormValues } from "@/schemas/postSchemas";

type TitleFieldProps = {
  control: Control<PostFormValues>;
  errors: FieldErrors<PostFormValues>;
  value: string;
};

export default function TitleField({ control, errors, value }: TitleFieldProps) {
  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Title"
            placeholder="Enter post title"
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title?.message as string}
            inputProps={{ maxLength: 100 }}
            sx={{ mb: 1 }}
          />
        )}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {value.length}/100
        </Typography>
      </Box>
    </>
  );
}
