import UserAvatar from "@/components/auth/UserAvatar";
import { useAuth } from "@/contexts/AuthProvider";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { Link, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

type PostCommentCardProps = {
  comment: PostCommentType;
  handleToggleCommentLike: (postId: string, commentId: string, isLiked: boolean) => void;
};

export default function PostCommentCard({ comment, handleToggleCommentLike }: PostCommentCardProps) {
  const { user } = useAuth();
  const { postId } = useParams({ from: "/posts/$postId" });

  return (
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
  );
}
