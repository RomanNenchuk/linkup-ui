import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/auth/Header";
import { Box } from "@mui/material";
import { useProfilePage } from "@/hooks/useProfilePage";
import UserLoadingState from "@/components/user/UserLoadingState";
import CurrentUserProfileCard from "@/components/profile/CurrentUserProfileCard";
import UserPostsSection from "@/components/profile/UserPostsSection";
import UserPostLocations from "@/components/maps/routemap/UserPostLocations";
import { useUserTabs } from "@/hooks/useUserTabs";
import UserTabs from "@/components/profile/UserTabs";

export const Route = createFileRoute("/_protected/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, handleVerifyEmail, handleLogout, isPending, isError, error } = useProfilePage();
  const { activeTab, setActiveTab, mapRef } = useUserTabs();

  if (!user) return <UserLoadingState />;

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
        <CurrentUserProfileCard
          user={user}
          handleLogout={handleLogout}
          handleVerifyEmail={handleVerifyEmail}
          isError={isError}
          error={error}
          isPending={isPending}
        />
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
