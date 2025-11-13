import { Box, Typography, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { createFileRoute } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import { useMemo } from "react";
import Header from "@/components/auth/Header";
import { usePostList } from "@/hooks/usePostList";
import PostsLoading from "@/components/posts/post-list/PostsLoading";
import PostsError from "@/components/posts/post-list/PostsError";
import PostsNotFound from "@/components/posts/post-list/PostsNotFound";
import PostCard from "@/components/posts/post-list/PostCard";
import { usePostListToggleLike } from "@/hooks/usePostListToggleLike";
import FilteringTabs from "@/components/posts/post-list/FilteringTabs";

export const Route = createFileRoute("/")({
  component: PostsListPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sort: (search.sort as PostSortType) ?? "recent",
    };
  },
});

export default function PostsListPage() {
  const navigate = Route.useNavigate();
  const { sort } = Route.useSearch();

  const setFilter = (newFilter: PostSortType) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sort: newFilter,
      }),
      replace: true,
    });
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePostList({ sort });
  const { handleLike } = usePostListToggleLike({ sort });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header currentPage="Home" />

      <FilteringTabs sort={sort} setFilter={setFilter} />

      <Box sx={{ width: "100%", maxWidth: 650, pb: 4, pt: 4, mx: "auto" }}>
        {isLoading ? (
          <PostsLoading />
        ) : isError ? (
          <PostsError />
        ) : posts.length === 0 ? (
          <PostsNotFound />
        ) : (
          posts.map((post, index) => (
            <PostCard
              key={post.id}
              sx={{
                border: 1,
                borderBottom: 0,
                borderColor: "divider",
                borderRadius: index === 0 ? "16px 16px 0 0" : 0,
              }}
              post={post}
              handleLike={handleLike}
            />
          ))
        )}

        {/* Sentinel for IntersectionObserver */}
        {hasNextPage && <div ref={loadMoreRef} style={{ height: 1 }} />}

        {isFetchingNextPage && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
            Loading more posts...
          </Typography>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="create post"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          height: 50,
          width: 50,
        }}
        onClick={() => navigate({ to: "/create-post" })}
      >
        <Add />
      </Fab>
    </Box>
  );
}
