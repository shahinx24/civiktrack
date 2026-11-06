import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.civictrack.local/v1";

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request Interceptor: Attach Auth Token when available
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("civictrack_token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Standardize API responses & errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        // Can route 401 unauthenticated, 403 forbidden, etc.
        return Promise.reject(error);
      }
    );
  }

  public getRawClient(): AxiosInstance {
    return this.client;
  }

  // Simulated latency for realistic UX when testing pure frontend
  public static async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();

