type PostPhoto = {
  id: string;
  url: string;
  publicId: string;
  postId: string;
};

type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string | null;
  latitude: string | null;
  longtitude: string | null;
  address: string | null;
  postPhotos: PostPhoto[];
  createdAt: Date;
};
