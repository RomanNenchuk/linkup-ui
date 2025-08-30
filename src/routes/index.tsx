import Header from "@/components/auth/Header";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", gap: 3 }}>
      <Header />
      <Container sx={{ flexGrow: 1 }}>
        <Typography variant="h1" gutterBottom>
          Hello from MUI + TanStack 🚀
        </Typography>
        <Button variant="contained" color="primary">
          Click me
        </Button>
        <Link to="/login">Login</Link>
      </Container>
    </Box>
  );
}
