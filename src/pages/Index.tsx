import { useState } from "react";
import { Car, ShoppingCart, Key, Users, Landmark, ArrowUpRight, Clock, Bell, AlertTriangle, Info, CheckCircle, XCircle, CreditCard, CarFront } from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from "recharts";

const monthlyData = [
  { month: "Jan", sales: 12, rentals: 34, finance: 8 },
  { month: "Feb", sales: 8,  rentals: 28, finance: 5 },
  { month: "Mar", sales: 15, rentals: 42, finance: 11 },
  { month: "Apr", sales: 10, rentals: 38, finance: 9 },
  { month: "May", sales: 18, rentals: 45, finance: 14 },
  { month: "Jun", sales: 14, rentals: 50, finance: 17 },
];

const fleetData = [
  { name: "Available",   value: 28, color: "hsl(0, 85%, 50%)" },
  { name: "Rented",      value: 42, color: "hsl(0, 0%, 12%)" },
  { name: "Maintenance", value: 8,  color: "hsl(0, 0%, 70%)" },
  { name: "Reserved",    value: 12, color: "hsl(0, 70%, 80%)" },
];

const recentDeals = [
  { id: "DL-001", customer: "Ahmed Khan",  type: "Sale",    vehicle: "Toyota Corolla 2024",  amount: "PKR 5,200,000", status: "Completed" },
  { id: "DL-002", customer: "Sara Ali",    type: "Rental",  vehicle: "Honda Civic 2023",     amount: "PKR 8,000/day", status: "Active" },
  { id: "DL-003", customer: "Usman Tariq", type: "Finance", vehicle: "Suzuki Alto 2024",     amount: "PKR 2,800,000", status: "Pending" },
  { id: "DL-004", customer: "Fatima Noor", type: "Rental",  vehicle: "Toyota Hilux 2023",   amount: "PKR 15,000/day",status: "Active" },
  { id: "DL-005", customer: "Ali Hassan",  type: "Sale",    vehicle: "Honda City 2024",      amount: "PKR 4,500,000", status: "Completed" },
];

const upcomingReturns = [
  { vehicle: "Civic 2023 – LHR-1234",   customer: "Sara Ali",    due: "Today",     urgent: true },
  { vehicle: "Hilux 2023 – ISB-5678",   customer: "Fatima Noor", due: "Tomorrow",  urgent: false },
  { vehicle: "Corolla 2024 – KHI-9012", customer: "Bilal Ahmed", due: "In 3 days", urgent: false },
];

const overdueItems = [
  { id: "OD-001", type: "payment",  icon: CreditCard,  customer: "Usman Tariq",  detail: "EMI Installment — Month 3",     amount: "PKR 42,000",  overdueDays: 12, severity: "high" },
  { id: "OD-002", type: "rental",   icon: CarFront,    customer: "Kamran Malik",  detail: "Honda BRV 2022 – ISB-4433",    amount: "PKR 90,000",  overdueDays: 5,  severity: "high" },
  { id: "OD-003", type: "payment",  icon: CreditCard,  customer: "Bilal Ahmed",   detail: "Sale Balance Payment",         amount: "PKR 150,000", overdueDays: 3,  severity: "medium" },
  { id: "OD-004", type: "rental",   icon: CarFront,    customer: "Sana Sheikh",   detail: "Suzuki Cultus 2023 – LHR-7712",amount: "PKR 24,000",  overdueDays: 2,  severity: "medium" },
  { id: "OD-005", type: "payment",  icon: CreditCard,  customer: "Tariq Mehmood", detail: "Rental Security Deposit Refund",amount: "PKR 30,000",  overdueDays: 1,  severity: "low" },
];

const alerts = [
  { id: 1, type: "danger",   message: "3 vehicles due for service this week",              time: "2 hrs ago" },
  { id: 2, type: "warning",  message: "Loan installment overdue — Usman Tariq (OD-001)",  time: "5 hrs ago" },
  { id: 3, type: "info",     message: "New customer registration: Bilal Ahmed",             time: "Today" },
  { id: 4, type: "success",  message: "Payment received — PKR 150,000 from Sara Ali",     time: "Yesterday" },
  { id: 5, type: "warning",  message: "Vehicle insurance expiring — LHR-9977 in 7 days",  time: "Yesterday" },
];

const alertMeta: Record<string, { icon: typeof Bell; cls: string; dot: string }> = {
  warning: { icon: AlertTriangle, cls: "bg-yellow-50 border-yellow-200 text-yellow-800", dot: "bg-yellow-400" },
  danger:  { icon: XCircle,       cls: "bg-red-50   border-red-200   text-red-800",      dot: "bg-red-500"   },
  info:    { icon: Info,          cls: "bg-blue-50  border-blue-200  text-blue-800",     dot: "bg-blue-400"  },
  success: { icon: CheckCircle,   cls: "bg-green-50 border-green-200 text-green-800",    dot: "bg-green-500" },
};

const severityStyle: Record<string, string> = {
  high:   "border-l-4 border-l-red-500   bg-red-50/60",
  medium: "border-l-4 border-l-yellow-400 bg-yellow-50/60",
  low:    "border-l-4 border-l-blue-300  bg-blue-50/40",
};

