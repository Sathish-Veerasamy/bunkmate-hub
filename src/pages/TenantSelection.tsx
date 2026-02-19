import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { orgAPI } from "@/lib/api";
import { useAuth } from "@/store/auth";

interface Tenant {
  tenantId: string | number;
  name: string;
}

export default function TenantSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setAuth, setTenant } = useAuth();

  // Tenants come from login response via router state
  const tenants: Tenant[] = (location.state as any)?.tenants || [];
  const user = (location.state as any)?.user;

  const [isSelecting, setIsSelecting] = useState<string | number | null>(null);

  useEffect(() => {
    if (tenants.length === 0) {
      // No tenants passed — redirect to org setup
      navigate("/organization-setup");
    }
  }, []);

  const handleSelectTenant = async (tenant: Tenant) => {
    setIsSelecting(tenant.tenantId);
    try {
      const result = await orgAPI.selectTenant(tenant.tenantId);

      if (result.success) {
        // Backend sets cookie; update zustand state for ProtectedRoute
        setAuth({
          id: user?.id,
          email: user?.email || "",
          first_name: user?.firstName || user?.first_name || "",
          last_name: user?.lastName || user?.last_name || "",
        });
        setTenant(tenant);
        toast({
          title: "Organization Selected",
          description: `You are now working in ${tenant.name}`,
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Selection Failed",
          description: result.error || "Could not select organization.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSelecting(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Select Organization</CardTitle>
            <CardDescription>
              Choose an organization to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tenants.map((tenant) => (
            <Card
              key={tenant.tenantId}
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              onClick={() => !isSelecting && handleSelectTenant(tenant)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">{tenant.name}</p>
                </div>
                {isSelecting === tenant.tenantId ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardContent>
            </Card>
          ))}

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/organization-setup")}
            >
              Create New Organization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
