import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Lock, Shield, Users } from "lucide-react";

export function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Fitwell ERP
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manufacturing management made simple
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your manufacturing dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features List */}
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Multiple login options</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-purple-600" />
                <span>Protected data access</span>
              </div>
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full" 
              size="lg"
              data-testid="button-login"
            >
              Sign In with Replit
            </Button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By signing in, you'll have access to all ERP features including 
              product management, production tracking, sales orders, and reporting.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Replit Auth</p>
        </div>
      </div>
    </div>
  );
}