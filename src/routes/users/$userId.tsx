import Header from "@/components/auth/Header";
import { Box } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/users";
import UserNotFoundState from "@/components/user/UserNotFoundState";
import UserLoadingState from "@/components/user/UserLoadingState";
import UserProfileCard from "@/components/user/UserProfileCard";
import UserPostsSection from "@/components/profile/UserPostsSection";
import UserPostLocations from "@/components/maps/routemap/UserPostLocations";
import { useUserTabs } from "@/hooks/useUserTabs";
import UserTabs from "@/components/profile/UserTabs";

export const Route = createFileRoute("/users/$userId")({
  component: UserPage,
});

function UserPage() {
  const { userId } = useParams({ from: "/users/$userId" });
  const { activeTab, setActiveTab, mapRef } = useUserTabs();

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
          mt: 4,
        }}
      >
        <UserProfileCard user={user} />
        <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "posts" && <UserPostsSection userId={user.id} />}
        {activeTab === "map" && (
          <Box
            ref={mapRef}
            sx={{
              height: "calc(100vh - 200px)",
              width: "100%",
              mt: 1,
              scrollMarginTop: "calc(env(safe-area-inset-top, 0px) + 72px)",
            }}
          >
            <UserPostLocations userId={user.id} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
