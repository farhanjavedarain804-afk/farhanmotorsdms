import { useState } from "react";
import { Handshake, Plus, Search, TrendingUp, Car, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const investorRevenueData = [
  { month: "Jan", fixedRent: 2.4, percentage: 1.2, salePurchase: 3.1 },
  { month: "Feb", fixedRent: 2.4, percentage: 0.9, salePurchase: 2.8 },
  { month: "Mar", fixedRent: 2.6, percentage: 1.5, salePurchase: 4.2 },
  { month: "Apr", fixedRent: 2.6, percentage: 1.1, salePurchase: 3.5 },
  { month: "May", fixedRent: 2.8, percentage: 1.8, salePurchase: 3.8 },
  { month: "Jun", fixedRent: 2.8, percentage: 1.4, salePurchase: 4.5 },
];

const vehicleTypeBreakdown = [
  { name: "For Sale", value: 18, color: "hsl(0, 85%, 50%)" },
  { name: "Fixed Rent", value: 12, color: "hsl(0, 0%, 12%)" },
  { name: "% Based Rent", value: 8, color: "hsl(0, 0%, 50%)" },
  { name: "Purchase", value: 5, color: "hsl(0, 70%, 80%)" },
];

const profitTrend = [
  { month: "Jan", profit: 0.8 },
  { month: "Feb", profit: 0.6 },
  { month: "Mar", profit: 1.2 },
  { month: "Apr", profit: 0.9 },
  { month: "May", profit: 1.4 },
  { month: "Jun", profit: 1.1 },
];

const investors = [
  { id: "INV-001", name: "Haji Abdul Rasheed", phone: "0300-1234567", vehicles: 8, arrangement: "Sale & Purchase", totalInvested: "24,000,000", returns: "3,200,000", status: "Active" },
  { id: "INV-002", name: "Ch. Nasir Mehmood", phone: "0321-2345678", vehicles: 5, arrangement: "Fixed Monthly Rent", totalInvested: "15,000,000", returns: "1,800,000", status: "Active" },
  { id: "INV-003", name: "Malik Tariq Javed", phone: "0333-3456789", vehicles: 4, arrangement: "Percentage Based", totalInvested: "12,000,000", returns: "1,400,000", status: "Active" },
  { id: "INV-004", name: "Sheikh Imran", phone: "0311-4567890", vehicles: 6, arrangement: "Sale & Purchase", totalInvested: "18,000,000", returns: "2,100,000", status: "Active" },
  { id: "INV-005", name: "Rana Waseem", phone: "0345-5678901", vehicles: 3, arrangement: "Fixed Monthly Rent", totalInvested: "9,000,000", returns: "900,000", status: "Settled" },
];

const investorVehicles = [
  { plate: "LHR-1234", vehicle: "Toyota Corolla 2024", investor: "Haji Abdul Rasheed", type: "For Sale", purchasePrice: "4,800,000", salePrice: "5,200,000", profit: "400,000", status: "Sold" },
  { plate: "LHR-5678", vehicle: "Honda Civic 2023", investor: "Ch. Nasir Mehmood", type: "Fixed Rent", monthlyRent: "45,000", duration: "12 months", earned: "540,000", status: "Active" },
  { plate: "ISB-9012", vehicle: "Suzuki Cultus 2024", investor: "Malik Tariq Javed", type: "% Based", percentage: "30%", totalEarned: "180,000", status: "Active" },
  { plate: "KHI-3456", vehicle: "Toyota Hilux 2023", investor: "Sheikh Imran", type: "For Sale", purchasePrice: "8,500,000", salePrice: "—", profit: "—", status: "Listed" },
  { plate: "LHR-7890", vehicle: "Honda City 2024", investor: "Ch. Nasir Mehmood", type: "Fixed Rent", monthlyRent: "35,000", duration: "12 months", earned: "210,000", status: "Active" },
];

const Investors = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"investors" | "vehicles">("investors");

  const filteredInvestors = investors.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const filteredVehicles = investorVehicles.filter(v => v.investor.toLowerCase().includes(search.toLowerCase()) || v.vehicle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Investors Management</h1>
          <p className="text-sm text-muted-foreground">Manage investor vehicles — Sale, Purchase, Fixed Rent & Percentage based arrangements.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Investor
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Register New Investor</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Investor Name</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Full name" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="03XX-XXXXXXX" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Arrangement Type</label><select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option>Sale & Purchase</option><option>Fixed Monthly Rent</option><option>Percentage Based</option><option>Mixed</option></select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">CNIC</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="XXXXX-XXXXXXX-X" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Initial Investment (PKR)</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Address</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="City, Area" /></div>
            <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button><button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Register Investor</button></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Total Investors</p>
          <p className="text-2xl font-heading font-bold mt-1">12</p>
          <p className="text-xs opacity-80 mt-1">5 active partnerships</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Investor Vehicles</p>
          <p className="text-2xl font-heading font-bold mt-1">43</p>
          <p className="text-xs text-muted-foreground mt-1">In our fleet</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Investment</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 78M</p>
          <p className="text-xs text-green-600 mt-1">↑ 15% from last quarter</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Returns Paid</p>
          <p className="text-2xl font-heading font-bold mt-1">PKR 9.4M</p>
          <p className="text-xs text-muted-foreground mt-1">This year</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Revenue by Arrangement (PKR M)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={investorRevenueData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="salePurchase" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Sale/Purchase" />
              <Bar dataKey="fixedRent" fill="hsl(0, 0%, 12%)" radius={[4, 4, 0, 0]} name="Fixed Rent" />
              <Bar dataKey="percentage" fill="hsl(0, 0%, 60%)" radius={[4, 4, 0, 0]} name="% Based" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Vehicle Arrangements</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={vehicleTypeBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {vehicleTypeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {vehicleTypeBreakdown.map(v => (
              <div key={v.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v.color }} />
                <span className="text-muted-foreground">{v.name}</span>
                <span className="font-semibold ml-auto">{v.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Our Profit Trend (PKR M)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={profitTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="profit" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-muted rounded-lg p-0.5">
          <button onClick={() => setActiveTab("investors")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "investors" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>Investors</button>
          <button onClick={() => setActiveTab("vehicles")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "vehicles" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>Investor Vehicles</button>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      {activeTab === "investors" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Investor Name</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Vehicles</th>
                <th className="p-3 font-medium">Arrangement</th>
                <th className="p-3 font-medium">Total Invested</th>
                <th className="p-3 font-medium">Returns Paid</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestors.map(i => (
                <tr key={i.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{i.id}</td>
                  <td className="p-3 font-medium">{i.name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{i.phone}</td>
                  <td className="p-3 font-semibold">{i.vehicles}</td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{i.arrangement}</span></td>
                  <td className="p-3 font-semibold">PKR {i.totalInvested}</td>
                  <td className="p-3 text-green-600 font-semibold">PKR {i.returns}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${i.status === "Active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{i.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="p-3 font-medium">Plate</th>
                <th className="p-3 font-medium">Vehicle</th>
                <th className="p-3 font-medium">Investor</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Details</th>
                <th className="p-3 font-medium">Earnings</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((v, idx) => (
                <tr key={idx} className="border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="p-3 font-mono text-xs">{v.plate}</td>
                  <td className="p-3 font-medium">{v.vehicle}</td>
                  <td className="p-3 text-muted-foreground">{v.investor}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    v.type === "For Sale" ? "bg-accent text-accent-foreground" :
                    v.type === "Fixed Rent" ? "bg-blue-100 text-blue-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>{v.type}</span></td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {v.type === "For Sale" ? `Buy: PKR ${v.purchasePrice}` : v.type === "Fixed Rent" ? `PKR ${v.monthlyRent}/mo` : `${v.percentage} share`}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    {v.type === "For Sale" ? (v.profit !== "—" ? `PKR ${v.profit}` : "—") : `PKR ${v.earned}`}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      v.status === "Active" ? "bg-green-100 text-green-700" :
                      v.status === "Sold" ? "bg-muted text-muted-foreground" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Investors;