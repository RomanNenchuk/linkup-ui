import { resendVerification } from "@/api/auth";
import { ResendEmailButton } from "@/components/auth/ResendEmailButton";
import { useResendTimer } from "@/hooks/useResendTimer";
import { Alert, Box, Card, CardContent, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/auth/Header";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";

export const Route = createFileRoute("/_protected/verify-email")({
  component: VerifyEmail,
});

function VerifyEmail() {
  const { resendDisabled, resendTimer, startResendTimer } = useResendTimer();

  const handleResend = async () => {
    mutate();
  };

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      startResendTimer();
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 1 }}>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} px={2}>
        <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Verify Email
            </Typography>
            {isSuccess && (
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                sx={{ display: "flex", justifyContent: "center" }}
                severity="success"
              >
                Verification resent to your email
              </Alert>
            )}

            {isError && (
              <Alert
                icon={<ErrorOutlineIcon fontSize="inherit" />}
                sx={{ display: "flex", justifyContent: "center" }}
                severity="error"
              >
                {extractApiErrorMessage(error, "Failed to resend email verification. Try later")}
              </Alert>
            )}

            <Typography align="center" color="text.secondary">
              Check your inbox to verify email
            </Typography>

            <Box mt={3} display="flex" justifyContent="center">
              <ResendEmailButton
                resendDisabled={resendDisabled || isPending}
                resendTimer={resendTimer}
                isSubmitting={isPending}
                type="button"
                variant="contained"
                caption="Resend Email"
                onClick={handleResend}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
