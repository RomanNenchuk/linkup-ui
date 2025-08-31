import { Box, Card, CardContent, Divider, Typography, Alert } from "@mui/material";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import RegisterForm from "@/components/auth/RegisterForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthProvider";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth";
import Header from "@/components/auth/Header";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";
import { useEffect } from "react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { setToken, token } = useAuth();

  const navigate = useNavigate();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      setToken(data);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const handleRegister = (payload: RegisterPayload) => {
    mutate(payload);
  };

  useEffect(() => {
    if (token) {
      navigate({ to: "/verify-email" });
    }
  }, [token, navigate]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 3 }}>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} px={2}>
        <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
          <CardContent>
            <Typography variant="h2" align="center" gutterBottom>
              Create Account
            </Typography>

            {isError && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
                {extractApiErrorMessage(error, "Failed to create an account")}
              </Alert>
            )}

            <GoogleAuthButton />

            <Divider sx={{ my: 2 }}>or</Divider>

            <RegisterForm onSubmit={handleRegister} isPending={isPending} />

            <AuthPrompt text="Already have an account?" linkText="Login" to="/login" />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
