import Header from "@/components/auth/Header";
import UserAvatar from "@/components/auth/UserAvatar";
import { useAuth } from "@/contexts/AuthProvider";
import { Box, Card, CardContent, Chip, CircularProgress, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  if (user == null)
    return (
      <>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      </>
    );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 1 }}>
      <Header />
      <Box display="flex" justifyContent="center" mt={4} flexGrow={1}>
        <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <UserAvatar id={user.id} displayName={user.displayName} size={64} />
            <Box>
              <Typography variant="h5">{user.displayName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <CardContent>
            <Typography variant="body1" gutterBottom>
              Статус:
            </Typography>
            {user.isVerified ? (
              <Chip label="Підтверджено" color="success" />
            ) : (
              <Chip label="Не підтверджено" color="warning" />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
