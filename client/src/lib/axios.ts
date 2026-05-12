import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/features/auth/store/authStore";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    /** After one refresh cycle, suppress further refresh attempts (avoid loop on credential 401s). */
    _retryAfterRefresh?: boolean;
  }
}

/** Only routes where 401 should never trigger /auth/refresh (exact pathname match). */
const SKIP_REFRESH_PATHS = new Set([
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
]);

const normalizeRequestPath = (rawUrl: string): string => {
  const pathOnly = rawUrl.split("?")[0];
  if (!pathOnly) return "";
  if (/^https?:\/\//i.test(pathOnly)) {
    return new URL(pathOnly).pathname;
  }
  return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
};

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

interface QueuedRequest {
  readonly config: InternalAxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
}

let refreshQueue: QueuedRequest[] = [];

const settleQueuedRequestsSuccess = (token: string): void => {
  const queued = [...refreshQueue];
  refreshQueue = [];
  queued.forEach(({ config, resolve, reject }) => {
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers);
    config.headers = headers;
    headers.set("Authorization", `Bearer ${token}`);
    api(config).then(resolve).catch(reject);
  });
};

const settleQueuedRequestsFailure = (reason: AxiosError): void => {
  const queued = [...refreshQueue];
  refreshQueue = [];
  queued.forEach(({ reject }) => {
    reject(reason);
  });
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    const path = normalizeRequestPath(original.url ?? "");
    if (SKIP_REFRESH_PATHS.has(path)) {
      return Promise.reject(error);
    }

    /** Second 401 after a refresh+retry cycle — do not logout (e.g. wrong password). */
    if (original._retryAfterRefresh) {
      return Promise.reject(error);
    }

    original._retryAfterRefresh = true;

    const originalHeaders =
      original.headers instanceof AxiosHeaders
        ? original.headers
        : AxiosHeaders.from(original.headers);
    original.headers = originalHeaders;

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        refreshQueue.push({ config: original, resolve, reject });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh");
      const newToken: string = data.data.accessToken;

      useAuthStore.getState().setAccessToken(newToken);
      settleQueuedRequestsSuccess(newToken);

      originalHeaders.set("Authorization", `Bearer ${newToken}`);
      return api(original);
    } catch {
      useAuthStore.getState().logout();
      settleQueuedRequestsFailure(error);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
