import { useState } from "react";
import { ArrowRightLeft, Plus, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const dailyMovement = [
  { day: "Mon", in: 5, out: 8 },
  { day: "Tue", in: 7, out: 6 },
  { day: "Wed", in: 4, out: 9 },
  { day: "Thu", in: 6, out: 5 },
  { day: "Fri", in: 8, out: 7 },
  { day: "Sat", in: 3, out: 10 },
];

const monthlyTrend = [
  { month: "Jan", movements: 68 },
  { month: "Feb", movements: 55 },
  { month: "Mar", movements: 82 },
  { month: "Apr", movements: 74 },
  { month: "May", movements: 91 },
  { month: "Jun", movements: 85 },
];

const movements = [
  { id: "MOV-001", date: "2024-03-15 09:30", vehicle: "Toyota Corolla 2024", plate: "LHR-1234", direction: "Out", purpose: "Rental - Sara Ali", handler: "Kamran", kmReading: "45,230", fuelLevel: "Full", condition: "Good" },
  { id: "MOV-002", date: "2024-03-15 10:15", vehicle: "Honda Civic 2023", plate: "LHR-5678", direction: "In", purpose: "Return - Ahmed Khan", handler: "Bilal", kmReading: "32,100", fuelLevel: "3/4", condition: "Minor Scratch" },
  { id: "MOV-003", date: "2024-03-15 11:00", vehicle: "Suzuki Alto 2024", plate: "ISB-9012", direction: "Out", purpose: "Sale Delivery", handler: "Usman", kmReading: "1,200", fuelLevel: "Full", condition: "New" },
  { id: "MOV-004", date: "2024-03-15 14:30", vehicle: "Toyota Hilux 2023", plate: "KHI-3456", direction: "In", purpose: "Maintenance Return", handler: "Hassan", kmReading: "67,800", fuelLevel: "Half", condition: "Good" },
  { id: "MOV-005", date: "2024-03-15 15:45", vehicle: "Honda BR-V 2023", plate: "LHR-0123", direction: "Out", purpose: "Test Drive - Bilal Ahmed", handler: "Farhan", kmReading: "28,500", fuelLevel: "Full", condition: "Good" },
  { id: "MOV-006", date: "2024-03-14 17:00", vehicle: "Toyota Yaris 2023", plate: "ISB-2345", direction: "In", purpose: "Rental Return - Omar", handler: "Kamran", kmReading: "41,600", fuelLevel: "1/4", condition: "Good" },
];

const VehicleInOut = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = movements.filter(m => m.vehicle.toLowerCase().includes(search.toLowerCase()) || m.plate.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Vehicle In & Out</h1>
          <p className="text-sm text-muted-foreground">Track all vehicle movements — departures & arrivals.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Log Movement
        </button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Log Vehicle Movement</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Direction</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Out (Departure)</option><option>In (Arrival)</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Select vehicle" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Plate No.</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="LHR-XXXX" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Purpose</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Rental</option><option>Sale Delivery</option><option>Test Drive</option><option>Maintenance</option><option>Return</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">KM Reading</label><input type="number" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Fuel Level</label>
              <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Full</option><option>3/4</option><option>Half</option><option>1/4</option><option>Empty</option>
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Vehicle Condition</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Good, Minor Scratch, etc." /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Handler</label><input className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Staff name" /></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium">Cancel</button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Log Movement</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Today's Movements</p>
          <p className="text-2xl font-heading font-bold mt-1">14</p>
          <p className="text-xs opacity-80 mt-1">6 In / 8 Out</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicles Out</p>
          <p className="text-2xl font-heading font-bold mt-1">38</p>
          <p className="text-xs text-yellow-600 mt-1">Currently outside</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected Returns</p>
          <p className="text-2xl font-heading font-bold mt-1">5</p>
          <p className="text-xs text-blue-600 mt-1">Due today</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue Returns</p>
          <p className="text-2xl font-heading font-bold mt-1">2</p>
          <p className="text-xs text-red-600 mt-1">Late returns</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Daily In/Out</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyMovement}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="in" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="In" />
              <Bar dataKey="out" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Out" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Movement Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="movements" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by vehicle or plate..." className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Date/Time</th>
              <th className="p-3 font-medium">Direction</th>
              <th className="p-3 font-medium">Vehicle</th>
              <th className="p-3 font-medium">Plate</th>
              <th className="p-3 font-medium">Purpose</th>
              <th className="p-3 font-medium">KM</th>
              <th className="p-3 font-medium">Fuel</th>
              <th className="p-3 font-medium">Condition</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{m.id}</td>
                <td className="p-3 text-xs text-muted-foreground">{m.date}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${m.direction === "In" ? "text-green-600" : "text-red-600"}`}>
                    {m.direction === "In" ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />} {m.direction}
                  </span>
                </td>
                <td className="p-3 font-medium">{m.vehicle}</td>
                <td className="p-3 font-mono text-xs">{m.plate}</td>
                <td className="p-3 text-xs text-muted-foreground">{m.purpose}</td>
                <td className="p-3 text-xs">{m.kmReading}</td>
                <td className="p-3 text-xs">{m.fuelLevel}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.condition === "Good" || m.condition === "New" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{m.condition}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleInOut;
