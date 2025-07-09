import { supabase } from "../supabase/client";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  // Get the current session's access token if authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token || null;

  // Use a relative path for the API base URL to work with the Vite proxy
  const apiBaseUrl = "/api";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  // Add Authorization header with Supabase JWT token if available
  if (token) {
    // Use proper type assertion for the headers object to avoid TypeScript errors
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`);
  }

  return response.json();
}
