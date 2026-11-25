import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SpeedometerLoader from "./SpeedometerLoader";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardLayout = () => {
  const { user, profile, roles, signOut } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [dateTime, setDateTime] = useState(new Date());
  const [routeLoading, setRouteLoading] = useState(false);


  useEffect(() => {
    const t = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Speedometer route transition
  useEffect(() => {
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);


  const handleLogout = async () => { await signOut(); };

  const displayName = profile?.full_name || profile?.username || user?.email?.split("@")[0] || "User";
  const roleLabel = roles[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : "Staff";

  return (
    <div className="min-h-screen bg-background dashboard-bg">
      <AppSidebar onLogout={handleLogout} />
      <div className="ml-[240px] transition-all duration-300 relative">
        {routeLoading && (
          <div className="route-loader">
            <SpeedometerLoader label="Revving up…" duration={650} />
          </div>
        )}

        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search vehicles, customers, invoices..." className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">{dateTime.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{dateTime.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-3 border-l border-border hover:opacity-80">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="text-sm text-left">
                    <p className="font-medium text-foreground leading-tight">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{roleLabel}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/settings")}><User className="h-4 w-4 mr-2" /> Profile & Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500"><LogOut className="h-4 w-4 mr-2" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default DashboardLayout;