const Dashboard = () => {
  const [selectedDeal,   setSelectedDeal]   = useState<string | null>(null);
  const [hoveredReturn,  setHoveredReturn]  = useState<number | null>(null);
  const [hoveredOverdue, setHoveredOverdue] = useState<string | null>(null);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" /> Export
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            + New Deal
          </button>
        </div>
      </div>

      {/* Stat Cards — all white, hover → red */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Car}          title="Total Fleet"       value={90}    change="4 new this month"     changeType="up" />
        <StatCard icon={Key}          title="Active Rentals"    value={42}    change="+12% from last month" changeType="up" />
        <StatCard icon={ShoppingCart} title="Sales This Month"  value={18}    change="+5 from last month"   changeType="up" />
        <StatCard icon={Users}        title="Customers"         value={340}   change="15 new this week"     changeType="up" />
        <StatCard icon={Landmark}     title="Revenue (PKR)"     value="8.2M"  change="+22% vs last month"   changeType="up" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Line Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 animate-fade-in">
          <h2 className="font-heading font-semibold text-foreground mb-4">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(0,0%,90%)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <Line type="monotone" dataKey="sales"   stroke="hsl(0,85%,50%)"  strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="rentals" stroke="hsl(0,0%,12%)"   strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="finance" stroke="hsl(0,60%,70%)"  strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
          <h2 className="font-heading font-semibold text-foreground mb-4">Fleet Status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={fleetData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {fleetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(0,0%,90%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {fleetData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold text-foreground ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1 — Recent Deals + Upcoming Returns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Deals */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Recent Deals</h2>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    onClick={() => setSelectedDeal(selectedDeal === deal.id ? null : deal.id)}
                    className={`border-b border-border/50 last:border-0 cursor-pointer transition-all duration-200 ${
                      selectedDeal === deal.id
                        ? "bg-red-50 border-l-2 border-l-primary"
                        : "hover:bg-red-50/70"
                    }`}
                  >
                    <td className="py-2.5 font-mono text-xs text-muted-foreground">{deal.id}</td>
                    <td className="py-2.5 font-medium">{deal.customer}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        deal.type === "Sale"    ? "bg-accent text-accent-foreground" :
                        deal.type === "Rental"  ? "bg-secondary/10 text-secondary"  :
                        "bg-muted text-muted-foreground"
                      }`}>{deal.type}</span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{deal.vehicle}</td>
                    <td className="py-2.5 font-medium">{deal.amount}</td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium ${
                        deal.status === "Completed" ? "text-green-600" :
                        deal.status === "Active"    ? "text-primary"   :
                        "text-muted-foreground"
                      }`}>{deal.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Returns */}
        <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Upcoming Returns</h2>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {upcomingReturns.map((item, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoveredReturn(i)}
                onMouseLeave={() => setHoveredReturn(null)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  hoveredReturn === i
                    ? "border-primary bg-red-50"
                    : item.urgent
                    ? "border-primary/30 bg-accent/50"
                    : "border-border bg-muted/30"
                }`}
              >
                <p className="font-medium text-sm text-foreground">{item.vehicle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.customer}</p>
                <p className={`text-xs font-semibold mt-1 ${
                  hoveredReturn === i || item.urgent ? "text-primary" : "text-muted-foreground"
                }`}>{item.due}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — Overdue + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Overdue Section */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-semibold text-foreground">Overdue</h2>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                {overdueItems.length} Items
              </span>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-2">
            {overdueItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredOverdue(item.id)}
                  onMouseLeave={() => setHoveredOverdue(null)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    hoveredOverdue === item.id
                      ? "bg-red-50 border-primary/40 shadow-sm"
                      : severityStyle[item.severity]
                  }`}
                >
                  {/* Icon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 transition-colors duration-200 ${
                    hoveredOverdue === item.id ? "bg-red-100" :
                    item.severity === "high"   ? "bg-red-100"    :
                    item.severity === "medium" ? "bg-yellow-100" : "bg-blue-100"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      hoveredOverdue === item.id ? "text-primary" :
                      item.severity === "high"   ? "text-red-600"    :
                      item.severity === "medium" ? "text-yellow-600" : "text-blue-500"
                    }`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-foreground truncate">{item.customer}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                        item.type === "payment" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {item.type === "payment" ? "💳 Payment" : "🚗 Rental"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.detail}</p>
                  </div>

                  {/* Amount + Days */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-foreground">{item.amount}</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${
                      item.severity === "high" ? "text-red-600" :
                      item.severity === "medium" ? "text-yellow-600" : "text-blue-500"
                    }`}>
                      {item.overdueDays}d overdue
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-foreground">Alerts</h2>
            <span className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Bell className="h-3 w-3" /> {alerts.filter(a => a.type === "warning" || a.type === "danger").length}
            </span>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => {
              const meta = alertMeta[alert.type];
              const Icon = meta.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${meta.cls} transition-all duration-200 hover:shadow-sm`}
                >
                  <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-snug">{alert.message}</p>
                    <p className="opacity-60 mt-0.5">{alert.time}</p>
                  </div>
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 opacity-70" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
