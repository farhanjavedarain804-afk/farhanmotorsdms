import { useState } from "react";
import { Users, Plus, Search, Phone, Mail, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const departmentData = [
  { name: "Sales", value: 8, color: "hsl(0, 85%, 50%)" },
  { name: "Rentals", value: 6, color: "hsl(0, 0%, 12%)" },
  { name: "Finance", value: 4, color: "hsl(0, 0%, 50%)" },
  { name: "Admin", value: 3, color: "hsl(0, 70%, 80%)" },
  { name: "Workshop", value: 5, color: "hsl(0, 0%, 70%)" },
];

const performanceData = [
  { name: "Farhan Ali", deals: 12 },
  { name: "Kamran", deals: 9 },
  { name: "Bilal", deals: 8 },
  { name: "Usman", deals: 7 },
  { name: "Hassan", deals: 5 },
];

const staffMembers = [
  { id: "STF-001", name: "Farhan Ali", role: "Sales Manager", department: "Sales", phone: "0321-1234567", email: "farhan@fm.pk", status: "Active", joined: "2020-01-15" },
  { id: "STF-002", name: "Kamran Yousaf", role: "Rental Coordinator", department: "Rentals", phone: "0333-2345678", email: "kamran@fm.pk", status: "Active", joined: "2021-06-01" },
  { id: "STF-003", name: "Bilal Ahmed", role: "Finance Officer", department: "Finance", phone: "0300-3456789", email: "bilal@fm.pk", status: "Active", joined: "2022-03-10" },
  { id: "STF-004", name: "Usman Tariq", role: "Sales Executive", department: "Sales", phone: "0311-4567890", email: "usman@fm.pk", status: "Active", joined: "2023-01-20" },
  { id: "STF-005", name: "Hassan Raza", role: "Workshop Head", department: "Workshop", phone: "0322-5678901", email: "hassan@fm.pk", status: "On Leave", joined: "2019-08-05" },
  { id: "STF-006", name: "Nadia Hussain", role: "Admin Assistant", department: "Admin", phone: "0345-6789012", email: "nadia@fm.pk", status: "Active", joined: "2023-07-15" },
];

const Staff = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = staffMembers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage employees, roles, and departments.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add New Staff Member</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Full Name</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Full name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Role</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Job title" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Department</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Sales</option><option>Rentals</option><option>Finance</option><option>Admin</option><option>Workshop</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="03XX-XXXXXXX" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Email</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="email@fm.pk" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Salary (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save Staff</button></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Staff</p>
          <p className="text-2xl font-heading font-bold mt-1">26</p>
          <p className="text-xs opacity-80 mt-1">Across all departments</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Today</p>
          <p className="text-2xl font-heading font-bold mt-1">22</p>
          <p className="text-xs text-green-600 mt-1">84% attendance</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">On Leave</p>
          <p className="text-2xl font-heading font-bold mt-1">3</p>
          <p className="text-xs text-yellow-600 mt-1">1 sick, 2 casual</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Departments</p>
          <p className="text-2xl font-heading font-bold mt-1">5</p>
          <p className="text-xs text-muted-foreground mt-1">Sales, Rentals, Finance...</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {departmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {departmentData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Top Performers (Deals Closed)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="deals" fill="hsl(0, 85%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Department</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="p-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3 text-muted-foreground">{s.role}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{s.department}</span></td>
                <td className="p-3 text-xs text-muted-foreground">{s.phone}</td>
                <td className="p-3 text-xs text-muted-foreground">{s.joined}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;