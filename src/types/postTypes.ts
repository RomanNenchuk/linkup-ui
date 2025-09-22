type PostPhoto = {
  id: string;
  url: string;
  publicId: string;
};

type Post = {
  id: string;
  title: string;
  content: string | null;
  latitude: string | null;
  longtitude: string | null;
  address: string | null;
  photos: PostPhoto[];
  createdAt: Date;
  author: {
    id: string;
    displayName: string;
  };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
};

type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

type PostLocation = LocationCoordinates & {
  address?: string;
};
