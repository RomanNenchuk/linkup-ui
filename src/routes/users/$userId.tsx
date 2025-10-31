import Header from "@/components/auth/Header";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/users";
import UserNotFoundState from "@/components/profile/UserNotFoundState";
import UserLoadingState from "@/components/profile/UserLoadingState";
import UserProfileCard from "@/components/profile/UserProfileCard";
import UserPostsSection from "@/components/profile/UserPostsSection";

export const Route = createFileRoute("/users/$userId")({
  component: UserPage,
});

function UserPage() {
  const { userId } = useParams({ from: "/users/$userId" });
  const [activeTab, setActiveTab] = useState<"posts" | "map">("posts");

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) return <UserLoadingState />;
  if (!user) return <UserNotFoundState />;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
          mt: 12,
          px: { xs: 2, sm: 4 },
        }}
      >
        <UserProfileCard user={user} />

        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered variant="fullWidth">
          <Tab label="Posts" value="posts" />
          <Tab label="Map" value="map" />
        </Tabs>

        {activeTab === "posts" && <UserPostsSection userId={user.id} />}
        {activeTab === "map" && <Typography sx={{ mt: 4, color: "text.secondary" }}>Map coming soon...</Typography>}
      </Box>
    </Box>
  );
}
