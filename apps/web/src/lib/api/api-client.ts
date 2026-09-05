import { getConfig } from "../config";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success?: boolean;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Standard simulated network delay helper for backwards compatibility
 */
export async function simulateNetworkDelay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Standard simulated API wrapper with latency and typed responses
 */
export async function mockFetch<T>(
  data: T,
  delayMs: number = 220,
  shouldFail: boolean = false,
  errorMessage: string = "Simulated API error"
): Promise<ApiResponse<T>> {
  await simulateNetworkDelay(delayMs);

  if (shouldFail) {
    throw new ApiError(500, errorMessage);
  }

  return {
    data,
    status: 200,
    success: true,
  };
}

/**
 * Production-ready API client fetch wrapper with:
 * - Configurable base URL
 * - Request timeout via AbortController
 * - External AbortSignal chaining
 * - Automatic exponential backoff retries
 * - Typed response parsing
 * - Structured error handling
 */
export class ApiClient {
  private baseUrl: string;
  private defaultTimeoutMs: number;
  private defaultRetries: number;

  constructor(
    baseUrl?: string,
    defaultTimeoutMs?: number,
    defaultRetries?: number
  ) {
    const config = getConfig();
    this.baseUrl = baseUrl ?? config.apiUrl;
    this.defaultTimeoutMs = defaultTimeoutMs ?? config.apiTimeoutMs;
    this.defaultRetries = defaultRetries ?? config.apiRetryCount;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const fullUrl = this.baseUrl ? `${this.baseUrl}${cleanEndpoint}` : cleanEndpoint;

    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}${queryString}` : fullUrl;
  }

  public async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      timeoutMs = this.defaultTimeoutMs,
      retries = this.defaultRetries,
      retryDelayMs = 400,
      signal: externalSignal,
      headers = {},
      ...fetchInit
    } = options;

    const url = this.buildUrl(endpoint, params);

    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      // Create controller for timeout
      const controller = new AbortController();
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs);

      // Chain with external signal if provided
      const onExternalAbort = () => {
        controller.abort();
      };
      if (externalSignal) {
        if (externalSignal.aborted) {
          clearTimeout(timeoutId);
          throw new ApiError(499, "Request aborted by caller");
        }
        externalSignal.addEventListener("abort", onExternalAbort);
      }

      try {
        const response = await fetch(url, {
          ...fetchInit,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (externalSignal) {
          externalSignal.removeEventListener("abort", onExternalAbort);
        }

        let responseData: unknown;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        if (!response.ok) {
          const errorMessage =
            typeof responseData === "object" && responseData !== null && "error" in responseData
              ? String((responseData as { error: unknown }).error)
              : typeof responseData === "object" && responseData !== null && "message" in responseData
              ? String((responseData as { message: unknown }).message)
              : `HTTP error ${response.status}: ${response.statusText}`;

          throw new ApiError(response.status, errorMessage, responseData);
        }

        // If response already wraps data in { data: ... }, extract it
        const actualData =
          typeof responseData === "object" && responseData !== null && "data" in responseData
            ? (responseData as { data: T }).data
            : (responseData as T);

        return {
          data: actualData,
          status: response.status,
          success: true,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        if (externalSignal) {
          externalSignal.removeEventListener("abort", onExternalAbort);
        }

        if (timedOut) {
          lastError = new ApiError(408, `Request timed out after ${timeoutMs}ms`);
        } else if (error instanceof ApiError) {
          lastError = error;
          // Don't retry on 4xx client errors except 429
          if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
        } else if (error instanceof Error && error.name === "AbortError") {
          throw new ApiError(499, "Request aborted by caller");
        } else {
          lastError = new ApiError(
            500,
            error instanceof Error ? error.message : "Network error occurred",
            error
          );
        }

        // If we have remaining retry attempts, wait with exponential backoff
        if (attempt < retries) {
          const delay = retryDelayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  public async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
