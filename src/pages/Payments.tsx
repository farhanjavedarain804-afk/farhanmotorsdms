import { useState } from "react";
import { CreditCard, Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const monthlyPayments = [
  { month: "Jan", received: 4.2, pending: 1.1 },
  { month: "Feb", received: 3.8, pending: 0.9 },
  { month: "Mar", received: 5.6, pending: 1.4 },
  { month: "Apr", received: 4.9, pending: 1.2 },
  { month: "May", received: 6.1, pending: 0.8 },
  { month: "Jun", received: 5.4, pending: 1.0 },
];

const paymentMethods = [
  { name: "Cash", value: 45, color: "hsl(0, 85%, 50%)" },
  { name: "Bank Transfer", value: 30, color: "hsl(0, 0%, 12%)" },
  { name: "Cheque", value: 15, color: "hsl(0, 0%, 50%)" },
  { name: "Online", value: 10, color: "hsl(0, 70%, 80%)" },
];

const payments = [
  { id: "PAY-001", date: "2024-03-15", customer: "Ahmed Khan", type: "Received", method: "Cash", amount: "520,000", reference: "Sale - Toyota Corolla", status: "Verified" },
  { id: "PAY-002", date: "2024-03-14", customer: "Sara Ali", type: "Received", method: "Bank Transfer", amount: "80,000", reference: "Rental - Honda Civic", status: "Verified" },
  { id: "PAY-003", date: "2024-03-13", customer: "Usman Tariq", type: "Received", method: "Cheque", amount: "58,000", reference: "EMI - Suzuki Alto", status: "Pending" },
  { id: "PAY-004", date: "2024-03-12", customer: "Vendor - AutoParts", type: "Paid", method: "Bank Transfer", amount: "125,000", reference: "Maintenance Parts", status: "Verified" },
  { id: "PAY-005", date: "2024-03-11", customer: "Imran Shah", type: "Received", method: "Cash", amount: "48,000", reference: "EMI - Suzuki Cultus", status: "Overdue" },
  { id: "PAY-006", date: "2024-03-10", customer: "Nadia Hussain", type: "Received", method: "Online", amount: "92,000", reference: "EMI - Honda City", status: "Verified" },
];

const Payments = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = payments.filter(p => 
    p.customer.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Track all incoming and outgoing payments.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Record Payment
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Record New Payment</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Customer</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Customer name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Amount (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Payment Method</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Cash</option><option>Bank Transfer</option><option>Cheque</option><option>Online</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Type</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Received</option><option>Paid</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Reference</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Sale, Rental, EMI..." /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Date</label><input type="date" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save Payment</button></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Received</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 5.8M</p>
          <p className="text-xs opacity-80 mt-1">This month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 2.1M</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 890K</p>
          <p className="text-xs text-yellow-600 mt-1">12 pending payments</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 340K</p>
          <p className="text-xs text-red-600 mt-1">5 overdue payments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Payment Flow (PKR M)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyPayments}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="received" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="pending" fill="hsl(0, 0%, 70%)" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {paymentMethods.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {paymentMethods.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Customer/Vendor</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Reference</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="p-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                <td className="p-3 text-muted-foreground">{p.date}</td>
                <td className="p-3 font-medium">{p.customer}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.type === "Received" ? "text-green-600" : "text-red-600"}`}>
                    {p.type === "Received" ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />} {p.type}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{p.method}</td>
                <td className="p-3 font-semibold">PKR {p.amount}</td>
                <td className="p-3 text-xs text-muted-foreground">{p.reference}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.status === "Verified" ? "bg-green-100 text-green-700" :
                    p.status === "Overdue" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;