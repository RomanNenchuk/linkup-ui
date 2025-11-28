import UserAvatar from "@/components/auth/UserAvatar";
import { Favorite, Comment, FavoriteBorder } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  type SxProps,
  type Theme,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import PostPhotos from "./PostPhotos";
import { memo } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthProvider";

type PostCardProps = {
  post: Post;
  handleLike: (postId: string, isLikedByCurrentUser: boolean) => void;
  sx?: SxProps<Theme>;
};

const PostCard = memo(function PostCard({ post, handleLike, sx }: PostCardProps) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if (window.getSelection()?.toString()) return;
    const target = e.target as HTMLElement;
    // Don't navigate if a click was on element marked as no-nav
    if (target.closest(".no-nav")) return;
    router.navigate({
      to: "/posts/$postId",
      params: { postId: post.id },
    });
  };

  return (
    <Card sx={{ cursor: "pointer", ...sx }} onClick={handleCardClick}>
      <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 1, pt: 2, pb: 0, px: isMobile ? 1.5 : 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mt: 0.3 }}>
          <Link
            className="no-nav"
            to={user?.id === post.author.id ? "/profile" : "/users/$userId"}
            params={user?.id === post.author.id ? undefined : { userId: post.author.id }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserAvatar
              id={post.author.id ?? "unknown"}
              size={36}
              displayName={post.author?.displayName ?? "Unknown User"}
            />
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}>
          <Box sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              <Link
                className="no-nav"
                to={user?.id === post.author.id ? "/profile" : "/users/$userId"}
                params={user?.id === post.author.id ? undefined : { userId: post.author.id }}
                onClick={(e) => e.stopPropagation()}
              >
                {post.author?.displayName || "Unknown User"}
              </Link>

              <Typography component="span" variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
                • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </Typography>
            </Typography>

            {post.address && post.latitude && post.longitude && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="caption"
                  color={theme.palette.text.secondary}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  noWrap
                >
                  <Link
                    className="no-nav"
                    onClick={(e) => e.stopPropagation()}
                    to="/locations"
                    search={{
                      latitude: +post.latitude,
                      longitude: +post.longitude,
                      radius: 0.1,
                      sort: "recent",
                    }}
                  >
                    {post.address}
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="body2" sx={{ color: "black" }}>
            {post.content}
          </Typography>
        </Box>
      </CardContent>

      <PostPhotos photos={post.photos} />

      <CardContent
        sx={{
          "&&": {
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            padding: "0 4px 10px 60px",
          },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}
          className="no-nav"
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleLike(post.id, !!post.isLikedByCurrentUser);
            }}
            color={post.isLikedByCurrentUser ? "error" : "default"}
            size="small"
          >
            {post.isLikedByCurrentUser ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>

          <Typography variant="caption" color={theme.palette.text.secondary}>
            {post.reactionCount || 0}
          </Typography>

          <Link onClick={(e) => e.stopPropagation()} to="/posts/$postId" params={{ postId: post.id }}>
            <IconButton color="default" size="small">
              <Comment fontSize="small" />
            </IconButton>
            <Typography variant="caption" color={theme.palette.text.secondary}>
              {post.commentCount || 0}
            </Typography>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
});

export default PostCard;
