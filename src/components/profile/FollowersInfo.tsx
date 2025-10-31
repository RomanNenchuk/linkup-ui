import { Box, Typography } from "@mui/material";

export default function FollowersInfo({
  followersCount,
  followingCount,
  compact = false,
}: {
  followersCount?: number;
  followingCount?: number;
  compact?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
        mt: compact ? 0.5 : 1,
      }}
    >
      <Typography variant="body2">
        <strong>{followersCount ?? 0}</strong> Followers
      </Typography>
      <Typography variant="body2">
        <strong>{followingCount ?? 0}</strong> Following
      </Typography>
    </Box>
  );
}
