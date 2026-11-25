import { useState } from "react";
import { Landmark, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const loans = [
  { id: "FN-001", customer: "Usman Tariq", vehicle: "Suzuki Alto 2024", amount: "2,800,000", emi: "58,000", tenure: "48 months", paid: "12/48", status: "Active" },
  { id: "FN-002", customer: "Hassan Raza", vehicle: "Toyota Yaris 2023", amount: "3,600,000", emi: "78,000", tenure: "48 months", paid: "6/48", status: "Active" },
  { id: "FN-003", customer: "Nadia Hussain", vehicle: "Honda City 2024", amount: "4,200,000", emi: "92,000", tenure: "48 months", paid: "48/48", status: "Completed" },
  { id: "FN-004", customer: "Imran Shah", vehicle: "Suzuki Cultus 2024", amount: "2,200,000", emi: "48,000", tenure: "48 months", paid: "3/48", status: "Overdue" },
];

const Finance = () => {
  const [showForm, setShowForm] = useState(false);
  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Vehicle Finance</h1>
        <p className="text-sm text-muted-foreground">Loan management, EMI tracking, and payment schedules.</p>
      </div>
      <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
        <Plus className="h-4 w-4" /> New Loan
      </button>
    </div>

    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Create New Loan</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div><label className="text-xs text-muted-foreground mb-1 block">Customer</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Customer name" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Select vehicle" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Loan Amount (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">EMI (PKR/mo)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Tenure</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>12 months</option><option>24 months</option><option>36 months</option><option>48 months</option></select></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Start Date</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Create Loan</button></div>
        </div>
      </DialogContent>
    </Dialog>

    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Active Loans", value: "24", accent: true },
        { label: "Total Disbursed", value: "PKR 62M" },
        { label: "Monthly Collections", value: "PKR 3.2M" },
        { label: "Overdue Payments", value: "5" },
      ].map((s, i) => (
        <div key={i} className={`rounded-xl p-4 ${s.accent ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
          <p className={`text-xs uppercase tracking-wider ${s.accent ? "opacity-70" : "text-muted-foreground"}`}>{s.label}</p>
          <p className="text-2xl font-heading font-bold mt-1">{s.value}</p>
        </div>
      ))}
    </div>

    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-xs text-muted-foreground">
            <th className="p-3 font-medium">ID</th>
            <th className="p-3 font-medium">Customer</th>
            <th className="p-3 font-medium">Vehicle</th>
            <th className="p-3 font-medium">Loan Amount</th>
            <th className="p-3 font-medium">EMI</th>
            <th className="p-3 font-medium">Progress</th>
            <th className="p-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
              <td className="p-3 font-mono text-xs text-muted-foreground">{l.id}</td>
              <td className="p-3 font-medium">{l.customer}</td>
              <td className="p-3 text-muted-foreground">{l.vehicle}</td>
              <td className="p-3 font-semibold">PKR {l.amount}</td>
              <td className="p-3">PKR {l.emi}/mo</td>
              <td className="p-3 text-xs text-muted-foreground">{l.paid}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  l.status === "Active" ? "bg-green-100 text-green-700" :
                  l.status === "Overdue" ? "bg-red-100 text-red-700" :
                  "bg-muted text-muted-foreground"
                }`}>{l.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Finance;
