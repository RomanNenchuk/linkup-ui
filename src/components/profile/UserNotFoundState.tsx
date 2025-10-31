import { Box, Typography } from "@mui/material";
import Header from "@/components/auth/Header";

export default function UserNotFoundState() {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          User not found
        </Typography>
      </Box>
    </>
  );
}
