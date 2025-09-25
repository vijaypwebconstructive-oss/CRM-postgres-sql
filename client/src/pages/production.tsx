import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProductionForm from "@/components/forms/production-form";
import ProductionTable from "@/components/tables/production-table";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Production() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: production, isLoading } = useQuery({
    queryKey: ["/api/production"],
    queryFn: api.getProduction,
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    queryFn: api.getProducts,
  });

  const createProductionMutation = useMutation({
    mutationFn: api.createProduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Production record created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create production record",
        variant: "destructive",
      });
    },
  });

  const handleCreateProduction = (data: any) => {
    createProductionMutation.mutate(data);
  };

  if (isLoading) {
    return <div data-testid="loading-production">Loading production records...</div>;
  }

  return (
    <div data-testid="production-page">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle data-testid="production-title">Production Records</CardTitle>
              <p className="text-muted-foreground" data-testid="production-description">
                Log daily manufacturing output and track production efficiency
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-production">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="add-production-dialog">
                <DialogHeader>
                  <DialogTitle>Add Production Record</DialogTitle>
                </DialogHeader>
                <ProductionForm
                  products={products || []}
                  onSubmit={handleCreateProduction}
                  isLoading={createProductionMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ProductionTable production={production || []} />
        </CardContent>
      </Card>
    </div>
  );
}
