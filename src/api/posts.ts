import type { PagedResult } from "@/hooks/usePostList";
import { apiClient } from "./clients";

export async function createPost(data: FormData): Promise<string> {
  const response = await apiClient.post("/posts", data);
  return response.data;
}

export async function updatePost({ postId, data }: { postId: string; data: FormData }): Promise<string> {
  const response = await apiClient.patch(`/posts/${postId}`, data);
  return response.data;
}

export const fetchPosts = async ({
  sort,
  cursor,
  latitude,
  longitude,
  radius,
  pageSize,
  authorId,
}: FetchPostsProps): Promise<PagedResult<Post>> => {
  const response = await apiClient.get("/posts", {
    params: {
      sort,
      cursor,
      latitude,
      longitude,
      radius,
      pageSize: pageSize ?? 10,
      authorId,
    },
  });
  return response.data;
};

export const reverseGeocode = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<string> => {
  try {
    const response = await apiClient.get("/geo/reverse", {
      params: {
        lat: latitude,
        lon: longitude,
      },
    });
    return response.data ?? "";
  } catch (error: any) {
    return "";
  }
};

export async function togglePostLike(postId: string, isLiked: boolean): Promise<void> {
  await apiClient.post(`/posts/${postId}/toggle-reaction`, {
    isLiked,
  });
}

export async function togglePostCommentLike(postId: string, commentId: string, isLiked: boolean): Promise<void> {
  await apiClient.post(`/posts/${postId}/comments/${commentId}/toggle-reaction`, {
    isLiked,
  });
}

export const getPostById = async ({ postId }: { postId: string }): Promise<Post> => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
};

export const deletePostById = async (postId: string): Promise<void> => {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
};

export const getHeatmapPoints = async ({ minLat, maxLat, minLon, maxLon, zoom }: HeatmapParams) => {
  const response = await apiClient.get(`/posts/heatmap-points`, {
    params: {
      minLat,
      maxLat,
      minLon,
      maxLon,
      zoom,
    },
  });
  return response.data;
};

export const getPostClusters = async (): Promise<ClusterType[]> => {
  const response = await apiClient.get("/posts/clusters");
  return response.data;
};

export const getUserPostLocations = async (userId: string): Promise<TimestampedPostLocation[]> => {
  const response = await apiClient.get("/posts/post-locations", {
    params: { userId },
  });
  return response.data;
};

export const getDefaultLocation = async (): Promise<ApiResponse<LocationCoordinates>> => {
  try {
    const response = await apiClient.get("/geo/default");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data,
    };
  }
};
