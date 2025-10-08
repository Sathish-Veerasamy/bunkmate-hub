import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage application settings and preferences
        </p>
      </div>

      {/* Organization Settings */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Organization Details</h3>
            <p className="text-sm text-muted-foreground">
              Update organization information
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  defaultValue="Dindigul District Petroleum Dealers Welfare Association"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration No</Label>
                <Input id="regNo" defaultValue="385/98A/24-2024" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Registered Office Address</Label>
              <Input
                id="address"
                defaultValue="No.47, Vivekananda Nagar, Dindigul - 624 001"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" defaultValue="94430 28547" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" defaultValue="ddpdwa2014@gmail.com" />
              </div>
            </div>
          </div>

          <Button>Save Changes</Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure notification preferences
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>WhatsApp Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send event notifications via WhatsApp
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send updates via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Subscription Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Notify dealers about expiring subscriptions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </Card>

      {/* System Settings */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">System Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure system preferences
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="membershipFee">Annual Membership Fee (₹)</Label>
              <Input id="membershipFee" type="number" defaultValue="5000" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-renewal Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send reminders 30 days before expiry
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Export</Label>
                <p className="text-sm text-muted-foreground">
                  Allow dealers data export
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}
