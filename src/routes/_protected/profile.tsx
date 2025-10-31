import Header from "@/components/auth/Header";
import { useAuth } from "@/contexts/AuthProvider";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";
import FollowersInfo from "@/components/profile/FollowersInfo";
import EmailVerificationCall from "@/components/profile/EmailVerificationCall";
import ProfileHeader from "@/components/profile/ProfileHeader";

export const Route = createFileRoute("/_protected/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setToken } = useAuth();
  const navigate = useNavigate();

  const handleVerifyEmail = () => {
    navigate({ to: ROUTES.VERIFY_EMAIL });
  };

  const {
    mutate: handleLogout,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setToken(null);
      navigate({ to: "/", search: { sort: "recent" } });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, mt: 12, px: { xs: 2, sm: 4 } }}>
        <Card sx={{ maxWidth: 600, width: "100%", height: "fit-content" }}>
          <CardContent>
            {!user.isVerified && <EmailVerificationCall handleVerifyEmail={handleVerifyEmail} />}
            {isError && (
              <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ mb: 2 }} severity="error">
                {extractApiErrorMessage(error, "Failed to logout. Pleasy, try again later")}
              </Alert>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "center", sm: "start" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <ProfileHeader user={user} />
              <Button
                variant="contained"
                size="small"
                sx={{ my: "auto" }}
                disabled={isPending}
                onClick={() => handleLogout()}
              >
                Log out
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />

            <FollowersInfo followersCount={user.followersCount} followingCount={user.followingCount} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
