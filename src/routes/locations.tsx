import Header from "@/components/auth/Header";
import Map from "@/components/posts/location/Map";
import RadiusPickerButton from "@/components/posts/location/RadiusPickerButton";
import FilteringTabs from "@/components/posts/post-list/FilteringTabs";
import PostCard from "@/components/posts/post-list/PostCard";
import PostsError from "@/components/posts/post-list/PostsError";
import PostsLoading from "@/components/posts/post-list/PostsLoading";
import PostsNotFound from "@/components/posts/post-list/PostsNotFound";
import SelectLocationPrompt from "@/components/posts/post-list/SelectLocationPrompt";
import { DEFAULT_ZOOM, SMALL_ZOOM } from "@/constants/posts";
import { usePostList } from "@/hooks/usePostList";
import { usePostLocation } from "@/hooks/usePostLocation";
import { usePostListToggleLike } from "@/hooks/usePostListToggleLike";
import { Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

export const Route = createFileRoute("/locations")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sort: (search.sort as PostSortType) ?? "recent",
      latitude: search.latitude ? Number(search.latitude) : undefined,
      longitude: search.longitude ? Number(search.longitude) : undefined,
      radius: search.radius ? Number(search.radius) : undefined,
    };
  },
  component: LocationsPage,
});

function LocationsPage() {
  const { sort, latitude, longitude, radius, radiusValue, setFilter, handleSelectLocation, handleChangeRadius } =
    usePostLocation();

  const mapCenter: [number, number] | undefined = latitude && longitude ? [latitude, longitude] : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePostList({
    sort,
    latitude,
    longitude,
    radius,
    enabled: !!mapCenter,
  });
  const { handleLike } = usePostListToggleLike({ sort, latitude, longitude, radius });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  if (isError) return <PostsError />;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header currentPage="Locations" />

      <Box sx={{ position: "relative" }}>
        <Map
          mapCenter={mapCenter}
          handleSelect={handleSelectLocation}
          zoom={mapCenter ? DEFAULT_ZOOM : SMALL_ZOOM}
          boxStyles={{ height: 300 }}
        />
        <RadiusPickerButton radius={radiusValue} handleChangeRadius={handleChangeRadius} />
      </Box>

      <FilteringTabs
        sort={sort}
        setFilter={(newValue) =>
          setFilter(newValue, latitude && longitude ? { latitude, longitude } : undefined, radius)
        }
      />

      <Box sx={{ pt: 4, px: { xs: 2, sm: 4 }, pb: 4 }}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          {!latitude || !longitude ? (
            <SelectLocationPrompt />
          ) : isLoading ? (
            <PostsLoading />
          ) : isError ? (
            <PostsError />
          ) : posts.length === 0 ? (
            <PostsNotFound />
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} handleLike={handleLike} />)
          )}

          {/* Sentinel for IntersectionObserver */}
          {hasNextPage && <div ref={loadMoreRef} style={{ height: 1 }} />}

          {isFetchingNextPage && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
              Loading more posts...
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
