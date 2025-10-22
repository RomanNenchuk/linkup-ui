import { Box, CircularProgress, Typography } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "@/api/posts";
import { usePostToggleLike } from "@/hooks/usePostToggleLike";
import Header from "@/components/auth/Header";
import PostViewLeft from "@/components/posts/post-view/PostViewLeft";
import PostCommentsSection from "@/components/posts/post-view/PostCommentsSection";

export const Route = createFileRoute("/posts/$postId")({
  component: PostViewPage,
});

function PostViewPage() {
  const { postId } = useParams({ from: "/posts/$postId" });
  const { handleLike } = usePostToggleLike();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => (typeof postId === "string" ? getPostById({ postId }) : undefined),
    enabled: !!postId,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Header />

      {postLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : !post ? (
        <Typography align="center" sx={{ mt: 4 }}>
          Post not found
        </Typography>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: "calc(100vh - 65px)",
          }}
        >
          <PostViewLeft post={post} handleLike={handleLike} />
          <PostCommentsSection />
        </Box>
      )}
    </Box>
  );
}

export default PostViewPage;
