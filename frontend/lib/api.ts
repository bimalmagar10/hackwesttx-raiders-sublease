import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
  useAuth?: boolean;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { useAuth = false, headers = {}, ...restOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let finalHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
  };

  if (useAuth) {
    const session = await getSession();

    if (!session?.user?.access_token) {
      throw new Error("No authentication token available");
    }

    finalHeaders.Authorization = `Bearer ${session.user.access_token}`;
  }

  const config: RequestInit = {
    ...restOptions,
    headers: finalHeaders,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
