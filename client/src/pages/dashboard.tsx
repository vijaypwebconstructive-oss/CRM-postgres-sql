import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KPICards from "@/components/kpi-cards";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    queryFn: api.getDashboardMetrics,
  });

  const { data: recentProduction } = useQuery({
    queryKey: ["/api/production"],
    queryFn: api.getProduction,
  });

  const { data: inventory } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: api.getInventory,
  });

  const { data: salesOrders } = useQuery({
    queryKey: ["/api/sales"],
    queryFn: api.getSalesOrders,
  });

  const lowStockItems = inventory?.filter((item: any) => item.currentStock < 50) || [];
  const pendingOrders = salesOrders?.filter((order: any) => order.status === "pending") || [];
  const recentProductionRecords = recentProduction?.slice(0, 3) || [];

  if (!metrics) {
    return <div data-testid="loading-dashboard">Loading dashboard...</div>;
  }

  return (
    <div data-testid="dashboard-page">
      <KPICards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Production Records */}
        <Card className="lg:col-span-2" data-testid="recent-production-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Production Records</CardTitle>
              <Button data-testid="button-add-production">Add Record</Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full data-table" data-testid="table-recent-production">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Quantity (KG)</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Pieces</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProductionRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground" data-testid="no-production-records">
                        No production records found. Start by adding your first production record.
                      </td>
                    </tr>
                  ) : (
                    recentProductionRecords.map((record: any) => (
                      <tr key={record.id} data-testid={`production-row-${record.id}`}>
                        <td className="py-3 text-sm" data-testid={`production-date-${record.id}`}>
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </td>
                        <td className="py-3 text-sm font-medium" data-testid={`production-product-${record.id}`}>
                          {record.product.name}
                        </td>
                        <td className="py-3 text-sm" data-testid={`production-quantity-${record.id}`}>
                          {record.quantityKg}
                        </td>
                        <td className="py-3 text-sm" data-testid={`production-pieces-${record.id}`}>
                          {record.pieces}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card data-testid="inventory-alerts-card">
          <CardHeader className="border-b border-border">
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {lowStockItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-4" data-testid="no-inventory-alerts">
                All products have sufficient stock levels.
              </div>
            ) : (
              lowStockItems.map((item: any) => {
                const severity = item.currentStock < 20 ? "critical" : item.currentStock < 50 ? "low" : "medium";
                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      severity === "critical" 
                        ? "bg-red-50 border-red-200" 
                        : severity === "low"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                    data-testid={`inventory-alert-${item.id}`}
                  >
                    <div>
                      <p className="font-medium text-sm" data-testid={`alert-product-${item.id}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`alert-stock-${item.id}`}>
                        {item.currentStock} pieces remaining
                      </p>
                    </div>
                    <Badge 
                      variant={severity === "critical" ? "destructive" : "secondary"}
                      data-testid={`alert-severity-${item.id}`}
                    >
                      {severity === "critical" ? "Critical" : severity === "low" ? "Low" : "Medium"}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Sales Orders */}
        <Card data-testid="pending-orders-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle>Pending Sales Orders</CardTitle>
              <Button data-testid="button-new-order">New Order</Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="text-center text-muted-foreground py-4" data-testid="no-pending-orders">
                  No pending orders. All orders are up to date.
                </div>
              ) : (
                pendingOrders.slice(0, 3).map((order: any) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                    data-testid={`pending-order-${order.id}`}
                  >
                    <div>
                      <p className="font-medium" data-testid={`order-number-${order.id}`}>
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`order-party-${order.id}`}>
                        {order.party.name}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`order-date-${order.id}`}>
                        {format(new Date(order.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" data-testid={`order-status-${order.id}`}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1" data-testid={`order-items-${order.id}`}>
                        {order.itemCount} items
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Production Planning */}
        <Card data-testid="production-planning-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle>Production Planning</CardTitle>
              <Button data-testid="button-plan-production">Plan Production</Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg" data-testid="material-requirements">
                <h4 className="font-medium mb-2">Material Requirements</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Access the Planning module to calculate material requirements for production runs.</p>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg" data-testid="todays-plan">
                <h4 className="font-medium mb-2">Today's Plan</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Set up production plans to track daily manufacturing goals.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
