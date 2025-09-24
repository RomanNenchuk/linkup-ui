import type { PagedResult } from "@/hooks/usePostList";
import { apiClient } from "./clients";
import axios from "axios";

export async function createPost(data: FormData): Promise<string> {
  const response = await apiClient.post("/posts", data);
  return response.data;
}

export const fetchPosts = async ({ filter, cursor, pageSize }: FetchPostsProps): Promise<PagedResult<Post>> => {
  const response = await apiClient.get("/posts", {
    params: {
      filter: filter,
      cursor: cursor,
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
      headers: {
        "User-Agent": "MyApp/1.0 (myemail@example.com)",
      },
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
