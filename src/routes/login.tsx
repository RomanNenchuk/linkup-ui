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

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const {
    mutate: handleLogin,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setToken(data);
      navigate({ to: "/profile" });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

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
                {(error as any)?.response?.data ?? "Failed to login"}
              </Alert>
            )}

            <GoogleAuthButton />

            <Divider sx={{ my: 2 }}>or</Divider>

            <LoginForm onSubmit={handleLogin} isPending={isPending} />

            <AuthPrompt text="Don't have an account?" linkText="Register" to="/register" />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
