import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Typography } from "@mui/material";
import UserAvatar from "../auth/UserAvatar";

export default function ProfileHeader({ user }: { user: User; compact?: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <UserAvatar id={user.id} displayName={user.displayName} size={48} />
      <Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="h6" fontWeight={500} noWrap maxWidth={180}>
            {user.displayName}
          </Typography>
          {user.isVerified && <VerifiedIcon color="primary" fontSize="small" sx={{ verticalAlign: "middle" }} />}
        </Box>
        <Typography variant="subtitle2" color="text.secondary" noWrap>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}
