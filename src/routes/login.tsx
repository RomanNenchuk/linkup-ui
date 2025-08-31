import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { useAuth } from "@/contexts/AuthProvider";
import { Box, Card, CardContent, Typography, Alert, Divider } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoginForm from "@/components/auth/LoginForm";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import Header from "@/components/auth/Header";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const {
    mutate: handleLogin,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setToken(data);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (token) {
      navigate({ to: "/profile" });
    }
  }, [token, navigate]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 1 }}>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" px={2} flexGrow={1}>
        <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
          <CardContent>
            <Typography variant="h2" align="center" gutterBottom>
              Login
            </Typography>

            {isError && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
                {extractApiErrorMessage(error, "Failed to login")}
              </Alert>
            )}

            <GoogleAuthButton />

            <Divider sx={{ my: 2 }}>or</Divider>

            <LoginForm onSubmit={handleLogin} isPending={isPending} />

            <AuthPrompt text="Don't have an account?" linkText="Register" to="/register" />
            <AuthPrompt linkText="Forgot Password?" to="/forgot-password" />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
