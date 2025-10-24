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
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat: latitude,
        lon: longitude,
        format: "json",
        addressdetails: 1,
        "accept-language": "en",
        zoom: 10,
      },
    });

    const addr = response.data.address;

    if (!addr) return response.data.display_name || "";

    const { city, town, village, suburb, state, country } = addr;

    if (city) return city;
    if (town) return town;
    if (village) return village;
    if (suburb && state) return `${suburb}, ${state}`;
    if (state && country) return `${state}, ${country}`;
    return country || response.data.display_name || "";
  } catch (err) {
    console.error("Reverse geocoding failed", err);
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
