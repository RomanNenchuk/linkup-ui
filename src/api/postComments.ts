import { apiClient } from "./clients";

export const getPostComments = async ({ postId }: { postId: string }): Promise<PostCommentType[]> => {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return response.data;
};

export const createPostComment = async ({ postId, ...data }: CreatePostCommentType): Promise<string> => {
  const response = await apiClient.post(`/posts/${postId}/comments`, data);
  return response.data;
};
