import Header from "@/components/auth/Header";
import UserAvatar from "@/components/auth/UserAvatar";
import { Box, Button, Card, CardContent, Typography, Divider, CircularProgress, Alert } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { getUserById } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import useToggleFollow from "@/hooks/useToggleFollow";

export const Route = createFileRoute("/users/$userId")({
  component: UserPage,
});

function UserPage() {
  const { userId } = useParams({ from: "/users/$userId" });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const { handleFollowToggle, isToggleFollowPending, isToggleFollowError, toggleFollowError } = useToggleFollow(user);

  if (isUserLoading)
    return (
      <>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      </>
    );

  if (user == null) {
    return (
      <>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <Typography variant="h6" color="text.secondary">
            User not found
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, mt: 12, px: { xs: 2, sm: 4 } }}>
        <Card sx={{ maxWidth: 600, width: "100%", height: "fit-content" }}>
          {isToggleFollowError && (
            <Alert severity="error">{toggleFollowError?.message ?? "Failed to toggle follow state"}</Alert>
          )}
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "center", sm: "start" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: { xs: 2, sm: 0 },
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <UserAvatar id={user.id} displayName={user.displayName} size={64} />
                <Box>
                  <Box display="flex" alignItems="center" gap={1} justifyContent={{ xs: "center", sm: "flex-start" }}>
                    <Typography variant="h5" fontWeight="bold">
                      {user.displayName}
                    </Typography>
                    {user.isVerified && <VerifiedIcon color="primary" fontSize="small" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant={user.isFollowing ? "outlined" : "contained"}
                startIcon={user.isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                onClick={handleFollowToggle}
                disabled={isToggleFollowPending}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mb: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  {user.followersCount ?? 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  {user.followingCount ?? 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
