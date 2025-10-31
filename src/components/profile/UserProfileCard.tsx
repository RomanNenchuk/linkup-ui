import { Box, Card, CardContent, Divider, Alert } from "@mui/material";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowButton from "@/components/profile/FollowButton";
import FollowersInfo from "@/components/profile/FollowersInfo";
import useToggleFollow from "@/hooks/useToggleFollow";

export default function UserProfileCard({ user }: { user: any }) {
  const { handleFollowToggle, isToggleFollowPending, isToggleFollowError, toggleFollowError } = useToggleFollow(user);

  return (
    <Card sx={{ maxWidth: 600, width: "100%", mb: 2 }}>
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
  );
}
