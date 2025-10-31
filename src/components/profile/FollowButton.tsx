import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export default function FollowButton({ user, handleFollowToggle, isToggleFollowPending }: any) {
  return (
    <Button
      variant={user.isFollowing ? "outlined" : "contained"}
      size="small"
      startIcon={user.isFollowing ? <PersonRemoveIcon fontSize="small" /> : <PersonAddIcon fontSize="small" />}
      onClick={handleFollowToggle}
      disabled={isToggleFollowPending}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 500,
        px: 2,
        minWidth: 100,
      }}
    >
      {user.isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
