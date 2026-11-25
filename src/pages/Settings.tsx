import { useState } from "react";
import { Settings as SettingsIcon, Shield, Globe, Database, Bell, Users, Plus, Edit, Trash2, Eye, EyeOff, Save, Landmark, Power, User, Lock, Phone, Mail, Clock, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type UserRecord = { id: number; name: string; username: string; role: string; email: string; phone: string; status: "Active" | "Inactive"; lastLogin: string };
type BankAccount = { id: number; bank: string; title: string; accountNo: string; branch: string; status: "Active" | "Inactive" };

const initialUsers: UserRecord[] = [
  { id: 1, name: "Muhammad Farhan", username: "admin", role: "Super Admin", email: "farhan@farhanmotors.pk", phone: "0300-1234567", status: "Active", lastLogin: "2024-03-15 14:32" },
  { id: 2, name: "Ahmed Ali", username: "ahmed.ali", role: "Manager", email: "ahmed@farhanmotors.pk", phone: "0321-9876543", status: "Active", lastLogin: "2024-03-15 09:18" },
  { id: 3, name: "Hassan Khan", username: "hassan.k", role: "Sales Staff", email: "hassan@farhanmotors.pk", phone: "0333-5551234", status: "Active", lastLogin: "2024-03-14 17:45" },
  { id: 4, name: "Usman Raza", username: "usman.r", role: "Finance", email: "usman@farhanmotors.pk", phone: "0345-7891234", status: "Inactive", lastLogin: "2024-02-28 11:20" },
];

const initialBanks: BankAccount[] = [
  { id: 1, bank: "HBL", title: "Farhan Motors", accountNo: "1234-5678901-01", branch: "Lahore Main", status: "Active" },
  { id: 2, bank: "Meezan Bank", title: "Farhan Motors & RAC", accountNo: "9876-5432101-01", branch: "Gulberg Branch", status: "Active" },
  { id: 3, bank: "UBL", title: "Farhan Motors", accountNo: "5555-1234567-01", branch: "DHA Branch", status: "Inactive" },
];

const userLogs = [
  { time: "14:32", user: "admin", action: "Logged in", ip: "192.168.1.10" },
  { time: "14:25", user: "ahmed.ali", action: "Created Invoice INV-092", ip: "192.168.1.15" },
  { time: "13:50", user: "hassan.k", action: "Added vehicle to fleet", ip: "192.168.1.12" },
  { time: "12:30", user: "admin", action: "Updated settings", ip: "192.168.1.10" },
  { time: "11:15", user: "usman.r", action: "Generated financial report", ip: "192.168.1.18" },
  { time: "10:00", user: "ahmed.ali", action: "Created rental booking", ip: "192.168.1.15" },
  { time: "09:20", user: "admin", action: "Added new user", ip: "192.168.1.10" },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [banks, setBanks] = useState<BankAccount[]>(initialBanks);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");

  // Profile form
  const [profile, setProfile] = useState({ fullName: "Muhammad Farhan", username: "admin", email: "farhan@farhanmotors.pk", phone: "0300-1234567", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileSaved, setProfileSaved] = useState(false);

  // User form
  const [userForm, setUserForm] = useState({ name: "", username: "", role: "Staff", email: "", phone: "", password: "" });

  // Bank form
  const [bankForm, setBankForm] = useState({ bank: "", title: "", accountNo: "", branch: "" });

  // General settings
  const [general, setGeneral] = useState({ currency: "PKR", language: "English", dateFormat: "DD/MM/YYYY", timezone: "Asia/Karachi" });

  // Notification settings
  const [notifs, setNotifs] = useState({ paymentDue: true, vehicleReturn: true, maintenance: true, emi: true, email: true, sms: false });

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.username) return;
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name: userForm.name, username: userForm.username, role: userForm.role, email: userForm.email, phone: userForm.phone } : u));
    } else {
      setUsers(prev => [...prev, { id: Date.now(), name: userForm.name, username: userForm.username, role: userForm.role, email: userForm.email, phone: userForm.phone, status: "Active", lastLogin: "Never" }]);
    }
    setUserForm({ name: "", username: "", role: "Staff", email: "", phone: "", password: "" });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const handleEditUser = (u: UserRecord) => {
    setEditingUser(u);
    setUserForm({ name: u.name, username: u.username, role: u.role, email: u.email, phone: u.phone, password: "" });
    setShowUserForm(true);
  };

  const handleDeleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));
  const toggleUserStatus = (id: number) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));

  const handleSaveBank = () => {
    if (!bankForm.bank || !bankForm.accountNo) return;
    if (editingBank) {
      setBanks(prev => prev.map(b => b.id === editingBank.id ? { ...b, ...bankForm } : b));
    } else {
      setBanks(prev => [...prev, { id: Date.now(), ...bankForm, status: "Active" }]);
    }
    setBankForm({ bank: "", title: "", accountNo: "", branch: "" });
    setEditingBank(null);
    setShowBankForm(false);
  };

  const handleEditBank = (b: BankAccount) => {
    setEditingBank(b);
    setBankForm({ bank: b.bank, title: b.title, accountNo: b.accountNo, branch: b.branch });
    setShowBankForm(true);
  };

  const handleDeleteBank = (id: number) => setBanks(prev => prev.filter(b => b.id !== id));

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const tabs = [
    { id: "users", label: "User Management", icon: Users },
    { id: "profile", label: "My Profile", icon: User },
    { id: "banks", label: "Bank Accounts", icon: Landmark },
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "logs", label: "User Logs", icon: Clock },
    { id: "system", label: "System", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration, user management, and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-56 flex-shrink-0 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User Management */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-semibold">User Management</h2>
                <div className="flex gap-2">
                  <div className="relative w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search users..." />
                  </div>
                  <button onClick={() => { setEditingUser(null); setUserForm({ name: "", username: "", role: "Staff", email: "", phone: "", password: "" }); setShowUserForm(true); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Plus className="h-4 w-4" /> Add User</button>
                </div>
              </div>

              <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div><label className="text-xs text-muted-foreground mb-1 block">Full Name</label><input value={userForm.name} onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Username</label><input value={userForm.username} onChange={e => setUserForm(p => ({ ...p, username: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Email</label><input value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><input value={userForm.phone} onChange={e => setUserForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Role</label>
                      <select value={userForm.role} onChange={e => setUserForm(p => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>Super Admin</option><option>Admin</option><option>Manager</option><option>Sales Staff</option><option>Finance</option><option>Staff</option>
                      </select>
                    </div>
                    {!editingUser && <div><label className="text-xs text-muted-foreground mb-1 block">Password</label><input type="password" value={userForm.password} onChange={e => setUserForm(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>}
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => setShowUserForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">Cancel</button>
                      <button onClick={handleSaveUser} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">{editingUser ? "Update" : "Create"} User</button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/30 text-left">
                    <th className="px-4 py-3 text-muted-foreground font-medium">Name</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Username</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Role</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Contact</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Last Login</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium text-center">Actions</th>
                  </tr></thead>
                  <tbody>
                    {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())).map(u => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{u.username}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{u.role}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}<br />{u.phone}</td>
                        <td className="px-4 py-3"><button onClick={() => toggleUserStatus(u.id)} className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.status}</button></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleEditUser(u)} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* My Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-heading font-semibold">My Profile</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Full Name</label><input value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Username</label><input value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Email</label><input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                </div>
                <hr className="border-border" />
                <h3 className="text-sm font-semibold flex items-center gap-2"><Lock className="h-4 w-4" /> Change Password</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={profile.currentPassword} onChange={e => setProfile(p => ({ ...p, currentPassword: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">New Password</label><input type="password" value={profile.newPassword} onChange={e => setProfile(p => ({ ...p, newPassword: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Confirm Password</label><input type="password" value={profile.confirmPassword} onChange={e => setProfile(p => ({ ...p, confirmPassword: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSaveProfile} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
                {profileSaved && <p className="text-xs text-green-600 text-right animate-pulse">Profile updated successfully!</p>}
              </div>
            </div>
          )}

          {/* Bank Accounts */}
          {activeTab === "banks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-semibold">Bank Accounts</h2>
                <button onClick={() => { setEditingBank(null); setBankForm({ bank: "", title: "", accountNo: "", branch: "" }); setShowBankForm(true); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Plus className="h-4 w-4" /> Add Bank</button>
              </div>

              <Dialog open={showBankForm} onOpenChange={setShowBankForm}>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{editingBank ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div><label className="text-xs text-muted-foreground mb-1 block">Bank Name</label><input value={bankForm.bank} onChange={e => setBankForm(p => ({ ...p, bank: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. HBL" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Account Title</label><input value={bankForm.title} onChange={e => setBankForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Account Number</label><input value={bankForm.accountNo} onChange={e => setBankForm(p => ({ ...p, accountNo: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Branch</label><input value={bankForm.branch} onChange={e => setBankForm(p => ({ ...p, branch: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => setShowBankForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">Cancel</button>
                      <button onClick={handleSaveBank} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">{editingBank ? "Update" : "Add"} Account</button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-3 gap-4">
                {banks.map(b => (
                  <div key={b.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded-lg"><Landmark className="h-4 w-4" /></div>
                        <div>
                          <h3 className="font-semibold text-sm">{b.bank}</h3>
                          <p className="text-xs text-muted-foreground">{b.branch}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${b.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.status}</span>
                    </div>
                    <p className="text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{b.accountNo}</p>
                    <div className="flex gap-1 mt-3 border-t border-border pt-3">
                      <button onClick={() => handleEditBank(b)} className="px-3 py-1.5 bg-muted rounded-lg text-xs hover:bg-muted/80 flex items-center gap-1"><Edit className="h-3 w-3" /> Edit</button>
                      <button onClick={() => handleDeleteBank(b.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 flex items-center gap-1"><Trash2 className="h-3 w-3" /> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General */}
          {activeTab === "general" && (
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-lg font-heading font-semibold">General Settings</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                    <select value={general.currency} onChange={e => setGeneral(p => ({ ...p, currency: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option>PKR</option><option>USD</option><option>AED</option><option>SAR</option>
                    </select>
                  </div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Language</label>
                    <select value={general.language} onChange={e => setGeneral(p => ({ ...p, language: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option>English</option><option>Urdu</option>
                    </select>
                  </div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Date Format</label>
                    <select value={general.dateFormat} onChange={e => setGeneral(p => ({ ...p, dateFormat: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Timezone</label>
                    <select value={general.timezone} onChange={e => setGeneral(p => ({ ...p, timezone: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option>Asia/Karachi</option><option>Asia/Dubai</option><option>UTC</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Save className="h-4 w-4" /> Save</button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-lg font-heading font-semibold">Notification Preferences</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                {[
                  { key: "paymentDue" as const, label: "Payment Due Alerts" },
                  { key: "vehicleReturn" as const, label: "Vehicle Return Reminders" },
                  { key: "maintenance" as const, label: "Maintenance Due" },
                  { key: "emi" as const, label: "EMI Reminders" },
                  { key: "email" as const, label: "Email Notifications" },
                  { key: "sms" as const, label: "SMS Notifications" },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-2">
                    <span className="text-sm">{n.label}</span>
                    <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${notifs[n.key] ? "bg-primary" : "bg-muted"}`}>
                      <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs[n.key] ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><Save className="h-4 w-4" /> Save</button>
                </div>
              </div>
            </div>
          )}

          {/* User Logs */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              <h2 className="text-lg font-heading font-semibold">User Activity Logs</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/30 text-left">
                    <th className="px-4 py-3 text-muted-foreground font-medium">Time</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">User</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">Action</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium">IP Address</th>
                  </tr></thead>
                  <tbody>
                    {userLogs.map((l, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{l.time}</td>
                        <td className="px-4 py-3 font-medium">{l.user}</td>
                        <td className="px-4 py-3 text-muted-foreground">{l.action}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System */}
          {activeTab === "system" && (
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-lg font-heading font-semibold">System Settings</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2"><Power className="h-4 w-4" /> Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Portal will be inaccessible to non-admin users</p>
                  </div>
                  <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${maintenanceMode ? "bg-red-500" : "bg-muted"}`}>
                    <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${maintenanceMode ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                {maintenanceMode && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg">⚠️ Maintenance mode is ON. Only admins can access the portal.</p>}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div><p className="text-sm font-medium">Auto Backup</p><p className="text-xs text-muted-foreground">Daily automated backup</p></div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div><p className="text-sm font-medium">Cloud Sync</p><p className="text-xs text-muted-foreground">Real-time data synchronization</p></div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div><p className="text-sm font-medium">Last Backup</p><p className="text-xs text-muted-foreground">Most recent backup timestamp</p></div>
                    <span className="text-xs text-muted-foreground font-mono">2024-03-15 02:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
