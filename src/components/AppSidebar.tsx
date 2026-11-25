import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Car, ShoppingCart, Key, Landmark, Globe,
  ClipboardCheck, Users, BookOpen, BarChart3, Settings, ChevronLeft, ChevronRight,
  CreditCard, UserCheck, Clock, Wallet, MessageSquareWarning, Handshake,
  FileText, TrendingUp, ArrowRightLeft, Package, FolderOpen, Wrench,
  ShoppingBag, LogOut, User, Receipt
} from "lucide-react";
import logo from "@/assets/farhan-motors-logo.png";
import { useState } from "react";

const navSections = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: Car, label: "Fleet", path: "/fleet" },
      { icon: Package, label: "Stock", path: "/stock" },
      { icon: ArrowRightLeft, label: "Vehicle In/Out", path: "/vehicle-in-out" },
    ],
  },
  {
    title: "Business",
    items: [
      { icon: ShoppingCart, label: "Sales", path: "/sales" },
      { icon: ShoppingBag, label: "Purchases", path: "/purchases" },
      { icon: Key, label: "Rentals", path: "/rentals" },
      { icon: FileText, label: "Invoices", path: "/invoices" },
      { icon: Receipt, label: "Document Generator", path: "/document-generator" },

      { icon: Globe, label: "Imports", path: "/imports" },
      { icon: ClipboardCheck, label: "Inspections", path: "/inspections" },
      { icon: Wrench, label: "Maintenance", path: "/maintenance" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: TrendingUp, label: "Financials", path: "/financials" },
      { icon: Landmark, label: "Finance", path: "/finance" },
      { icon: CreditCard, label: "Payments", path: "/payments" },
      { icon: BookOpen, label: "Accounts", path: "/accounts" },
      { icon: Handshake, label: "Investors", path: "/investors" },
    ],
  },
  {
    title: "People",
    items: [
      { icon: Users, label: "Customers", path: "/customers" },
      { icon: UserCheck, label: "Staff", path: "/staff" },
      { icon: Clock, label: "Attendance", path: "/attendance" },
      { icon: Wallet, label: "Payroll", path: "/payroll" },
      { icon: MessageSquareWarning, label: "Complaints", path: "/complaints" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: FolderOpen, label: "Documents", path: "/documents" },
      { icon: BarChart3, label: "Reports", path: "/reports" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

const AppSidebar = ({ onLogout }: { onLogout?: () => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col z-50 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
      <div className="flex items-center justify-center px-4 py-5 border-b border-sidebar-border">
        <img src={logo} alt="Farhan Motors" className="h-10 w-auto object-contain flex-shrink-0 brightness-0 invert" />
      </div>
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && <p className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest text-sidebar-muted font-semibold">{section.title}</p>}
            {collapsed && <div className="h-2" />}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
          <User className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>My Profile</span>}
        </NavLink>
        {onLogout && (
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-xs">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
