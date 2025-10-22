type PostPhoto = {
  id: string;
  url: string;
  publicId: string;
};

type AuthorType = {
  id: string;
  displayName: string;
};

type Post = {
  id: string;
  title: string;
  content: string | null;
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  photos: PostPhoto[];
  createdAt: Date;
  author: AuthorType;
  reactionCount?: number;
  commentCount?: number;
  isLikedByCurrentUser?: boolean;
};

type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

type PostLocation = LocationCoordinates & {
  address: string | null;
};

type PostFilterType = "top" | "recent" | "following";

type FetchPostsProps = {
  filter: PostFilterType;
  cursor: string | null;
  latitude?: number;
  longitude?: number;
  radius?: number;
  pageSize: number | null;
};

type BoundsType = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

type HeatmapParams = BoundsType & {
  zoom: number;
};

type ClusterType = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  count: number;
};

type PostCommentType = {
  id: string;
  content: string;
  postId: string;
  author: AuthorType;
  repliedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
};

type CreatePostCommentType = {
  postId: string;
  content: string;
  repliedTo?: string;
};
