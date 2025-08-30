import { Button } from "@mui/material";
import { ROUTES } from "@/constants/routes";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "@tanstack/react-router";

interface AuthButtonProps {
  variant?: "text" | "outlined" | "contained";
}

export default function AuthButton({ variant = "text" }: AuthButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleProfileClick = () => navigate({ to: ROUTES.PROFILE });
  const handleLoginClick = () => navigate({ to: ROUTES.LOGIN });

  return user ? (
    <Button onClick={handleProfileClick} sx={{ textTransform: "none" }}>
      <UserAvatar id={user.id} size={35} displayName={user.displayName} />
    </Button>
  ) : (
    <Button
      onClick={handleLoginClick}
      variant={variant}
      color="inherit"
      sx={{
        fontWeight: 500,
        borderRadius: 0,
      }}
    >
      Login
    </Button>
  );
}
