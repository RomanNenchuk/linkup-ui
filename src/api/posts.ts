import type { PagedResult } from "@/hooks/usePostList";
import { apiClient } from "./clients";

export async function createPost(data: FormData): Promise<string> {
  const response = await apiClient.post("/posts", data);
  return response.data;
}

export async function fetchPosts(options?: {
  ascending: boolean | null;
  cursor: string | null;
  pageSize: number | null;
}): Promise<PagedResult<Post>> {
  const response = await apiClient.get("/posts", {
    params: {
      ascending: options?.ascending ?? false,
      cursor: options?.cursor,
      pageSize: options?.pageSize ?? 10,
    },
  });
  return response.data;
}
