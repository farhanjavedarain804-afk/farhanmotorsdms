import { useState } from "react";
import { Wrench, Plus, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const typeBreakdown = [
  { name: "Oil Change", value: 32, color: "hsl(0, 85%, 50%)" },
  { name: "Tires", value: 18, color: "hsl(0, 0%, 12%)" },
  { name: "Brakes", value: 12, color: "hsl(0, 0%, 50%)" },
  { name: "AC Service", value: 15, color: "hsl(0, 70%, 80%)" },
  { name: "General", value: 23, color: "hsl(0, 0%, 70%)" },
];

const monthlyCost = [
  { month: "Jan", cost: 180 },
  { month: "Feb", cost: 150 },
  { month: "Mar", cost: 220 },
  { month: "Apr", cost: 190 },
  { month: "May", cost: 250 },
  { month: "Jun", cost: 210 },
];

const records = [
  { id: "MNT-001", date: "2024-03-15", vehicle: "Honda Civic 2023", plate: "LHR-5678", type: "Oil Change", cost: "8,500", vendor: "AutoCare Lahore", nextDue: "2024-06-15", status: "Completed" },
  { id: "MNT-002", date: "2024-03-14", vehicle: "Toyota Hilux 2023", plate: "KHI-3456", type: "Brake Pads", cost: "22,000", vendor: "Speed Motors", nextDue: "2024-09-14", status: "Completed" },
  { id: "MNT-003", date: "2024-03-13", vehicle: "Suzuki Alto 2024", plate: "ISB-9012", type: "AC Service", cost: "12,000", vendor: "Cool Air", nextDue: "2024-09-13", status: "In Progress" },
  { id: "MNT-004", date: "2024-03-12", vehicle: "Honda City 2024", plate: "LHR-7890", type: "Tires", cost: "45,000", vendor: "TyrePro", nextDue: "2025-03-12", status: "Scheduled" },
  { id: "MNT-005", date: "2024-03-10", vehicle: "Toyota Corolla 2024", plate: "LHR-1234", type: "General Service", cost: "15,000", vendor: "AutoCare Lahore", nextDue: "2024-06-10", status: "Completed" },
];

const Maintenance = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = records.filter(r => r.vehicle.toLowerCase().includes(search.toLowerCase()) || r.plate.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Maintenance & Service</h1>
          <p className="text-sm text-muted-foreground">Track vehicle maintenance, service history, and upcoming schedules.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Record
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add Maintenance Record</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Select vehicle" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Service Type</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Oil Change</option><option>Tires</option><option>Brakes</option><option>AC Service</option><option>General Service</option><option>Body Work</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Cost (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Vendor</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Vendor name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Date</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Next Due Date</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save Record</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Services</p>
          <p className="text-2xl font-heading font-bold mt-1">100</p>
          <p className="text-xs opacity-80 mt-1">This year</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Monthly Cost</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 210K</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Scheduled</p>
          <p className="text-2xl font-heading font-bold mt-1">6</p>
          <p className="text-xs text-blue-600 mt-1">Upcoming this week</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue</p>
          <p className="text-2xl font-heading font-bold mt-1">3</p>
          <p className="text-xs text-red-600 mt-1">Past due date</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Service Types</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{typeBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">{typeBreakdown.map(t => (<div key={t.name} className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} /><span className="text-muted-foreground">{t.name}</span><span className="font-semibold ml-auto">{t.value}%</span></div>))}</div>
        </div>
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Cost Trend (PKR K)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyCost}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="cost" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search maintenance records..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Vehicle</th><th className="p-3 font-medium">Type</th><th className="p-3 font-medium">Cost</th><th className="p-3 font-medium">Vendor</th><th className="p-3 font-medium">Next Due</th><th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="p-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="p-3 text-muted-foreground">{r.date}</td>
                <td className="p-3 font-medium">{r.vehicle}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{r.type}</span></td>
                <td className="p-3 font-semibold">PKR {r.cost}</td>
                <td className="p-3 text-muted-foreground">{r.vendor}</td>
                <td className="p-3 text-xs text-muted-foreground">{r.nextDue}</td>
                <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${r.status === "Completed" ? "bg-green-100 text-green-700" : r.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
