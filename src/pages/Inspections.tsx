import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const scoreDistribution = [{ range: "90-100", count: 12 },{ range: "80-89", count: 8 },{ range: "70-79", count: 5 },{ range: "60-69", count: 3 },{ range: "<60", count: 2 }];
const inspections = [
  { id: "INS-001", vehicle: "Honda Civic 2023 - LHR-5678", date: "2024-03-14", type: "Pre-Rental", score: 92, inspector: "Ali Raza", status: "Passed" },
  { id: "INS-002", vehicle: "Toyota Hilux 2023 - KHI-3456", date: "2024-03-13", type: "Post-Rental", score: 78, inspector: "Kamran", status: "Issues Found" },
  { id: "INS-003", vehicle: "Suzuki Alto 2024 - ISB-9012", date: "2024-03-12", type: "Purchase", score: 95, inspector: "Ali Raza", status: "Passed" },
  { id: "INS-004", vehicle: "Honda City 2024 - LHR-7890", date: "2024-03-11", type: "Maintenance", score: 65, inspector: "Bilal", status: "Failed" },
  { id: "INS-005", vehicle: "Toyota Yaris 2023 - ISB-2345", date: "2024-03-10", type: "Pre-Rental", score: 88, inspector: "Ali Raza", status: "Passed" },
];

const Inspections = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Inspections</h1><p className="text-sm text-muted-foreground">Vehicle condition tracking and inspection reports.</p></div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"><Plus className="h-4 w-4" /> New Inspection</button>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Create New Inspection</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Select vehicle" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Type</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Pre-Rental</option><option>Post-Rental</option><option>Purchase</option><option>Maintenance</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Inspector</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Inspector name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Score (0-100)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Notes</label><textarea className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 h-20 resize-none" placeholder="Inspection notes..." /></div>
            <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Submit</button></div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4"><p className="text-xs uppercase tracking-wider opacity-70">Total Inspections</p><p className="text-2xl font-heading font-bold mt-1">30</p><p className="text-xs opacity-80 mt-1">This month</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Passed</p><p className="text-2xl font-heading font-bold mt-1">22</p><p className="text-xs text-green-600 mt-1">73% pass rate</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Score</p><p className="text-2xl font-heading font-bold mt-1">84%</p><p className="text-xs text-muted-foreground mt-1">Across all</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Issues Found</p><p className="text-2xl font-heading font-bold mt-1">6</p><p className="text-xs text-yellow-600 mt-1">Requires attention</p></div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5"><h2 className="font-heading font-semibold mb-4">Score Distribution</h2><ResponsiveContainer width="100%" height={200}><BarChart data={scoreDistribution}><XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="count" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground"><th className="p-3 font-medium">ID</th><th className="p-3 font-medium">Vehicle</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Type</th><th className="p-3 font-medium">Score</th><th className="p-3 font-medium">Inspector</th><th className="p-3 font-medium">Status</th></tr></thead>
        <tbody>{inspections.map(ins => (<tr key={ins.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"><td className="p-3 font-mono text-xs text-muted-foreground">{ins.id}</td><td className="p-3 font-medium">{ins.vehicle}</td><td className="p-3 text-muted-foreground">{ins.date}</td><td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{ins.type}</span></td><td className="p-3"><div className="flex items-center gap-2"><div className="w-16 h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${ins.score >= 90 ? "bg-green-500" : ins.score >= 70 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${ins.score}%` }} /></div><span className="font-bold text-xs">{ins.score}%</span></div></td><td className="p-3 text-muted-foreground">{ins.inspector}</td><td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${ins.status === "Passed" ? "bg-green-100 text-green-700" : ins.status === "Failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{ins.status}</span></td></tr>))}</tbody></table>
      </div>
    </div>
  );
};
export default Inspections;
