import { useState } from "react";
import { FolderOpen, Plus, Search, FileText, Download, Eye, Trash2, Upload } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const docTypes = [
  { name: "Agreements", value: 45, color: "hsl(0, 85%, 50%)" },
  { name: "Receipts", value: 30, color: "hsl(0, 0%, 12%)" },
  { name: "CNIC Copies", value: 55, color: "hsl(0, 0%, 50%)" },
  { name: "Registrations", value: 38, color: "hsl(0, 70%, 80%)" },
  { name: "Insurance", value: 22, color: "hsl(0, 0%, 70%)" },
];

const monthlyUploads = [
  { month: "Jan", count: 28 },
  { month: "Feb", count: 22 },
  { month: "Mar", count: 45 },
  { month: "Apr", count: 35 },
  { month: "May", count: 42 },
  { month: "Jun", count: 38 },
];

const documents = [
  { id: "DOC-001", name: "Sale Agreement - Ahmed Khan", type: "Agreement", category: "Sales", relatedTo: "Toyota Corolla 2024", date: "2024-03-15", size: "245 KB", status: "Active" },
  { id: "DOC-002", name: "Rent Agreement - Sara Ali", type: "Agreement", category: "Rentals", relatedTo: "Honda Civic 2023", date: "2024-03-14", size: "180 KB", status: "Active" },
  { id: "DOC-003", name: "CNIC - Ahmed Khan", type: "CNIC Copy", category: "Customer", relatedTo: "C-001", date: "2024-03-15", size: "120 KB", status: "Verified" },
  { id: "DOC-004", name: "Vehicle Registration - LHR-1234", type: "Registration", category: "Fleet", relatedTo: "Toyota Corolla 2024", date: "2024-01-10", size: "340 KB", status: "Active" },
  { id: "DOC-005", name: "Insurance Policy - Honda Civic", type: "Insurance", category: "Fleet", relatedTo: "Honda Civic 2023", date: "2024-02-20", size: "450 KB", status: "Expiring" },
  { id: "DOC-006", name: "Purchase Receipt - Suzuki Alto", type: "Receipt", category: "Sales", relatedTo: "Suzuki Alto 2024", date: "2024-03-12", size: "95 KB", status: "Active" },
  { id: "DOC-007", name: "Finance Agreement - Usman Tariq", type: "Agreement", category: "Finance", relatedTo: "Suzuki Alto 2024", date: "2024-03-13", size: "280 KB", status: "Active" },
  { id: "DOC-008", name: "Investor Agreement - Haji Rasheed", type: "Agreement", category: "Investors", relatedTo: "INV-001", date: "2024-01-05", size: "310 KB", status: "Active" },
];

const Documents = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = documents.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Document Organizer</h1>
          <p className="text-sm text-muted-foreground">Centralized document management — agreements, CNIC copies, registrations, and more.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Document Name</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Document title" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Agreement</option><option>Receipt</option><option>CNIC Copy</option><option>Registration</option><option>Insurance</option><option>Other</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Sales</option><option>Rentals</option><option>Finance</option><option>Fleet</option><option>Customer</option><option>Investors</option><option>HR</option>
              </select>
            </div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Related To</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Vehicle, Customer ID, etc." /></div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">File</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Upload</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Documents</p>
          <p className="text-2xl font-heading font-bold mt-1">190</p>
          <p className="text-xs opacity-80 mt-1">Across all categories</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Agreements</p>
          <p className="text-2xl font-heading font-bold mt-1">45</p>
          <p className="text-xs text-green-600 mt-1">All verified</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
          <p className="text-2xl font-heading font-bold mt-1">38</p>
          <p className="text-xs text-muted-foreground mt-1">Documents uploaded</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Expiring Soon</p>
          <p className="text-2xl font-heading font-bold mt-1">4</p>
          <p className="text-xs text-yellow-600 mt-1">Insurance & registrations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Documents by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={docTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {docTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {docTypes.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Uploads</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyUploads}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {["All", "Sales", "Rentals", "Finance", "Fleet", "Customer"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Document</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Related To</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{d.id}</td>
                <td className="p-3 font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{d.name}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{d.type}</span></td>
                <td className="p-3 text-xs text-muted-foreground">{d.category}</td>
                <td className="p-3 text-xs text-muted-foreground">{d.relatedTo}</td>
                <td className="p-3 text-xs text-muted-foreground">{d.date}</td>
                <td className="p-3 text-xs text-muted-foreground">{d.size}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    d.status === "Active" || d.status === "Verified" ? "bg-green-100 text-green-700" :
                    d.status === "Expiring" ? "bg-yellow-100 text-yellow-700" :
                    "bg-muted text-muted-foreground"
                  }`}>{d.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded hover:bg-muted transition-colors"><Download className="h-3.5 w-3.5 text-muted-foreground" /></button>
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

export default Documents;
