import { useState } from "react";
import { Package, Plus, Search, Tag, Car } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const stockByCategory = [
  { name: "For Sale", value: 32, color: "hsl(0, 85%, 50%)" },
  { name: "For Rent", value: 28, color: "hsl(0, 0%, 12%)" },
  { name: "Reserved", value: 8, color: "hsl(0, 0%, 50%)" },
  { name: "In Process", value: 5, color: "hsl(0, 70%, 80%)" },
];

const priceRange = [
  { range: "< 3M", count: 12 },
  { range: "3-5M", count: 18 },
  { range: "5-8M", count: 15 },
  { range: "8-12M", count: 8 },
  { range: "> 12M", count: 4 },
];

const stockVehicles = [
  { id: "STK-001", vehicle: "Toyota Corolla GLi 2024", plate: "LHR-1234", category: "For Sale", price: "5,200,000", condition: "New", daysInStock: 12, location: "Main Showroom" },
  { id: "STK-002", vehicle: "Honda Civic Oriel 2023", plate: "LHR-5678", category: "For Rent", rate: "8,000/day", condition: "Excellent", daysInStock: 0, location: "Rental Lot" },
  { id: "STK-003", vehicle: "Suzuki Alto VXR 2024", plate: "ISB-9012", category: "For Sale", price: "2,800,000", condition: "New", daysInStock: 5, location: "Main Showroom" },
  { id: "STK-004", vehicle: "Toyota Hilux Revo 2023", plate: "KHI-3456", category: "For Rent", rate: "15,000/day", condition: "Good", daysInStock: 0, location: "Rental Lot" },
  { id: "STK-005", vehicle: "Honda City Aspire 2024", plate: "LHR-7890", category: "For Sale", price: "4,500,000", condition: "New", daysInStock: 20, location: "Main Showroom" },
  { id: "STK-006", vehicle: "Toyota Yaris ATIV 2023", plate: "ISB-2345", category: "Reserved", price: "3,900,000", condition: "Excellent", daysInStock: 8, location: "Main Showroom" },
  { id: "STK-007", vehicle: "Suzuki Cultus VXL 2024", plate: "KHI-6789", category: "For Rent", rate: "4,000/day", condition: "Good", daysInStock: 0, location: "Rental Lot" },
  { id: "STK-008", vehicle: "Honda BR-V S 2023", plate: "LHR-0123", category: "For Sale", price: "5,800,000", condition: "Excellent", daysInStock: 15, location: "Main Showroom" },
];

const Stock = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = stockVehicles.filter(v => {
    const matchSearch = v.vehicle.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || v.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Stock — Sale & Rent Vehicles</h1>
          <p className="text-sm text-muted-foreground">View all on-stock vehicles available for sale & rent.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add to Stock
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add Vehicle to Stock</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Make Model Year" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Plate No.</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="LHR-XXXX" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>For Sale</option><option>For Rent</option><option>Both</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Price / Rate (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Condition</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>New</option><option>Excellent</option><option>Good</option><option>Fair</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Location</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Main Showroom" /></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Add to Stock</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Stock</p>
          <p className="text-2xl font-heading font-bold mt-1">73</p>
          <p className="text-xs opacity-80 mt-1">Vehicles in inventory</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">For Sale</p>
          <p className="text-2xl font-heading font-bold mt-1">32</p>
          <p className="text-xs text-green-600 mt-1">PKR 185M total value</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">For Rent</p>
          <p className="text-2xl font-heading font-bold mt-1">28</p>
          <p className="text-xs text-blue-600 mt-1">18 currently rented</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Days in Stock</p>
          <p className="text-2xl font-heading font-bold mt-1">14</p>
          <p className="text-xs text-muted-foreground mt-1">Sale vehicles</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Stock by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stockByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {stockByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {stockByCategory.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="font-semibold ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Price Range Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priceRange}>
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {["All", "For Sale", "For Rent", "Reserved"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Vehicle</th>
              <th className="p-3 font-medium">Plate</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price/Rate</th>
              <th className="p-3 font-medium">Condition</th>
              <th className="p-3 font-medium">Days</th>
              <th className="p-3 font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="p-3 font-mono text-xs text-muted-foreground">{v.id}</td>
                <td className="p-3 font-medium">{v.vehicle}</td>
                <td className="p-3 font-mono text-xs">{v.plate}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    v.category === "For Sale" ? "bg-accent text-accent-foreground" :
                    v.category === "For Rent" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{v.category}</span>
                </td>
                <td className="p-3 font-semibold">PKR {v.price || v.rate}</td>
                <td className="p-3 text-xs text-muted-foreground">{v.condition}</td>
                <td className="p-3 text-xs">{v.daysInStock > 0 ? v.daysInStock : "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{v.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
