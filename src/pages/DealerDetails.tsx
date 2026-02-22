import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Plus } from "lucide-react";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { api } from "@/lib/api";
import {
  USE_MOCK,
  DEALER_META,
  getMockDealerById,
  getMockSubModuleData,
} from "@/lib/mock-data";

// ── Derive sub-module tabs from meta (collection + standalone) ───
const SUB_MODULE_TABS = DEALER_META.fields
  .filter((f) => f.type === "ref_entity" && f.collection && f.standalone)
  .map((f) => ({
    key: f.name,
    label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
    displayKey: f.display_key,
    refEntity: f.relational_mapping?.ref_entity,
    mappedBy: f.relational_mapping?.mapped_by,
  }));

// ── Sub-module column definitions ────────────────────────────────
const SUB_MODULE_COLUMNS: Record<string, { columns: DataTableColumn[]; searchFields: string[] }> = {
  tasks: {
    columns: [
      { id: "title", label: "Title", visible: true },
      { id: "status", label: "Status", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Pending", value: "Pending" }, { label: "Completed", value: "Completed" }, { label: "In Progress", value: "In Progress" }],
        render: (value: string) => {
          const colors: Record<string, string> = { Pending: "bg-amber-100 text-amber-800", Completed: "bg-green-100 text-green-800", "In Progress": "bg-blue-100 text-blue-800" };
          return <Badge variant="secondary" className={colors[value] || ""}>{value}</Badge>;
        },
      },
      { id: "priority", label: "Priority", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "High", value: "High" }, { label: "Medium", value: "Medium" }, { label: "Low", value: "Low" }],
        render: (value: string) => {
          const colors: Record<string, string> = { High: "bg-red-100 text-red-800", Medium: "bg-amber-100 text-amber-800", Low: "bg-green-100 text-green-800" };
          return <Badge variant="secondary" className={colors[value] || ""}>{value}</Badge>;
        },
      },
      { id: "assignedTo", label: "Assigned To", visible: true },
      { id: "dueDate", label: "Due Date", visible: true },
      { id: "createdAt", label: "Created", visible: true },
    ],
    searchFields: ["title", "status", "assignedTo", "priority"],
  },
  subscriptions: {
    columns: [
      { id: "planName", label: "Plan", visible: true },
      { id: "startDate", label: "Start Date", visible: true },
      { id: "endDate", label: "End Date", visible: true },
      { id: "amount", label: "Amount", visible: true },
      { id: "billingCycle", label: "Billing Cycle", visible: true },
      { id: "status", label: "Status", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Active", value: "Active" }, { label: "Expired", value: "Expired" }],
        render: (value: string) => (
          <Badge variant={value === "Active" ? "default" : "secondary"} className={value === "Active" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
            {value}
          </Badge>
        ),
      },
    ],
    searchFields: ["planName", "status", "amount", "billingCycle"],
  },
  donations: {
    columns: [
      { id: "date", label: "Date", visible: true },
      { id: "purpose", label: "Purpose", visible: true },
      { id: "amount", label: "Amount", visible: true },
      { id: "mode", label: "Mode", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Cash", value: "Cash" }, { label: "Cheque", value: "Cheque" }, { label: "UPI", value: "UPI" }] },
      { id: "receiptNo", label: "Receipt No", visible: true },
    ],
    searchFields: ["purpose", "amount", "receiptNo", "mode"],
  },
  meetings: {
    columns: [
      { id: "date", label: "Date", visible: true },
      { id: "title", label: "Meeting Title", visible: true },
      { id: "venue", label: "Venue", visible: true },
      { id: "duration", label: "Duration", visible: true },
      { id: "attended", label: "Attendance", visible: true, filterable: true, filterType: "select", filterOptions: [{ label: "Present", value: "true" }, { label: "Absent", value: "false" }],
        render: (value: boolean) => (
          <Badge variant={value ? "default" : "secondary"} className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {value ? "Present" : "Absent"}
          </Badge>
        ),
      },
      { id: "notes", label: "Notes", visible: true },
    ],
    searchFields: ["title", "venue", "notes"],
  },
};

// ── Component ────────────────────────────────────────────────────
export default function DealerDetails() {
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || "details";
  const dealerId = parseInt(id!);

  const [dealer, setDealer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subModuleData, setSubModuleData] = useState<Record<string, any[]>>({});

  // Fetch dealer
  useEffect(() => {
    const fetchDealer = async () => {
      setLoading(true);
      if (USE_MOCK) {
        setDealer(getMockDealerById(dealerId));
      } else {
        const res = await api.get<any>(`/dealers/${dealerId}`);
        setDealer(res.success ? res.data : null);
      }
      setLoading(false);
    };
    fetchDealer();
  }, [dealerId]);

  // Fetch sub-module data
  useEffect(() => {
    const fetchSubModules = async () => {
      const map: Record<string, any[]> = {};
      for (const t of SUB_MODULE_TABS) {
        if (USE_MOCK) {
          map[t.key] = getMockSubModuleData(t.key, dealerId);
        } else {
          const endpoint = t.mappedBy
            ? `/${t.refEntity}s?${t.mappedBy}=${dealerId}`
            : `/${t.refEntity}s`;
          const res = await api.get<any>(endpoint);
          if (res.success && res.data) {
            map[t.key] = Array.isArray(res.data)
              ? res.data
              : res.data.data ?? res.data.content ?? [];
          } else {
            map[t.key] = [];
          }
        }
      }
      setSubModuleData(map);
    };
    fetchSubModules();
  }, [dealerId]);

  const handleTabChange = (value: string) => {
    navigate(`/dealers/${id}/${value}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">{dealer.name || dealer.dealerName}</h1>
          <p className="text-muted-foreground">{dealer.dealershipName}</p>
        </div>
        <Badge
          variant={dealer.is_active || dealer.active ? "default" : "secondary"}
          className={(dealer.is_active || dealer.active) ? "bg-green-100 text-green-800 text-lg px-4 py-2" : "text-lg px-4 py-2"}
        >
          {(dealer.is_active || dealer.active) ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {SUB_MODULE_TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                {(subModuleData[t.key] ?? []).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["Full Name", dealer.name || dealer.dealerName],
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
                  <div><p className="text-sm text-muted-foreground">Primary Contact</p><p className="font-medium">{dealer.phone || dealer.contact}</p></div>
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
                  ["Category", dealer.category || "N/A"],
                  ["Constitution", dealer.constitution],
                  ["GST Number", dealer.gstNo || "N/A"],
                  ["Established Year", dealer.establishedYear],
                  ["Rating", dealer.rating?.toString() || "N/A"],
                  ["Total Orders", dealer.total_orders?.toString() || "N/A"],
                  ["Registered Date", dealer.registered_date || "N/A"],
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

        {/* Dynamic sub-module tabs */}
        {SUB_MODULE_TABS.map((t) => {
          const config = SUB_MODULE_COLUMNS[t.key];
          if (!config) return null;
          const data = subModuleData[t.key] ?? [];
          return (
            <TabsContent key={t.key} value={t.key} className="mt-0">
              <DataTable
                data={data}
                columns={config.columns}
                actions={subModuleActions(t.key)}
                searchableFields={config.searchFields}
                customActions={subModuleCustomActions(t.key)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
