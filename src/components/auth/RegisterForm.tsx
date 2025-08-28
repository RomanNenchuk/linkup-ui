import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/schemas/authSchemas";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import PasswordField from "./PasswordInput";

type RegisterFormProps = {
  onSubmit: (data: RegisterFormData) => void;
};

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message ?? ""}
          />
        )}
      />

      <Controller
        name="displayName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Display Name"
            fullWidth
            margin="normal"
            error={!!errors.displayName}
            helperText={errors.displayName?.message ?? ""}
          />
        )}
      />

      <PasswordField
        name="password"
        control={control}
        label="Password"
        error={errors.password}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <PasswordField
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        error={errors.confirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
      >
        Register
      </Button>
    </Box>
  );
}
