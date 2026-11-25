import { useState } from "react";
import { FileText, Plus, Search, Download, Printer, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const monthlyInvoices = [
  { month: "Jan", issued: 32, paid: 28 },
  { month: "Feb", issued: 28, paid: 25 },
  { month: "Mar", issued: 45, paid: 38 },
  { month: "Apr", issued: 38, paid: 35 },
  { month: "May", issued: 42, paid: 40 },
  { month: "Jun", issued: 50, paid: 44 },
];

const invoiceTypes = [
  { name: "Sale", value: 35, color: "hsl(0, 85%, 50%)" },
  { name: "Rental", value: 28, color: "hsl(0, 0%, 12%)" },
  { name: "Service", value: 15, color: "hsl(0, 0%, 50%)" },
  { name: "Finance EMI", value: 22, color: "hsl(0, 70%, 80%)" },
];

const revenueTrend = [
  { month: "Jan", amount: 4.2 },
  { month: "Feb", amount: 3.8 },
  { month: "Mar", amount: 5.6 },
  { month: "Apr", amount: 4.9 },
  { month: "May", amount: 6.1 },
  { month: "Jun", amount: 7.2 },
];

const invoices = [
  { id: "INV-0001", date: "2024-03-15", customer: "Ahmed Khan", type: "Sale", vehicle: "Toyota Corolla 2024", amount: "5,200,000", tax: "260,000", total: "5,460,000", status: "Paid", dueDate: "2024-03-20" },
  { id: "INV-0002", date: "2024-03-14", customer: "Sara Ali", type: "Rental", vehicle: "Honda Civic 2023", amount: "80,000", tax: "4,000", total: "84,000", status: "Paid", dueDate: "2024-03-18" },
  { id: "INV-0003", date: "2024-03-13", customer: "Usman Tariq", type: "EMI", vehicle: "Suzuki Alto 2024", amount: "58,000", tax: "0", total: "58,000", status: "Pending", dueDate: "2024-03-25" },
  { id: "INV-0004", date: "2024-03-12", customer: "Fatima Noor", type: "Rental", vehicle: "Toyota Hilux 2023", amount: "150,000", tax: "7,500", total: "157,500", status: "Overdue", dueDate: "2024-03-10" },
  { id: "INV-0005", date: "2024-03-11", customer: "Ali Hassan", type: "Sale", vehicle: "Honda City 2024", amount: "4,500,000", tax: "225,000", total: "4,725,000", status: "Paid", dueDate: "2024-03-15" },
  { id: "INV-0006", date: "2024-03-10", customer: "Bilal Ahmed", type: "Service", vehicle: "Suzuki Cultus 2024", amount: "35,000", tax: "1,750", total: "36,750", status: "Draft", dueDate: "—" },
];

const Invoices = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = invoices.filter(i => i.customer.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">Create, manage and track all invoices.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Invoice
          </button>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Customer</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Customer name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Invoice Type</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Sale</option><option>Rental</option><option>Service</option><option>Finance EMI</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Vehicle details" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Amount (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Tax (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Due Date</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Notes</label><textarea className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 h-20 resize-none" placeholder="Additional notes..." /></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save Invoice</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Invoiced</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 31.8M</p>
          <p className="text-xs opacity-80 mt-1">This quarter</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 26.4M</p>
          <p className="text-xs text-green-600 mt-1">83% collection rate</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 3.8M</p>
          <p className="text-xs text-yellow-600 mt-1">12 pending invoices</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 1.6M</p>
          <p className="text-xs text-red-600 mt-1">5 overdue invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Issued vs Paid</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyInvoices}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="issued" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Issued" />
              <Bar dataKey="paid" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Paid" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Invoice Types</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={invoiceTypes} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {invoiceTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {invoiceTypes.map(t => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-muted-foreground">{t.name}</span>
                <span className="font-semibold ml-auto">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Revenue Trend (PKR M)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="amount" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">Invoice #</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Tax</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Due Date</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs font-semibold text-primary">{inv.id}</td>
                <td className="p-3 text-muted-foreground">{inv.date}</td>
                <td className="p-3 font-medium">{inv.customer}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{inv.type}</span></td>
                <td className="p-3">PKR {inv.amount}</td>
                <td className="p-3 text-muted-foreground">PKR {inv.tax}</td>
                <td className="p-3 font-semibold">PKR {inv.total}</td>
                <td className="p-3 text-muted-foreground">{inv.dueDate}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    inv.status === "Paid" ? "bg-green-100 text-green-700" :
                    inv.status === "Overdue" ? "bg-red-100 text-red-700" :
                    inv.status === "Draft" ? "bg-muted text-muted-foreground" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{inv.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded hover:bg-muted transition-colors"><Printer className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
