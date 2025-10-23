import { Box, CircularProgress, Typography, Card, CardContent, IconButton } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/auth/UserAvatar";
import CommentInput from "./CommentInput";
import { useAuth } from "@/contexts/AuthProvider";
import usePostComments from "@/hooks/usePostComments";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostCommentLike } from "@/api/posts";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

export default function PostCommentsSection() {
  const { user } = useAuth();
  const { postId } = useParams({ from: "/posts/$postId" });
  const queryClient = useQueryClient();
  const { newComment, setNewComment, comments, commentsLoading, commentCreationPending, handleCreatePostComment } =
    usePostComments(postId);

  const { mutate: togglePostCommentLikeMutation, isPending: likePending } = useMutation({
    mutationFn: ({ postId, commentId, isLiked }: { postId: string; commentId: string; isLiked: boolean }) =>
      togglePostCommentLike(postId, commentId, isLiked),
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId, "comments"] });
      const prevData = queryClient.getQueryData<PostCommentType[]>(["posts", postId, "comments"]);

      queryClient.setQueryData<PostCommentType[]>(["posts", postId, "comments"], (old = []) =>
        old.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLikedByCurrentUser: !comment.isLikedByCurrentUser,
                reactionCount: (comment.reactionCount ?? 0) + (comment.isLikedByCurrentUser ? -1 : 1),
              }
            : comment
        )
      );

      return { prevData };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["posts", postId, "comments"], context.prevData);
      }
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
    },
  });

  const handleToggleCommentLike = (postId: string, commentId: string, isLiked: boolean) => {
    if (!user || likePending) return;
    const newLikeState = !isLiked;
    togglePostCommentLikeMutation({ postId, commentId, isLiked: newLikeState });
  };

  return (
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
        <CommentInput
          user={user}
          newComment={newComment}
          setNewComment={setNewComment}
          onSend={handleCreatePostComment}
          disabled={commentCreationPending}
        />
      )}

      {commentsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : !comments?.length ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
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
              <Link
                to={user?.id === comment.author.id ? "/profile" : "/users/$userId"}
                params={user?.id === comment.author.id ? undefined : { userId: comment.author.id }}
              >
                <UserAvatar id={comment.author.id} size={32} displayName={comment.author.displayName} />
              </Link>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Link
                      to={user?.id === comment.author.id ? "/profile" : "/users/$userId"}
                      params={user?.id === comment.author.id ? undefined : { userId: comment.author.id }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography component="span" variant="subtitle2" fontWeight={600} noWrap sx={{ mr: 0.5 }}>
                        {comment.author.displayName}
                      </Typography>
                    </Link>

                    <Typography
                      component="span"
                      sx={{
                        fontSize: "14px",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={() => handleToggleCommentLike(postId, comment.id, !!comment.isLikedByCurrentUser)}
                    color={comment.isLikedByCurrentUser ? "error" : "default"}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    {comment.isLikedByCurrentUser ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.reactionCount || 0} likes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
