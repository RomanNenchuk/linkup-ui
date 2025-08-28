import { apiClient } from "./clients";

export const refreshToken = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.post("/auth/refresh-token", undefined, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export async function registerUser(data: RegisterPayload): Promise<string> {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
}
