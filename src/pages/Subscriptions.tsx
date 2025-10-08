import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, XCircle } from "lucide-react";

const sampleSubscriptions = [
  {
    id: 1,
    dealerName: "Rajesh Kumar",
    dealershipName: "Kumar Petroleum Services",
    membershipNo: "DDPWA001",
    renewalDate: "2026-03-31",
    status: "active",
    amount: 5000,
  },
  {
    id: 2,
    dealerName: "Priya Sharma",
    dealershipName: "Sharma Fuel Station",
    membershipNo: "DDPWA002",
    renewalDate: "2025-12-31",
    status: "active",
    amount: 5000,
  },
  {
    id: 3,
    dealerName: "Mohammed Ali",
    dealershipName: "Ali Petro Center",
    membershipNo: "DDPWA003",
    renewalDate: "2025-06-30",
    status: "expiring",
    amount: 5000,
  },
  {
    id: 4,
    dealerName: "Lakshmi Devi",
    dealershipName: "Devi Fuel Solutions",
    membershipNo: "DDPWA004",
    renewalDate: "2025-03-15",
    status: "expired",
    amount: 5000,
  },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">
          Manage dealer membership subscriptions and renewals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">34</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <CreditCard className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card className="p-6">
        <div className="space-y-4">
          {sampleSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow gap-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{subscription.dealerName}</h3>
                  <Badge
                    variant={
                      subscription.status === "active"
                        ? "default"
                        : subscription.status === "expiring"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      subscription.status === "active"
                        ? "bg-success hover:bg-success/90"
                        : subscription.status === "expiring"
                        ? "bg-accent hover:bg-accent/90"
                        : "border-destructive text-destructive"
                    }
                  >
                    {subscription.status === "active" && "Active"}
                    {subscription.status === "expiring" && "Expiring Soon"}
                    {subscription.status === "expired" && "Expired"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {subscription.dealershipName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Membership No: {subscription.membershipNo}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-1">
                <p className="text-sm font-medium">₹{subscription.amount}</p>
                <p className="text-sm text-muted-foreground">
                  Renewal:{" "}
                  {new Date(subscription.renewalDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {subscription.status !== "active" && (
                  <Button size="sm">Renew</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
