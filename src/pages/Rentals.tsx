import { useState } from "react";
import { Key, Plus, Search, Trash2, Pencil, AlertCircle, CalendarCheck, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTable } from "@/hooks/useTable";
import { formatPKR } from "@/lib/pakistan";
import { toast } from "sonner";

interface Vehicle { id: string; registration_no: string; make: string; model?: string; rent_per_day?: number; rent_per_month?: number; }
interface Customer { id: string; name: string; }
interface Rental {
  id: string; vehicle_id?: string; customer_id?: string;
  rate: number; rate_type: string; total: number;
  start_date: string; end_date: string; status: string; notes?: string;
}

const dayDiff = (a: string, b: string) => Math.max(1, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

const Rentals = () => {
  const { rows, insert, update, remove, loading } = useTable<Rental>("rentals", { order: "start_date" });
  const { rows: vehicles } = useTable<Vehicle>("vehicles", { order: "created_at" });
  const { rows: customers } = useTable<Customer>("customers", { order: "name", ascending: true });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Rental | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Rental>>({ rate_type: "daily", status: "active", start_date: new Date().toISOString().slice(0, 10), end_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10) });

  const startNew = () => { setEditing(null); setForm({ rate_type: "daily", status: "active", start_date: new Date().toISOString().slice(0, 10), end_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10) }); setOpen(true); };
  const startEdit = (r: Rental) => { setEditing(r); setForm(r); setOpen(true); };

  const calcTotal = (f: Partial<Rental>) => {
    if (!f.start_date || !f.end_date || !f.rate) return 0;
    const days = dayDiff(f.start_date, f.end_date);
    if (f.rate_type === "monthly") return Number(f.rate) * Math.max(1, Math.ceil(days / 30));
    if (f.rate_type === "weekly") return Number(f.rate) * Math.max(1, Math.ceil(days / 7));
    return Number(f.rate) * days;
  };

  const save = async () => {
    if (!form.rate || form.rate <= 0) { toast.error("Rate required"); return; }
    if (!form.start_date || !form.end_date) { toast.error("Dates required"); return; }
    const total = calcTotal(form);
    const payload = { ...form, rate: Number(form.rate), total };
    const ok = editing ? await update(editing.id, payload) : await insert(payload);
    if (ok) setOpen(false);
  };

  const filtered = rows.filter(r => {
    if (!search) return true;
    const v = vehicles.find(x => x.id === r.vehicle_id); const c = customers.find(x => x.id === r.customer_id);
    return v?.registration_no.toLowerCase().includes(search.toLowerCase()) || c?.name.toLowerCase().includes(search.toLowerCase());
  });

  const active = rows.filter(r => r.status === "active");
  const overdue = rows.filter(r => r.status === "overdue" || (r.status === "active" && new Date(r.end_date) < new Date()));
  const monthRev = rows.filter(r => new Date(r.start_date).getMonth() === new Date().getMonth()).reduce((s, r) => s + Number(r.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Rent A Car</h1><p className="text-sm text-muted-foreground">Bookings, agreements, & vehicle availability.</p></div>
        <button onClick={startNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Plus className="h-4 w-4" /> New Booking</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Key, label: "Active Rentals", value: active.length, color: "bg-primary text-primary-foreground" },
          { icon: CalendarCheck, label: "Total Bookings", value: rows.length, color: "bg-card border border-border" },
          { icon: DollarSign, label: "Month Revenue", value: formatPKR(monthRev, { compact: true }), color: "bg-card border border-border" },
          { icon: AlertCircle, label: "Overdue", value: overdue.length, color: "bg-card border border-border" },
        ].map((c, i) => (
          <div key={i} className={`rounded-xl p-4 ${c.color}`}>
            <div className="flex items-center gap-2 mb-2"><c.icon className="h-4 w-4 opacity-70" /><p className="text-xs uppercase tracking-wider opacity-70">{c.label}</p></div>
            <p className="text-2xl font-heading font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">All Bookings</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Search..." />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Vehicle</th><th className="pb-3 font-medium">Period</th><th className="pb-3 font-medium">Rate</th><th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No bookings yet.</td></tr>}
              {filtered.map(r => {
                const v = vehicles.find(x => x.id === r.vehicle_id); const c = customers.find(x => x.id === r.customer_id);
                return (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 font-medium">{c?.name || "—"}</td>
                  <td className="py-3">{v ? `${v.registration_no} — ${v.make} ${v.model ?? ""}` : "—"}</td>
                  <td className="py-3 text-xs text-muted-foreground">{r.start_date} → {r.end_date}</td>
                  <td className="py-3">{formatPKR(r.rate)}/{r.rate_type.slice(0,3)}</td>
                  <td className="py-3 font-semibold">{formatPKR(r.total)}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "active" ? "bg-green-100 text-green-700" : r.status === "overdue" ? "bg-red-100 text-red-700" : r.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-muted"}`}>{r.status}</span></td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(r)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete?")) remove(r.id); }} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Booking" : "New Booking"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Customer</label>
              <select value={form.customer_id ?? ""} onChange={e => setForm({ ...form, customer_id: e.target.value || undefined })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="">— Select —</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label>
              <select value={form.vehicle_id ?? ""} onChange={e => {
                const vid = e.target.value || undefined; const v = vehicles.find(x => x.id === vid);
                setForm({ ...form, vehicle_id: vid, rate: form.rate || (form.rate_type === "monthly" ? v?.rent_per_month : v?.rent_per_day) || 0 });
              }} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="">— Select —</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.make} {v.model ?? ""}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Rate Type</label>
              <select value={form.rate_type} onChange={e => setForm({ ...form, rate_type: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Rate (PKR)</label><input type="number" value={form.rate ?? ""} onChange={e => setForm({ ...form, rate: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Start Date</label><input type="date" value={form.start_date ?? ""} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">End Date</label><input type="date" value={form.end_date ?? ""} onChange={e => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm">
                <option value="active">Active</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Calculated Total</span>
              <span className="font-bold text-primary">{formatPKR(calcTotal(form))}</span>
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

export default Rentals;
