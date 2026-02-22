import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

// Hardcoded metadata – same source of truth as DynamicDealerForm
const DEALER_META_FIELDS = [
  { name: "tasks", type: "ref_entity", collection: true, standalone: true, display_key: "title", display_type: "Child Table" },
  { name: "subscriptions", type: "ref_entity", collection: true, standalone: true, display_key: "plan_name", display_type: "Child Table" },
  { name: "donations", type: "ref_entity", collection: true, standalone: true, display_key: "purpose", display_type: "Child Table" },
  { name: "meetings", type: "ref_entity", collection: true, standalone: true, display_key: "title", display_type: "Child Table" },
];

// Derive tabs from fields that are collection=true & standalone=true
const SUB_MODULE_TABS = DEALER_META_FIELDS
  .filter((f) => f.collection && f.standalone)
  .map((f) => ({
    key: f.name,
    label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
  }));

// Sample data
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

// Sample sub-module data
const sampleSubModuleData: Record<string, { columns: string[]; rows: any[][] }> = {
  tasks: {
    columns: ["Title", "Status", "Due Date"],
    rows: [
      ["Follow up on order", "Pending", "2024-10-15"],
      ["Site inspection", "Completed", "2024-09-20"],
    ],
  },
  subscriptions: {
    columns: ["Plan", "Start Date", "End Date", "Status"],
    rows: [
      ["Premium Plan", "2024-01-01", "2024-12-31", "Active"],
      ["Basic Plan", "2023-01-01", "2023-12-31", "Expired"],
    ],
  },
  donations: {
    columns: ["Date", "Purpose", "Amount"],
    rows: [
      ["2024-08-15", "Independence Day Event", "₹10,000"],
      ["2024-01-26", "Republic Day Event", "₹8,000"],
      ["2023-12-25", "Christmas Charity", "₹5,000"],
    ],
  },
  meetings: {
    columns: ["Date", "Title", "Attended"],
    rows: [
      ["2024-09-15", "Annual General Meeting", "Yes"],
      ["2024-06-20", "Quarterly Review", "Yes"],
      ["2024-03-10", "Budget Planning", "No"],
    ],
  },
};

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
            <Button onClick={() => navigate("/dealers")} className="mt-4">
              Back to Dealers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
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

      {/* Tabs: Details (default) + sub-module tabs from metadata */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {SUB_MODULE_TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
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

        {/* Dynamic sub-module tabs */}
        {SUB_MODULE_TABS.map((t) => {
          const data = sampleSubModuleData[t.key];
          if (!data) return null;
          return (
            <TabsContent key={t.key} value={t.key}>
              <Card>
                <CardHeader><CardTitle>{t.label}</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {data.columns.map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.rows.map((row, idx) => (
                        <TableRow key={idx}>
                          {row.map((cell, ci) => (
                            <TableCell key={ci} className={ci === 0 ? "font-medium" : ""}>
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
