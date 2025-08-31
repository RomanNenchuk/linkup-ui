import { apiClient } from "./clients";

export const refreshToken = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.post("/auth/refresh-token");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response.data,
    };
  }
};

export const resendVerification = async (): Promise<void> => {
  return await apiClient.post("/auth/resend-verification");
};

export const confirmEmail = async (verificationToken: string): Promise<void> => {
  return await apiClient.post("/auth/confirm-email", { verificationToken });
};

export const resetPassword = async ({
  verificationToken,
  newPassword,
}: {
  verificationToken: string;
  newPassword: string;
}): Promise<void> => {
  return await apiClient.post("/auth/reset-password", { verificationToken, newPassword });
};

export const verificationCooldown = async (): Promise<ApiResponse<number>> => {
  try {
    const response = await apiClient.get("/auth/verification-cooldown");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response.data,
    };
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export async function register(data: RegisterPayload): Promise<string> {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
}

export async function login(data: LoginPayload): Promise<string> {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
}
