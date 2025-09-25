import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CSRFTokenResponse {
  csrfToken: string;
}

// Hook to get current user
export function useUser() {
  return useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
  });
}

// Hook to get CSRF token
export function useCSRFToken() {
  return useQuery<CSRFTokenResponse>({
    queryKey: ['/api/csrf-token'],
    retry: false,
  });
}

// Hook for authentication state
export function useAuth() {
  const queryClient = useQueryClient();
  const userQuery = useUser();
  const csrfQuery = useCSRFToken();

  const logout = useMutation({
    mutationFn: async () => {
      // Clear all cached data on logout
      queryClient.clear();
      // Redirect to logout endpoint
      window.location.href = '/api/logout';
    },
  });

  const isAuthenticated = !!userQuery.data && !userQuery.isError;
  const isLoading = userQuery.isLoading;
  const user = userQuery.data;
  const csrfToken = csrfQuery.data?.csrfToken;

  return {
    user,
    isAuthenticated,
    isLoading,
    csrfToken,
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
  };
}