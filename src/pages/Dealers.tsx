import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Download,
  Upload,
  UserX,
  Eye,
  Pencil,
  Settings2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import DealersTable from "@/components/dealers/DealersTable";
import DealerForm from "@/components/dealers/DealerForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Dealers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDealer, setEditingDealer] = useState<any>(null);

  const handleAddDealer = () => {
    setEditingDealer(null);
    setShowForm(true);
  };

  const handleEditDealer = (dealer: any) => {
    setEditingDealer(dealer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDealer(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bunk Dealers</h1>
        <p className="text-muted-foreground mt-1">
          Manage petroleum dealer registrations and information
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search dealers by name, dealership, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddDealer} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Dealer
            </Button>
            <Button variant="outline" className="gap-2">
              <UserX className="h-4 w-4" />
              Make Inactive
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="p-6">
        <DealersTable
          searchQuery={searchQuery}
          onEdit={handleEditDealer}
        />
      </Card>

      {/* Add/Edit Dealer Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDealer ? "Edit Dealer" : "Add New Dealer"}
            </DialogTitle>
            <DialogDescription>
              {editingDealer
                ? "Update dealer information below"
                : "Fill in the dealer information below"}
            </DialogDescription>
          </DialogHeader>
          <DealerForm
            dealer={editingDealer}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
