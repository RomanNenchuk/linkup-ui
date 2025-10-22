import { Box, CircularProgress, Typography, Card, CardContent } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/auth/UserAvatar";
import CommentInput from "./CommentInput";
import { useAuth } from "@/contexts/AuthProvider";
import usePostComments from "@/hooks/usePostComments";
import { useParams } from "@tanstack/react-router";

export default function PostCommentsSection() {
  const { user } = useAuth();
  const { postId } = useParams({ from: "/posts/$postId" });
  const { newComment, setNewComment, comments, commentsLoading, commentCreationPending, handleCreatePostComment } =
    usePostComments(postId);
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
  );
}
