import { Card, CardContent, Typography } from "@mui/material";

export default function SelectLocationPrompt() {
  return (
    <Card
      sx={{
        mb: 2,
        textAlign: "center",
        // bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Select a location
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on the map to choose a place and view nearby posts.
        </Typography>
      </CardContent>
    </Card>
  );
}
