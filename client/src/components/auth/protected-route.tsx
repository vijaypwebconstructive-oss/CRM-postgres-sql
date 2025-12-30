import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }

  // If not authenticated, show fallback (login page) or redirect to login
  // if (!isAuthenticated) {
  //   if (fallback) {
  //     return <>{fallback}</>;
  //   }

  //   // Redirect to login if no fallback provided
  //   window.location.href = '/api/login';
  //   return null;
  // }

  // User is authenticated, render children
  return <>{children}</>;
}
