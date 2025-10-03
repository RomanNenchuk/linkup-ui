import Header from "@/components/auth/Header";
import HeatMap from "@/components/maps/HeatMap";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const mockClusters = [
  { id: 1, title: "Cluster 1: Tech Posts", count: 25, description: "Posts about technology and gadgets." },
  { id: 2, title: "Cluster 2: Travel", count: 15, description: "Posts about travel experiences and locations." },
  { id: 3, title: "Cluster 3: Food", count: 30, description: "Posts related to food recipes and restaurants." },
];

export const Route = createFileRoute("/analytics")({
  component: Analytics,
});

function Analytics() {
  const [clusters, setClusters] = useState<any>([]);

  // Імітація завантаження кластерів (можна замінити на API виклик)
  useEffect(() => {
    setClusters(mockClusters);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header currentPage="Analytics" />

      <HeatMap />

      <Box sx={{ mt: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Clusters of Posts
        </Typography>

        {clusters.length === 0 ? (
          <Typography>No cluster data available.</Typography>
        ) : (
          <List>
            {clusters.map((cluster: any) => (
              <Paper key={cluster.id} sx={{ mb: 2, p: 2 }}>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemText primary={`${cluster.title} (${cluster.count} posts)`} secondary={cluster.description} />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
