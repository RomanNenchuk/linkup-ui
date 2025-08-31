import { confirmEmail } from "@/api/auth";
import { Box, Card, CardContent, Typography, Alert } from "@mui/material";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/auth/Header";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";

export const Route = createFileRoute("/confirm-email")({
  validateSearch: (search: Record<string, unknown>): { verificationToken?: string } => {
    return {
      verificationToken: search.verificationToken as string | undefined,
    };
  },
  component: ConfirmEmailPage,
});

function ConfirmEmailPage() {
  const { verificationToken } = useSearch({ from: "/confirm-email" });
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: confirmEmail,
    onSuccess: () => {
      setTimeout(() => navigate({ to: "/login", replace: true }), 2000);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (!verificationToken) return;
    mutate(verificationToken);

    const cleanUrl = () => {
      if (window.history.replaceState) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("verificationToken");
        window.history.replaceState({}, document.title, newUrl.pathname);
      }
    };

    cleanUrl();
  }, [verificationToken]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 1 }}>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} px={2}>
        <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Email Confirmation
            </Typography>

            {!verificationToken && !isError && !isSuccess && !isPending && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
                Verification token is missing. Please check your email for the correct link.
              </Alert>
            )}

            {isSuccess && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Your email is verified. You can login now!
              </Alert>
            )}

            {isError && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
                {extractApiErrorMessage(error, "Failed to confirm your email. Try later")}
              </Alert>
            )}

            {isPending && (
              <Typography align="center" color="text.secondary">
                Verifying...
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
