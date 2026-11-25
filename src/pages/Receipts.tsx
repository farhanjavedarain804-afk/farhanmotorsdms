import { useEffect, useMemo, useRef, useState } from "react";
import { Printer, FileText, RotateCcw, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import template from "@/assets/raseed-template.jpg";

type F = Record<string, string>;

const genReceiptNo = () => {
  const stored = Number(localStorage.getItem("fm_receipt_seq") || "1000");
  const next = stored + 1;
  localStorage.setItem("fm_receipt_seq", String(next));
  return `FM-${next}`;
};

const nowDate = () => new Date().toISOString().slice(0, 10);
const nowTime = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const emptyForm = (): F => ({
  receipt_no: "", date: "",
  buyer_name: "", buyer_father: "", buyer_cnic: "", buyer_mobile: "",
  buyer_address: "", buyer_district: "", buyer_tehsil: "",
  seller_name: "", seller_father: "", seller_cnic: "", seller_mobile: "",
  seller_address: "", seller_district: "", seller_tehsil: "",
  owner_name: "", owner_father: "", owner_cnic: "", owner_mobile: "",
  vehicle_type: "", maker: "", model: "", color: "", reg_no: "",
  engine_no: "", chassis_no: "", document: "", import_local: "", meter: "",
  horse_power: "", noc_no: "", book_no: "", key_no: "", condition: "",
  other_details: "",
  txn_date: "", txn_time: "", price: "", advance: "", remaining: "",
  return_date: "", payment_method: "", cheque_no: "",
  notes: "",
  witness1_name: "", witness1_cnic: "", witness1_mobile: "",
  witness2_name: "", witness2_cnic: "", witness2_mobile: "",
});

// Overlay positions calibrated to the template image (percent of sheet).
// left% / top% mark the LEFT end of each blank underline (values are drawn LTR
// starting from left, which for Urdu-embedded text still fills the underline).
type Pos = { key: string; top: number; left: number; width: number; align?: "left" | "right" | "center"; size?: number };
// Precise pixel calibration against template image (2800×2400).
// Each field is mapped to the exact pale-yellow blank box beside its Urdu label.
const POS: Pos[] = [
  // Row 1 — رسید نمبر / تاریخ
  { key: "date",       top: 20.25, left: 1.82, width: 9.89, size: 13 },
  { key: "receipt_no", top: 20.27, left: 85.29, width: 9.96, size: 13 },

  // Row 2 — نام خریدار / ولدیت / شناختی / موبائل
  { key: "buyer_mobile", top: 23.67, left: 1.71, width: 18.89 },
  { key: "buyer_cnic",   top: 23.67, left: 24.86, width: 19.93 },
  { key: "buyer_father", top: 23.65, left: 50.36, width: 19.21 },
  { key: "buyer_name",   top: 23.65, left: 72.86, width: 21.36 },

  // Row 3 — buyer ضلع / تحصیل / مکمل پتہ
  { key: "buyer_district", top: 26.79, left: 1.75, width: 17.25 },
  { key: "buyer_tehsil",   top: 26.81, left: 21.00, width: 16.29 },
  { key: "buyer_address",  top: 26.79, left: 40.39, width: 54.25 },

  // Row 4 — seller
  { key: "seller_mobile", top: 29.88, left: 1.75, width: 18.29 },
  { key: "seller_cnic",   top: 29.88, left: 24.25, width: 19.14 },
  { key: "seller_father", top: 29.85, left: 49.00, width: 18.46 },
  { key: "seller_name",   top: 29.85, left: 70.68, width: 21.39 },

  // Row 5 — seller address
  { key: "seller_district", top: 32.96, left: 1.71, width: 17.25 },
  { key: "seller_tehsil",   top: 32.94, left: 21.00, width: 16.29 },
  { key: "seller_address",  top: 32.96, left: 40.43, width: 54.21 },

  // Row 6 — owner
  { key: "owner_mobile", top: 36.08, left: 1.71, width: 19.18 },
  { key: "owner_cnic",   top: 36.08, left: 24.96, width: 20.07 },
  { key: "owner_father", top: 36.06, left: 50.57, width: 19.18 },
  { key: "owner_name",   top: 36.08, left: 73.00, width: 21.43 },

  // Row 7 — گاڑی قسم / میکر / ماڈل / رنگ / رجسٹریشن
  { key: "reg_no",       top: 39.35, left: 1.71, width: 17.32 },
  { key: "color",        top: 39.38, left: 24.00, width: 14.82 },
  { key: "model",        top: 39.35, left: 41.11, width: 14.75 },
  { key: "maker",        top: 39.38, left: 58.25, width: 18.46 },
  { key: "vehicle_type", top: 39.38, left: 78.68, width: 14.82 },

  // Row 8 — انجن / چیسس / ڈاکومنٹ / امپورٹڈ / میٹر
  { key: "meter",        top: 42.48, left: 1.79, width: 14.61 },
  { key: "import_local", top: 42.48, left: 20.89, width: 11.14 },
  { key: "document",     top: 42.48, left: 37.18, width: 16.96 },
  { key: "chassis_no",   top: 42.48, left: 57.89, width: 16.25 },
  { key: "engine_no",    top: 42.48, left: 78.71, width: 16.32 },

  // Row 9 — ہارس پاور / این او سی / بک / چابی / کنڈیشن
  { key: "condition",   top: 45.60, left: 1.71, width: 18.96 },
  { key: "key_no",      top: 45.56, left: 26.43, width: 14.86 },
  { key: "book_no",     top: 45.58, left: 44.54, width: 16.25 },
  { key: "noc_no",      top: 45.58, left: 64.00, width: 16.32 },
  { key: "horse_power", top: 45.60, left: 84.86, width: 9.71 },

  // Row 10 — دیگر تفصیلات گاڑی
  { key: "other_details", top: 48.67, left: 1.71, width: 89.43 },

  // Row 11 — تاریخ / ٹائم / قیمت / ایڈوانس / بقایا
  { key: "remaining", top: 51.75, left: 1.75, width: 18.29 },
  { key: "advance",   top: 51.75, left: 22.82, width: 17.71 },
  { key: "price",     top: 51.75, left: 45.00, width: 17.71 },
  { key: "txn_time",  top: 51.75, left: 70.25, width: 11.86 },
  { key: "txn_date",  top: 51.75, left: 83.82, width: 11.93 },

  // Row 12 — تاریخ واپسی / ادائیگی / چیک
  { key: "cheque_no",      top: 54.85, left: 1.75, width: 25.36 },
  { key: "payment_method", top: 54.88, left: 38.14, width: 25.18 },
  { key: "return_date",    top: 54.88, left: 69.29, width: 20.75 },

  // Row 13 — نوٹ
  { key: "notes", top: 58.02, left: 1.79, width: 94.07 },

  // Witness 1
  { key: "witness1_mobile", top: 87.52, left: 26.04, width: 16.29 },
  { key: "witness1_cnic",   top: 87.54, left: 46.46, width: 16.21 },
  { key: "witness1_name",   top: 87.52, left: 68.21, width: 20.71 },

  // Witness 2
  { key: "witness2_mobile", top: 91.90, left: 25.68, width: 16.29 },
  { key: "witness2_cnic",   top: 91.90, left: 46.11, width: 16.25 },
  { key: "witness2_name",   top: 91.90, left: 67.96, width: 20.64 },
];

const ReceiptSheet = ({ copyLabel, urduCopy, f, sheetRef }: { copyLabel: string; urduCopy: string; f: F; sheetRef?: (el: HTMLDivElement | null) => void }) => {
  const qrData = useMemo(() =>
    JSON.stringify({
      no: f.receipt_no, date: f.date,
      buyer: f.buyer_name, seller: f.seller_name,
      reg: f.reg_no, price: f.price,
    }), [f]);

  const barcodeVal = (f.receipt_no || "FM-0000").replace(/[^A-Za-z0-9\-]/g, "");

  return (
    <div className="raseed-sheet" ref={sheetRef}>
      <img src={template} alt="Receipt template" className="raseed-bg" crossOrigin="anonymous" />
      <div className="raseed-overlay">
        {POS.map(p => (
          <div
            key={p.key}
            className="raseed-field urdu"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.width}%`,
              fontSize: `${p.size || 11}px`,
              textAlign: p.align || "center",
            }}
          >
            {f[p.key] || ""}
          </div>
        ))}

        {/* Copy badge — top-right corner only */}
        <div className="raseed-copy-badge urdu">{copyLabel} — {urduCopy}</div>

        {/* Barcode — bottom-left in footer safe zone */}
        <div className="raseed-barcode">
          <Barcode value={barcodeVal || "FM0000"} height={28} width={1.1} fontSize={9} margin={0} background="#faf6e8" />
        </div>

        {/* QR code — bottom-right in footer safe zone (small) */}
        <div className="raseed-qr">
          <QRCodeSVG value={qrData || " "} size={48} bgColor="#faf6e8" fgColor="#1a1a1a" />
        </div>
      </div>
    </div>
  );
};

const Receipts = () => {
  const [form, setForm] = useState<F>(emptyForm());
  const [showPreview, setShowPreview] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const sheetsRef = useRef<(HTMLDivElement | null)[]>([]);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  // Auto-populate receipt no + date/time on mount
  useEffect(() => {
    setForm(p => ({
      ...p,
      receipt_no: p.receipt_no || genReceiptNo(),
      date: p.date || nowDate(),
      txn_date: p.txn_date || nowDate(),
      txn_time: p.txn_time || nowTime(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => window.print(), 250);
  };

  const handleDownloadPDF = async () => {
    setShowPreview(true);
    setDownloading(true);
    try {
      // Wait a tick so preview renders if just toggled on
      await new Promise(r => setTimeout(r, 300));
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = 297;
      const pageH = 210;

      const sheets = sheetsRef.current.filter(Boolean) as HTMLDivElement[];
      for (let i = 0; i < sheets.length; i++) {
        const el = sheets[i];
        // Ensure background image is loaded
        const imgs = Array.from(el.querySelectorAll("img"));
        await Promise.all(imgs.map(img =>
          img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = () => res(null); })
        ));
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#faf6e8",
          windowWidth: el.scrollWidth,
          windowHeight: el.scrollHeight,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        if (i > 0) pdf.addPage("a4", "landscape");
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
      }
      pdf.save(`Raseed-${form.receipt_no || "receipt"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    const fresh = emptyForm();
    fresh.receipt_no = genReceiptNo();
    fresh.date = nowDate();
    fresh.txn_date = nowDate();
    fresh.txn_time = nowTime();
    setForm(fresh);
  };

  const inputs: { key: string; label: string; type?: string; full?: boolean }[] = [
    { key: "receipt_no", label: "رسید نمبر" },
    { key: "date", label: "تاریخ", type: "date" },
    { key: "buyer_name", label: "نام خریدار" },
    { key: "buyer_father", label: "ولدیت (خریدار)" },
    { key: "buyer_cnic", label: "شناختی کارڈ (خریدار)" },
    { key: "buyer_mobile", label: "موبائل (خریدار)" },
    { key: "buyer_address", label: "مکمل پتہ (خریدار)", full: true },
    { key: "buyer_district", label: "ضلع (خریدار)" },
    { key: "buyer_tehsil", label: "تحصیل (خریدار)" },
    { key: "seller_name", label: "نام فروخت کنندہ" },
    { key: "seller_father", label: "ولدیت (فروخت کنندہ)" },
    { key: "seller_cnic", label: "شناختی کارڈ (فروخت کنندہ)" },
    { key: "seller_mobile", label: "موبائل (فروخت کنندہ)" },
    { key: "seller_address", label: "مکمل پتہ (فروخت کنندہ)", full: true },
    { key: "seller_district", label: "ضلع (فروخت کنندہ)" },
    { key: "seller_tehsil", label: "تحصیل (فروخت کنندہ)" },
    { key: "owner_name", label: "نام مالک" },
    { key: "owner_father", label: "ولدیت (مالک)" },
    { key: "owner_cnic", label: "شناختی کارڈ (مالک)" },
    { key: "owner_mobile", label: "موبائل (مالک)" },
    { key: "vehicle_type", label: "گاڑی کی قسم" },
    { key: "maker", label: "میکر" },
    { key: "model", label: "ماڈل" },
    { key: "color", label: "رنگ" },
    { key: "reg_no", label: "رجسٹریشن نمبر" },
    { key: "engine_no", label: "انجن نمبر" },
    { key: "chassis_no", label: "چیسس نمبر" },
    { key: "document", label: "ڈاکومنٹ" },
    { key: "import_local", label: "امپورٹڈ / لوکل" },
    { key: "meter", label: "میٹر ریڈنگ" },
    { key: "horse_power", label: "ہارس پاور" },
    { key: "noc_no", label: "این او سی نمبر" },
    { key: "book_no", label: "بک نمبر" },
    { key: "key_no", label: "چابی نمبر" },
    { key: "condition", label: "کنڈیشن گاڑی" },
    { key: "other_details", label: "دیگر تفصیلات گاڑی", full: true },
    { key: "txn_date", label: "ٹرانزیکشن تاریخ", type: "date" },
    { key: "txn_time", label: "ٹائم", type: "time" },
    { key: "price", label: "قیمت خرید و فروخت" },
    { key: "advance", label: "ایڈوانس رقم" },
    { key: "remaining", label: "بقایا رقم" },
    { key: "return_date", label: "تاریخ واپسی بقایا", type: "date" },
    { key: "payment_method", label: "ادائیگی کا طریقہ" },
    { key: "cheque_no", label: "چیک / ٹرانزیکشن نمبر" },
    { key: "notes", label: "نوٹ", full: true },
    { key: "witness1_name", label: "گواہ ۱ نام بمعہ ولدیت" },
    { key: "witness1_cnic", label: "گواہ ۱ شناختی کارڈ" },
    { key: "witness1_mobile", label: "گواہ ۱ موبائل" },
    { key: "witness2_name", label: "گواہ ۲ نام بمعہ ولدیت" },
    { key: "witness2_cnic", label: "گواہ ۲ شناختی کارڈ" },
    { key: "witness2_mobile", label: "گواہ ۲ موبائل" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold">رسید / ڈلیوری چالان</h1>
          <p className="text-sm text-muted-foreground">Same-to-same design · Landscape A4 · Auto receipt # &amp; date/time · QR code · 3 copies</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="px-4 py-2 bg-muted rounded-lg text-sm flex items-center gap-2"><RotateCcw className="h-4 w-4" />New</button>
          <button onClick={() => setShowPreview(v => !v)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm flex items-center gap-2"><FileText className="h-4 w-4" />{showPreview ? "Hide" : "Preview"}</button>
          <button onClick={handleDownloadPDF} disabled={downloading} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60"><Download className="h-4 w-4" />{downloading ? "Generating…" : "Download PDF"}</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2"><Printer className="h-4 w-4" />Print 3 Copies</button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 no-print">
        <h2 className="font-heading font-semibold mb-4">تفصیلات درج کریں</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inputs.map(fi => (
            <div key={fi.key} className={fi.full ? "md:col-span-3" : ""}>
              <label className="text-xs text-muted-foreground mb-1 block urdu" style={{ textAlign: "right" }}>{fi.label}</label>
              {fi.full ? (
                <textarea value={form[fi.key]} onChange={e => set(fi.key, e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm urdu" rows={2} />
              ) : (
                <input type={fi.type || "text"} value={form[fi.key]} onChange={e => set(fi.key, e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm urdu" />
              )}
            </div>
          ))}
        </div>
      </div>

      {showPreview && (
        <div className="print-area">
          <ReceiptSheet copyLabel="BUYER COPY" urduCopy="کاپی خریدار" f={form} sheetRef={el => (sheetsRef.current[0] = el)} />
          <ReceiptSheet copyLabel="SELLER COPY" urduCopy="کاپی فروخت کنندہ" f={form} sheetRef={el => (sheetsRef.current[1] = el)} />
          <ReceiptSheet copyLabel="SHOWROOM COPY" urduCopy="کاپی شوروم" f={form} sheetRef={el => (sheetsRef.current[2] = el)} />
        </div>
      )}
    </div>
  );
};

export default Receipts;
