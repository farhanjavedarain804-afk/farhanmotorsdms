import { useState } from "react";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const weeklyAttendance = [
  { day: "Mon", present: 24, absent: 2 },
  { day: "Tue", present: 23, absent: 3 },
  { day: "Wed", present: 25, absent: 1 },
  { day: "Thu", present: 22, absent: 4 },
  { day: "Fri", present: 20, absent: 6 },
  { day: "Sat", present: 18, absent: 8 },
];

const monthlyTrend = [
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 88 },
  { month: "Mar", rate: 94 },
  { month: "Apr", rate: 91 },
  { month: "May", rate: 89 },
  { month: "Jun", rate: 93 },
];

const todayAttendance = [
  { id: "STF-001", name: "Farhan Ali", department: "Sales", checkIn: "08:55 AM", checkOut: "06:02 PM", hours: "9.1", status: "Present" },
  { id: "STF-002", name: "Kamran Yousaf", department: "Rentals", checkIn: "09:10 AM", checkOut: "06:15 PM", hours: "9.0", status: "Present" },
  { id: "STF-003", name: "Bilal Ahmed", department: "Finance", checkIn: "09:30 AM", checkOut: "—", hours: "—", status: "Late" },
  { id: "STF-004", name: "Usman Tariq", department: "Sales", checkIn: "08:45 AM", checkOut: "06:00 PM", hours: "9.2", status: "Present" },
  { id: "STF-005", name: "Hassan Raza", department: "Workshop", checkIn: "—", checkOut: "—", hours: "—", status: "Absent" },
  { id: "STF-006", name: "Nadia Hussain", department: "Admin", checkIn: "09:00 AM", checkOut: "—", hours: "—", status: "Present" },
  { id: "STF-007", name: "Saad Malik", department: "Sales", checkIn: "—", checkOut: "—", hours: "—", status: "Leave" },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState("2024-03-15");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">Track daily staff attendance and working hours.</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Clock className="h-4 w-4" /> Mark Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider opacity-70">Present Today</p>
          <p className="text-2xl font-heading font-bold mt-1">22/26</p>
          <p className="text-xs opacity-80 mt-1">84.6% attendance</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Late Arrivals</p>
          <p className="text-2xl font-heading font-bold mt-1">3</p>
          <p className="text-xs text-yellow-600 mt-1">After 9:15 AM</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">On Leave</p>
          <p className="text-2xl font-heading font-bold mt-1">2</p>
          <p className="text-xs text-muted-foreground mt-1">1 sick, 1 casual</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Hours</p>
          <p className="text-2xl font-heading font-bold mt-1">8.5h</p>
          <p className="text-xs text-green-600 mt-1">Above target (8h)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAttendance}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="present" fill="hsl(0, 85%, 50%)" radius={[4, 4, 0, 0]} name="Present" stackId="a" />
              <Bar dataKey="absent" fill="hsl(0, 0%, 80%)" radius={[4, 4, 0, 0]} name="Absent" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-heading font-semibold mb-4">Monthly Attendance Rate (%)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(0, 85%, 50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 85%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-semibold">Today's Attendance — {selectedDate}</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Department</th>
              <th className="p-3 font-medium">Check In</th>
              <th className="p-3 font-medium">Check Out</th>
              <th className="p-3 font-medium">Hours</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAttendance.map(a => (
              <tr key={a.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3 text-muted-foreground">{a.department}</td>
                <td className="p-3 text-sm">{a.checkIn}</td>
                <td className="p-3 text-sm">{a.checkOut}</td>
                <td className="p-3 font-semibold">{a.hours}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    a.status === "Present" ? "bg-green-100 text-green-700" :
                    a.status === "Late" ? "bg-yellow-100 text-yellow-700" :
                    a.status === "Leave" ? "bg-blue-100 text-blue-700" :
                    "bg-red-100 text-red-700"
                  }`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;