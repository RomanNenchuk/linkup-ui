import { forgotPassword } from "@/api/auth";
import Header from "@/components/auth/Header";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = (data: ForgotPasswordSchemaType) => {
    mutate(data.email);
  };

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: forgotPassword,
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
            <Typography variant="h2" align="center" gutterBottom>
              Forgot Password
            </Typography>
            {isSuccess && (
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                sx={{ display: "flex", justifyContent: "center" }}
                severity="success"
              >
                Check your inbox and follow further instructions
              </Alert>
            )}

            {isError && (
              <Alert
                icon={<ErrorOutlineIcon fontSize="inherit" />}
                sx={{ display: "flex", justifyContent: "center" }}
                severity="error"
              >
                {extractApiErrorMessage(error, "Failed to send email. Please, try again later")}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit(handleForgotPassword)} noValidate>
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

              <Button type="submit" fullWidth variant="contained" disabled={isPending} sx={{ mt: 2, py: 1.2 }}>
                Send email
              </Button>
            </Box>
            <AuthPrompt text="Don't have an account?" linkText="Register" to="/register" />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
