import { Controller, type Control, type FieldError } from "react-hook-form";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import type { Dispatch, SetStateAction } from "react";

type PasswordFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
};

export default function PasswordField({
  name,
  control,
  label,
  error,
  showPassword,
  setShowPassword,
}: PasswordFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error?.message ?? ""}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
