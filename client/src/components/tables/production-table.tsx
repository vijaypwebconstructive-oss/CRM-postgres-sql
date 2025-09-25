import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { ProductionWithProduct } from "@shared/schema";

interface ProductionTableProps {
  production: ProductionWithProduct[];
}

export default function ProductionTable({ production }: ProductionTableProps) {
  if (production.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="no-production-records">
        No production records found. Add your first production record to track manufacturing output.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full data-table" data-testid="production-table">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Product</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Quantity (KG)</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Pieces</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Material Type</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {production.map((record) => (
            <tr key={record.id} className="border-b border-border hover:bg-muted" data-testid={`production-row-${record.id}`}>
              <td className="py-3 text-sm" data-testid={`production-date-${record.id}`}>
                {format(new Date(record.date), "MMM dd, yyyy")}
              </td>
              <td className="py-3 text-sm font-medium" data-testid={`production-product-${record.id}`}>
                {record.product.name}
              </td>
              <td className="py-3 text-sm" data-testid={`production-quantity-${record.id}`}>
                {parseFloat(record.quantityKg).toFixed(3)} kg
              </td>
              <td className="py-3 text-sm font-bold" data-testid={`production-pieces-${record.id}`}>
                {record.pieces.toLocaleString()}
              </td>
              <td className="py-3 text-sm" data-testid={`production-material-${record.id}`}>
                <Badge variant="outline">{record.product.rawMaterialType}</Badge>
              </td>
              <td className="py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid={`button-edit-production-${record.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-delete-production-${record.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
