import { apiClient } from "./clients";

export async function createPost(data: FormData): Promise<string> {
  const response = await apiClient.post("/posts", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
