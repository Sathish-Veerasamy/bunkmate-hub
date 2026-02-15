import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api, orgAPI } from "@/lib/api";
import { useAuth } from "@/store/auth";

interface Tenant {
  id: string;
  org_name: string;
  org_type?: string;
  role?: string;
}

export default function TenantSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTenant } = useAuth();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const result = await api.get<any>('/tenants');

      if (result.success && result.data) {
        // Handle response - data could be array directly or wrapped
        const tenantList: Tenant[] = Array.isArray(result.data)
          ? result.data
          : result.data.tenants || result.data.data || [];

        setTenants(tenantList);

        // Auto-select if only one tenant
        if (tenantList.length === 1) {
          await handleSelectTenant(tenantList[0]);
        } else if (tenantList.length === 0) {
          toast({
            title: "No Organization Found",
            description: "Please create an organization to continue.",
          });
          navigate("/organization-setup");
        }
      } else {
        toast({
          title: "No Organization Found",
          description: "Please create an organization to continue.",
        });
        navigate("/organization-setup");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch organizations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTenant = async (tenant: Tenant) => {
    setIsSelecting(tenant.id);
    try {
      const result = await orgAPI.selectTenant(tenant.id);

      if (result.success) {
        // Mark as authenticated in zustand so ProtectedRoute allows access
        const { setAuth } = useAuth.getState();
        setAuth(
          { email: "", first_name: "", last_name: "" },
          "authenticated"
        );
        setTenant(tenant);
        toast({
          title: "Organization Selected",
          description: `You are now working in ${tenant.org_name}`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your organizations...</p>
        </div>
      </div>
    );
  }

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
              key={tenant.id}
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              onClick={() => handleSelectTenant(tenant)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{tenant.org_name}</p>
                    {tenant.org_type && (
                      <p className="text-sm text-muted-foreground">{tenant.org_type}</p>
                    )}
                    {tenant.role && (
                      <p className="text-xs text-muted-foreground capitalize">{tenant.role}</p>
                    )}
                  </div>
                </div>
                {isSelecting === tenant.id ? (
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
