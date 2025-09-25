import { Card, CardContent } from "@/components/ui/card";
import { Hammer, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";

interface KPICardsProps {
  metrics: {
    todayProduction: number;
    pendingOrders: number;
    lowStockItems: number;
    monthlyRevenue: number;
  };
}

export default function KPICards({ metrics }: KPICardsProps) {
  const kpiData = [
    {
      title: "Today's Production",
      value: metrics.todayProduction.toLocaleString(),
      change: "+12% from yesterday",
      changeType: "positive",
      icon: Hammer,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      testId: "kpi-production"
    },
    {
      title: "Pending Orders",
      value: metrics.pendingOrders.toString(),
      change: "5 urgent orders",
      changeType: "warning",
      icon: ShoppingCart,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      testId: "kpi-orders"
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockItems.toString(),
      change: "Requires attention",
      changeType: "negative",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-destructive",
      testId: "kpi-stock"
    },
    {
      title: "Revenue (Month)",
      value: `₹${(metrics.monthlyRevenue / 100000).toFixed(1)}L`,
      change: "+8% vs last month",
      changeType: "positive",
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      testId: "kpi-revenue"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="kpi-cards">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.testId} data-testid={kpi.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground" data-testid={`${kpi.testId}-title`}>
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold" data-testid={`${kpi.testId}-value`}>
                    {kpi.value}
                  </p>
                  <p 
                    className={`text-sm ${
                      kpi.changeType === "positive" 
                        ? "text-green-600" 
                        : kpi.changeType === "warning"
                        ? "text-amber-600"
                        : "text-destructive"
                    }`}
                    data-testid={`${kpi.testId}-change`}
                  >
                    {kpi.changeType === "positive" ? "↗ " : kpi.changeType === "warning" ? "→ " : "→ "}
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${kpi.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
