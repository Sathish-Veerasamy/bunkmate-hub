import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, UserX, Download, Upload } from "lucide-react";
import { useDealers } from "@/store/dealers";
import DataTable, { DataTableAction } from "@/components/ui/data-table";
import { useMetaColumns } from "@/hooks/use-meta-columns";

interface DealersTableProps {
  onEdit: (dealer: any) => void;
  onAddDealer: () => void;
}

export default function DealersTable({ onEdit, onAddDealer }: DealersTableProps) {
  const navigate = useNavigate();
  const { dealers, deleteDealer } = useDealers();

  const { columns, searchFields } = useMetaColumns("dealer", {
    hiddenFields: ["documents", "metadata"],
  });

  const handleBulkDelete = (selectedIds: any[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} dealer(s)?`)) {
      selectedIds.forEach(id => deleteDealer(id));
    }
  };

  const actions: DataTableAction[] = [
    {
      icon: "view",
      label: "View Details",
      onClick: (dealer) => navigate(`/dealers/${dealer.id}/details`),
    },
    {
      icon: "edit",
      label: "Edit Dealer",
      onClick: (dealer) => onEdit(dealer),
    },
  ];

  const customActions = (
    <>
      <Button onClick={onAddDealer} size="sm" className="h-9">
        <Plus className="h-4 w-4 mr-2" />
        Add Dealer
      </Button>
      <Button variant="outline" size="sm" className="h-9">
        <UserX className="h-4 w-4 mr-2" />
        Make Inactive
      </Button>
      <Button variant="outline" size="sm" className="h-9">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="h-9">
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
    </>
  );

  return (
    <DataTable
      data={dealers}
      columns={columns}
      actions={actions}
      searchableFields={searchFields}
      onBulkDelete={handleBulkDelete}
      customActions={customActions}
    />
  );
}
