import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Fleet from "./pages/Fleet";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import Rentals from "./pages/Rentals";
import Finance from "./pages/Finance";
import Payments from "./pages/Payments";
import Imports from "./pages/Imports";
import Inspections from "./pages/Inspections";
import Customers from "./pages/Customers";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import Staff from "./pages/Staff";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Complaints from "./pages/Complaints";
import Investors from "./pages/Investors";
import Settings from "./pages/Settings";
import Invoices from "./pages/Invoices";
import Financials from "./pages/Financials";
import VehicleInOut from "./pages/VehicleInOut";
import Stock from "./pages/Stock";
import Documents from "./pages/Documents";
import Maintenance from "./pages/Maintenance";
import Receipts from "./pages/Receipts";
import DocumentGenerator from "./pages/DocumentGenerator";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Gate = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">Loading…</div>;
  if (!user) return <Login />;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchases" element={<Purchase />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/imports" element={<Imports />} />
          <Route path="/inspections" element={<Inspections />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/vehicle-in-out" element={<VehicleInOut />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/document-generator" element={<DocumentGenerator />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
