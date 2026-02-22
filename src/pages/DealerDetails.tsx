import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Plus } from "lucide-react";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Hardcoded metadata – sub-module tabs from collection+standalone fields
const SUB_MODULE_TABS = [
  { key: "tasks", label: "Tasks" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "donations", label: "Donations" },
  { key: "meetings", label: "Meetings" },
];

// Sample dealer data
const getDealerById = (id: string) => {
  const dealers = [
    {
      id: 1, dealerName: "Rajesh Kumar", dealershipName: "Kumar Petroleum Services",
      address: "123 Main Road, Dindigul - 624001", contact: "9876543210",
      email: "rajesh@example.com", company: "IOC", status: "Sale",
      constitution: "Proprietor", gstNo: "33AAAAA1234A1Z5", establishedYear: "2015",
      active: true, district: "Dindigul", pincode: "624001",
      emergencyContact: "9876543299", dateOfBirth: "1985-05-15", gender: "M",
      bloodGroup: "O+", education: "B.Com", aadharNumber: "1234 5678 9012",
      officeDetails: "Office: 0451-2345678", otherActivities: "Transport business",
    },
    {
      id: 2, dealerName: "Priya Sharma", dealershipName: "Sharma Fuel Station",
      address: "456 Market Street, Dindigul - 624002", contact: "9876543211",
      email: "priya@example.com", company: "BPC", status: "Dist",
      constitution: "Partnership", gstNo: "33BBBBB5678B1Z5", establishedYear: "2018",
      active: true, district: "Dindigul", pincode: "624002",
    },
    {
      id: 3, dealerName: "Mohammed Ali", dealershipName: "Ali Petro Center",
      address: "789 Highway Road, Dindigul - 624003", contact: "9876543212",
      email: "ali@example.com", company: "HPC", status: "CRE",
      constitution: "Limited", gstNo: "33CCCCC9012C1Z5", establishedYear: "2020",
      active: false, district: "Dindigul", pincode: "624003",
    },
    {
      id: 4, dealerName: "Lakshmi Devi", dealershipName: "Devi Fuel Solutions",
      address: "321 Temple Road, Dindigul - 624004", contact: "9876543213",
      email: "lakshmi@example.com", company: "IOC", status: "Sale",
      constitution: "Proprietor", gstNo: "33DDDDD3456D1Z5", establishedYear: "2012",
      active: true, district: "Dindigul", pincode: "624004",
    },
  ];
  return dealers.find((d) => d.id === parseInt(id));
};

// ── Sub-module table configs ─────────────────────────────────────

const tasksColumns: DataTableColumn[] = [
  { id: "title", label: "Title", visible: true },
  { id: "status", label: "Status", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Pending", value: "Pending" }, { label: "Completed", value: "Completed" }, { label: "In Progress", value: "In Progress" }] },
  { id: "priority", label: "Priority", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "High", value: "High" }, { label: "Medium", value: "Medium" }, { label: "Low", value: "Low" }] },
  { id: "assignedTo", label: "Assigned To", visible: true },
  { id: "dueDate", label: "Due Date", visible: true },
];

const tasksData = [
  { id: 1, title: "Follow up on order", status: "Pending", priority: "High", assignedTo: "Admin", dueDate: "2024-10-15" },
  { id: 2, title: "Site inspection", status: "Completed", priority: "Medium", assignedTo: "Inspector", dueDate: "2024-09-20" },
  { id: 3, title: "Document verification", status: "In Progress", priority: "High", assignedTo: "Admin", dueDate: "2024-11-01" },
];

const subscriptionsColumns: DataTableColumn[] = [
  { id: "planName", label: "Plan", visible: true },
  { id: "startDate", label: "Start Date", visible: true },
  { id: "endDate", label: "End Date", visible: true },
  { id: "amount", label: "Amount", visible: true },
  { id: "status", label: "Status", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Active", value: "Active" }, { label: "Expired", value: "Expired" }],
    render: (value: string) => (
      <Badge variant={value === "Active" ? "default" : "secondary"} className={value === "Active" ? "bg-success hover:bg-success/90" : ""}>
        {value}
      </Badge>
    ),
  },
];

const subscriptionsData = [
  { id: 1, planName: "Premium Plan", startDate: "2024-01-01", endDate: "2024-12-31", amount: "₹12,000", status: "Active" },
  { id: 2, planName: "Basic Plan", startDate: "2023-01-01", endDate: "2023-12-31", amount: "₹6,000", status: "Expired" },
];

const donationsColumns: DataTableColumn[] = [
  { id: "date", label: "Date", visible: true },
  { id: "purpose", label: "Purpose", visible: true },
  { id: "amount", label: "Amount", visible: true },
  { id: "receiptNo", label: "Receipt No", visible: true },
];

