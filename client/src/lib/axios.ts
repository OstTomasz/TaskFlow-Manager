import axios, { type AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/store/authStore";

const SKIP_REFRESH_URLS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/password",
  "/auth/user",
];

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5001/api",
  withCredentials: true, // sends httpOnly refresh token cookie automatically
});

/**
 * Request interceptor — attaches access token to every request.
 * Reads from Zustand store (in-memory, not localStorage).
 */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Response interceptor — handles expired access tokens silently.
 *
 * Flow:
 * 1. Request fails with 401
 * 2. Call /auth/refresh (refresh token sent via cookie automatically)
 * 3. Store new access token
 * 4. Retry original request with new token
 * 5. If refresh fails → logout (session truly expired)
 */
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

/**
 * Processes queued requests after token refresh.
 * Multiple simultaneous 401s → only one /refresh call, rest wait in queue.
 */
const processQueue = (token: string) => {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    const shouldSkip = SKIP_REFRESH_URLS.some((url) =>
      original.url?.includes(url),
    );
    if (shouldSkip) {
      return Promise.reject(error);
    }

    // Avoid infinite loop if /refresh itself returns 401
    if (original.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      /**
       * Another request already triggered refresh.
       * Queue this request — resolve it when new token arrives.
       */
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh");
      const newToken: string = data.data.accessToken;

      useAuthStore.getState().setAccessToken(newToken);
      processQueue(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
