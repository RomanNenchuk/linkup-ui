import UserAvatar from "@/components/auth/UserAvatar";
import { useAuth } from "@/contexts/AuthProvider";
import { Box, Typography } from "@mui/material";

export default function UserInfoSection() {
  const { user } = useAuth();
  return (
    <>
      {user && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <UserAvatar id={user.id} size={35} displayName={user.displayName} />
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {user.displayName}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
