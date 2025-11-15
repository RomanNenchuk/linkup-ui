import PostsLoading from "./PostsLoading";
import PostsError from "./PostsError";
import PostsNotFound from "./PostsNotFound";
import PostCard from "./PostCard";
import { getBorderRadius } from "@/utils/post-card/getBorderRadius";
import { useMediaQuery, useTheme } from "@mui/material";

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
  isError: boolean;
  handleLike: (postId: string, isLikedByCurrentUser: boolean) => void;
}

export default function PostsList({ posts, isLoading, isError, handleLike }: PostsListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) return <PostsLoading />;
  if (isError) return <PostsError />;
  if (posts.length === 0) return <PostsNotFound />;

  return (
    <>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          handleLike={handleLike}
          sx={{
            border: 1,
            borderBottom: index === posts.length - 1 ? 1 : 0,
            borderColor: "divider",
            borderRadius: getBorderRadius(index, posts.length, isMobile),
          }}
        />
      ))}
    </>
  );
}
