import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "../../auth/UserAvatar";
import { Link } from "@tanstack/react-router";
import { useFollowUser } from "@/hooks/useFollowUser";

export default function SearchedUserCard({ user }: { user: SearchedUser }) {
  const { toggleFollowMutation } = useFollowUser();

  const handleClick = () => {
    toggleFollowMutation.mutate({ followeeId: user.id, isFollowed: !user.isFollowed });
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Link to="/users/$userId" params={{ userId: user.id }}>
        <UserAvatar id={user.id} size={42} displayName={user.displayName} />
      </Link>

      <Box sx={{ flexGrow: 1 }}>
        <Link to="/users/$userId" params={{ userId: user.id }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1 }}>
            {user.displayName}
          </Typography>
        </Link>
      </Box>
      <Button
        variant={user.isFollowed ? "outlined" : "contained"}
        size="small"
        disabled={toggleFollowMutation.isPending}
        onClick={handleClick}
      >
        {user.isFollowed ? "Followed" : "Follow"}
      </Button>
    </Box>
  );
}
