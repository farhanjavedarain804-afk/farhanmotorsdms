import { useState } from "react";
import { TrendingUp, Plus, Download, ArrowUpCircle, ArrowDownCircle, Search, Trash2, Edit } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const revenueBreakdown = [
  { month: "Jan", sales: 6.2, rentals: 2.8, finance: 1.4, services: 0.6 },
  { month: "Feb", sales: 5.1, rentals: 2.5, finance: 1.3, services: 0.5 },
  { month: "Mar", sales: 8.4, rentals: 3.2, finance: 1.6, services: 0.8 },
  { month: "Apr", sales: 7.0, rentals: 2.9, finance: 1.5, services: 0.7 },
  { month: "May", sales: 9.2, rentals: 3.5, finance: 1.8, services: 0.9 },
  { month: "Jun", sales: 8.6, rentals: 3.3, finance: 1.7, services: 0.8 },
];

const expenseCategories = [
  { name: "Salaries", value: 35, color: "hsl(0, 85%, 50%)" },
  { name: "Vehicle Purchase", value: 30, color: "hsl(0, 0%, 12%)" },
  { name: "Maintenance", value: 15, color: "hsl(0, 0%, 50%)" },
  { name: "Operations", value: 12, color: "hsl(0, 70%, 80%)" },
  { name: "Others", value: 8, color: "hsl(0, 0%, 70%)" },
];

const cashFlowData = [
  { month: "Jan", inflow: 11.0, outflow: 8.2 },
  { month: "Feb", inflow: 9.4, outflow: 7.5 },
  { month: "Mar", inflow: 14.0, outflow: 9.8 },
  { month: "Apr", inflow: 12.1, outflow: 8.9 },
  { month: "May", inflow: 15.4, outflow: 10.2 },
  { month: "Jun", inflow: 14.4, outflow: 9.6 },
];

const profitMarginData = [
  { month: "Jan", margin: 18 }, { month: "Feb", margin: 15 }, { month: "Mar", margin: 22 },
  { month: "Apr", margin: 19 }, { month: "May", margin: 25 }, { month: "Jun", margin: 23 },
];

type Entry = { id: number; date: string; type: "Credit" | "Debit"; category: string; description: string; amount: number; method: string };

const initialEntries: Entry[] = [
  { id: 1, date: "2024-03-15", type: "Credit", category: "Sales Revenue", description: "Toyota Corolla sold to Ahmed", amount: 4200000, method: "Bank Transfer" },
  { id: 2, date: "2024-03-14", type: "Debit", category: "Salaries", description: "Staff salaries - March", amount: 850000, method: "Bank Transfer" },
  { id: 3, date: "2024-03-13", type: "Credit", category: "Rental Income", description: "Honda Civic rental - 30 days", amount: 90000, method: "Cash" },
  { id: 4, date: "2024-03-12", type: "Debit", category: "Maintenance", description: "Fleet service & repairs", amount: 125000, method: "Cash" },
  { id: 5, date: "2024-03-11", type: "Credit", category: "Finance Income", description: "EMI received - Honda City", amount: 65000, method: "Bank Transfer" },
  { id: 6, date: "2024-03-10", type: "Debit", category: "Vehicle Purchase", description: "Suzuki Alto purchased", amount: 2400000, method: "Cheque" },
  { id: 7, date: "2024-03-09", type: "Credit", category: "Sales Revenue", description: "Suzuki Cultus sold", amount: 2800000, method: "Cash" },
  { id: 8, date: "2024-03-08", type: "Debit", category: "Operations", description: "Office rent & utilities", amount: 180000, method: "Bank Transfer" },
];

