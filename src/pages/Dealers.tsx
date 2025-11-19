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
    <div>
      {/* Table Card */}
      <Card className="p-6">
        <DealersTable 
          onEdit={handleEditDealer}
          onAddDealer={handleAddDealer}
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
