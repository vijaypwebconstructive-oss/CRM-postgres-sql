import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to get CSRF token - fetch fresh if not available
async function getCSRFToken(): Promise<string | undefined> {
  // First try to get from cache
  let data = queryClient.getQueryData(['/api/csrf-token']) as { csrfToken: string } | undefined;
  
  // If not in cache or stale, fetch fresh
  if (!data?.csrfToken) {
    try {
      const response = await fetch('/api/csrf-token', { credentials: 'include' });
      if (response.ok) {
        data = await response.json();
        // Update the cache with fresh token
        queryClient.setQueryData(['/api/csrf-token'], data);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      return undefined;
    }
  }
  
  return data?.csrfToken;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add CSRF token for unsafe methods
  const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (unsafeMethods.includes(method.toUpperCase())) {
    const csrfToken = await getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
