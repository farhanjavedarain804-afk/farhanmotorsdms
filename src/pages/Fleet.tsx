import { useState, useRef } from "react";
import { Car, Plus, Search, Trash2, Pencil, Package, CheckCircle2, Wrench, Key, Upload, FileText, X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTable } from "@/hooks/useTable";
import { formatPKR, validateRegistration, validateCNIC, formatCNIC, validateMobile, formatMobile, VEHICLE_MAKES, PK_CITIES } from "@/lib/pakistan";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  registration_no: string;
  make: string;
  model?: string;
  variant?: string;
  year?: number;
  color?: string;
  chassis_no?: string;
  engine_no?: string;
  engine_capacity?: string;
  transmission?: string;
  fuel_type?: string;
  body_type?: string;
  mileage?: number;
  condition?: string;
  purpose: string;
  status: string;
  ownership_type?: string;
  owner_name?: string;
  owner_cnic?: string;
  owner_phone?: string;
  registered_city?: string;
  token_validity?: string;
  fitness_expiry?: string;
  insurance_expiry?: string;
  purchase_price?: number;
  sale_price?: number;
  rent_per_day?: number;
  rent_per_month?: number;
  rent_with_driver?: number;
  notes?: string;
  created_at: string;
}

interface UploadedFile { name: string; size: number; type: string; }

const STATUS_COLORS: Record<string, string> = {
  in_stock:    "bg-blue-100   text-blue-700",
  sold:        "bg-green-100  text-green-700",
  rented:      "bg-purple-100 text-purple-700",
  maintenance: "bg-orange-100 text-orange-700",
};

const INPUT  = "w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const SELECT = "w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const LABEL  = "text-xs text-muted-foreground mb-1 block font-medium";

const VARIANTS: Record<string, string[]> = {
  Toyota:    ["Corolla GLi", "Corolla XLi", "Corolla Altis", "Yaris", "Land Cruiser", "Fortuner", "Hilux", "Prado", "Camry", "Vitz"],
  Honda:     ["City Aspire", "City Standard", "Civic Oriel", "Civic VTi", "BR-V", "HR-V", "CR-V"],
  Suzuki:    ["Alto VX", "Alto VXR", "Cultus VXR", "Cultus VXL", "Swift GL", "Swift GLX", "Wagon R VXR", "Wagon R VXL", "Jimny"],
  Hyundai:   ["Tucson FWD", "Tucson AWD", "Elantra", "Sonata", "Ioniq"],
  Kia:       ["Picanto", "Sportage FWD", "Sportage AWD", "Sorento", "Stonic"],
  Changan:   ["Alsvin", "Oshan X7", "Uni-T", "Uni-K"],
  MG:        ["HS", "ZS", "3", "GT"],
  Haval:     ["H6", "Jolion"],
  Proton:    ["Saga", "X50", "X70"],
};

const STATUS_OPTIONS = ["In Stock", "Sold", "Rented", "Maintenance", "Reserved", "Inspection", "On Hold"];
const CC_OPTIONS     = ["660cc","800cc","1000cc","1200cc","1300cc","1400cc","1500cc","1600cc","1800cc","2000cc","2500cc","2700cc","3000cc","3500cc","4000cc+"];
const COLOR_OPTIONS  = ["White","Pearl White","Silver","Black","Grey","Maroon","Red","Blue","Navy Blue","Golden","Brown","Green","Beige","Orange"];
const YEAR_OPTIONS   = Array.from({ length: 25 }, (_, i) => String(new Date().getFullYear() - i));

/** Combo field: dropdown + "Custom…" option reveals a text input */
const ComboField = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => {
  const [custom, setCustom] = useState(false);
  const isCustom = value !== "" && !options.includes(value);

  return (
    <div>
      <label className={LABEL}>{label}</label>
      {(custom || isCustom) ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={value}
            onChange={e => onChange(e.target.value)}
            className={INPUT}
            placeholder={`Custom ${label}`}
          />
          <button
            type="button"
            onClick={() => { setCustom(false); onChange(""); }}
            className="px-2 text-muted-foreground hover:text-foreground border border-border rounded-lg bg-muted"
            title="Back to dropdown"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={e => e.target.value === "__custom__" ? setCustom(true) : onChange(e.target.value)}
          className={SELECT}
        >
          <option value="">Select {label}</option>
          {options.map(o => <option key={o}>{o}</option>)}
          <option value="__custom__">+ Add Custom…</option>
        </select>
      )}
    </div>
  );
};

