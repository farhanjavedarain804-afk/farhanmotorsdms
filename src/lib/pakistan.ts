// Pakistan-specific utilities: PKR formatting, CNIC validation, banks, wallets

export const formatPKR = (n: number | string | null | undefined, opts: { compact?: boolean; symbol?: boolean } = {}) => {
  const num = Number(n ?? 0);
  if (isNaN(num)) return opts.symbol === false ? "0" : "PKR 0";
  const sym = opts.symbol === false ? "" : "PKR ";
  if (opts.compact) {
    if (Math.abs(num) >= 1e7) return `${sym}${(num / 1e7).toFixed(2)} Cr`;
    if (Math.abs(num) >= 1e5) return `${sym}${(num / 1e5).toFixed(2)} Lac`;
    if (Math.abs(num) >= 1e3) return `${sym}${(num / 1e3).toFixed(1)}K`;
  }
  return `${sym}${num.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
};

export const parsePKR = (s: string) => {
  const n = Number(String(s).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
};

// CNIC: 13 digits, format XXXXX-XXXXXXX-X
export const validateCNIC = (cnic: string): boolean => /^\d{5}-\d{7}-\d{1}$/.test((cnic || "").trim());

export const formatCNIC = (raw: string): string => {
  const d = (raw || "").replace(/\D/g, "").slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
};

// Pakistan vehicle registration: e.g. ABC-1234, LEA-1234, ICT-2024
export const validateRegistration = (reg: string): boolean => /^[A-Z]{2,4}[- ]?\d{1,4}$/i.test((reg || "").trim());

// Pakistan mobile: 03XX-XXXXXXX
export const validateMobile = (m: string): boolean => /^03\d{2}[- ]?\d{7}$/.test((m || "").trim());
export const formatMobile = (raw: string): string => {
  const d = (raw || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)}-${d.slice(4)}`;
};

export const PK_BANKS = [
  "HBL - Habib Bank Limited",
  "MCB - Muslim Commercial Bank",
  "UBL - United Bank Limited",
  "ABL - Allied Bank Limited",
  "Meezan Bank",
  "Bank Alfalah",
  "Bank Al Habib",
  "Faysal Bank",
  "Standard Chartered Pakistan",
  "Askari Bank",
  "Soneri Bank",
  "JS Bank",
  "BankIslami Pakistan",
  "National Bank of Pakistan",
  "Sindh Bank",
  "Bank of Punjab",
  "Dubai Islamic Bank Pakistan",
  "Habib Metropolitan Bank",
  "Silkbank",
  "Summit Bank",
];

export const PK_WALLETS = ["JazzCash", "Easypaisa", "SadaPay", "NayaPay", "UPaisa", "Konnect by HBL"];

export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "JazzCash", "Easypaisa", "Card", "Installment"];

export const PK_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar",
  "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur",
  "Mardan", "Mirpur", "Abbottabad", "Sahiwal",
];

export const VEHICLE_MAKES = [
  "Toyota", "Honda", "Suzuki", "Hyundai", "Kia", "Nissan", "Mitsubishi", "Daihatsu",
  "Mazda", "Changan", "MG", "Proton", "Haval", "DFSK", "FAW", "Master",
];
