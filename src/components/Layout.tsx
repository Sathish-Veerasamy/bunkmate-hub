import { useEffect, useState } from "react";
import { Home, Users, Menu, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
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
  { id: 1, name: "Home", icon: "home", route: "/", subModules: [] },
  { id: 2, name: "Settings", icon: "settings", route: "/settings", subModules: [] },
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
  };
  return mappings[iconName.toLowerCase()] || (LucideIcons as any)[key] || LucideIcons.LayoutDashboard;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
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
        // Auto-expand module whose route matches current path
        const active = result.data.find((m: Module) =>
          m.subModules?.some((s) => location.pathname.startsWith(s.route))
        );
        if (active) setExpandedModules(new Set([active.id]));
      } else {
        setModules(FALLBACK_NAV);
      }
    } catch {
      setModules(FALLBACK_NAV);
    } finally {
      setLoadingModules(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Dashboard</h1>
                <p className="text-xs text-sidebar-foreground/70">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-0.5 px-3 py-4">
            {loadingModules ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground/50" />
              </div>
            ) : (
              modules.map((mod) => {
                const Icon = getIcon(mod.icon);
                const hasSubModules = mod.subModules && mod.subModules.length > 0;
                const isExpanded = expandedModules.has(mod.id);
                const isActive = isActiveRoute(mod.route);

                return (
                  <div key={mod.id}>
                    {hasSubModules ? (
                      // Expandable parent
                      <button
                        onClick={() => toggleExpand(mod.id)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          isActive || isExpanded
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 text-left">{mod.name}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      // Direct link
                      <Link
                        to={mod.route}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {mod.name}
                      </Link>
                    )}

                    {/* Sub-modules */}
                    {hasSubModules && isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                        {mod.subModules.map((sub) => {
                          const subActive = location.pathname.startsWith(sub.route);
                          return (
                            <Link
                              key={sub.id}
                              to={sub.route}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                                subActive
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="text-xs text-sidebar-foreground/60">
              <p className="font-semibold">DDPWA System</p>
              <p>Version 1.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
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
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
