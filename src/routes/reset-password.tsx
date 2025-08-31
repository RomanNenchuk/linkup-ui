import { resetPassword } from "@/api/auth";
import { Box, Card, CardContent, Typography, Alert, Button } from "@mui/material";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/auth/Header";
import { resetPasswordSchema, type ResetPasswordSchemaType } from "@/schemas/authSchemas";
import PasswordField from "@/components/auth/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): { verificationToken?: string } => {
    return {
      verificationToken: search.verificationToken as string | undefined,
    };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { verificationToken } = useSearch({ from: "/reset-password" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setTimeout(() => navigate({ to: "/login", replace: true }), 2000);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = (payload: ResetPasswordSchemaType) => {
    if (!verificationToken) return;
    mutate({
      verificationToken,
      newPassword: payload.password,
    });
    cleanUrl();
  };

  const cleanUrl = () => {
    if (window.history.replaceState) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("verificationToken");
      window.history.replaceState({}, document.title, newUrl.pathname);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 1 }}>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} px={2}>
        <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Password Reset
            </Typography>

            {!verificationToken && !isError && !isSuccess && !isPending && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
                Verification token is missing. Please check your email for the correct link.
              </Alert>
            )}

            {isSuccess && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Your password is reset. You can login now!
              </Alert>
            )}

            {isError && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
                {extractApiErrorMessage(error, "Failed to reset password. Please, try again later")}
              </Alert>
            )}

            {isPending && (
              <Typography align="center" color="text.secondary">
                Verifying...
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit(handleResetPassword)} noValidate>
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

              <Button type="submit" fullWidth variant="contained" disabled={isPending} sx={{ mt: 2, py: 1.2 }}>
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
