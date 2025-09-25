import { Bell, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import AppSidebar from "./app-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <main className="flex-1 overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4" data-testid="header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" data-testid="page-title">Manufacturing Dashboard</h2>
              <p className="text-muted-foreground" data-testid="page-description">
                Real-time overview of your production operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>
              
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium" data-testid="user-name-display">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.email
                      }
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => logout()}
                    disabled={isLoggingOut}
                    data-testid="button-logout"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 overflow-y-auto h-full" data-testid="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
