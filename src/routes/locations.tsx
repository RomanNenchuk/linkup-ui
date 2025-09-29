import Header from "@/components/auth/Header";
import PostCard from "@/components/posts/post-list/PostCard";
import PostsError from "@/components/posts/post-list/PostsError";
import PostsLoading from "@/components/posts/post-list/PostsLoading";
import PostsNotFound from "@/components/posts/post-list/PostsNotFound";
import { usePostList } from "@/hooks/usePostList";
import { useToggleLike } from "@/hooks/useToggleLike";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

export const Route = createFileRoute("/locations")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      filter: (search.filter as PostFilterType) ?? "recent",
      latitude: search.latitude as number,
      longitude: search.longitude as number,
    };
  },
  component: LocationsPage,
});

function LocationsPage() {
  const navigate = Route.useNavigate();
  const { filter, latitude, longitude } = Route.useSearch();

  const setFilter = (newFilter: PostFilterType) => {
    navigate({
      search: (prev) => ({
        ...prev,
        filter: newFilter,
      }),
      replace: true,
    });
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePostList(
    filter,
    latitude,
    longitude
  );
  const { handleLike } = useToggleLike({ filter, pageSize: 10 });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  if (isLoading) return <PostsLoading />;
  if (isError) return <PostsError />;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />

      <Tabs sx={{ mt: 2 }} value={filter} onChange={(_, newValue) => setFilter(newValue)} centered>
        <Tab label="Recent" value="recent" />
        <Tab label="Top" value="top" />
        <Tab label="Following" value="following" />
      </Tabs>

      <Box sx={{ pt: 4, px: { xs: 2, sm: 4 }, pb: 4 }}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          {posts.length === 0 ? (
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
