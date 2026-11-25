import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

const originData = [{ name: "Japan", value: 18, color: "hsl(0, 85%, 50%)" },{ name: "UAE", value: 8, color: "hsl(0, 0%, 12%)" },{ name: "UK", value: 4, color: "hsl(0, 0%, 50%)" },{ name: "USA", value: 2, color: "hsl(0, 70%, 80%)" }];
const monthlyCosts = [{ month: "Jan", customs: 2.1, duty: 1.5 },{ month: "Feb", customs: 1.8, duty: 1.2 },{ month: "Mar", customs: 3.2, duty: 2.1 },{ month: "Apr", customs: 2.5, duty: 1.8 },{ month: "May", customs: 2.8, duty: 2.0 },{ month: "Jun", customs: 3.5, duty: 2.4 }];
const shipments = [
  { id: "IMP-001", vehicle: "Toyota Land Cruiser 2024", origin: "Japan", port: "Karachi", customs: "1,200,000", duty: "800,000", status: "In Transit", eta: "2024-04-01" },
  { id: "IMP-002", vehicle: "Honda Vezel 2024", origin: "Japan", port: "Karachi", customs: "450,000", duty: "320,000", status: "Customs", eta: "2024-03-25" },
  { id: "IMP-003", vehicle: "Toyota Prado 2023", origin: "UAE", port: "Karachi", customs: "900,000", duty: "650,000", status: "Cleared", eta: "2024-03-10" },
  { id: "IMP-004", vehicle: "BMW X5 2024", origin: "UK", port: "Karachi", customs: "1,500,000", duty: "1,100,000", status: "In Transit", eta: "2024-04-15" },
];

const Imports = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Vehicle Imports</h1><p className="text-sm text-muted-foreground">Track shipments, customs, and duties.</p></div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"><Plus className="h-4 w-4" /> Add Shipment</button>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add New Shipment</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Vehicle details" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Origin Country</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Japan</option><option>UAE</option><option>UK</option><option>USA</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">ETA</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Customs (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Duty (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div className="flex items-end"><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full">Save Shipment</button></div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4"><p className="text-xs uppercase tracking-wider opacity-70">Total Imports</p><p className="text-2xl font-heading font-bold mt-1">32</p><p className="text-xs opacity-80 mt-1">This year</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">In Transit</p><p className="text-2xl font-heading font-bold mt-1">5</p><p className="text-xs text-blue-600 mt-1">On the way</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Customs</p><p className="text-2xl font-heading font-bold mt-1">PKR 15.9M</p><p className="text-xs text-muted-foreground mt-1">This year</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Cost/Vehicle</p><p className="text-2xl font-heading font-bold mt-1">PKR 2.1M</p><p className="text-xs text-muted-foreground mt-1">Import + duties</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5"><h2 className="font-heading font-semibold mb-4">Import Costs (PKR M)</h2><ResponsiveContainer width="100%" height={220}><BarChart data={monthlyCosts}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="customs" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Customs" /><Bar dataKey="duty" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Duty" /></BarChart></ResponsiveContainer></div>
        <div className="bg-card border border-border rounded-xl p-5"><h2 className="font-heading font-semibold mb-4">By Origin</h2><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={originData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{originData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="grid grid-cols-2 gap-2 mt-2">{originData.map(o => (<div key={o.name} className="flex items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: o.color }} /><span className="text-muted-foreground">{o.name}</span><span className="font-semibold ml-auto">{o.value}</span></div>))}</div></div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground"><th className="p-3 font-medium">ID</th><th className="p-3 font-medium">Vehicle</th><th className="p-3 font-medium">Origin</th><th className="p-3 font-medium">Customs</th><th className="p-3 font-medium">Duty</th><th className="p-3 font-medium">ETA</th><th className="p-3 font-medium">Status</th></tr></thead>
        <tbody>{shipments.map(s => (<tr key={s.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"><td className="p-3 font-mono text-xs text-muted-foreground">{s.id}</td><td className="p-3 font-medium">{s.vehicle}</td><td className="p-3 text-muted-foreground">{s.origin}</td><td className="p-3">PKR {s.customs}</td><td className="p-3">PKR {s.duty}</td><td className="p-3 text-muted-foreground">{s.eta}</td><td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === "In Transit" ? "bg-blue-100 text-blue-700" : s.status === "Customs" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{s.status}</span></td></tr>))}</tbody></table>
      </div>
    </div>
  );
};

export default Imports;
