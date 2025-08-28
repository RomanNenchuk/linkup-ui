import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function GoogleAuthButton() {
  const handleLoginWithGoogle = async () => {
    window.location.href =
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/login/google?returnUrl=${window.location.origin}`;
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        mb: 2,
        mt: 1,
        borderRadius: 2,
        fontWeight: 500,
      }}
      onClick={handleLoginWithGoogle}
    >
      Continue with Google
    </Button>
  );
}
