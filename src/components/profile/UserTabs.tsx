import type { UserTabsType } from "@/hooks/useUserTabs";
import { Box, Tab, Tabs } from "@mui/material";

type UserTabsProps = {
  activeTab: UserTabsType;
  setActiveTab: React.Dispatch<React.SetStateAction<UserTabsType>>;
};

export default function UserTabs({ activeTab, setActiveTab }: UserTabsProps) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: "env(safe-area-inset-top, 0px)",
        zIndex: 20,
        background: "background.paper",
      }}
    >
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
        <Tab label="Posts" value="posts" />
        <Tab label="Map" value="map" />
      </Tabs>
    </Box>
  );
}
