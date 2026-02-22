import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, UserX, Download, Upload } from "lucide-react";
import { useDealers } from "@/store/dealers";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

interface DealersTableProps {
  onEdit: (dealer: any) => void;
  onAddDealer: () => void;
}

export default function DealersTable({ onEdit, onAddDealer }: DealersTableProps) {
  const navigate = useNavigate();
  const { dealers, deleteDealer } = useDealers();

  const handleBulkDelete = (selectedIds: any[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} dealer(s)?`)) {
      selectedIds.forEach(id => deleteDealer(id));
    }
  };

  // Get unique values for filters
  const uniqueCompanies = Array.from(new Set(dealers.map(d => d.company)));
  const uniqueStatuses = Array.from(new Set(dealers.map(d => d.status)));
  const uniqueConstitutions = Array.from(new Set(dealers.map(d => d.constitution)));

  const columns: DataTableColumn[] = [
    { id: "dealerName", label: "Dealer Name", visible: true },
    { id: "dealershipName", label: "Dealership Name", visible: true },
    { id: "contact", label: "Contact", visible: true },
    { id: "email", label: "Email", visible: true },
    { 
      id: "company", 
      label: "Company", 
      visible: true,
      filterable: true,
      filterType: "select",
      filterOptions: uniqueCompanies.map(c => ({ label: c, value: c })),
    },
    { 
      id: "status", 
      label: "Status", 
      visible: true,
      filterable: true,
      filterType: "select",
      filterOptions: uniqueStatuses.map(s => ({ label: s, value: s })),
    },
    { 
      id: "constitution", 
      label: "Constitution", 
      visible: false,
      filterable: true,
      filterType: "select",
      filterOptions: uniqueConstitutions.map(c => ({ label: c, value: c })),
    },
    { id: "gstNo", label: "GST No", visible: false },
    { id: "address", label: "Address", visible: false },
    {
      id: "active",
      label: "Active Status",
      visible: true,
      sortable: false,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
      render: (value: boolean) => (
        <Badge
          variant={value ? "default" : "secondary"}
          className={value ? "bg-success hover:bg-success/90" : ""}
        >
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

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

  const searchableFields = [
    "dealerName",
    "dealershipName",
    "contact",
    "email",
    "company",
    "status",
    "constitution",
    "gstNo",
    "address",
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
      searchableFields={searchableFields}
      onBulkDelete={handleBulkDelete}
      customActions={customActions}
    />
  );
}
