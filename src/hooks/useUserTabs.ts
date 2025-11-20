import { useEffect, useRef, useState } from "react";

export type UserTabsType = "posts" | "map";

export function useUserTabs() {
  const [activeTab, setActiveTab] = useState<UserTabsType>("posts");
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab === "map" && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab]);

  return { activeTab, setActiveTab, mapRef };
}
