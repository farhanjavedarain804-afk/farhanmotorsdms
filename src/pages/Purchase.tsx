import { useState } from "react";
import { ShoppingBag, Plus, Search, Trash2, Pencil, Truck, Clock, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTable } from "@/hooks/useTable";
import { formatCNIC, validateCNIC, formatPKR, PAYMENT_METHODS } from "@/lib/pakistan";
import { toast } from "sonner";

interface Vehicle { id: string; registration_no: string; make: string; model?: string; }
interface Purchase {
  id: string; vehicle_id?: string; seller_name: string; seller_cnic?: string; seller_phone?: string;
  amount: number; source: string; payment_method: string; status: string;
  purchase_date: string; notes?: string;
}

const Purchases = () => {
  const { rows, insert, update, remove, loading } = useTable<Purchase>("purchases", { order: "purchase_date" });
  const { rows: vehicles } = useTable<Vehicle>("vehicles", { order: "created_at" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Purchase>>({ source: "local", payment_method: "Cash", status: "completed", purchase_date: new Date().toISOString().slice(0, 10) });

  const startNew = () => { setEditing(null); setForm({ source: "local", payment_method: "Cash", status: "completed", purchase_date: new Date().toISOString().slice(0, 10) }); setOpen(true); };
  const startEdit = (p: Purchase) => { setEditing(p); setForm(p); setOpen(true); };

  const save = async () => {
    if (!form.seller_name?.trim()) { toast.error("Seller name required"); return; }
    if (!form.amount || form.amount <= 0) { toast.error("Amount required"); return; }
    if (form.seller_cnic && !validateCNIC(form.seller_cnic)) { toast.error("Invalid CNIC format"); return; }
    const ok = editing ? await update(editing.id, form) : await insert({ ...form, amount: Number(form.amount) });
    if (ok) setOpen(false);
  };

  const filtered = rows.filter(r => !search || r.seller_name.toLowerCase().includes(search.toLowerCase()));
  const totalAmt = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const pending = rows.filter(r => r.status !== "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Vehicle Purchases</h1><p className="text-sm text-muted-foreground">Record vehicle purchases & track payments.</p></div>
        <button onClick={startNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Plus className="h-4 w-4" /> New Purchase</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: "Total Purchases", value: formatPKR(totalAmt, { compact: true }), color: "bg-primary text-primary-foreground" },
          { icon: Truck, label: "Vehicles Bought", value: rows.length, color: "bg-card border border-border" },
          { icon: Clock, label: "Pending", value: pending.length, color: "bg-card border border-border" },
          { icon: Package, label: "Imports", value: rows.filter(r => r.source === "import").length, color: "bg-card border border-border" },
        ].map((c, i) => (
          <div key={i} className={`rounded-xl p-4 ${c.color}`}>
            <div className="flex items-center gap-2 mb-2"><c.icon className="h-4 w-4 opacity-70" /><p className="text-xs uppercase tracking-wider opacity-70">{c.label}</p></div>
            <p className="text-2xl font-heading font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">Purchase Records</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Search seller..." />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Vehicle</th><th className="pb-3 font-medium">Seller</th><th className="pb-3 font-medium">CNIC</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Source</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No purchase records yet.</td></tr>}
              {filtered.map(p => {
                const v = vehicles.find(x => x.id === p.vehicle_id);
                return (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 text-muted-foreground">{p.purchase_date}</td>
                  <td className="py-3 font-medium">{v ? `${v.registration_no} — ${v.make} ${v.model ?? ""}` : "—"}</td>
                  <td className="py-3">{p.seller_name}</td>
                  <td className="py-3 font-mono text-xs">{p.seller_cnic || "—"}</td>
                  <td className="py-3 font-semibold">{formatPKR(p.amount)}</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{p.source}</span></td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${p.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete?")) remove(p.id); }} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Purchase" : "New Purchase"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Vehicle (from inventory)</label>
              <select value={form.vehicle_id ?? ""} onChange={e => setForm({ ...form, vehicle_id: e.target.value || undefined })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="">— None / new —</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.make} {v.model ?? ""}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Seller Name *</label><input value={form.seller_name ?? ""} onChange={e => setForm({ ...form, seller_name: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Seller CNIC</label><input value={form.seller_cnic ?? ""} onChange={e => setForm({ ...form, seller_cnic: formatCNIC(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono" placeholder="XXXXX-XXXXXXX-X" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Amount (PKR) *</label><input type="number" value={form.amount ?? ""} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Date *</label><input type="date" value={form.purchase_date ?? ""} onChange={e => setForm({ ...form, purchase_date: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Source</label>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="local">Local</option><option value="import">Import</option><option value="auction">Auction</option><option value="trade_in">Trade-In</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Payment Method</label>
              <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="completed">Completed</option><option value="pending">Pending Payment</option><option value="in_transit">In Transit</option>
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

export default Purchases;
