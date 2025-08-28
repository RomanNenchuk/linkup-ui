import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

import type { InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/api/clients";
import { getCurrentUser, refreshToken, registerUser } from "@/api/auth";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useMutation,
  useQuery,
  type UseMutationResult,
} from "@tanstack/react-query";

type AuthContextType = {
  user: User | undefined;
  registerMutation: UseMutationResult<string, Error, RegisterPayload, unknown>;
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      const { success, data: accessToken } = await refreshToken();
      if (success && accessToken) {
        setToken(accessToken);
      }
      setCheckedAuth(true);
    };

    refresh();
  }, []);

  const { data: user } = useQuery({
    queryKey: ["me", token],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      setToken(data);
    },
  });

  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use(
      (config: CustomAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (!config._retry && token)
          config.headers.Authorization = `Bearer ${token}`;

        return config;
      }
    );
    return () => apiClient.interceptors.request.eject(authInterceptor);
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          const { success, data: accessToken } = await refreshToken();
          if (success && accessToken) {
            setToken(accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest._retry = true;
            return apiClient(originalRequest);
          } else {
            setToken(null);
          }
        }

        return Promise.reject(error);
      }
    );
    return () => apiClient.interceptors.response.eject(refreshInterceptor);
  }, []);

  if (!checkedAuth) {
    return <CircularProgress />;
  }

  return (
    <AuthContext.Provider value={{ user, registerMutation }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
