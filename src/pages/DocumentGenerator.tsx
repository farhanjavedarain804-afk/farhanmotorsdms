import { useEffect, useMemo, useState } from "react";
import { Download, Printer, RotateCcw, Loader2, Search, UserPlus, History, UserCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { documentFields, pageLabels, type DocumentKind } from "@/lib/documentTemplates";
import { renderDocument, createDocumentPDF, deliverDocument, printDocument } from "@/lib/documentExport";
import { supabase } from "@/lib/apiClient";
import { formatCNIC, validateCNIC, formatMobile, validateMobile } from "@/lib/pakistan";
import { toast } from "sonner";

interface Customer { id: string; name: string; cnic?: string; phone?: string; email?: string; address?: string; created_at: string; }
interface HistoryRow { id: string; kind: DocumentKind; receipt_no?: string; customer_name?: string; values: Record<string, string>; created_at: string; }

function freshValues(): Record<string, string> {
  const seq = Number(localStorage.getItem("fm_document_seq") || 1000) + 1;
  localStorage.setItem("fm_document_seq", String(seq));
  const now = new Date();
  const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
  return { receipt_no: `FM-${seq}`, date, txn_date: date, txn_time: now.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit" }) };
}

// Customer keys on each document: [name, cnic, phone, address]
const customerKeys: Record<DocumentKind, [string, string, string, string]> = {
  receipt: ["buyer_name", "buyer_cnic", "buyer_mobile", "buyer_address"],
  rental: ["client_name", "client_cnic", "client_contact1", "client_address"],
};

export default function DocumentGenerator() {
  const [kind, setKind] = useState<DocumentKind>("receipt");
  const [forms, setForms] = useState<Record<DocumentKind, Record<string, string>>>(() => ({ receipt: freshValues(), rental: freshValues() }));
  const [pages, setPages] = useState<string[]>([]);
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [selectedPage, setSelectedPage] = useState(0);
  const values = forms[kind];

  // Customer picker state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Record<string, { deals: number; complaints: number }>>({});
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});

  // History state
  const [tab, setTab] = useState<"form" | "history">("form");
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: cust }, { data: sales }, { data: rentals }, { data: complaints }] = await Promise.all([
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("sales").select("customer_id, status"),
        supabase.from("rentals").select("customer_id, status"),
        supabase.from("complaints").select("customer_id, status"),
      ]);
      if (cust) setCustomers(cust as Customer[]);
      const map: Record<string, { deals: number; complaints: number }> = {};
      for (const s of [...(sales ?? []), ...(rentals ?? [])] as any[]) {
        if (!s.customer_id) continue;
        map[s.customer_id] ??= { deals: 0, complaints: 0 };
        if (s.status !== "cancelled") map[s.customer_id].deals++;
      }
      for (const c of (complaints ?? []) as any[]) {
        if (!c.customer_id) continue;
        map[c.customer_id] ??= { deals: 0, complaints: 0 };
        if (c.status !== "resolved") map[c.customer_id].complaints++;
      }
      setStats(map);
    })();
  }, []);

  const creditScore = (id: string) => {
    const s = stats[id] ?? { deals: 0, complaints: 0 };
    return Math.max(300, Math.min(900, 650 + s.deals * 25 - s.complaints * 75));
  };
  const creditStatus = (score: number) => score >= 700 ? { label: "اچھا", cls: "text-green-500" } : score >= 500 ? { label: "درمیانہ", cls: "text-yellow-500" } : { label: "خطرناک", cls: "text-red-500" };

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return [];
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.cnic?.includes(q) || c.phone?.includes(q) || c.id.startsWith(q)
    ).slice(0, 6);
  }, [customerSearch, customers]);

  const applyCustomer = (c: Customer) => {
    const [nameKey, cnicKey, phoneKey, addressKey] = customerKeys[kind];
    setSelectedCustomer(c);
    setCustomerSearch("");
    setForms(prev => ({ ...prev, [kind]: { ...prev[kind], [nameKey]: c.name, [cnicKey]: c.cnic || "", [phoneKey]: c.phone || "", [addressKey]: c.address || "" } }));
    toast.success(`${c.name} فارم میں شامل ہو گیا`);
  };

  const saveNewCustomer = async () => {
    if (!newCustomer.name?.trim()) { toast.error("نام درج کریں"); return; }
    if (newCustomer.cnic && !validateCNIC(newCustomer.cnic)) { toast.error("CNIC must be XXXXX-XXXXXXX-X"); return; }
    if (newCustomer.phone && !validateMobile(newCustomer.phone)) { toast.error("Mobile must be 03XX-XXXXXXX"); return; }
    const { data, error } = await supabase.from("customers").insert({ name: newCustomer.name.trim(), cnic: newCustomer.cnic || null, phone: newCustomer.phone || null, email: newCustomer.email || null, address: newCustomer.address || null }).select().single();
    if (error) { toast.error(error.message); return; }
    setCustomers(prev => [data as Customer, ...prev]);
    setNewCustomerOpen(false);
    setNewCustomer({});
    applyCustomer(data as Customer);
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    const { data, error } = await supabase.from("document_history").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) toast.error(error.message);
    else setHistory((data ?? []) as HistoryRow[]);
    setHistoryLoading(false);
  };

  const saveHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("document_history").insert({
      kind,
      receipt_no: values.receipt_no || null,
      customer_id: selectedCustomer?.id || null,
      customer_name: values[customerKeys[kind][0]] || null,
      values,
      created_by: user?.id || null,
    });
  };

  const restoreHistory = (h: HistoryRow) => {
    setKind(h.kind);
    setForms(prev => ({ ...prev, [h.kind]: { ...freshValues(), ...h.values } }));
    setSelectedPage(0);
    setTab("form");
    toast.success("ڈاکومنٹ فارم میں لوڈ ہو گیا");
  };

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    setPdf(null);
    setError("");
    const timeout = setTimeout(() => {
      renderDocument(kind, values).then(result => {
        if (cancelled) return;
        setPages(result);
        setPdf(createDocumentPDF(result));
        setBusy(false);
      }).catch(() => {
        if (cancelled) return;
        setError("Document load nahi hua. Dobara koshish karein.");
        setBusy(false);
      });
    }, 350);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [kind, values]);

  function changeKind(next: DocumentKind) { setKind(next); setSelectedPage(0); setSelectedCustomer(null); }
  function reset() { setForms(prev => ({ ...prev, [kind]: freshValues() })); setSelectedCustomer(null); }

  async function download() {
    if (!pdf) return;
    await saveHistory();
    void deliverDocument(pdf, `${kind}-${values.receipt_no}.pdf`).catch(() => toast.error("Download failed"));
  }
  async function print() {
    await saveHistory();
    printDocument(pages);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-heading font-bold">Document Generator</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant={tab === "history" ? "default" : "outline"} onClick={() => { setTab(tab === "history" ? "form" : "history"); if (tab === "form") loadHistory(); }}><History />ہسٹری</Button>
          <Button variant="outline" onClick={reset}><RotateCcw />New</Button>
          <Button variant="secondary" disabled={busy || !pdf} onClick={download}><Download />Download PDF</Button>
          <Button disabled={busy || !pdf} onClick={print}><Printer />Print</Button>
        </div>
      </div>

      {tab === "history" ? (
        <section className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-heading font-semibold">Document Generator ہسٹری</h2>
          {historyLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!historyLoading && history.length === 0 && <p className="text-sm text-muted-foreground">ابھی تک کوئی ڈاکومنٹ محفوظ نہیں۔</p>}
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 font-medium">رسید نمبر</th><th className="pb-2 font-medium">قسم</th><th className="pb-2 font-medium">کسٹمر</th><th className="pb-2 font-medium">تاریخ</th><th className="pb-2 font-medium text-right">ایکشن</th>
              </tr></thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 font-mono text-xs">{h.receipt_no || "—"}</td>
                    <td className="py-2.5 urdu">{h.kind === "receipt" ? "رسید / ڈیلیوری چالان" : "رینٹ اے کار ایگریمنٹ"}</td>
                    <td className="py-2.5">{h.customer_name || "—"}</td>
                    <td className="py-2.5 text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</td>
                    <td className="py-2.5 text-right"><Button size="sm" variant="outline" onClick={() => restoreHistory(h)}>لوڈ کریں</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 border-b border-border pb-3" role="tablist" aria-label="Document type">
            <Button role="tab" aria-selected={kind === "receipt"} variant={kind === "receipt" ? "default" : "outline"} onClick={() => changeKind("receipt")}>رسید / ڈیلیوری چالان</Button>
            <Button role="tab" aria-selected={kind === "rental"} variant={kind === "rental" ? "default" : "outline"} onClick={() => changeKind("rental")}>رینٹ اے کار ایگریمنٹ</Button>
          </div>

          <section className="bg-card border border-border rounded-xl p-5 space-y-4" dir="rtl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold urdu">کسٹمر منتخب کریں</h2>
              <Button variant="outline" size="sm" onClick={() => setNewCustomerOpen(true)}><UserPlus />نیا کسٹمر</Button>
            </div>
            {selectedCustomer ? (
              <div className="flex flex-wrap items-center gap-3 bg-muted/50 border border-border rounded-lg px-4 py-3">
                <UserCheck className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium urdu">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedCustomer.cnic || "—"} · {selectedCustomer.phone || "—"}</p>
                </div>
                {(() => { const s = creditScore(selectedCustomer.id); const st = creditStatus(s); return (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className={`h-4 w-4 ${st.cls}`} />
                    <span className="font-mono font-bold">{s}</span>
                    <span className={`urdu text-xs ${st.cls}`}>{st.label}</span>
                  </div>
                ); })()}
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>تبدیل کریں</Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="w-full pr-9 pl-3 py-2 bg-muted border border-border rounded-lg text-sm urdu" placeholder="کسٹمر تلاش کریں — نام، شناختی کارڈ، موبائل یا ID…" />
                {filteredCustomers.length > 0 && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    {filteredCustomers.map(c => {
                      const s = creditScore(c.id); const st = creditStatus(s);
                      return (
                        <button key={c.id} onClick={() => applyCustomer(c)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 text-right transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium urdu truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{c.cnic || "—"} · {c.phone || "—"}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs shrink-0">
                            <Star className={`h-3.5 w-3.5 ${st.cls}`} />
                            <span className="font-mono font-bold">{s}</span>
                            <span className={`urdu ${st.cls}`}>{st.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="space-y-4" dir="rtl">
            <h2 className="text-lg font-semibold urdu">تفصیلات درج کریں</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {documentFields[kind].map(field => (
                <div key={field.key}>
                  <label htmlFor={`document-${field.key}`} className="block text-sm text-muted-foreground urdu mb-1">{field.label}</label>
                  <input id={`document-${field.key}`} value={values[field.key] || ""} onChange={e => setForms(prev => ({ ...prev, [kind]: { ...prev[kind], [field.key]: e.target.value } }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm urdu" />
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-3 border-t border-border pt-5">
            <div className="flex flex-wrap items-center gap-2">
              {pageLabels[kind].map((label, index) => <Button key={label} size="sm" variant={selectedPage === index ? "secondary" : "ghost"} onClick={() => setSelectedPage(index)}>{label}</Button>)}
              {busy && <Loader2 aria-label="Preparing document" className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            {error ? <p role="alert" className="text-destructive">{error}</p> : pages[selectedPage] ? <img className={`document-preview ${busy ? "opacity-50" : ""}`} src={pages[selectedPage]} alt={pageLabels[kind][selectedPage]} /> : <div className="document-preview flex items-center justify-center bg-muted"><Loader2 className="animate-spin" /></div>}
          </section>
        </>
      )}

      <Dialog open={newCustomerOpen} onOpenChange={setNewCustomerOpen}>
        <DialogContent className="max-w-xl" dir="rtl">
          <DialogHeader><DialogTitle className="urdu">نیا کسٹمر</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block urdu">پورا نام *</label><input value={newCustomer.name ?? ""} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm urdu" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block urdu">شناختی کارڈ</label><input value={newCustomer.cnic ?? ""} onChange={e => setNewCustomer({ ...newCustomer, cnic: formatCNIC(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono" placeholder="XXXXX-XXXXXXX-X" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block urdu">موبائل</label><input value={newCustomer.phone ?? ""} onChange={e => setNewCustomer({ ...newCustomer, phone: formatMobile(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" placeholder="03XX-XXXXXXX" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block urdu">ای میل</label><input type="email" value={newCustomer.email ?? ""} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm" /></div>
            <div className="col-span-2"><label className="text-xs text-muted-foreground mb-1 block urdu">پتہ</label><textarea value={newCustomer.address ?? ""} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm h-16" /></div>
          </div>
          <DialogFooter>
            <button onClick={() => setNewCustomerOpen(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm urdu">منسوخ</button>
            <button onClick={saveNewCustomer} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium urdu">محفوظ کریں</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
