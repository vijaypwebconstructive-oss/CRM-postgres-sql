import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import PartyForm from "@/components/forms/party-form";
import PartiesTable from "@/components/tables/parties-table";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Parties() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: parties, isLoading } = useQuery({
    queryKey: ["/api/parties"],
    queryFn: api.getParties,
  });

  const createPartyMutation = useMutation({
    mutationFn: api.createParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parties"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Party created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create party",
        variant: "destructive",
      });
    },
  });

  const handleCreateParty = (data: any) => {
    createPartyMutation.mutate(data);
  };

  if (isLoading) {
    return <div data-testid="loading-parties">Loading parties...</div>;
  }

  return (
    <div data-testid="parties-page">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle data-testid="parties-title">Party Master</CardTitle>
              <p className="text-muted-foreground" data-testid="parties-description">
                Manage your customers and suppliers directory
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-party">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Party
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="add-party-dialog">
                <DialogHeader>
                  <DialogTitle>Add New Party</DialogTitle>
                </DialogHeader>
                <PartyForm
                  onSubmit={handleCreateParty}
                  isLoading={createPartyMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <PartiesTable parties={parties || []} />
        </CardContent>
      </Card>
    </div>
  );
}
