import { useState } from "react";
import { ShoppingCart, Plus, Search, Trash2, Pencil, TrendingUp, DollarSign, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTable } from "@/hooks/useTable";
import { formatPKR, PAYMENT_METHODS } from "@/lib/pakistan";
import { toast } from "sonner";

interface Vehicle { id: string; registration_no: string; make: string; model?: string; sale_price?: number; }
interface Customer { id: string; name: string; cnic?: string; }
interface Sale {
  id: string; vehicle_id?: string; customer_id?: string; amount: number;
  payment_method: string; status: string; sale_date: string; notes?: string;
}

const Sales = () => {
  const { rows, insert, update, remove, loading } = useTable<Sale>("sales", { order: "sale_date" });
  const { rows: vehicles } = useTable<Vehicle>("vehicles", { order: "created_at" });
  const { rows: customers } = useTable<Customer>("customers", { order: "name", ascending: true });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Sale>>({ payment_method: "Cash", status: "completed", sale_date: new Date().toISOString().slice(0, 10) });

  const startNew = () => { setEditing(null); setForm({ payment_method: "Cash", status: "completed", sale_date: new Date().toISOString().slice(0, 10) }); setOpen(true); };
  const startEdit = (s: Sale) => { setEditing(s); setForm(s); setOpen(true); };

  const save = async () => {
    if (!form.amount || form.amount <= 0) { toast.error("Amount required"); return; }
    const ok = editing ? await update(editing.id, form) : await insert({ ...form, amount: Number(form.amount) });
    if (ok) setOpen(false);
  };

  const filtered = rows.filter(r => {
    if (!search) return true;
    const v = vehicles.find(x => x.id === r.vehicle_id); const c = customers.find(x => x.id === r.customer_id);
    return v?.registration_no.toLowerCase().includes(search.toLowerCase()) || c?.name.toLowerCase().includes(search.toLowerCase());
  });

  const totalAmt = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const thisMonth = rows.filter(r => new Date(r.sale_date).getMonth() === new Date().getMonth()).reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Sales</h1><p className="text-sm text-muted-foreground">Vehicle sales transactions & customer history.</p></div>
        <button onClick={startNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Plus className="h-4 w-4" /> New Sale</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: "Total Sales", value: formatPKR(totalAmt, { compact: true }), color: "bg-primary text-primary-foreground" },
          { icon: TrendingUp, label: "This Month", value: formatPKR(thisMonth, { compact: true }), color: "bg-card border border-border" },
          { icon: DollarSign, label: "Transactions", value: rows.length, color: "bg-card border border-border" },
          { icon: CalendarDays, label: "Avg Sale", value: formatPKR(rows.length ? totalAmt / rows.length : 0, { compact: true }), color: "bg-card border border-border" },
        ].map((c, i) => (
          <div key={i} className={`rounded-xl p-4 ${c.color}`}>
            <div className="flex items-center gap-2 mb-2"><c.icon className="h-4 w-4 opacity-70" /><p className="text-xs uppercase tracking-wider opacity-70">{c.label}</p></div>
            <p className="text-2xl font-heading font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">Sale Records</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Search vehicle/customer..." />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Vehicle</th><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Payment</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No sales yet.</td></tr>}
              {filtered.map(s => {
                const v = vehicles.find(x => x.id === s.vehicle_id); const c = customers.find(x => x.id === s.customer_id);
                return (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 text-muted-foreground">{s.sale_date}</td>
                  <td className="py-3 font-medium">{v ? `${v.registration_no} — ${v.make} ${v.model ?? ""}` : "—"}</td>
                  <td className="py-3">{c?.name || "—"}</td>
                  <td className="py-3 font-semibold">{formatPKR(s.amount)}</td>
                  <td className="py-3 text-xs">{s.payment_method}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${s.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span></td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(s)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete?")) remove(s.id); }} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Sale" : "New Sale"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label>
              <select value={form.vehicle_id ?? ""} onChange={e => {
                const vid = e.target.value || undefined;
                const v = vehicles.find(x => x.id === vid);
                setForm({ ...form, vehicle_id: vid, amount: form.amount || v?.sale_price || 0 });
              }} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="">— Select —</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.make} {v.model ?? ""}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Customer</label>
              <select value={form.customer_id ?? ""} onChange={e => setForm({ ...form, customer_id: e.target.value || undefined })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="">— Select —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Amount (PKR) *</label><input type="number" value={form.amount ?? ""} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Sale Date *</label><input type="date" value={form.sale_date ?? ""} onChange={e => setForm({ ...form, sale_date: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Payment Method</label>
              <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="completed">Completed</option><option value="pending">Pending</option><option value="installment">Installment</option>
              </select>
            </div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Notes</label><textarea value={form.notes ?? ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm h-16" /></div>
          </div>
          <DialogFooter>
            <button onClick={() => setOpen(false)} className="px-4 py-2 bg-muted rounded-lg text-sm">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">{editing ? "Update" : "Save"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
