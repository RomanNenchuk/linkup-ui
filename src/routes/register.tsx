import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import RegisterForm from "@/components/auth/RegisterForm";
import { createFileRoute } from "@tanstack/react-router";
import type { RegisterFormData } from "@/schemas/authSchemas";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { registerMutation } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setError("");
      setSuccess("");
      await registerMutation.mutateAsync(data);
      setSuccess("Check your inbox to verify email address");
    } catch (error: any) {
      console.log(error);

      setError(error.response.data ?? "Failed to create an account");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h2" align="center" gutterBottom>
            Create Account
          </Typography>

          {success && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              {success}
            </Alert>
          )}
          {error && (
            <Alert
              icon={<ErrorOutlineIcon fontSize="inherit" />}
              severity="error"
            >
              {error}
            </Alert>
          )}

          <GoogleAuthButton />

          <Divider sx={{ my: 2 }}>or</Divider>

          <RegisterForm onSubmit={handleRegister} />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover" color="primary">
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
