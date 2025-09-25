import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { InventoryItem } from "@shared/schema";

interface InventoryTableProps {
  inventory: InventoryItem[];
}

export default function InventoryTable({ inventory }: InventoryTableProps) {
  const getStockStatus = (currentStock: number) => {
    if (currentStock < 20) return { status: "critical", color: "bg-red-100 text-red-800", icon: TrendingDown };
    if (currentStock < 50) return { status: "low", color: "bg-amber-100 text-amber-800", icon: Minus };
    return { status: "good", color: "bg-green-100 text-green-800", icon: TrendingUp };
  };

  if (inventory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="no-inventory">
        No inventory data available. Add products and production records to see inventory levels.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full data-table" data-testid="inventory-table">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Product</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Current Stock</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Total Produced</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Total Sold</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Adjustments</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Material</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const stockInfo = getStockStatus(item.currentStock);
            const StockIcon = stockInfo.icon;
            
            return (
              <tr key={item.id} className="border-b border-border hover:bg-muted" data-testid={`inventory-row-${item.id}`}>
                <td className="py-3 text-sm font-medium" data-testid={`inventory-product-${item.id}`}>
                  {item.name}
                </td>
                <td className="py-3 text-sm font-bold" data-testid={`inventory-current-stock-${item.id}`}>
                  {item.currentStock.toLocaleString()} pieces
                </td>
                <td className="py-3 text-sm" data-testid={`inventory-produced-${item.id}`}>
                  {item.totalProduced.toLocaleString()}
                </td>
                <td className="py-3 text-sm" data-testid={`inventory-sold-${item.id}`}>
                  {item.totalSold.toLocaleString()}
                </td>
                <td className="py-3 text-sm" data-testid={`inventory-adjustments-${item.id}`}>
                  <span className={item.adjustments > 0 ? "text-green-600" : item.adjustments < 0 ? "text-red-600" : ""}>
                    {item.adjustments > 0 ? "+" : ""}{item.adjustments}
                  </span>
                </td>
                <td className="py-3 text-sm" data-testid={`inventory-status-${item.id}`}>
                  <div className="flex items-center space-x-2">
                    <Badge className={stockInfo.color}>
                      <StockIcon className="w-3 h-3 mr-1" />
                      {stockInfo.status}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 text-sm" data-testid={`inventory-material-${item.id}`}>
                  <Badge variant="outline">{item.rawMaterialType}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
