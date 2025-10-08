import { Card } from "@/components/ui/card";
import { Users, Calendar, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to DDPWA Management System
        </h1>
        <p className="text-white/90">
          Dindigul District Petroleum Dealers Welfare Association
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Dealers</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <span className="text-success font-medium">+3</span> from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            93% active membership rate
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Next event in 5 days
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Subscriptions need renewal
          </p>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/dealers"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Manage Dealers</span>
              </div>
              <span className="text-sm text-muted-foreground">45 dealers</span>
            </a>
            <a
              href="/events"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Create Event</span>
              </div>
              <span className="text-sm text-muted-foreground">2 upcoming</span>
            </a>
            <a
              href="/subscriptions"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-medium">View Subscriptions</span>
              </div>
              <span className="text-sm text-muted-foreground">8 expiring</span>
            </a>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-success mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">New dealer registered</p>
                <p className="text-xs text-muted-foreground">
                  Suresh Kumar joined as new member
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Event created</p>
                <p className="text-xs text-muted-foreground">
                  Safety Training Workshop scheduled
                </p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Subscription renewed</p>
                <p className="text-xs text-muted-foreground">
                  Lakshmi Devi renewed membership
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-muted mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Data exported</p>
                <p className="text-xs text-muted-foreground">
                  Dealer list exported by admin
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
