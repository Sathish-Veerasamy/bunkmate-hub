import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import EntityListPage from "./pages/EntityListPage";
import EntityDetailsPage from "./pages/EntityDetailsPage";
import EntityFormPage from "./pages/EntityFormPage";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OrganizationSetup from "./pages/OrganizationSetup";
import TenantSelection from "./pages/TenantSelection";

const queryClient = new QueryClient();

// Helper to wrap in ProtectedRoute + Layout
const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/organization-setup" element={<OrganizationSetup />} />
          <Route path="/tenant-selection" element={<TenantSelection />} />
          
          {/* Dashboard */}
          <Route path="/" element={<P><Index /></P>} />

          {/* ── Generic entity routes ── */}
          {/* Dealers */}
          <Route path="/dealers" element={<P><EntityListPage entityName="dealer" /></P>} />
          <Route path="/dealers/new" element={<P><EntityFormPage /></P>} />
          <Route path="/dealers/:id/edit" element={<P><EntityFormPage /></P>} />
          <Route path="/dealers/:id/:tab?" element={<P><EntityDetailsPage entityName="dealer" /></P>} />

          {/* Tasks */}
          <Route path="/tasks" element={<P><EntityListPage entityName="task" /></P>} />
          <Route path="/tasks/new" element={<P><EntityFormPage /></P>} />
          <Route path="/tasks/:id/edit" element={<P><EntityFormPage /></P>} />
          <Route path="/tasks/:id/:tab?" element={<P><EntityDetailsPage entityName="task" /></P>} />

          {/* Donations */}
          <Route path="/donations" element={<P><EntityListPage entityName="donation" /></P>} />
          <Route path="/donations/new" element={<P><EntityFormPage /></P>} />
          <Route path="/donations/:id/edit" element={<P><EntityFormPage /></P>} />
          <Route path="/donations/:id/:tab?" element={<P><EntityDetailsPage entityName="donation" /></P>} />

          {/* Subscriptions */}
          <Route path="/subscriptions" element={<P><EntityListPage entityName="subscription" /></P>} />
          <Route path="/subscriptions/new" element={<P><EntityFormPage /></P>} />
          <Route path="/subscriptions/:id/edit" element={<P><EntityFormPage /></P>} />
          <Route path="/subscriptions/:id/:tab?" element={<P><EntityDetailsPage entityName="subscription" /></P>} />

          {/* Meetings */}
          <Route path="/meetings" element={<P><EntityListPage entityName="meeting" /></P>} />
          <Route path="/meetings/new" element={<P><EntityFormPage /></P>} />
          <Route path="/meetings/:id/edit" element={<P><EntityFormPage /></P>} />
          <Route path="/meetings/:id/:tab?" element={<P><EntityDetailsPage entityName="meeting" /></P>} />

          {/* Events (custom pages) */}
          <Route path="/events" element={<P><Events /></P>} />
          <Route path="/events/:id" element={<P><EventDetails /></P>} />

          {/* Other */}
          <Route path="/users" element={<P><Users /></P>} />
          <Route path="/settings" element={<P><Settings /></P>} />

          {/* Generic fallback for any new entity */}
          <Route path="/:entity" element={<P><EntityListPage entityName="" /></P>} />
          <Route path="/:entity/new" element={<P><EntityFormPage /></P>} />
          <Route path="/:entity/:id/edit" element={<P><EntityFormPage /></P>} />
          <Route path="/:entity/:id/:tab?" element={<P><EntityDetailsPage entityName="" /></P>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