const donationsData = [
  { id: 1, date: "2024-08-15", purpose: "Independence Day Event", amount: "₹10,000", receiptNo: "RCP-001" },
  { id: 2, date: "2024-01-26", purpose: "Republic Day Event", amount: "₹8,000", receiptNo: "RCP-002" },
  { id: 3, date: "2023-12-25", purpose: "Christmas Charity", amount: "₹5,000", receiptNo: "RCP-003" },
];

const meetingsColumns: DataTableColumn[] = [
  { id: "date", label: "Date", visible: true },
  { id: "title", label: "Meeting Title", visible: true },
  { id: "venue", label: "Venue", visible: true },
  { id: "attended", label: "Attendance", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Present", value: "true" }, { label: "Absent", value: "false" }],
    render: (value: boolean) => (
      <Badge variant={value ? "default" : "secondary"} className={value ? "bg-success hover:bg-success/90" : ""}>
        {value ? "Present" : "Absent"}
      </Badge>
    ),
  },
];

const meetingsData = [
  { id: 1, date: "2024-09-15", title: "Annual General Meeting", venue: "Main Hall", attended: true },
  { id: 2, date: "2024-06-20", title: "Quarterly Review", venue: "Conference Room", attended: true },
  { id: 3, date: "2024-03-10", title: "Budget Planning", venue: "Board Room", attended: false },
  { id: 4, date: "2024-01-05", title: "New Year Planning", venue: "Main Hall", attended: true },
];

const SUB_MODULE_CONFIG: Record<string, { columns: DataTableColumn[]; data: any[]; searchFields: string[] }> = {
  tasks: { columns: tasksColumns, data: tasksData, searchFields: ["title", "status", "assignedTo"] },
  subscriptions: { columns: subscriptionsColumns, data: subscriptionsData, searchFields: ["planName", "status", "amount"] },
  donations: { columns: donationsColumns, data: donationsData, searchFields: ["purpose", "amount", "receiptNo"] },
  meetings: { columns: meetingsColumns, data: meetingsData, searchFields: ["title", "venue"] },
};

// ── Component ────────────────────────────────────────────────────

export default function DealerDetails() {
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const dealer = getDealerById(id!);
  const activeTab = tab || "details";

  const handleTabChange = (value: string) => {
    navigate(`/dealers/${id}/${value}`, { replace: true });
  };

  if (!dealer) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Dealer not found</p>
            <Button onClick={() => navigate("/dealers")} className="mt-4">Back to Dealers</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subModuleActions = (tabKey: string): DataTableAction[] => [
    { icon: "view", label: "View", onClick: (row) => console.log("View", tabKey, row) },
    { icon: "edit", label: "Edit", onClick: (row) => console.log("Edit", tabKey, row) },
  ];

  const subModuleCustomActions = (tabKey: string) => (
    <Button size="sm" className="h-9">
      <Plus className="h-4 w-4 mr-2" />
      Add {SUB_MODULE_TABS.find((t) => t.key === tabKey)?.label.replace(/s$/, "")}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dealers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{dealer.dealerName}</h1>
          <p className="text-muted-foreground">{dealer.dealershipName}</p>
        </div>
        <Badge
          variant={dealer.active ? "default" : "secondary"}
          className={dealer.active ? "bg-success hover:bg-success/90 text-lg px-4 py-2" : "text-lg px-4 py-2"}
        >
          {dealer.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {SUB_MODULE_TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["Full Name", dealer.dealerName],
                  ["Date of Birth", dealer.dateOfBirth || "N/A"],
                  ["Gender", dealer.gender === "M" ? "Male" : dealer.gender === "F" ? "Female" : "N/A"],
                  ["Blood Group", dealer.bloodGroup || "N/A"],
                  ["Education", dealer.education || "N/A"],
                  ["Aadhar Number", dealer.aadharNumber || "N/A"],
                ].map(([label, value]) => (
                  <div key={label as string} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div><p className="text-sm text-muted-foreground">Primary Contact</p><p className="font-medium">{dealer.contact}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div><p className="text-sm text-muted-foreground">Emergency Contact</p><p className="font-medium">{dealer.emergencyContact || "N/A"}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{dealer.email}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{dealer.address}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {[
                  ["Dealership Name", dealer.dealershipName],
                  ["Company", dealer.company],
                  ["Status", dealer.status],
                  ["Constitution", dealer.constitution],
                  ["GST Number", dealer.gstNo || "N/A"],
                  ["Established Year", dealer.establishedYear],
                ].map(([label, value]) => (
                  <div key={label as string} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dynamic sub-module tabs using DataTable */}
        {SUB_MODULE_TABS.map((t) => {
          const config = SUB_MODULE_CONFIG[t.key];
          if (!config) return null;
          return (
            <TabsContent key={t.key} value={t.key}>
              <Card className="p-6">
                <DataTable
                  data={config.data}
                  columns={config.columns}
                  actions={subModuleActions(t.key)}
                  searchableFields={config.searchFields}
                  customActions={subModuleCustomActions(t.key)}
                />
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
