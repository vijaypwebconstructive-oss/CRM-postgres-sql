import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Phone, MapPin, Trash2 } from "lucide-react";
import type { Party } from "@shared/schema";

interface PartiesTableProps {
  parties: Party[];
  onEdit: (party: Party) => void;
  onDelete: (party: Party) => void;
}

export default function PartiesTable({ parties, onEdit, onDelete }: PartiesTableProps) {
  if (parties.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="no-parties">
        No parties found. Add your first customer or supplier to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full data-table" data-testid="parties-table">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Party Name</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Contact</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Location</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">GST Number</th>
            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party) => (
            <tr key={party.id} className="border-b border-border hover:bg-muted" data-testid={`party-row-${party.id}`}>
              <td className="py-3 text-sm font-medium" data-testid={`party-name-${party.id}`}>
                {party.name}
              </td>
              <td className="py-3 text-sm" data-testid={`party-contact-${party.id}`}>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span>{party.phoneNumber}</span>
                </div>
              </td>
              <td className="py-3 text-sm" data-testid={`party-location-${party.id}`}>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="truncate max-w-xs">{party.address}, {party.pinCode}</span>
                </div>
              </td>
              <td className="py-3 text-sm" data-testid={`party-gst-${party.id}`}>
                {party.gstNumber ? (
                  <Badge variant="secondary">{party.gstNumber}</Badge>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </td>
              <td className="py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(party)}
                    data-testid={`button-edit-party-${party.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(party)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`button-delete-party-${party.id}`}
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
