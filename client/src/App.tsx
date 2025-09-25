import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/main-layout";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Parties from "@/pages/parties";
import Production from "@/pages/production";
import Sales from "@/pages/sales";
import Inventory from "@/pages/inventory";
import Planning from "@/pages/planning";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/products" component={Products} />
        <Route path="/parties" component={Parties} />
        <Route path="/production" component={Production} />
        <Route path="/sales" component={Sales} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/planning" component={Planning} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
