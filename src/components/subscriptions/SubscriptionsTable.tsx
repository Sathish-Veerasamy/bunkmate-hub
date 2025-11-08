import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useSubscriptions } from "@/store/subscriptions";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

interface SubscriptionsTableProps {
  dealerId?: number;
}

export default function SubscriptionsTable({ dealerId }: SubscriptionsTableProps) {
  const navigate = useNavigate();
  const { subscriptions } = useSubscriptions();

  // Filter subscriptions by dealerId if provided
  const filteredSubscriptions = dealerId
    ? subscriptions.filter((sub) => sub.dealerId === dealerId)
    : subscriptions;

  // Get unique values for filters
  const uniquePeriods = Array.from(new Set(filteredSubscriptions.map(s => s.period)));
  const uniqueDealerNames = Array.from(new Set(filteredSubscriptions.map(s => s.dealerName)));

  const columns: DataTableColumn[] = [
    { 
      id: "dealerName", 
      label: "Dealer Name", 
      visible: !dealerId,
      filterable: !dealerId,
      filterType: "select",
      filterOptions: uniqueDealerNames.map(n => ({ label: n, value: n })),
    },
    { id: "dealershipName", label: "Dealership Name", visible: true },
    { id: "membershipNo", label: "Membership No", visible: true },
    { 
      id: "period", 
      label: "Period", 
      visible: true,
      filterable: true,
      filterType: "select",
      filterOptions: uniquePeriods.map(p => ({ label: p, value: p })),
    },
    { id: "amount", label: "Amount", visible: true, render: (value: number) => `₹${value}` },
    { id: "paymentDate", label: "Payment Date", visible: true },
    { id: "paymentTime", label: "Payment Time", visible: true },
    {
      id: "status",
      label: "Status",
      visible: true,
      sortable: false,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "Active", value: "active" },
        { label: "Expiring Soon", value: "expiring" },
        { label: "Expired", value: "expired" },
      ],
      render: (value: string) => {
        let className = "";
        let label = "";
        
        if (value === "active") {
          className = "bg-success hover:bg-success/90";
          label = "Active";
        } else if (value === "expiring") {
          className = "bg-accent hover:bg-accent/90";
          label = "Expiring Soon";
        } else {
          className = "border-destructive text-destructive";
          label = "Expired";
        }
        
        return (
          <Badge variant={value === "expired" ? "outline" : "default"} className={className}>
            {label}
          </Badge>
        );
      },
    },
  ];

  const actions: DataTableAction[] = [
    {
      icon: "view",
      label: "View Dealer",
      onClick: (subscription) => navigate(`/dealers/${subscription.dealerId}`),
    },
  ];

  const searchableFields = [
    "dealerName",
    "dealershipName",
    "membershipNo",
    "period",
    "paymentDate",
    "paymentTime",
    "status",
  ];

  return (
    <DataTable
      data={filteredSubscriptions}
      columns={columns}
      actions={actions}
      searchableFields={searchableFields}
    />
  );
}
