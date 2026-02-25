import { useEffect, useState } from "react";
import { Home, Users, Menu, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Header from "./Header";
import { modulesAPI } from "@/lib/api";
import { useAuth } from "@/store/auth";

interface SubModule {
  id: number;
  name: string;
  route: string;
}

interface Module {
  id: number;
  name: string;
  icon: string;
  route: string;
  subModules: SubModule[];
}

// Fallback static nav if API fails
const FALLBACK_NAV: Module[] = [
  { id: 0, name: "Home", icon: "home", route: "/", subModules: [] },
  { id: 1, name: "Dealers", icon: "users", route: "/dealers", subModules: [] },
  { id: 2, name: "Tasks", icon: "checkSquare", route: "/tasks", subModules: [] },
  { id: 3, name: "Donations", icon: "heart", route: "/donations", subModules: [] },
];

function getIcon(iconName: string) {
  if (!iconName) return Home;
  const key = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  // Try common mappings
  const mappings: Record<string, any> = {
    home: LucideIcons.Home,
    users: LucideIcons.Users,
    dealers: LucideIcons.Users,
    heart: LucideIcons.Heart,
    donations: LucideIcons.Heart,
    calendar: LucideIcons.Calendar,
    events: LucideIcons.Calendar,
    creditcard: LucideIcons.CreditCard,
    subscriptions: LucideIcons.CreditCard,
    settings: LucideIcons.Settings,
    usercog: LucideIcons.UserCog,
    shield: LucideIcons.Shield,
    building: LucideIcons.Building2,
    package: LucideIcons.Package,
    chart: LucideIcons.BarChart,
    barchart: LucideIcons.BarChart,
    file: LucideIcons.FileText,
    bell: LucideIcons.Bell,
    checksquare: LucideIcons.CheckSquare,
    tasks: LucideIcons.CheckSquare,
  };
  return mappings[iconName.toLowerCase()] || (LucideIcons as any)[key] || LucideIcons.LayoutDashboard;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated]);

  const fetchModules = async () => {
    setLoadingModules(true);
    try {
      const result = await modulesAPI.getModules();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setModules(result.data);
      } else {
        setModules(FALLBACK_NAV);
      }
    } catch {
      setModules(FALLBACK_NAV);
    } finally {
      setLoadingModules(false);
    }
  };

  const isActiveRoute = (route: string) =>
    route === "/" ? location.pathname === "/" : location.pathname.startsWith(route);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-20 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center justify-center border-b border-sidebar-border">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-3">
            {loadingModules ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground/50" />
              </div>
            ) : (
              modules.map((mod) => {
                const Icon = getIcon(mod.icon);
                const isActive = isActiveRoute(mod.route);

                return (
                  <Link
                    key={mod.id}
                    to={mod.route}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-all text-center",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {mod.name}
                  </Link>
                );
              })
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-2 text-center">
            <p className="text-[9px] text-sidebar-foreground/60 font-semibold">v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-20">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        {/* Desktop header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Page content */}
        <main className="p-2">{children}</main>
      </div>
    </div>
  );
}