/** Status field: dropdown list + custom text option */
const StatusField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [custom, setCustom] = useState(false);
  const normalized = value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const isCustom = normalized !== "" && !STATUS_OPTIONS.map(s => s.toLowerCase()).includes(value.replace(/_/g, " ").toLowerCase());

  return (
    <div>
      <label className={LABEL}>Status</label>
      {(custom || isCustom) ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={value}
            onChange={e => onChange(e.target.value)}
            className={INPUT}
            placeholder="Custom status"
          />
          <button
            type="button"
            onClick={() => { setCustom(false); onChange("in_stock"); }}
            className="px-2 text-muted-foreground hover:text-foreground border border-border rounded-lg bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={e => e.target.value === "__custom__" ? setCustom(true) : onChange(e.target.value)}
          className={SELECT}
        >
          <option value="in_stock">In Stock</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
          <option value="reserved">Reserved</option>
          <option value="inspection">Inspection</option>
          <option value="on_hold">On Hold</option>
          <option value="__custom__">+ Add Custom…</option>
        </select>
      )}
    </div>
  );
};

/** File upload card */
const FileUploadCard = ({
  label, accept, files, onAdd, onRemove,
}: {
  label: string; accept: string;
  files: UploadedFile[]; onAdd: (f: UploadedFile[]) => void; onRemove: (i: number) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const added: UploadedFile[] = [];
    for (const f of Array.from(fileList)) {
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name} exceeds 10 MB limit`); continue; }
      added.push({ name: f.name, size: f.size, type: f.type });
    }
    if (added.length) onAdd(added);
  };

  return (
    <div className="border border-dashed border-border rounded-lg p-3 bg-muted/30">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {/* Drop zone */}
      <div
        className="flex flex-col items-center gap-1 py-4 cursor-pointer hover:bg-muted/60 rounded-lg transition-colors"
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-center">
          Click or drag &amp; drop<br />
          <span className="text-[10px]">PDF, JPG, PNG — max 10 MB each</span>
        </p>
        <input ref={ref} type="file" multiple accept={accept} className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>
      {/* File list */}
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-card border border-border rounded-lg text-xs">
              <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="flex-1 truncate text-foreground">{f.name}</span>
              <span className="text-muted-foreground flex-shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => onRemove(i)} className="text-muted-foreground hover:text-red-500 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════ MAIN COMPONENT ══════════════════════ */
const Fleet = () => {
  const { rows, insert, update, remove, loading } = useTable<Vehicle>("vehicles", { order: "created_at" });
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [search, setSearch]   = useState("");
  const [form, setForm]       = useState<Partial<Vehicle>>({
    purpose: "sale", status: "in_stock",
    ownership_type: "company", fuel_type: "Petrol",
    transmission: "Automatic", condition: "Used",
  });
  const [customMake,  setCustomMake]  = useState(false);
  const [vehicleDocs, setVehicleDocs] = useState<UploadedFile[]>([]);
  const [ownerDocs,   setOwnerDocs]   = useState<UploadedFile[]>([]);

  const set = (k: keyof Vehicle, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

  const startNew = () => {
    setEditing(null);
    setForm({ purpose: "sale", status: "in_stock", ownership_type: "company", fuel_type: "Petrol", transmission: "Automatic", condition: "Used" });
    setCustomMake(false);
    setVehicleDocs([]); setOwnerDocs([]);
    setOpen(true);
  };
  const startEdit = (v: Vehicle) => {
    setEditing(v); setForm(v);
    setCustomMake(!!v.make && !VEHICLE_MAKES.includes(v.make));
    setVehicleDocs([]); setOwnerDocs([]);
    setOpen(true);
  };

  const save = async () => {
    if (!form.registration_no?.trim())               { toast.error("Registration number is required"); return; }
    if (!validateRegistration(form.registration_no)) { toast.error("Invalid Reg No — e.g. ABC-1234"); return; }
    if (!form.make?.trim())                          { toast.error("Make is required"); return; }
    if (!form.model?.trim())                         { toast.error("Model is required"); return; }
    if (form.owner_cnic  && !validateCNIC(form.owner_cnic))    { toast.error("CNIC format: XXXXX-XXXXXXX-X"); return; }
    if (form.owner_phone && !validateMobile(form.owner_phone)) { toast.error("Mobile format: 03XX-XXXXXXX"); return; }

    const payload: Partial<Vehicle> = {
      ...form,
      registration_no:  form.registration_no.toUpperCase(),
      year:             form.year             ? Number(form.year)             : undefined,
      mileage:          form.mileage          ? Number(form.mileage)          : undefined,
      purchase_price:   Number(form.purchase_price   ?? 0),
      sale_price:       Number(form.sale_price       ?? 0),
      rent_per_day:     Number(form.rent_per_day     ?? 0),
      rent_per_month:   Number(form.rent_per_month   ?? 0),
      rent_with_driver: Number(form.rent_with_driver ?? 0),
    };
    const ok = editing ? await update(editing.id, payload) : await insert(payload);
    if (ok) {
      if (vehicleDocs.length || ownerDocs.length)
        toast.info(`${vehicleDocs.length + ownerDocs.length} file(s) noted (storage integration coming soon)`);
      setOpen(false);
    }
  };

  const filtered = rows.filter(r =>
    !search ||
    r.registration_no.toLowerCase().includes(search.toLowerCase()) ||
    r.make.toLowerCase().includes(search.toLowerCase()) ||
    r.model?.toLowerCase().includes(search.toLowerCase()) ||
    r.chassis_no?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:       rows.length,
    in_stock:    rows.filter(r => r.status === "in_stock").length,
    sold:        rows.filter(r => r.status === "sold").length,
    rented:      rows.filter(r => r.status === "rented").length,
    maintenance: rows.filter(r => r.status === "maintenance").length,
  };

  const variantOptions = !customMake ? (VARIANTS[form.make ?? ""] ?? []) : [];
  const purpose = form.purpose ?? "sale";
  const showSale  = purpose === "sale"  || purpose === "both";
  const showRent  = purpose === "rent"  || purpose === "both";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Fleet Management</h1>
          <p className="text-sm text-muted-foreground">Complete vehicle inventory — sale &amp; rent stock.</p>
        </div>
        <button onClick={startNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Car,          label: "Total Vehicles", value: stats.total },
          { icon: Package,      label: "In Stock",       value: stats.in_stock },
          { icon: CheckCircle2, label: "Sold",           value: stats.sold },
          { icon: Key,          label: "Rented",         value: stats.rented },
          { icon: Wrench,       label: "Maintenance",    value: stats.maintenance },
        ].map((c, i) => (
          <div key={i} className="group rounded-xl p-4 bg-card border border-border cursor-pointer transition-all duration-300 hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <p className="text-xs uppercase tracking-wider opacity-70">{c.label}</p>
            </div>
            <p className="text-2xl font-heading font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">Vehicle Inventory</h2>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm"
              placeholder="Search reg no, make, model, chassis…" />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Reg. No</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 font-medium">Color</th>
                <th className="pb-3 font-medium">Purpose</th>
                <th className="pb-3 font-medium">Sale Price</th>
                <th className="pb-3 font-medium">Rent / Day</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">No vehicles found. Click "Add Vehicle".</td></tr>
              )}
              {filtered.map(v => (
                <tr key={v.id} className="border-b border-border/50 hover:bg-red-50/50 transition-colors cursor-pointer">
                  <td className="py-3 font-mono font-semibold">{v.registration_no}</td>
                  <td className="py-3">{v.make} {v.model}{v.variant && <span className="text-xs text-muted-foreground ml-1">({v.variant})</span>}</td>
                  <td className="py-3 text-muted-foreground">{v.year || "—"}</td>
                  <td className="py-3 text-muted-foreground">{v.color || "—"}</td>
                  <td className="py-3 text-xs"><span className="px-2 py-0.5 rounded-full bg-muted capitalize">{v.purpose}</span></td>
                  <td className="py-3">{formatPKR(v.sale_price, { compact: true })}</td>
                  <td className="py-3">{formatPKR(v.rent_per_day, { compact: true })}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[v.status] || "bg-muted text-muted-foreground"}`}>{v.status.replace(/_/g, " ")}</span></td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(v)} className="p-1.5 hover:bg-muted rounded transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete this vehicle?")) remove(v.id); }} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded ml-1 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Dialog ─── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading">{editing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">

            {/* ── 1. Basic Information ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-border pb-1">Basic Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Reg No */}
                <div>
                  <label className={LABEL}>Registration No *</label>
                  <input value={form.registration_no ?? ""} onChange={e => set("registration_no", e.target.value.toUpperCase())}
                    className={INPUT + " font-mono"} placeholder="ABC-1234" />
                </div>

                {/* Make — dropdown + custom */}
                <div>
                  <label className={LABEL}>Make *</label>
                  {customMake ? (
                    <div className="flex gap-1">
                      <input value={form.make ?? ""} onChange={e => set("make", e.target.value)}
                        className={INPUT} placeholder="Enter make name" autoFocus />
                      <button type="button" onClick={() => { setCustomMake(false); set("make", ""); set("model", ""); }}
                        className="px-2 border border-border rounded-lg bg-muted text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <select value={form.make ?? ""} onChange={e => {
                      if (e.target.value === "__custom__") { setCustomMake(true); set("make", ""); }
                      else { set("make", e.target.value); set("model", ""); set("variant", ""); }
                    }} className={SELECT}>
                      <option value="">Select Make…</option>
                      {VEHICLE_MAKES.map(m => <option key={m}>{m}</option>)}
                      <option value="__custom__">+ Add Custom Make…</option>
                    </select>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className={LABEL}>Model *</label>
                  {variantOptions.length > 0 ? (
                    <select value={form.model ?? ""} onChange={e => set("model", e.target.value)} className={SELECT}>
                      <option value="">Select Model…</option>
                      {variantOptions.map(v => <option key={v}>{v}</option>)}
                      <option value="Other">Other / Custom</option>
                    </select>
                  ) : (
                    <input value={form.model ?? ""} onChange={e => set("model", e.target.value)} className={INPUT} placeholder="e.g. Corolla GLi" />
                  )}
                </div>

                {/* Variant */}
                <div>
                  <label className={LABEL}>Variant</label>
                  <input value={form.variant ?? ""} onChange={e => set("variant", e.target.value)} className={INPUT} placeholder="GLi / VXR / Oriel" />
                </div>

                {/* Year — combo */}
                <ComboField label="Model Year *" options={YEAR_OPTIONS}
                  value={form.year ? String(form.year) : ""}
                  onChange={v => set("year", v ? Number(v) : undefined)} />

                {/* Color — combo */}
                <ComboField label="Color" options={COLOR_OPTIONS}
                  value={form.color ?? ""} onChange={v => set("color", v)} />

                {/* Condition */}
                <div>
                  <label className={LABEL}>Condition</label>
                  <select value={form.condition ?? "Used"} onChange={e => set("condition", e.target.value)} className={SELECT}>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Imported">Imported</option>
                    <option value="Reconstructed">Reconstructed</option>
                  </select>
                </div>

                {/* Mileage */}
                <div>
                  <label className={LABEL}>Mileage (km)</label>
                  <input type="number" value={form.mileage ?? ""} onChange={e => set("mileage", e.target.value)} className={INPUT} placeholder="45000" />
                </div>
              </div>
            </section>

            {/* ── 2. Technical Details ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-border pb-1">Technical Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={LABEL}>Chassis No</label>
                  <input value={form.chassis_no ?? ""} onChange={e => set("chassis_no", e.target.value.toUpperCase())}
                    className={INPUT + " font-mono"} placeholder="JT2BF22K000000000" />
                </div>
                <div>
                  <label className={LABEL}>Engine No</label>
                  <input value={form.engine_no ?? ""} onChange={e => set("engine_no", e.target.value.toUpperCase())}
                    className={INPUT + " font-mono"} placeholder="2NZ-0000000" />
                </div>

                {/* Engine CC — combo */}
                <ComboField label="Engine Capacity" options={CC_OPTIONS}
                  value={form.engine_capacity ?? ""} onChange={v => set("engine_capacity", v)} />

                <div>
                  <label className={LABEL}>Fuel Type</label>
                  <select value={form.fuel_type ?? "Petrol"} onChange={e => set("fuel_type", e.target.value)} className={SELECT}>
                    {["Petrol","Diesel","CNG","Petrol+CNG","Hybrid","Electric"].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Transmission</label>
                  <select value={form.transmission ?? "Automatic"} onChange={e => set("transmission", e.target.value)} className={SELECT}>
                    {["Automatic","Manual","CVT","Semi-Auto"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Body Type</label>
                  <select value={form.body_type ?? ""} onChange={e => set("body_type", e.target.value)} className={SELECT}>
                    <option value="">Select Type</option>
                    {["Sedan","Hatchback","SUV","Crossover","MPV","Pickup","Van","Coupe","Wagon"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Registered City — combo */}
                <ComboField label="Registered City" options={PK_CITIES}
                  value={form.registered_city ?? ""} onChange={v => set("registered_city", v)} />
              </div>
            </section>

            {/* ── 3. Documents & Validity ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-border pb-1">Documents &amp; Validity</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className={LABEL}>Token Validity</label>
                  <input type="date" value={form.token_validity ?? ""} onChange={e => set("token_validity", e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Fitness Certificate Expiry</label>
                  <input type="date" value={form.fitness_expiry ?? ""} onChange={e => set("fitness_expiry", e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Insurance Expiry</label>
                  <input type="date" value={form.insurance_expiry ?? ""} onChange={e => set("insurance_expiry", e.target.value)} className={INPUT} />
                </div>
              </div>
            </section>

            {/* ── 4. Ownership ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-border pb-1">Ownership Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={LABEL}>Ownership Type</label>
                  <select value={form.ownership_type ?? "company"} onChange={e => set("ownership_type", e.target.value)} className={SELECT}>
                    <option value="company">Company Owned</option>
                    <option value="investor">Investor Owned</option>
                    <option value="leased">Leased</option>
                    <option value="consignment">Consignment</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Owner / Investor Name</label>
                  <input value={form.owner_name ?? ""} onChange={e => set("owner_name", e.target.value)} className={INPUT} placeholder="Muhammad Ali" />
                </div>
                <div>
                  <label className={LABEL}>Owner CNIC</label>
                  <input value={form.owner_cnic ?? ""} onChange={e => set("owner_cnic", formatCNIC(e.target.value))}
                    className={INPUT + " font-mono"} placeholder="XXXXX-XXXXXXX-X" maxLength={15} />
                </div>
                <div>
                  <label className={LABEL}>Owner Mobile</label>
                  <input value={form.owner_phone ?? ""} onChange={e => set("owner_phone", formatMobile(e.target.value))}
                    className={INPUT} placeholder="03XX-XXXXXXX" maxLength={12} />
                </div>
              </div>
            </section>

            {/* ── 5. Purpose & Pricing (Conditional) ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-border pb-1">Purpose &amp; Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Purpose selector */}
                <div className="col-span-2 md:col-span-1">
                  <label className={LABEL}>Purpose</label>
                  <select value={form.purpose} onChange={e => set("purpose", e.target.value)} className={SELECT}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="both">Sale + Rent</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-span-2 md:col-span-1">
                  <StatusField value={form.status ?? "in_stock"} onChange={v => set("status", v)} />
                </div>

                {/* Sale fields — shown when purpose = sale or both */}
                {showSale && (
                  <>
                    <div>
                      <label className={LABEL}>Purchase Price (PKR)</label>
                      <input type="number" value={form.purchase_price ?? ""} onChange={e => set("purchase_price", e.target.value)} className={INPUT} placeholder="2500000" />
                    </div>
                    <div>
                      <label className={LABEL}>Sale Price (PKR)</label>
                      <input type="number" value={form.sale_price ?? ""} onChange={e => set("sale_price", e.target.value)} className={INPUT} placeholder="2800000" />
                    </div>
                  </>
                )}

                {/* Rent fields — shown when purpose = rent or both */}
                {showRent && (
                  <>
                    <div>
                      <label className={LABEL}>Rent / Day (PKR)</label>
                      <input type="number" value={form.rent_per_day ?? ""} onChange={e => set("rent_per_day", e.target.value)} className={INPUT} placeholder="8000" />
                    </div>
                    <div>
                      <label className={LABEL}>Rent / Month (PKR)</label>
                      <input type="number" value={form.rent_per_month ?? ""} onChange={e => set("rent_per_month", e.target.value)} className={INPUT} placeholder="180000" />
                    </div>
                    <div>
                      <label className={LABEL}>Rent with Driver / Day (PKR)</label>
                      <input type="number" value={form.rent_with_driver ?? ""} onChange={e => set("rent_with_driver", e.target.value)} className={INPUT} placeholder="12000" />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ── 6. Document Attachments ── */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 border-b border-border pb-1">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUploadCard
                  label="Vehicle Documents (Registration, Fitness, Insurance…)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  files={vehicleDocs}
                  onAdd={f => setVehicleDocs(prev => [...prev, ...f])}
                  onRemove={i => setVehicleDocs(prev => prev.filter((_, idx) => idx !== i))}
                />
                <FileUploadCard
                  label="Owner Documents (CNIC, Ownership Letter, NOC…)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  files={ownerDocs}
                  onAdd={f => setOwnerDocs(prev => [...prev, ...f])}
                  onRemove={i => setOwnerDocs(prev => prev.filter((_, idx) => idx !== i))}
                />
              </div>
            </section>

            {/* ── 7. Notes ── */}
            <section>
              <label className={LABEL}>Notes / Additional Information</label>
              <textarea value={form.notes ?? ""} onChange={e => set("notes", e.target.value)}
                className={INPUT + " h-20 resize-none"} placeholder="Any additional details about this vehicle…" />
            </section>

          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <button onClick={() => setOpen(false)} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors">Cancel</button>
            <button onClick={save} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              {editing ? "Save Changes" : "Add Vehicle"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fleet;
