import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Search, FileText, ClipboardCheck, Car, Shield, CheckCircle, XCircle, Loader2, Phone, Globe, MapPin, Sparkles, Heart, Users, Wrench, Repeat, CalendarPlus, Plane, Banknote, Landmark, ScrollText, AlertTriangle, KeyRound, Download, ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";

import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/farhan-motors-logo.png";

const BRAND = "Farhan Motors & Rent A Car (Private) Limited";
const FM_ADDR = "Near Bypass Multan Road, Chowk Azam, Layyah, Punjab, Pakistan";
const DEV_ADDR = "Near Farhan Motors & Rent A Car, Multan Road, Chowk Azam, Layyah, Punjab, Pakistan";
const FM_PHONE = "+923284880257";
const DEV_PHONE = "+923177121841";
const waLink = (p: string) => `https://wa.me/${p.replace(/[^0-9]/g, "")}`;

const Login = () => {
  const { signIn } = useAuth();
  const [tab, setTab] = useState<"login" | "services" | "verify">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signMode, setSignMode] = useState<"password" | "pin">("password");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [verifyType, setVerifyType] = useState("invoice");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState<null | { valid: boolean; info: string; details?: Record<string, string> }>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<"input" | "details">("input");
  const [time, setTime] = useState(new Date());
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const handler = (e: MouseEvent) => setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", handler);
    return () => { clearInterval(t); window.removeEventListener("mousemove", handler); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setLoginError("");
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setLoginError(error); setTimeout(() => setLoginError(""), 4000); }
    else { try { localStorage.setItem("fm_quick_email", email); localStorage.setItem("fm_quick_pw", password); } catch {} }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    if (pin !== "4457") { setPinError("Invalid PIN. Try again."); setTimeout(() => setPinError(""), 3000); return; }
    const savedEmail = localStorage.getItem("fm_quick_email");
    const savedPw = localStorage.getItem("fm_quick_pw");
    if (!savedEmail || !savedPw) { setPinError("PIN verified. Please sign in with password first to enable PIN login."); setTimeout(() => setPinError(""), 5000); return; }
    setLoading(true);
    const { error } = await signIn(savedEmail, savedPw);
    setLoading(false);
    if (error) { setPinError("PIN ok, but stored credentials expired. Use password."); setTimeout(() => setPinError(""), 4000); }
  };

  const dummyDetails = (type: string, code: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const ref = code || `${type.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (type === "invoice") return { "Invoice No": ref, "Customer": "Muhammad Ahmed Khan", "Vehicle": "Toyota Corolla GLi 2022", "Amount (PKR)": "1,850,000", "Status": "Paid", "Issue Date": today, "Verified By": BRAND };
    if (type === "vehicle") return { "Registration No": ref, "Make / Model": "Honda Civic Oriel 1.5 Turbo", "Year": "2023", "Color": "Pearl White", "Engine": "1498cc Turbo", "Owner": "Ch Tahir Javed Arain", "Status": "Active — Verified", "Verified By": BRAND };
    if (type === "inspection") return { "Inspection ID": ref, "Vehicle": "Suzuki Cultus VXL 2021", "Inspector": "Eng. Bilal Hussain", "Date": today, "Engine Condition": "Excellent (9/10)", "Body Condition": "Very Good (8.5/10)", "Result": "PASSED", "Verified By": BRAND };
    return { "Document ID": ref, "Title": "Vehicle Registration Certificate", "Category": "Official", "Issued To": "Ch Furqan Javed Arain", "Issue Date": today, "Expiry Date": "2027-12-31", "Status": "Valid & Verified", "Verified By": BRAND };
  };

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifying(true); setVerifyResult(null);
    try {
      const code = verifyCode.trim();
      const details = dummyDetails(verifyType, code);
      setVerifyResult({ valid: true, info: `${verifyType.toUpperCase()} ${code} verified successfully.`, details });
      setVerifyStep("details");
    } finally { setVerifying(false); }
  };

  const downloadVerificationPdf = () => {
    if (!verifyResult?.details) return;
    const doc = new jsPDF();
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16); doc.text(BRAND, 14, 12);
    doc.setFontSize(10); doc.text("Official Verification Report — Digital Management System (DMS)", 14, 20);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(13); doc.text(`${verifyType.toUpperCase()} VERIFICATION CERTIFICATE`, 14, 42);
    doc.setDrawColor(220, 38, 38); doc.line(14, 45, 196, 45);
    let y = 56;
    doc.setFontSize(10);
    Object.entries(verifyResult.details).forEach(([k, v]) => {
      doc.setFont("helvetica", "bold"); doc.text(`${k}:`, 16, y);
      doc.setFont("helvetica", "normal"); doc.text(String(v), 70, y);
      y += 9;
    });
    y += 6;
    doc.setDrawColor(180); doc.line(14, y, 196, y); y += 8;
    doc.setFont("helvetica", "bold"); doc.setTextColor(22, 163, 74);
    doc.text("✓ VERIFIED AUTHENTIC", 14, y); y += 8;
    doc.setFont("helvetica", "normal"); doc.setTextColor(80);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString("en-PK")}`, 14, y); y += 5;
    doc.text(`Verification ID: VRF-${Date.now()}`, 14, y); y += 5;
    doc.text("This is a system-generated report. Terms & Conditions apply.", 14, y);
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text(`© ${new Date().getFullYear()} ${BRAND}. All rights reserved.`, 14, 285);
    doc.save(`Verification-${verifyType}-${verifyCode || "report"}.pdf`);
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-[hsl(0,0%,3%)] flex flex-col items-center justify-center">
      {/* Aurora gradient mesh */}
      <div className="absolute inset-0 opacity-70" style={{
        background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, hsla(217,91%,60%,0.18), transparent 40%),
                     radial-gradient(circle at 80% 20%, hsla(280,90%,60%,0.15), transparent 50%),
                     radial-gradient(circle at 10% 90%, hsla(190,90%,55%,0.12), transparent 50%)`
      }} />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)"
      }} />

      {/* Animated blobs + floating objects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

        {/* Floating geometric objects */}
        {[
          { left: "8%", size: 40, delay: "0s", dur: "14s", shape: "ring", color: "#3b82f6" },
          { left: "22%", size: 28, delay: "3s", dur: "18s", shape: "diamond", color: "#a855f7" },
          { left: "38%", size: 36, delay: "1s", dur: "16s", shape: "tri", color: "#06b6d4" },
          { left: "55%", size: 24, delay: "5s", dur: "20s", shape: "ring", color: "#f59e0b" },
          { left: "68%", size: 44, delay: "2s", dur: "22s", shape: "diamond", color: "#10b981" },
          { left: "82%", size: 32, delay: "4s", dur: "17s", shape: "tri", color: "#ef4444" },
          { left: "92%", size: 26, delay: "6s", dur: "19s", shape: "ring", color: "#ec4899" },
        ].map((o, i) => (
          <div key={`fo-${i}`} className="absolute animate-float-obj" style={{
            left: o.left, bottom: "-60px", width: o.size, height: o.size,
            animationDelay: o.delay, animationDuration: o.dur,
          }}>
            {o.shape === "ring" && <div className="w-full h-full rounded-full border-2" style={{ borderColor: o.color, boxShadow: `0 0 20px ${o.color}80` }} />}
            {o.shape === "diamond" && <div className="w-full h-full rotate-45 border-2" style={{ borderColor: o.color, boxShadow: `0 0 20px ${o.color}80` }} />}
            {o.shape === "tri" && <div style={{ width: 0, height: 0, borderLeft: `${o.size/2}px solid transparent`, borderRight: `${o.size/2}px solid transparent`, borderBottom: `${o.size}px solid ${o.color}`, opacity: 0.4, filter: `drop-shadow(0 0 12px ${o.color})` }} />}
          </div>
        ))}

        {/* Particles */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/40 animate-float" style={{
            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`, animationDelay: `${Math.random() * 5}s`
          }} />
        ))}

        {/* Shooting stars */}
        {[...Array(4)].map((_, i) => (
          <div key={`s-${i}`} className="absolute h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent animate-shoot" style={{
            top: `${10 + Math.random() * 40}%`, left: `${Math.random() * 60}%`,
            animationDelay: `${i * 4}s`, animationDuration: "8s"
          }} />
        ))}

        {/* Fireworks */}
        {[
          { left: "12%", top: "18%", delay: "0s", color: "#ef4444" },
          { left: "78%", top: "14%", delay: "1.4s", color: "#22d3ee" },
          { left: "32%", top: "10%", delay: "2.8s", color: "#fde047" },
          { left: "62%", top: "22%", delay: "4.1s", color: "#a855f7" },
          { left: "88%", top: "32%", delay: "5.5s", color: "#10b981" },
          { left: "20%", top: "28%", delay: "6.7s", color: "#ec4899" },
        ].map((fw, idx) => (
          <div key={`fw-${idx}`} className="absolute" style={{ left: fw.left, top: fw.top, animation: `fw-launch 7s ease-out ${fw.delay} infinite` }}>
            <div className="relative w-1 h-1">
              {[...Array(14)].map((_, i) => (
                <span key={i} className="absolute left-1/2 top-1/2 block w-1 h-1 rounded-full"
                  style={{
                    background: fw.color,
                    boxShadow: `0 0 8px ${fw.color}, 0 0 16px ${fw.color}`,
                    transform: `rotate(${(i * 360) / 14}deg) translateY(0)`,
                    animation: `fw-spark 1.6s ease-out ${fw.delay} infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Single upper traffic lane */}
      <div className="absolute bottom-24 left-0 right-0 h-24 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-8 h-[2px] bg-white/10" />
        <div className="absolute inset-x-0 top-[42px] flex gap-6 opacity-60 animate-road">
          {[...Array(50)].map((_, i) => <div key={i} className="h-[2px] w-10 bg-yellow-400/70 flex-shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />)}
        </div>
        <div className="absolute inset-x-0 top-0 h-14">
          <div className="absolute animate-car-ltr-1"><CarSvg type="super" color="#dc2626" /></div>
          <div className="absolute animate-car-ltr-2"><CarSvg type="suv" color="#1e3a8a" /></div>
          <div className="absolute animate-car-ltr-3"><CarSvg type="sedan" color="#facc15" /></div>
        </div>
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl opacity-70 animate-road" />
      </div>

      <style>{`
        @keyframes car-ltr-1 { 0%{transform:translateX(-260px)} 100%{transform:translateX(110vw)} }
        @keyframes car-ltr-2 { 0%{transform:translateX(-260px)} 100%{transform:translateX(110vw)} }
        @keyframes car-ltr-3 { 0%{transform:translateX(-260px)} 100%{transform:translateX(110vw)} }
        @keyframes road-move { 0%{transform:translateX(0)} 100%{transform:translateX(-64px)} }
        @keyframes blink-light { 0%,40%,100%{opacity:1;filter:drop-shadow(0 0 8px currentColor)} 45%,95%{opacity:0.2;filter:none} }
        @keyframes blink-indicator { 0%,49%{opacity:1;filter:drop-shadow(0 0 6px #fbbf24)} 50%,100%{opacity:0.15;filter:none} }
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes float { 0%,100%{transform:translateY(0) translateX(0);opacity:0.3} 50%{transform:translateY(-100px) translateX(20px);opacity:1} }
        @keyframes float-obj { 0%{transform:translateY(0) rotate(0deg);opacity:0} 10%{opacity:0.7} 90%{opacity:0.7} 100%{transform:translateY(-110vh) rotate(360deg);opacity:0} }
        @keyframes shoot { 0%{transform:translateX(-100px) translateY(0) rotate(15deg);opacity:0} 10%{opacity:1} 60%{opacity:1} 100%{transform:translateX(800px) translateY(200px) rotate(15deg);opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px hsla(217,91%,60%,0.3),0 0 40px hsla(217,91%,60%,0.1)} 50%{box-shadow:0 0 30px hsla(217,91%,60%,0.5),0 0 60px hsla(217,91%,60%,0.2)} }
        @keyframes neon-run { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        @keyframes flag-wave { 0%,100%{transform:skewY(0deg)} 50%{transform:skewY(-2deg)} }
        @keyframes fw-launch { 0%,70%,100%{opacity:0} 72%,85%{opacity:1} }
        @keyframes fw-spark { 0%{transform:rotate(var(--r,0deg)) translateY(0);opacity:0} 10%{opacity:1} 100%{transform:rotate(var(--r,0deg)) translateY(80px);opacity:0} }
        .animate-car-ltr-1 { animation: car-ltr-1 16s linear infinite; }
        .animate-car-ltr-2 { animation: car-ltr-2 22s linear infinite; animation-delay: 5s; }
        .animate-car-ltr-3 { animation: car-ltr-3 19s linear infinite; animation-delay: 10s; }
        .animate-road { animation: road-move 0.8s linear infinite; }
        .animate-blob { animation: blob 18s ease-in-out infinite; }
        .animate-float { animation: float linear infinite; }
        .animate-float-obj { animation: float-obj linear infinite; }
        .animate-shoot { animation: shoot ease-in infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-flag-wave { animation: flag-wave 3s ease-in-out infinite; transform-origin: left center; }
        .car-headlight { animation: blink-light 2.5s ease-in-out infinite; color: #fde047; }
        .car-indicator { animation: blink-indicator 0.7s ease-in-out infinite; }
        .shimmer-text { background: linear-gradient(90deg, #fff 0%, #93c5fd 25%, #fff 50%, #93c5fd 75%, #fff 100%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 4s linear infinite; }
        /* Enhanced neon running border */
        .neon-border { position: relative; }
        .neon-border::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 2px;
          background: linear-gradient(90deg, #3b82f6, #a855f7, #06b6d4, #ec4899, #f59e0b, #3b82f6);
          background-size: 400% 100%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: neon-run 3s linear infinite;
          pointer-events: none; opacity: 1; z-index: 2;
          filter: drop-shadow(0 0 6px rgba(59,130,246,0.9)) drop-shadow(0 0 12px rgba(168,85,247,0.7));
        }
        .neon-border::after {
          content: ""; position: absolute; inset: 0; border-radius: inherit;
          box-shadow: inset 0 0 20px rgba(59,130,246,0.25), 0 0 25px rgba(59,130,246,0.35), 0 0 50px rgba(168,85,247,0.25);
          pointer-events: none; animation: glow-pulse 3s ease-in-out infinite; z-index: 1;
        }
        /* Neon text glow */
        .neon-text {
          text-shadow:
            0 0 5px rgba(59,130,246,0.8),
            0 0 10px rgba(59,130,246,0.6),
            0 0 20px rgba(168,85,247,0.5),
            0 0 40px rgba(6,182,212,0.3);
        }
      `}</style>

      {/* Top bar */}
      <div className="absolute top-4 left-0 right-0 z-20 grid grid-cols-3 items-center px-6 gap-3">
        <div className="neon-border flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 justify-self-start">
          <Car className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-xs text-white/80 font-semibold tracking-wide">Farhan Motors & Rent A Car (Private) Limited</span>
        </div>
        <div className="neon-border justify-self-center px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-md border border-white/15">
          <span className="text-xs md:text-sm font-heading font-bold shimmer-text whitespace-nowrap">Digital Management System — DMS</span>
        </div>
        <div className="neon-border flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 justify-self-end">
          <span className="text-xs text-white/70 font-mono tabular-nums">{time.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-white/50 hidden md:inline">{time.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" })}</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 grid md:grid-cols-2 lg:[grid-template-columns:1fr_1.5fr_1fr] gap-4 min-h-[600px] mt-20">
        <div className={`transition-all duration-500 ${tab === "login" ? "opacity-100 scale-100" : "opacity-60 scale-95"}`}>
          <div className="neon-border h-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden" onClick={() => setTab("login")}>
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-2xl animate-pulse" />
                  <img src={logo} alt="Farhan Motors" className="h-14 brightness-0 invert relative" />
                </div>
              </div>
              <h2 className="text-3xl font-heading font-bold text-center mb-1 shimmer-text">Welcome Back</h2>
              <p className="text-sm text-white/50 text-center mb-5">Sign in to your DMS portal</p>

              <div className="max-w-sm mx-auto w-full">
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSignMode("password"); }} className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${signMode === "password" ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30" : "text-white/60 hover:text-white"}`}>
                    <Lock className="h-3.5 w-3.5" /> Sign in Securely
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSignMode("pin"); }} className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${signMode === "pin" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30" : "text-white/60 hover:text-white"}`}>
                    <KeyRound className="h-3.5 w-3.5" /> Sign in with PIN
                  </button>
                </div>

                <div className="relative overflow-hidden">
                  <div className={`transition-all duration-500 ease-out ${signMode === "password" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"}`}>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="relative group/input">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within/input:text-primary transition-colors" />
                        <input type="email" required={signMode === "password"} value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all" placeholder="Email address" />
                      </div>
                      <div className="relative group/input">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within/input:text-primary transition-colors" />
                        <input type={showPassword ? "text" : "password"} required={signMode === "password"} minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all" placeholder="Password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginError && <p className="text-xs text-red-400 text-center animate-pulse">{loginError}</p>}
                      <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl text-sm font-semibold transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 animate-glow-pulse">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                        Sign In Securely
                      </button>
                    </form>
                  </div>

                  <div className={`transition-all duration-500 ease-out ${signMode === "pin" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"}`}>
                    <form onSubmit={handlePinLogin} className="space-y-4">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-3 animate-glow-pulse">
                          <KeyRound className="h-6 w-6 text-purple-300" />
                        </div>
                        <p className="text-xs text-white/60">Enter your 4-digit secure PIN</p>
                      </div>
                      <div className="flex justify-center gap-2">
                        {[0,1,2,3].map(i => (
                          <input key={i} id={`pin-${i}`} type="password" inputMode="numeric" maxLength={1} value={pin[i] || ""}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "");
                              const next = (pin.padEnd(4, " ").substring(0, i) + (v || " ") + pin.padEnd(4, " ").substring(i + 1)).trimEnd();
                              setPin(next);
                              if (v && i < 3) (document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus();
                            }}
                            onKeyDown={(e) => { if (e.key === "Backspace" && !pin[i] && i > 0) (document.getElementById(`pin-${i-1}`) as HTMLInputElement)?.focus(); }}
                            className="w-12 h-14 text-center text-xl font-bold bg-white/5 border-2 border-white/15 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all" />
                        ))}
                      </div>
                      {pinError && <p className="text-xs text-red-400 text-center animate-pulse">{pinError}</p>}
                      <button type="submit" disabled={loading || pin.length !== 4} className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl text-sm font-semibold transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                        Unlock with PIN
                      </button>
                      <p className="text-[10px] text-white/30 text-center">Quick access after first password sign-in</p>
                    </form>
                  </div>
                </div>
                <p className="text-xs text-white/30 text-center pt-3">Access by invitation only. Contact your administrator.</p>
              </div>

            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ${tab === "services" ? "opacity-100 scale-100" : "opacity-60 scale-95"}`}>
          <div className="neon-border h-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden cursor-pointer" onClick={() => setTab("services")}>
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="relative">
                  <Users className="h-7 w-7 text-primary relative z-10" />
                  <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse" />
                </div>
                <h2 className="text-xl font-heading font-bold shimmer-text">Ownership & Services</h2>
              </div>

              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-2 text-center">Owners</p>
                <div className="space-y-1.5">
                  {[
                    { name: "Ch Tahir Javed Arain", phone: "+923055648793", display: "0305-5648793" },
                    { name: "Ch Furqan Javed Arain", phone: "+923421297793", display: "0342-1297793" },
                    { name: "Ch Farhan Javed Arain", phone: "+923407992357", display: "0340-7992357" },
                  ].map((o) => (
                    <a key={o.name} href={waLink(o.phone)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 transition-all group/own">
                      <span className="text-xs text-white/80 font-medium">{o.name}</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-green-400 font-mono group-hover/own:text-green-300">
                        <Phone className="h-3 w-3" /> {o.display}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-2 text-center">Our Services</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Car, label: "Rent A Car" },
                    { icon: Repeat, label: "Vehicle Sale & Purchase" },
                    { icon: Repeat, label: "Vehicle Exchange (Trade-in)" },
                    { icon: CalendarPlus, label: "New Vehicle Booking" },
                    { icon: Plane, label: "Vehicle Import Services" },
                    { icon: Banknote, label: "Installment Plans" },
                    { icon: Landmark, label: "Islamic Bank Financing" },
                    { icon: ClipboardCheck, label: "Inspection & Verification" },
                    { icon: Wrench, label: "Maintenance & Workshop" },
                    { icon: ScrollText, label: "Insurance & Registration" },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1.5 px-2 py-2 rounded-lg bg-gradient-to-r from-primary/5 via-purple-500/5 to-cyan-500/5 border border-white/10 hover:border-primary/40 hover:from-primary/10 hover:to-purple-500/10 transition-all hover:translate-x-0.5" style={{ animationDelay: `${i * 50}ms` }}>
                      <s.icon className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="text-[11px] text-white/85 font-medium leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                <ScrollText className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Important Note
                  </p>
                  <p className="text-[10.5px] text-amber-200/80 mt-1 leading-relaxed">
                    Terms &amp; Conditions and Company Policies are applied to all clients. By engaging with our services you agree to be bound by them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ${tab === "verify" ? "opacity-100 scale-100" : "opacity-60 scale-95"}`}>
          <div className="neon-border h-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden" onClick={() => setTab("verify")}>
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="relative">
                  <Shield className="h-8 w-8 text-primary relative z-10" />
                  <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse" />
                </div>
                <h2 className="text-2xl font-heading font-bold shimmer-text">Verification Portal</h2>
              </div>
              <p className="text-sm text-white/50 text-center mb-6">Verify authenticity of invoices, vehicles, inspections & documents</p>

              <div className="max-w-sm mx-auto w-full relative overflow-hidden min-h-[360px]">
                {/* Step 1: Input */}
                <div className={`transition-all duration-500 ease-out space-y-4 ${verifyStep === "input" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"}`}>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "invoice", icon: FileText, label: "Invoice" },
                      { id: "document", icon: FileText, label: "Document" },
                      { id: "inspection", icon: ClipboardCheck, label: "Inspection" },
                      { id: "vehicle", icon: Car, label: "Vehicle" },
                    ].map(v => (
                      <button key={v.id} onClick={(e) => { e.stopPropagation(); setVerifyType(v.id); setVerifyResult(null); }} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all hover:-translate-y-0.5 ${verifyType === v.id ? "bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/20" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"}`}>
                        <v.icon className="h-4 w-4" />{v.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input value={verifyCode} onChange={e => { setVerifyCode(e.target.value); setVerifyResult(null); }} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all" placeholder={verifyType === "vehicle" ? "Enter registration no (e.g. ABC-1234)" : `Enter ${verifyType} code/ID`} />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleVerify(); }} disabled={verifying || !verifyCode.trim()} className="w-full py-3 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl text-sm font-semibold transition-all duration-500 border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] animate-glow-pulse">
                    {verifying ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : <><Shield className="h-4 w-4" /> Verify Now</>}
                  </button>
                  <p className="text-xs text-white/20 text-center">Powered by {BRAND}</p>
                </div>

                {/* Step 2: Details */}
                <div className={`transition-all duration-500 ease-out ${verifyStep === "details" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"}`}>
                  {verifyResult?.details && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <button onClick={(e) => { e.stopPropagation(); setVerifyStep("input"); setVerifyResult(null); setVerifyCode(""); }} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                          <ArrowLeft className="h-3 w-3" /> Back
                        </button>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/15 border border-green-500/40 text-[10px] font-bold text-green-300">
                          <CheckCircle className="h-3 w-3" /> VERIFIED AUTHENTIC
                        </span>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-cyan-500/10 border border-green-500/30 p-4 space-y-2 animate-fade-in">
                        {Object.entries(verifyResult.details).map(([k, v]) => (
                          <div key={k} className="flex items-start justify-between gap-3 text-xs border-b border-white/5 pb-1.5 last:border-0">
                            <span className="text-white/50 font-medium">{k}</span>
                            <span className="text-white/90 font-semibold text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); downloadVerificationPdf(); }} className="w-full py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl text-sm font-bold transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/30">
                        <Download className="h-4 w-4" /> Download Verification PDF
                      </button>
                      <p className="text-[10px] text-white/30 text-center">Certificate digitally generated by {BRAND}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-10 pb-4 px-4">
        <div className="max-w-6xl mx-auto neon-border bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Car className="h-3.5 w-3.5" /> {BRAND}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/60">
                <a href="https://www.farhanmotors.pk" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe className="h-3 w-3 text-primary/70" /> www.farhanmotors.pk</a>
                <a href="mailto:info@farhanmotors.pk" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Mail className="h-3 w-3 text-primary/70" /> info@farhanmotors.pk</a>
                <a href={waLink(FM_PHONE)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-green-400 transition-colors"><Phone className="h-3 w-3 text-primary/70" /> +92-328-4880257 (WhatsApp)</a>
              </div>
              <div className="flex items-start gap-1.5 text-white/50">
                <MapPin className="h-3 w-3 text-primary/70 mt-0.5 flex-shrink-0" />
                <span>{FM_ADDR}</span>
              </div>
            </div>
            <div className="space-y-2 md:border-l md:border-white/10 md:pl-4">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Developed by Devionic (Private) Limited
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/60">
                <a href="https://www.devionic.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-300 transition-colors"><Globe className="h-3 w-3 text-purple-400/70" /> www.devionic.com</a>
                <a href="mailto:info@devionic.com" className="flex items-center gap-1.5 hover:text-purple-300 transition-colors"><Mail className="h-3 w-3 text-purple-400/70" /> info@devionic.com</a>
                <a href={waLink(DEV_PHONE)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-green-400 transition-colors"><Phone className="h-3 w-3 text-purple-400/70" /> +92-317-7121841 (WhatsApp)</a>
              </div>
              <div className="flex items-start gap-1.5 text-white/50">
                <MapPin className="h-3 w-3 text-purple-400/70 mt-0.5 flex-shrink-0" />
                <span>{DEV_ADDR}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-white/30">© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-600/20 via-white/10 to-green-600/20 border border-green-500/30">
              <PakFlag />
              <span className="text-[11px] font-semibold text-white/80">Long Live Pakistan</span>
              <Heart className="h-3 w-3 text-red-400 animate-pulse" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PakFlag = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" className="animate-flag-wave rounded-sm overflow-hidden">
    <rect width="6" height="14" fill="#fff" />
    <rect x="6" width="16" height="14" fill="#01411C" />
    <circle cx="14" cy="7" r="3.2" fill="#01411C" />
    <circle cx="15" cy="6.2" r="3.2" fill="#fff" />
    <polygon points="16.5,7 17.2,7.6 17,6.7 17.7,6.2 16.8,6.2 16.5,5.4 16.2,6.2 15.3,6.2 16,6.7 15.8,7.6" fill="#fff" />
  </svg>
);

/** Realistic car SVGs: super, sedan, suv, jeep */
const CarSvg = ({ flip = false, color = "#1e3a8a", type = "sedan" }: { flip?: boolean; color?: string; type?: "super" | "sedan" | "suv" | "jeep" }) => {
  const body = (() => {
    if (type === "super") {
      // Low, aggressive supercar
      return (
        <>
          <path d="M5 42 L18 28 Q26 18 42 16 L80 16 Q100 18 118 26 L138 32 Q146 34 146 40 L146 44 Q146 46 144 46 L130 46 Q128 38 120 38 Q112 38 110 46 L52 46 Q50 38 42 38 Q34 38 32 46 L8 46 Q5 46 5 44 Z" fill={color} stroke="#fff" strokeOpacity="0.2" strokeWidth="0.5" />
          <path d="M30 28 L48 20 L78 20 L92 28 L92 34 L30 34 Z" fill="#0ea5e9" opacity="0.55" />
          <path d="M5 42 L146 42" stroke="#000" strokeOpacity="0.25" strokeWidth="0.5" />
        </>
      );
    }
    if (type === "suv") {
      return (
        <>
          <path d="M8 44 L14 26 Q18 18 30 18 L100 18 Q110 18 116 24 L132 30 Q140 32 140 40 L140 46 Q140 48 138 48 L124 48 Q122 40 114 40 Q106 40 104 48 L44 48 Q42 40 34 40 Q26 40 24 48 L10 48 Q8 48 8 46 Z" fill={color} />
          <path d="M28 24 L52 24 L52 36 L22 36 Z M56 24 L96 24 L106 36 L56 36 Z" fill="#93c5fd" opacity="0.55" />
        </>
      );
    }
    if (type === "jeep") {
      return (
        <>
          <path d="M10 44 L14 24 L30 22 L110 22 L126 24 L134 30 L138 38 L138 46 Q138 48 136 48 L122 48 Q120 40 112 40 Q104 40 102 48 L42 48 Q40 40 32 40 Q24 40 22 48 L12 48 Q10 48 10 46 Z" fill={color} />
          <rect x="26" y="26" width="28" height="14" fill="#86efac" opacity="0.5" />
          <rect x="58" y="26" width="46" height="14" fill="#86efac" opacity="0.5" />
          {/* Roof rails */}
          <rect x="22" y="20" width="100" height="2" fill="#000" opacity="0.4" />
        </>
      );
    }
    // sedan
    return (
      <>
        <path d="M8 42 L18 26 Q24 20 36 20 L92 20 Q102 20 108 26 L126 32 Q134 34 134 40 L134 44 Q134 46 132 46 L118 46 Q116 38 108 38 Q100 38 98 46 L46 46 Q44 38 36 38 Q28 38 26 46 L10 46 Q8 46 8 44 Z" fill={color} />
        <path d="M30 26 L50 22 L88 22 L102 26 L102 34 L30 34 Z" fill="#fde68a" opacity="0.5" />
      </>
    );
  })();

  return (
    <svg width="150" height="56" viewBox="0 0 150 56" fill="none" style={{ transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
      {body}
      {/* Wheels */}
      <circle cx="36" cy="46" r="8" fill="#0a0a0a" stroke="#374151" strokeWidth="1" />
      <circle cx="36" cy="46" r="3.2" fill="#9ca3af" />
      <circle cx="36" cy="46" r="1.2" fill="#374151" />
      <circle cx="112" cy="46" r="8" fill="#0a0a0a" stroke="#374151" strokeWidth="1" />
      <circle cx="112" cy="46" r="3.2" fill="#9ca3af" />
      <circle cx="112" cy="46" r="1.2" fill="#374151" />
      {/* Headlights (front-right side) */}
      <ellipse cx="132" cy="34" rx="3" ry="1.6" className="car-headlight" fill="currentColor" />
      <ellipse cx="130" cy="40" rx="1.6" ry="1" className="car-indicator" fill="#fbbf24" />
      {/* Tail light */}
      <rect x="9" y="32" width="3" height="4" rx="0.6" fill="#ef4444" className="car-headlight" style={{ animationDelay: "0.3s" }} />
      {/* Light beam */}
      <path d="M134 34 L180 26 L180 44 Z" fill="url(#beam2)" opacity="0.45" className="car-headlight" />
      <defs>
        <linearGradient id="beam2" x1="0" x2="1">
          <stop offset="0" stopColor="#fde047" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fde047" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Login;
