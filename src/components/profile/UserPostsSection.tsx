import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { usePostList } from "@/hooks/usePostList";
import { usePostListToggleLike } from "@/hooks/usePostListToggleLike";
import PostsLoading from "@/components/posts/post-list/PostsLoading";
import PostsError from "@/components/posts/post-list/PostsError";
import PostCard from "@/components/posts/post-list/PostCard";

export default function UserPostsSection({ userId }: { userId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePostList({
    sort: "recent",
    authorId: userId,
    enabled: !!userId,
  });

  const { handleLike } = usePostListToggleLike({
    sort: "recent",
    authorId: userId,
  });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  return (
    <Box sx={{ px: { sm: 4 }, width: "100%" }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {isLoading ? (
          <PostsLoading />
        ) : isError ? (
          <PostsError />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} handleLike={handleLike} />)
        )}

        {hasNextPage && <div ref={loadMoreRef} style={{ height: 1 }} />}
        {isFetchingNextPage && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
            Loading more posts...
          </Typography>
        )}
      </Box>
    </Box>
  );
}
