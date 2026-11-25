import { useState } from "react";
import { Wallet, Download, Plus, Calculator } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const monthlyPayroll = [
  { month: "Jan", salary: 1.8, bonus: 0.2 },
  { month: "Feb", salary: 1.8, bonus: 0.15 },
  { month: "Mar", salary: 1.85, bonus: 0.3 },
  { month: "Apr", salary: 1.85, bonus: 0.1 },
  { month: "May", salary: 1.9, bonus: 0.25 },
  { month: "Jun", salary: 1.9, bonus: 0.35 },
];

const costTrend = [
  { month: "Jan", cost: 2.0 },
  { month: "Feb", cost: 1.95 },
  { month: "Mar", cost: 2.15 },
  { month: "Apr", cost: 1.95 },
  { month: "May", cost: 2.15 },
  { month: "Jun", cost: 2.25 },
];

const payrollData = [
  { id: "STF-001", name: "Farhan Ali", department: "Sales", baseSalary: "85,000", bonus: "15,000", deductions: "5,000", netPay: "95,000", status: "Paid" },
  { id: "STF-002", name: "Kamran Yousaf", department: "Rentals", baseSalary: "65,000", bonus: "10,000", deductions: "3,000", netPay: "72,000", status: "Paid" },
  { id: "STF-003", name: "Bilal Ahmed", department: "Finance", baseSalary: "75,000", bonus: "8,000", deductions: "4,000", netPay: "79,000", status: "Paid" },
  { id: "STF-004", name: "Usman Tariq", department: "Sales", baseSalary: "55,000", bonus: "12,000", deductions: "2,500", netPay: "64,500", status: "Pending" },
  { id: "STF-005", name: "Hassan Raza", department: "Workshop", baseSalary: "70,000", bonus: "5,000", deductions: "3,500", netPay: "71,500", status: "Paid" },
  { id: "STF-006", name: "Nadia Hussain", department: "Admin", baseSalary: "45,000", bonus: "3,000", deductions: "2,000", netPay: "46,000", status: "Pending" },
];

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState("March 2024");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Payroll</h1>
          <p className="text-sm text-muted-foreground">Salary processing, bonuses, and deductions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Payslips
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Calculator className="h-4 w-4" /> Process Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Payroll</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 1.9M</p>
          <p className="text-xs opacity-80 mt-1">{selectedMonth}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Bonuses</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 180K</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Deductions</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 95K</p>
          <p className="text-xs text-muted-foreground mt-1">Tax + Advances</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-heading font-bold mt-1">4</p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Payroll Breakdown (PKR M)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyPayroll}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="salary" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Base Salary" stackId="a" />
              <Bar dataKey="bonus" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Bonus" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Payroll Cost Trend (PKR M)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={costTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="cost" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-semibold">Payroll — {selectedMonth}</h2>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm">
            <option>March 2024</option><option>February 2024</option><option>January 2024</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Department</th>
              <th className="p-3 font-medium">Base Salary</th>
              <th className="p-3 font-medium">Bonus</th>
              <th className="p-3 font-medium">Deductions</th>
              <th className="p-3 font-medium">Net Pay</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map(p => (
              <tr key={p.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.department}</td>
                <td className="p-3">PKR {p.baseSalary}</td>
                <td className="p-3 text-green-600">+PKR {p.bonus}</td>
                <td className="p-3 text-red-600">-PKR {p.deductions}</td>
                <td className="p-3 font-semibold">PKR {p.netPay}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;