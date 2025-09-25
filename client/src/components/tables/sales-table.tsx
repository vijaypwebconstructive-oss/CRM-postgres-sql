import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SalesOrderWithParty } from "@shared/schema";

interface SalesTableProps {
  salesOrders: SalesOrderWithParty[];
  onFulfill: (orderId: number, fulfillments: any) => void;
  isFulfilling: boolean;
}

export default function SalesTable({ salesOrders, onFulfill, isFulfilling }: SalesTableProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [fulfillmentData, setFulfillmentData] = useState<Record<number, number>>({});

  const { data: orderDetails } = useQuery({
    queryKey: ["/api/sales", selectedOrderId],
    queryFn: () => selectedOrderId ? api.getSalesOrder(selectedOrderId) : null,
    enabled: !!selectedOrderId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "partial_invoice":
        return "bg-blue-100 text-blue-800";
      case "fully_invoiced":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openDetailModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const openFulfillModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsFulfillModalOpen(true);
    // Initialize fulfillment data
    if (orderDetails?.items) {
      const initialData: Record<number, number> = {};
      orderDetails.items.forEach((item: any) => {
        initialData[item.id] = Math.max(0, item.quantity - item.fulfilled);
      });
      setFulfillmentData(initialData);
    }
  };

  const handleFulfill = () => {
    if (!selectedOrderId || !orderDetails) return;
    
    const fulfillments = Object.entries(fulfillmentData)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({
        itemId: parseInt(itemId),
        quantity
      }));

    onFulfill(selectedOrderId, fulfillments);
    setIsFulfillModalOpen(false);
    setSelectedOrderId(null);
  };

  if (salesOrders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="no-sales-orders">
        No sales orders found. Create your first sales order to start tracking orders.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full data-table" data-testid="sales-table">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Order Number</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Party</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Items</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted" data-testid={`sales-order-row-${order.id}`}>
                <td className="py-3 text-sm font-medium" data-testid={`order-number-${order.id}`}>
                  {order.orderNumber}
                </td>
                <td className="py-3 text-sm" data-testid={`order-party-${order.id}`}>
                  {order.party.name}
                </td>
                <td className="py-3 text-sm" data-testid={`order-date-${order.id}`}>
                  {format(new Date(order.date), "MMM dd, yyyy")}
                </td>
                <td className="py-3 text-sm" data-testid={`order-items-${order.id}`}>
                  {order.itemCount} items
                </td>
                <td className="py-3 text-sm" data-testid={`order-status-${order.id}`}>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="py-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetailModal(order.id)}
                      data-testid={`button-view-order-${order.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {order.status === "pending" || order.status === "partial_invoice" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openFulfillModal(order.id)}
                        data-testid={`button-fulfill-order-${order.id}`}
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl" data-testid="order-details-modal">
          <DialogHeader>
            <DialogTitle>Order Details - {orderDetails?.orderNumber}</DialogTitle>
          </DialogHeader>
          {orderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Party</Label>
                  <p className="font-medium" data-testid="modal-party-name">{orderDetails.party.name}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p data-testid="modal-order-date">{format(new Date(orderDetails.date), "PPP")}</p>
                </div>
              </div>
              <div>
                <Label>Items</Label>
                <div className="mt-2 space-y-2">
                  {orderDetails.items.map((item: any, index: any) => (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded" data-testid={`modal-item-${index}`}>
                      <span data-testid={`modal-item-product-${index}`}>{item.product.name}</span>
                      <span data-testid={`modal-item-quantity-${index}`}>
                        {item.fulfilled}/{item.quantity} pieces
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fulfill Order Modal */}
      <Dialog open={isFulfillModalOpen} onOpenChange={setIsFulfillModalOpen}>
        <DialogContent className="max-w-xl" data-testid="fulfill-order-modal">
          <DialogHeader>
            <DialogTitle>Fulfill Order - {orderDetails?.orderNumber}</DialogTitle>
          </DialogHeader>
          {orderDetails && (
            <div className="space-y-4">
              <div className="space-y-3">
                {orderDetails.items.map((item: any, index: any) => {
                  const remaining = item.quantity - item.fulfilled;
                  return (
                    <div key={item.id} className="space-y-2" data-testid={`fulfill-item-${index}`}>
                      <Label data-testid={`fulfill-item-label-${index}`}>
                        {item.product.name} (Remaining: {remaining} pieces)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max={remaining}
                        value={fulfillmentData[item.id] || 0}
                        onChange={(e) => setFulfillmentData(prev => ({
                          ...prev,
                          [item.id]: parseInt(e.target.value) || 0
                        }))}
                        data-testid={`input-fulfill-quantity-${index}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFulfillModalOpen(false)}
                  data-testid="button-cancel-fulfill"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleFulfill}
                  disabled={isFulfilling}
                  data-testid="button-confirm-fulfill"
                >
                  {isFulfilling ? "Fulfilling..." : "Fulfill Order"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
