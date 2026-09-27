export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

// Full backend API URL in production (e.g. https://host/campus-coin-backend/api);
// falls back to "/api", which the Vite dev server proxies.
export const API_BASE_URL = (
  import.meta.env["VITE_API_URL"] || "/api"
).replace(/\/+$/, "");

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// The backend returns file URLs like "/api/uploads/...". Point them at the real API host.
export function resolveApiAssetUrl(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("/api/") ? apiUrl(url.slice(4)) : url;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Something went wrong. Please try again.",
    );
  }

  return result;
}