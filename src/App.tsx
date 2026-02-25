import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dealers from "./pages/Dealers";
import DealerDetails from "./pages/DealerDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Subscriptions from "./pages/Subscriptions";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OrganizationSetup from "./pages/OrganizationSetup";
import TenantSelection from "./pages/TenantSelection";
import Donations from "./pages/Donations";
import Tasks from "./pages/Tasks";
import EntityFormPage from "./pages/EntityFormPage";

const queryClient = new QueryClient();

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
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
          <Route path="/dealers" element={<ProtectedRoute><Layout><Dealers /></Layout></ProtectedRoute>} />
          <Route path="/dealers/new" element={<ProtectedRoute><Layout><EntityFormPage /></Layout></ProtectedRoute>} />
          <Route path="/dealers/:id/edit" element={<ProtectedRoute><Layout><EntityFormPage /></Layout></ProtectedRoute>} />
          <Route path="/dealers/:id/:tab?" element={<ProtectedRoute><Layout><DealerDetails /></Layout></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Layout><Events /></Layout></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><Layout><EventDetails /></Layout></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><Layout><Subscriptions /></Layout></ProtectedRoute>} />
          <Route path="/donations" element={<ProtectedRoute><Layout><Donations /></Layout></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

          {/* Generic entity form routes */}
          <Route path="/:entity/new" element={<ProtectedRoute><Layout><EntityFormPage /></Layout></ProtectedRoute>} />
          <Route path="/:entity/:id/edit" element={<ProtectedRoute><Layout><EntityFormPage /></Layout></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
