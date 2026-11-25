import { useState } from "react";
import { MessageSquareWarning, Plus, Search, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const complaintsByCategory = [
  { name: "Vehicle Condition", value: 12, color: "hsl(0, 85%, 50%)" },
  { name: "Late Delivery", value: 8, color: "hsl(0, 0%, 12%)" },
  { name: "Billing Issue", value: 6, color: "hsl(0, 0%, 50%)" },
  { name: "Staff Behavior", value: 3, color: "hsl(0, 70%, 80%)" },
  { name: "Other", value: 4, color: "hsl(0, 0%, 70%)" },
];

const monthlyComplaints = [
  { month: "Jan", opened: 8, resolved: 6 },
  { month: "Feb", opened: 5, resolved: 7 },
  { month: "Mar", opened: 10, resolved: 8 },
  { month: "Apr", opened: 6, resolved: 5 },
  { month: "May", opened: 4, resolved: 6 },
  { month: "Jun", opened: 7, resolved: 7 },
];

const complaints = [
  { id: "CMP-001", date: "2024-03-15", customer: "Ahmed Khan", category: "Vehicle Condition", subject: "AC not working in rented vehicle", priority: "High", status: "Open", assignee: "Kamran" },
  { id: "CMP-002", date: "2024-03-14", customer: "Sara Ali", category: "Billing Issue", subject: "Overcharged for rental period", priority: "Medium", status: "In Progress", assignee: "Bilal" },
  { id: "CMP-003", date: "2024-03-13", customer: "Usman Tariq", category: "Late Delivery", subject: "Vehicle delivered 3 hours late", priority: "Low", status: "Resolved", assignee: "Farhan" },
  { id: "CMP-004", date: "2024-03-12", customer: "Fatima Noor", category: "Vehicle Condition", subject: "Scratches found on delivery", priority: "High", status: "Open", assignee: "Hassan" },
  { id: "CMP-005", date: "2024-03-11", customer: "Imran Shah", category: "Staff Behavior", subject: "Rude behavior by delivery staff", priority: "Medium", status: "In Progress", assignee: "Farhan" },
];

const Complaints = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = complaints.filter(c => c.customer.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Complaints</h1>
          <p className="text-sm text-muted-foreground">Track and resolve customer complaints efficiently.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Log Complaint
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Log New Complaint</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Customer</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Customer name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Category</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Vehicle Condition</option><option>Late Delivery</option><option>Billing Issue</option><option>Staff Behavior</option><option>Other</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Priority</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Low</option><option>Medium</option><option>High</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Assign To</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Staff name" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Subject</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Brief description" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Details</label><textarea className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 h-20 resize-none" placeholder="Full complaint details..." /></div>
            <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Submit</button></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Complaints</p>
          <p className="text-2xl font-heading font-bold mt-1">33</p>
          <p className="text-xs opacity-80 mt-1">This quarter</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Open</p>
          <p className="text-2xl font-heading font-bold mt-1">8</p>
          <p className="text-xs text-red-600 mt-1">Needs attention</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-heading font-bold mt-1">5</p>
          <p className="text-xs text-yellow-600 mt-1">Being handled</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-heading font-bold mt-1">20</p>
          <p className="text-xs text-green-600 mt-1">60% resolution rate</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Complaints</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyComplaints}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="opened" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Opened" />
              <Bar dataKey="resolved" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">By Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={complaintsByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {complaintsByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {complaintsByCategory.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-muted-foreground truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Subject</th>
              <th className="p-3 font-medium">Priority</th>
              <th className="p-3 font-medium">Assignee</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="p-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                <td className="p-3 text-muted-foreground">{c.date}</td>
                <td className="p-3 font-medium">{c.customer}</td>
                <td className="p-3 text-xs text-muted-foreground">{c.category}</td>
                <td className="p-3 text-sm max-w-[200px] truncate">{c.subject}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.priority === "High" ? "bg-red-100 text-red-700" :
                    c.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>{c.priority}</span>
                </td>
                <td className="p-3 text-muted-foreground">{c.assignee}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.status === "Open" ? "bg-red-100 text-red-700" :
                    c.status === "In Progress" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaints;