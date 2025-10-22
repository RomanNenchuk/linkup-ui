import UserAvatar from "@/components/auth/UserAvatar";
import { Box, CircularProgress, Typography, Card, CardContent, TextField, Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import PostCard from "@/components/posts/post-list/PostCard";
import Header from "@/components/auth/Header";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { usePostToggleLike } from "@/hooks/usePostToggleLike";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById } from "@/api/posts";
import { createPostComment, getPostComments } from "@/api/postComments";

export const Route = createFileRoute("/posts/$postId")({ component: RouteComponent });

function RouteComponent() {
  const { postId } = useParams({ from: "/posts/$postId" });
  const { handleLike } = usePostToggleLike();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => (typeof postId === "string" ? getPostById({ postId }) : undefined),
    enabled: !!postId,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => (typeof postId === "string" ? getPostComments({ postId }) : undefined),
    enabled: !!postId,
  });

  const { mutate: handleCreatePostComment, isPending } = useMutation({
    mutationFn: createPostComment,
    onMutate: async ({ postId, content, repliedTo }) => {
      // stops any current refetches ["posts", postId, "comments"] to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["posts", postId, "comments"] });

      const prevData = queryClient.getQueryData<PostCommentType[]>(["posts", postId, "comments"]);

      // створюємо тимчасовий коментар
      const tempId = `temp-${Date.now()}`;
      const optimisticComment: PostCommentType = {
        id: tempId,
        postId,
        content,
        repliedTo: repliedTo,
        createdAt: new Date(),
        author: {
          id: user!.id,
          displayName: user!.displayName,
        },
      };

      queryClient.setQueryData<PostCommentType[]>(["posts", postId, "comments"], (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { prevData, tempId };
    },

    onError: (_err, vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["posts", vars.postId, "comments"], context.prevData);
      }
    },

    onSuccess: (id, vars, context) => {
      // id — рядок, тому створюємо новий об'єкт на основі тимчасового коменту
      queryClient.setQueryData<PostCommentType[]>(["posts", vars.postId, "comments"], (old = []) =>
        old.map((comment) => (comment.id === context?.tempId ? { ...comment, id } : comment))
      );
    },

    onSettled: (_data, _error, _vars) => {
      // optional
      // queryClient.invalidateQueries({ queryKey: ["posts", vars.postId, "comments"] });
    },
  });

  const createPostCommentClick = () => {
    if (!newComment.trim() || typeof postId !== "string") return;
    handleCreatePostComment({ postId, content: newComment });
    setNewComment("");
  };

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
          <Box
            sx={{
              flex: 1,
              maxWidth: { md: "50%" },
              display: "flex",
              justifyContent: "center",
              px: { xs: 2, sm: 4 },
              py: 3,
              borderRight: { md: "1px solid", xs: "none" },
              borderColor: "divider",
              position: { md: "sticky" },
              top: { md: 65 },
              alignSelf: "flex-start",
              height: { md: "calc(100vh - 65px)" },
              overflowY: { md: "auto" },
              zIndex: 1,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              <PostCard post={post} handleLike={handleLike} />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              maxWidth: { md: "50%" },
              overflowY: "auto",
              px: { xs: 2, sm: 4 },
              height: "calc(100vh - 65px)",
            }}
          >
            {user && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "background.default",
                  zIndex: 2,
                  py: 3,
                }}
              >
                <UserAvatar id={user.id} size={36} displayName={user.displayName} />
                <TextField
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  size="small"
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={3}
                />
                <Button
                  variant="contained"
                  disabled={!newComment.trim() || isPending}
                  sx={{ textTransform: "none" }}
                  onClick={createPostCommentClick}
                >
                  Send
                </Button>
              </Box>
            )}

            {commentsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : !comments?.length ? (
              <Typography variant="body2" color="text.secondary">
                Be first to comment the post!
              </Typography>
            ) : (
              comments.map((comment) => (
                <Card
                  key={comment.id}
                  variant="outlined"
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    boxShadow: "none",
                    backgroundColor: "background.paper",
                  }}
                >
                  <CardContent sx={{ display: "flex", gap: 1.5, p: 1.5 }}>
                    <UserAvatar id={comment.author.id} size={36} displayName={comment.author.displayName} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {comment.author.displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        {comment.content}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
