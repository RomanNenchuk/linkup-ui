import type { PagedResult } from "@/hooks/usePostList";
import { apiClient } from "./clients";
import axios from "axios";

export async function createPost(data: FormData): Promise<string> {
  const response = await apiClient.post("/posts", data);
  return response.data;
}

export async function updatePost({ postId, data }: { postId: string; data: FormData }): Promise<string> {
  const response = await apiClient.patch(`/posts/${postId}`, data);
  return response.data;
}

export const fetchPosts = async ({
  filter,
  cursor,
  latitude,
  longitude,
  radius,
  pageSize,
}: FetchPostsProps): Promise<PagedResult<Post>> => {
  const response = await apiClient.get("/posts", {
    params: {
      filter,
      cursor,
      latitude,
      longitude,
      radius,
      pageSize: pageSize ?? 10,
    },
  });
  return response.data;
};

export const reverseGeocode = async ({ latitude, longitude }: LocationCoordinates): Promise<string> => {
  // Reverse geocoding з Nominatim
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat: latitude, lon: longitude, format: "json" },
    });
    return response.data.display_name || "";
  } catch (err) {
    console.error("Reverse geocoding failed", err);
    return "";
  }
};

export async function toggleLike(postId: string, isLiked: boolean): Promise<void> {
  await apiClient.post(`/posts/${postId}/toggle-reaction`, {
    isLiked,
  });
}

export const getPostById = async (postId: string): Promise<Post> => {
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