const Financials = () => {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [filter, setFilter] = useState<"All" | "Credit" | "Debit">("All");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ type: "Credit" as "Credit" | "Debit", category: "", description: "", amount: "", date: "", method: "Cash" });

  const totalCredit = entries.filter(e => e.type === "Credit").reduce((s, e) => s + e.amount, 0);
  const totalDebit = entries.filter(e => e.type === "Debit").reduce((s, e) => s + e.amount, 0);
  const balance = totalCredit - totalDebit;

  const handleSave = () => {
    if (!formData.category || !formData.amount || !formData.date) return;
    setEntries(prev => [{ id: Date.now(), ...formData, amount: Number(formData.amount) }, ...prev]);
    setFormData({ type: "Credit", category: "", description: "", amount: "", date: "", method: "Cash" });
    setShowForm(false);
  };

  const handleDelete = (id: number) => setEntries(prev => prev.filter(e => e.id !== id));

  const filtered = entries.filter(e => {
    const matchType = filter === "All" || e.type === filter;
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const fmt = (n: number) => `PKR ${(n / 1000000).toFixed(1)}M`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Financials</h1>
          <p className="text-sm text-muted-foreground">Income & expenses ledger with credit/debit entries and financial overview.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2"><Download className="h-4 w-4" /> Export</button>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"><Plus className="h-4 w-4" /> New Entry</button>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New Financial Entry</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Entry Type</label>
              <div className="flex gap-2">
                {(["Credit", "Debit"] as const).map(t => (
                  <button key={t} onClick={() => setFormData(p => ({ ...p, type: t }))} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.type === t ? (t === "Credit" ? "bg-green-600 text-white" : "bg-red-600 text-white") : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {t === "Credit" ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />} {t} {t === "Credit" ? "(Income)" : "(Expense)"}
                  </button>
                ))}
              </div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Date</label><input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select Category</option>
                {formData.type === "Credit" ? <><option>Sales Revenue</option><option>Rental Income</option><option>Finance Income</option><option>Investor Funds</option><option>Other Income</option></> : <><option>Vehicle Purchase</option><option>Salaries</option><option>Maintenance</option><option>Operations</option><option>Fuel & Transport</option><option>Insurance</option><option>Other Expense</option></>}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Amount (PKR)</label><input type="number" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Payment Method</label>
              <select value={formData.method} onChange={e => setFormData(p => ({ ...p, method: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Cash</option><option>Bank Transfer</option><option>Cheque</option><option>Online</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Description</label><input value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Entry description" /></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save Entry</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Revenue</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 76.4M</p>
          <p className="text-xs opacity-80 mt-1">↑ 24% YoY</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-1"><ArrowUpCircle className="h-3.5 w-3.5 text-green-600" /><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Credit</p></div>
          <p className="text-2xl font-heading font-bold mt-1 text-green-600">{fmt(totalCredit)}</p>
          <p className="text-xs text-muted-foreground mt-1">Income entries</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-1"><ArrowDownCircle className="h-3.5 w-3.5 text-red-600" /><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Debit</p></div>
          <p className="text-2xl font-heading font-bold mt-1 text-red-600">{fmt(totalDebit)}</p>
          <p className="text-xs text-muted-foreground mt-1">Expense entries</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Balance</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(balance)}</p>
          <p className="text-xs text-muted-foreground mt-1">{balance >= 0 ? "Profit" : "Loss"}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Profit Margin</p>
          <p className="text-2xl font-heading font-bold mt-1">29%</p>
          <p className="text-xs text-green-600 mt-1">Healthy margin</p>
        </div>
      </div>

      {/* Ledger Entries */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">Income & Expense Ledger</h2>
          <div className="flex gap-2 items-center">
            <div className="flex bg-muted rounded-lg p-0.5">
              {(["All", "Credit", "Debit"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
              ))}
            </div>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search entries..." />
            </div>
          </div>
        </div>
        <div className="overflow-auto max-h-[360px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card"><tr className="border-b border-border text-left">
              <th className="pb-3 text-muted-foreground font-medium">Date</th>
              <th className="pb-3 text-muted-foreground font-medium">Type</th>
              <th className="pb-3 text-muted-foreground font-medium">Category</th>
              <th className="pb-3 text-muted-foreground font-medium">Description</th>
              <th className="pb-3 text-muted-foreground font-medium">Method</th>
              <th className="pb-3 text-muted-foreground font-medium text-right">Amount</th>
              <th className="pb-3 text-muted-foreground font-medium text-center">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 text-muted-foreground">{e.date}</td>
                  <td className="py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${e.type === "Credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{e.type === "Credit" ? <ArrowUpCircle className="h-3 w-3" /> : <ArrowDownCircle className="h-3 w-3" />}{e.type}</span></td>
                  <td className="py-3">{e.category}</td>
                  <td className="py-3 text-muted-foreground">{e.description}</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{e.method}</span></td>
                  <td className={`py-3 text-right font-semibold ${e.type === "Credit" ? "text-green-600" : "text-red-600"}`}>{e.type === "Credit" ? "+" : "-"} PKR {e.amount.toLocaleString()}</td>
                  <td className="py-3 text-center"><button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Revenue Breakdown (PKR M)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueBreakdown}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="sales" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Sales" stackId="a" />
              <Bar dataKey="rentals" fill="hsl(0, 0%, 12%)" radius={[0, 0, 0, 0]} name="Rentals" stackId="a" />
              <Bar dataKey="finance" fill="hsl(0, 0%, 50%)" radius={[0, 0, 0, 0]} name="Finance" stackId="a" />
              <Bar dataKey="services" fill="hsl(0, 70%, 80%)" radius={[4, 4, 0, 0]} name="Services" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Cash Flow (PKR M)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cashFlowData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="inflow" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%, 0.1)" strokeWidth={2} name="Inflow" />
              <Area type="monotone" dataKey="outflow" stroke="hsl(0, 85%, 50%)" fill="hsl(0, 85%, 50%, 0.1)" strokeWidth={2} name="Outflow" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Expense Categories</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {expenseCategories.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="font-semibold ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Profit Margin Trend (%)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={profitMarginData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="margin" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Financials;
