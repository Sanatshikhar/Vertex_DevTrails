import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { loadWorkerSession, loadAdminSession } from "@/lib/appState";
import Index from "./pages/Index.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import WorkerDashboard from "./pages/WorkerDashboard.tsx";
import AdminAccess from "./pages/AdminAccess.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import SystemPage from "./pages/SystemPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const WorkerProtectedRoute = () => {
  return loadWorkerSession() ? <WorkerDashboard /> : <Navigate to="/onboarding" replace />;
};

const AdminAccessRoute = () => {
  return loadAdminSession() ? <Navigate to="/admin/dashboard" replace /> : <AdminAccess />;
};

const AdminProtectedRoute = () => {
  return loadAdminSession() ? <AdminDashboard /> : <Navigate to="/admin" replace />;
};

const SystemProtectedRoute = () => {
  return loadAdminSession() ? <SystemPage /> : <Navigate to="/admin" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<WorkerProtectedRoute />} />
          <Route path="/admin" element={<AdminAccessRoute />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute />} />
          <Route path="/system" element={<SystemProtectedRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
