import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function ProductsTable({ products, onDelete, isDeleting }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="no-products">
        No products found. Add your first product to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full data-table" data-testid="products-table">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Product Name</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Weight (g)</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Raw Material</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Price per KG</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-border hover:bg-muted" data-testid={`product-row-${product.id}`}>
              <td className="py-3 text-sm font-medium" data-testid={`product-name-${product.id}`}>
                {product.name}
              </td>
              <td className="py-3 text-sm" data-testid={`product-weight-${product.id}`}>
                {product.weightGrams}g
              </td>
              <td className="py-3 text-sm" data-testid={`product-material-${product.id}`}>
                <Badge variant="outline">{product.rawMaterialType}</Badge>
              </td>
              <td className="py-3 text-sm" data-testid={`product-price-${product.id}`}>
                ₹{parseFloat(product.rawMaterialPricePerKg).toFixed(2)}
              </td>
              <td className="py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid={`button-edit-product-${product.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                    data-testid={`button-delete-product-${product.id}`}
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
