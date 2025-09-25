import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import SalesForm from "@/components/forms/sales-form";
import SalesTable from "@/components/tables/sales-table";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Sales() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: salesOrders, isLoading } = useQuery({
    queryKey: ["/api/sales"],
    queryFn: api.getSalesOrders,
  });

  const { data: parties } = useQuery({
    queryKey: ["/api/parties"],
    queryFn: api.getParties,
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    queryFn: api.getProducts,
  });

  const createSalesOrderMutation = useMutation({
    mutationFn: api.createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Sales order created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create sales order",
        variant: "destructive",
      });
    },
  });

  const fulfillOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.fulfillOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Success",
        description: "Order fulfilled successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fulfill order",
        variant: "destructive",
      });
    },
  });

  const deleteSalesOrderMutation = useMutation({
    mutationFn: api.deleteSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsDeleteDialogOpen(false);
      setSelectedOrderId(null);
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete sales order",
        variant: "destructive",
      });
    },
  });

  const cancelInvoiceMutation = useMutation({
    mutationFn: api.cancelInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Invoice cancelled successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel invoice",
        variant: "destructive",
      });
    },
  });

  const handleCreateSalesOrder = (data: any) => {
    createSalesOrderMutation.mutate(data);
  };

  const handleFulfillOrder = (orderId: number, fulfillments: any) => {
    fulfillOrderMutation.mutate({ id: orderId, data: { fulfillments } });
  };

  const handleDeleteOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOrderId) {
      deleteSalesOrderMutation.mutate(selectedOrderId);
    }
  };

  const handleCancelInvoice = (orderId: number) => {
    cancelInvoiceMutation.mutate(orderId);
  };

  if (isLoading) {
    return <div data-testid="loading-sales">Loading sales orders...</div>;
  }

  return (
    <div data-testid="sales-page">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle data-testid="sales-title">Sales Orders</CardTitle>
              <p className="text-muted-foreground" data-testid="sales-description">
                Create and manage sales orders with order tracking and fulfillment
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-order">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl" data-testid="create-order-dialog">
                <DialogHeader>
                  <DialogTitle>Create Sales Order</DialogTitle>
                </DialogHeader>
                <SalesForm
                  parties={parties || []}
                  products={products || []}
                  onSubmit={handleCreateSalesOrder}
                  isLoading={createSalesOrderMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <SalesTable
            salesOrders={salesOrders || []}
            onFulfill={handleFulfillOrder}
            isFulfilling={fulfillOrderMutation.isPending}
            onDelete={handleDeleteOrder}
            onCancel={handleCancelInvoice}
            isDeleting={deleteSalesOrderMutation.isPending}
            isCancelling={cancelInvoiceMutation.isPending}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent data-testid="delete-sales-order-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sales Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sales order? This action cannot be undone and will not restore inventory levels.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
