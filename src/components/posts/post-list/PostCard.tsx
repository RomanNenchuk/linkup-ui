import UserAvatar from "@/components/auth/UserAvatar";
import { Favorite, Comment, FavoriteBorder, Share } from "@mui/icons-material";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import PostPhotos from "./PostPhotos";
import { memo } from "react";

const PostCard = memo(function PostCard({ post }: { post: Post }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <UserAvatar
            id={post.author.id ?? "unknown"}
            size={40}
            displayName={post.author?.displayName ?? "Unknown User"}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {post.author?.displayName || "Unknown User"}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </Typography>
            </Typography>

            {post.address && (
              <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {post.address}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          {post.title}
        </Typography>

        {post.content && (
          <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.5 }}>
            {post.content}
          </Typography>
        )}

        <PostPhotos photos={post.photos} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}>
          <IconButton onClick={() => {}} color={true || post.isLiked ? "error" : "default"} size="small">
            {true || post.isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {(post.likesCount || 0) + (true ? 1 : 0)}
          </Typography>

          <IconButton color="default" size="small">
            <Comment fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {post.commentsCount || 0}
          </Typography>

          <IconButton color="default" size="small">
            <Share fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
});

export default PostCard;
