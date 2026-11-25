import { useState } from "react";
import { Users, Plus, Search, Trash2, Pencil, Phone, IdCard, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTable } from "@/hooks/useTable";
import { formatCNIC, validateCNIC, formatMobile, validateMobile } from "@/lib/pakistan";
import { toast } from "sonner";

interface Customer { id: string; name: string; cnic?: string; phone?: string; email?: string; address?: string; notes?: string; created_at: string; }

const Customers = () => {
  const { rows, insert, update, remove, loading } = useTable<Customer>("customers", { order: "created_at" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Customer>>({});

  const startNew = () => { setEditing(null); setForm({}); setOpen(true); };
  const startEdit = (c: Customer) => { setEditing(c); setForm(c); setOpen(true); };

  const save = async () => {
    if (!form.name?.trim()) { toast.error("Name is required"); return; }
    if (form.cnic && !validateCNIC(form.cnic)) { toast.error("CNIC must be XXXXX-XXXXXXX-X"); return; }
    if (form.phone && !validateMobile(form.phone)) { toast.error("Mobile must be 03XX-XXXXXXX"); return; }
    const ok = editing ? await update(editing.id, form) : await insert(form);
    if (ok) setOpen(false);
  };

  const filtered = rows.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.cnic?.includes(search) || r.phone?.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold">Customers</h1><p className="text-sm text-muted-foreground">Manage customer database with CNIC & contact details.</p></div>
        <button onClick={startNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Plus className="h-4 w-4" /> New Customer</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Customers", value: rows.length, color: "bg-primary text-primary-foreground" },
          { icon: UserCheck, label: "With CNIC", value: rows.filter(r => r.cnic).length, color: "bg-card border border-border" },
          { icon: Phone, label: "With Mobile", value: rows.filter(r => r.phone).length, color: "bg-card border border-border" },
          { icon: IdCard, label: "This Month", value: rows.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length, color: "bg-card border border-border" },
        ].map((c, i) => (
          <div key={i} className={`rounded-xl p-4 ${c.color}`}>
            <div className="flex items-center gap-2 mb-2"><c.icon className="h-4 w-4 opacity-70" /><p className="text-xs uppercase tracking-wider opacity-70">{c.label}</p></div>
            <p className="text-2xl font-heading font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">All Customers</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search name, CNIC, phone..." />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">CNIC</th><th className="pb-3 font-medium">Mobile</th><th className="pb-3 font-medium">City/Address</th><th className="pb-3 font-medium">Added</th><th className="pb-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No customers yet. Click "New Customer" to add one.</td></tr>}
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 font-medium">{c.name}</td>
                  <td className="py-3 font-mono text-xs">{c.cnic || "—"}</td>
                  <td className="py-3">{c.phone || "—"}</td>
                  <td className="py-3 text-muted-foreground truncate max-w-[200px]">{c.address || "—"}</td>
                  <td className="py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(c)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete this customer?")) remove(c.id); }} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Customer" : "New Customer"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Full Name *</label><input value={form.name ?? ""} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="Customer full name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">CNIC</label><input value={form.cnic ?? ""} onChange={e => setForm({ ...form, cnic: formatCNIC(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono" placeholder="XXXXX-XXXXXXX-X" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Mobile</label><input value={form.phone ?? ""} onChange={e => setForm({ ...form, phone: formatMobile(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="03XX-XXXXXXX" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Email</label><input type="email" value={form.email ?? ""} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Address</label><textarea value={form.address ?? ""} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm h-20" placeholder="Street, City" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Notes</label><textarea value={form.notes ?? ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm h-16" /></div>
          </div>
          <DialogFooter>
            <button onClick={() => setOpen(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">{editing ? "Update" : "Save"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
