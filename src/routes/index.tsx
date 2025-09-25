import { Box, Typography, Fab, Tabs, Tab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { createFileRoute } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import { useMemo } from "react";
import Header from "@/components/auth/Header";
import { usePostList } from "@/hooks/usePostList";
import PostsLoading from "@/components/posts/post-list/PostsLoading";
import PostsError from "@/components/posts/post-list/PostsError";
import PostNotFound from "@/components/posts/post-list/PostNotFound";
import PostCard from "@/components/posts/post-list/PostCard";
import { useToggleLike } from "@/hooks/useToggleLike";

export const Route = createFileRoute("/")({
  component: PostsListPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      filter: (search.filter as PostFilterType) ?? "recent",
    };
  },
});

export default function PostsListPage() {
  const navigate = Route.useNavigate();
  const { filter } = Route.useSearch();

  const setFilter = (newFilter: PostFilterType) => {
    navigate({
      search: (prev) => ({
        ...prev,
        filter: newFilter,
      }),
      replace: true,
    });
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePostList(filter);
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
            <PostNotFound />
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

      <Fab
        color="primary"
        aria-label="create post"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        onClick={() => navigate({ to: "/create-post" })}
      >
        <Add />
      </Fab>
    </Box>
  );
}
