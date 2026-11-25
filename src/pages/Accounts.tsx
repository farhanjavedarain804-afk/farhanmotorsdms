import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const monthlyPL = [{ month: "Jan", income: 6.2, expense: 4.8 },{ month: "Feb", income: 5.8, expense: 4.2 },{ month: "Mar", income: 8.2, expense: 5.6 },{ month: "Apr", income: 7.1, expense: 5.1 },{ month: "May", income: 9.4, expense: 6.2 },{ month: "Jun", income: 8.8, expense: 5.8 }];
const cashFlow = [{ month: "Jan", flow: 1.4 },{ month: "Feb", flow: 1.6 },{ month: "Mar", flow: 2.6 },{ month: "Apr", flow: 2.0 },{ month: "May", flow: 3.2 },{ month: "Jun", flow: 3.0 }];
const transactions = [
  { id: "TX-001", date: "2024-03-15", description: "Vehicle Sale - Toyota Corolla", type: "Income", amount: "5,200,000", account: "Sales" },
  { id: "TX-002", date: "2024-03-14", description: "Vehicle Purchase - Honda City", type: "Expense", amount: "4,100,000", account: "Purchase" },
  { id: "TX-003", date: "2024-03-14", description: "Rental Income - 5 vehicles", type: "Income", amount: "180,000", account: "Rental" },
  { id: "TX-004", date: "2024-03-13", description: "Office Rent - March", type: "Expense", amount: "150,000", account: "Overhead" },
  { id: "TX-005", date: "2024-03-13", description: "EMI Collection - 8 customers", type: "Income", amount: "520,000", account: "Finance" },
  { id: "TX-006", date: "2024-03-12", description: "Vehicle Maintenance - 3 cars", type: "Expense", amount: "85,000", account: "Maintenance" },
];

const Accounts = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Accounts & Ledger</h1><p className="text-sm text-muted-foreground">Income, expenses, and financial tracking.</p></div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2"><Download className="h-4 w-4" /> Export</button>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"><Plus className="h-4 w-4" /> Add Entry</button>
        </div>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add Ledger Entry</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Description</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Transaction description" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Type</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Income</option><option>Expense</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Amount (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Account</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Sales</option><option>Purchase</option><option>Rental</option><option>Finance</option><option>Overhead</option><option>Maintenance</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Date</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save Entry</button></div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4"><p className="text-xs uppercase tracking-wider opacity-70">Total Income</p><p className="text-2xl font-heading font-bold mt-1">PKR 12.8M</p><p className="text-xs opacity-80 mt-1">This quarter</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Expenses</p><p className="text-2xl font-heading font-bold mt-1">PKR 9.4M</p><p className="text-xs text-muted-foreground mt-1">This quarter</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Net Profit</p><p className="text-2xl font-heading font-bold mt-1 text-green-600">PKR 3.4M</p><p className="text-xs text-green-600 mt-1">↑ 18%</p></div>
        <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">Cash in Hand</p><p className="text-2xl font-heading font-bold mt-1">PKR 4.2M</p><p className="text-xs text-muted-foreground mt-1">Available</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5"><h2 className="font-heading font-semibold mb-4">Income vs Expenses (PKR M)</h2><ResponsiveContainer width="100%" height={220}><BarChart data={monthlyPL}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="income" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Income" /><Bar dataKey="expense" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Expenses" /></BarChart></ResponsiveContainer></div>
        <div className="bg-card border border-border rounded-xl p-5"><h2 className="font-heading font-semibold mb-4">Cash Flow (PKR M)</h2><ResponsiveContainer width="100%" height={220}><LineChart data={cashFlow}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Line type="monotone" dataKey="flow" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} /></LineChart></ResponsiveContainer></div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-muted/50"><tr className="text-left text-xs text-muted-foreground"><th className="p-3 font-medium">ID</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Description</th><th className="p-3 font-medium">Account</th><th className="p-3 font-medium">Type</th><th className="p-3 font-medium">Amount</th></tr></thead>
        <tbody>{transactions.map(t => (<tr key={t.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors"><td className="p-3 font-mono text-xs text-muted-foreground">{t.id}</td><td className="p-3 text-muted-foreground">{t.date}</td><td className="p-3 font-medium">{t.description}</td><td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{t.account}</span></td><td className="p-3"><span className={`text-xs font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>{t.type}</span></td><td className={`p-3 font-semibold ${t.type === "Income" ? "text-green-600" : ""}`}>{t.type === "Income" ? "+" : "-"} {t.amount}</td></tr>))}</tbody></table>
      </div>
    </div>
  );
};
export default Accounts;
