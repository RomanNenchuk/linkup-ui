import { Box, CircularProgress } from "@mui/material";
import Header from "@/components/auth/Header";

export default function UserLoadingState() {
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
        <CircularProgress />
      </Box>
    </>
  );
}
