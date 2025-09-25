import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Upload } from "lucide-react";
import PartyForm from "@/components/forms/party-form";
import PartiesTable from "@/components/tables/parties-table";
import BulkUpload from "@/components/forms/bulk-upload";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Parties() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<any>(null);
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

  const updatePartyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateParty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parties"] });
      setIsEditDialogOpen(false);
      setSelectedParty(null);
      toast({
        title: "Success",
        description: "Party updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update party",
        variant: "destructive",
      });
    },
  });

  const deletePartyMutation = useMutation({
    mutationFn: api.deleteParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parties"] });
      setIsDeleteDialogOpen(false);
      setSelectedParty(null);
      toast({
        title: "Success",
        description: "Party deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete party",
        variant: "destructive",
      });
    },
  });

  const handleCreateParty = (data: any) => {
    createPartyMutation.mutate(data);
  };

  const handleEditParty = (party: any) => {
    setSelectedParty(party);
    setIsEditDialogOpen(true);
  };

  const handleUpdateParty = (data: any) => {
    if (selectedParty) {
      updatePartyMutation.mutate({ id: selectedParty.id, data });
    }
  };

  const handleDeleteParty = (party: any) => {
    setSelectedParty(party);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteParty = () => {
    if (selectedParty) {
      deletePartyMutation.mutate(selectedParty.id);
    }
  };

  const handleBulkUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/parties"] });
    setIsBulkUploadOpen(false);
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
            <div className="flex gap-2">
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

              <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-bulk-upload-parties">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl" data-testid="bulk-upload-parties-dialog">
                  <DialogHeader>
                    <DialogTitle>Bulk Upload Parties</DialogTitle>
                  </DialogHeader>
                  <BulkUpload
                    endpoint="/api/parties/bulk"
                    title="Bulk Upload Parties"
                    description="Upload multiple parties at once using an Excel file"
                    templateHeaders={['Party Name', 'Address', 'Pin Code', 'Phone Number', 'GST Number']}
                    onSuccess={handleBulkUploadSuccess}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PartiesTable 
            parties={parties || []} 
            onEdit={handleEditParty}
            onDelete={handleDeleteParty}
          />
        </CardContent>
      </Card>

      {/* Edit Party Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent data-testid="edit-party-dialog">
          <DialogHeader>
            <DialogTitle>Edit Party</DialogTitle>
          </DialogHeader>
          {selectedParty && (
            <PartyForm
              initialData={selectedParty}
              onSubmit={handleUpdateParty}
              isLoading={updatePartyMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent data-testid="delete-party-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Party</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedParty?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteParty}
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
