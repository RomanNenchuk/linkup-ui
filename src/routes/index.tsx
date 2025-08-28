import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Hello from MUI + TanStack 🚀
      </Typography>
      <Button variant="contained" color="primary">
        Click me
      </Button>
      <Link to="/login">Login</Link>
    </Container>
  );
}
