export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`/api${path}`, {
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