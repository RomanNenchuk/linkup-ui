import { Box, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

type AuthPromptProps = {
  text?: string;
  linkText: string;
  to: string;
};

export default function AuthPrompt({ text, linkText, to }: AuthPromptProps) {
  return (
    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
      {text && `${text} `}
      <Box
        component={Link}
        to={to}
        sx={{
          color: "primary.main",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {linkText}
      </Box>
    </Typography>
  );
}
