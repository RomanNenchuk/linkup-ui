import { Box, Card, CardContent, Divider, Alert, Button } from "@mui/material";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowersInfo from "@/components/profile/FollowersInfo";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { extractApiErrorMessage } from "@/utils/extractErrorMessage";
import EmailVerificationCall from "./EmailVerificationCall";

type CurrentUserProfileCardType = {
  handleVerifyEmail: VoidFunction;
  user: User;
  isError: boolean;
  error: Error | null;
  isPending: boolean;
  handleLogout: VoidFunction;
};

export default function CurrentUserProfileCard({
  handleVerifyEmail,
  user,
  isError,
  error,
  isPending,
  handleLogout,
}: CurrentUserProfileCardType) {
  return (
    <Box sx={{ width: "100%", maxWidth: 650, mb: 2 }}>
      {isError && (
        <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ mb: 2 }} severity="error">
          {extractApiErrorMessage(error, "Failed to logout. Please try again later")}
        </Alert>
      )}
      {!user.isVerified && <EmailVerificationCall handleVerifyEmail={handleVerifyEmail} />}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "center", sm: "start" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <ProfileHeader user={user} />
            <Button
              variant="contained"
              size="small"
              sx={{ my: "auto", width: { xs: "80%", sm: "auto" } }}
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
  );
}
