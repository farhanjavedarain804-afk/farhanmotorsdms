import { BarChart3, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 6.2, expenses: 4.8 },
  { month: "Feb", revenue: 5.8, expenses: 4.2 },
  { month: "Mar", revenue: 8.2, expenses: 5.6 },
  { month: "Apr", revenue: 7.1, expenses: 5.1 },
  { month: "May", revenue: 9.4, expenses: 6.2 },
  { month: "Jun", revenue: 8.8, expenses: 5.8 },
];

const Reports = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Business intelligence and performance insights.</p>
      </div>
      <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2">
        <Download className="h-4 w-4" /> Export PDF
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-heading font-semibold mb-4">Revenue vs Expenses (PKR M)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="revenue" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="expenses" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-heading font-semibold mb-4">Profit Trend (PKR M)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData.map(d => ({ ...d, profit: +(d.revenue - d.expenses).toFixed(1) }))}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="profit" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Vehicle ROI", value: "24%", sub: "Average across fleet" },
        { label: "Rental Utilization", value: "78%", sub: "Fleet usage rate" },
        { label: "Avg Deal Time", value: "3.2 days", sub: "From inquiry to close" },
        { label: "Customer Retention", value: "68%", sub: "Repeat customers" },
      ].map((r, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{r.label}</p>
          <p className="text-2xl font-heading font-bold mt-1">{r.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{r.sub}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Reports;
