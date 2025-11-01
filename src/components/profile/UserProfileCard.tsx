import { Box, Card, CardContent, Divider, Alert } from "@mui/material";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowButton from "@/components/profile/FollowButton";
import FollowersInfo from "@/components/profile/FollowersInfo";
import useToggleFollow from "@/hooks/useToggleFollow";

export default function UserProfileCard({ user }: { user: any }) {
  const { handleFollowToggle, isToggleFollowPending, isToggleFollowError, toggleFollowError } = useToggleFollow(user);

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      {isToggleFollowError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {toggleFollowError?.message ?? "Failed to toggle follow state"}
        </Alert>
      )}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "center", sm: "start" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mb: 3,
            }}
          >
            <ProfileHeader user={user} />
            <FollowButton
              user={user}
              handleFollowToggle={handleFollowToggle}
              isToggleFollowPending={isToggleFollowPending}
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          <FollowersInfo followersCount={user.followersCount} followingCount={user.followingCount} />
        </CardContent>
      </Card>
    </Box>
  );
}
