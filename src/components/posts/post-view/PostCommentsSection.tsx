import { Box, CircularProgress, Typography } from "@mui/material";
import CommentInput from "./CommentInput";
import { useAuth } from "@/contexts/AuthProvider";
import usePostComments from "@/hooks/usePostComments";
import { useParams } from "@tanstack/react-router";
import { useCommentListToggleLike } from "@/hooks/useCommentListToggleLike";
import PostCommentCard from "./PostCommentCard";

export default function PostCommentsSection() {
  const { user } = useAuth();
  const { postId } = useParams({ from: "/posts/$postId" });
  const { newComment, setNewComment, comments, commentsLoading, commentCreationPending, handleCreatePostComment } =
    usePostComments(postId);

  const { handleToggleCommentLike } = useCommentListToggleLike();

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
          <PostCommentCard comment={comment} handleToggleCommentLike={handleToggleCommentLike} />
        ))
      )}
    </Box>
  );
}
