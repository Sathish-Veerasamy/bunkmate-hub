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

// Sample data - in production, fetch from API/database
const getDealerById = (id: string) => {
  const dealers = [
    {
      id: 1,
      dealerName: "Rajesh Kumar",
      dealershipName: "Kumar Petroleum Services",
      address: "123 Main Road, Dindigul - 624001",
      contact: "9876543210",
      email: "rajesh@example.com",
      company: "IOC",
      status: "Sale",
      constitution: "Proprietor",
      gstNo: "33AAAAA1234A1Z5",
      establishedYear: "2015",
      active: true,
      district: "Dindigul",
      pincode: "624001",
      emergencyContact: "9876543299",
      dateOfBirth: "1985-05-15",
      gender: "M",
      bloodGroup: "O+",
      education: "B.Com",
      aadharNumber: "1234 5678 9012",
      officeDetails: "Office: 0451-2345678",
      otherActivities: "Transport business",
    },
  ];
  return dealers.find((d) => d.id === parseInt(id));
};

const sampleSubscriptions = [
  { year: "2024", amount: "₹5,000", status: "Paid", date: "2024-01-15" },
  { year: "2023", amount: "₹5,000", status: "Paid", date: "2023-01-10" },
  { year: "2022", amount: "₹4,500", status: "Paid", date: "2022-01-12" },
];

const sampleDonations = [
  { date: "2024-08-15", purpose: "Independence Day Event", amount: "₹10,000" },
  { date: "2024-01-26", purpose: "Republic Day Event", amount: "₹8,000" },
  { date: "2023-12-25", purpose: "Christmas Charity", amount: "₹5,000" },
];

const sampleMeetings = [
  { date: "2024-09-15", title: "Annual General Meeting", attended: true },
  { date: "2024-06-20", title: "Quarterly Review", attended: true },
  { date: "2024-03-10", title: "Budget Planning", attended: false },
  { date: "2024-01-05", title: "New Year Planning", attended: true },
];

export default function DealerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dealer = getDealerById(id!);

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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dealers")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{dealer.dealerName}</h1>
          <p className="text-muted-foreground">{dealer.dealershipName}</p>
        </div>
        <Badge
          variant={dealer.active ? "default" : "secondary"}
          className={
            dealer.active ? "bg-success hover:bg-success/90 text-lg px-4 py-2" : "text-lg px-4 py-2"
          }
        >
          {dealer.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Dealer Details</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{dealer.dealerName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{dealer.dateOfBirth || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">
                    {dealer.gender === "M" ? "Male" : "Female"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{dealer.bloodGroup || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Education</p>
                  <p className="font-medium">{dealer.education || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Aadhar Number</p>
                  <p className="font-medium">{dealer.aadharNumber || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Primary Contact</p>
                    <p className="font-medium">{dealer.contact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">{dealer.emergencyContact || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{dealer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{dealer.address}</p>
                    <p className="text-sm">
                      {dealer.district}, PIN: {dealer.pincode}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Office Details</p>
                  <p className="font-medium">{dealer.officeDetails || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Dealership Name</p>
                  <p className="font-medium">{dealer.dealershipName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{dealer.company}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{dealer.status}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Constitution</p>
                  <p className="font-medium">{dealer.constitution}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">GST Number</p>
                  <p className="font-medium">{dealer.gstNo || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Established Year</p>
                  <p className="font-medium">{dealer.establishedYear}</p>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <p className="text-sm text-muted-foreground">Other Activities</p>
                  <p className="font-medium">{dealer.otherActivities || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleSubscriptions.map((sub, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{sub.year}</TableCell>
                      <TableCell>{sub.amount}</TableCell>
                      <TableCell>{sub.date}</TableCell>
                      <TableCell>
                        <Badge className="bg-success hover:bg-success/90">
                          {sub.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDonations.map((donation, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{donation.date}</TableCell>
                      <TableCell>{donation.purpose}</TableCell>
                      <TableCell className="font-semibold text-success">
                        {donation.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Meeting Title</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleMeetings.map((meeting, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{meeting.date}</TableCell>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={meeting.attended ? "default" : "secondary"}
                          className={
                            meeting.attended
                              ? "bg-success hover:bg-success/90"
                              : ""
                          }
                        >
                          {meeting.attended ? "Present" : "Absent"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
