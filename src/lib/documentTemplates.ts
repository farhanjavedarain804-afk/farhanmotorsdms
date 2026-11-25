import receipt1 from "@/assets/document-templates/receipt-1.jpg.asset.json";
import receipt2 from "@/assets/document-templates/receipt-2.jpg.asset.json";
import receipt3 from "@/assets/document-templates/receipt-3.jpg.asset.json";
import receipt4 from "@/assets/document-templates/receipt-4.jpg.asset.json";
import receipt5 from "@/assets/document-templates/receipt-5.jpg.asset.json";
import receipt6 from "@/assets/document-templates/receipt-6.jpg.asset.json";
import rental1 from "@/assets/document-templates/rental-1.jpg.asset.json";
import rental2 from "@/assets/document-templates/rental-2.jpg.asset.json";
import rental3 from "@/assets/document-templates/rental-3.jpg.asset.json";
import rental4 from "@/assets/document-templates/rental-4.jpg.asset.json";

export type DocumentKind = "receipt" | "rental";
export type DocumentField = { key: string; label: string; left: number; top: number; width: number; page: "front" | "back" };
export const documentFields: Record<DocumentKind, DocumentField[]> = {
  "receipt": [
    {
      "key": "receipt_no",
      "label": "رسید نمبر",
      "left": 87,
      "top": 25.7,
      "width": 9,
      "page": "front"
    },
    {
      "key": "date",
      "label": "تاریخ",
      "left": 10,
      "top": 25.7,
      "width": 9,
      "page": "front"
    },
    {
      "key": "buyer_name",
      "label": "نام خریدار",
      "left": 75.4,
      "top": 29.6,
      "width": 20,
      "page": "front"
    },
    {
      "key": "buyer_father",
      "label": "ولدیت (خریدار)",
      "left": 54.6,
      "top": 29.6,
      "width": 17.7,
      "page": "front"
    },
    {
      "key": "buyer_cnic",
      "label": "شناختی کارڈ (خریدار)",
      "left": 30.5,
      "top": 29.6,
      "width": 19,
      "page": "front"
    },
    {
      "key": "buyer_mobile",
      "label": "موبائل (خریدار)",
      "left": 9.6,
      "top": 29.6,
      "width": 17,
      "page": "front"
    },
    {
      "key": "buyer_address",
      "label": "مکمل پتہ (خریدار)",
      "left": 45.5,
      "top": 33.1,
      "width": 49.5,
      "page": "front"
    },
    {
      "key": "buyer_tehsil",
      "label": "تحصیل (خریدار)",
      "left": 28.5,
      "top": 33.1,
      "width": 13.9,
      "page": "front"
    },
    {
      "key": "buyer_district",
      "label": "ضلع (خریدار)",
      "left": 9.6,
      "top": 33.1,
      "width": 15.8,
      "page": "front"
    },
    {
      "key": "seller_name",
      "label": "نام فروخت کنندہ",
      "left": 75.4,
      "top": 36.7,
      "width": 20,
      "page": "front"
    },
    {
      "key": "seller_father",
      "label": "ولدیت (فروخت کنندہ)",
      "left": 54.6,
      "top": 36.7,
      "width": 17.7,
      "page": "front"
    },
    {
      "key": "seller_cnic",
      "label": "شناختی کارڈ (فروخت کنندہ)",
      "left": 30.5,
      "top": 36.7,
      "width": 19,
      "page": "front"
    },
    {
      "key": "seller_mobile",
      "label": "موبائل (فروخت کنندہ)",
      "left": 9.6,
      "top": 36.7,
      "width": 17,
      "page": "front"
    },
    {
      "key": "seller_address",
      "label": "مکمل پتہ (فروخت کنندہ)",
      "left": 45.5,
      "top": 40.2,
      "width": 49.5,
      "page": "front"
    },
    {
      "key": "seller_tehsil",
      "label": "تحصیل (فروخت کنندہ)",
      "left": 28.5,
      "top": 40.2,
      "width": 13.9,
      "page": "front"
    },
    {
      "key": "seller_district",
      "label": "ضلع (فروخت کنندہ)",
      "left": 9.6,
      "top": 40.2,
      "width": 15.8,
      "page": "front"
    },
    {
      "key": "owner_name",
      "label": "نام مالک",
      "left": 75.4,
      "top": 43.8,
      "width": 20,
      "page": "front"
    },
    {
      "key": "owner_father",
      "label": "ولدیت (مالک)",
      "left": 54.6,
      "top": 43.8,
      "width": 17.7,
      "page": "front"
    },
    {
      "key": "owner_cnic",
      "label": "شناختی کارڈ (مالک)",
      "left": 30.5,
      "top": 43.8,
      "width": 19,
      "page": "front"
    },
    {
      "key": "owner_mobile",
      "label": "موبائل (مالک)",
      "left": 9.6,
      "top": 43.8,
      "width": 17,
      "page": "front"
    },
    {
      "key": "vehicle_type",
      "label": "گاڑی کی قسم",
      "left": 80.8,
      "top": 47.6,
      "width": 13.7,
      "page": "front"
    },
    {
      "key": "maker",
      "label": "میکر",
      "left": 61.5,
      "top": 47.6,
      "width": 15.1,
      "page": "front"
    },
    {
      "key": "model",
      "label": "ماڈل",
      "left": 46.1,
      "top": 47.6,
      "width": 13.5,
      "page": "front"
    },
    {
      "key": "color",
      "label": "رنگ",
      "left": 30.3,
      "top": 47.6,
      "width": 13.5,
      "page": "front"
    },
    {
      "key": "reg_no",
      "label": "رجسٹریشن نمبر",
      "left": 9.6,
      "top": 47.6,
      "width": 16,
      "page": "front"
    },
    {
      "key": "engine_no",
      "label": "انجن نمبر",
      "left": 80.8,
      "top": 51.2,
      "width": 15,
      "page": "front"
    },
    {
      "key": "chassis_no",
      "label": "چیسس نمبر",
      "left": 62.2,
      "top": 51.2,
      "width": 14.4,
      "page": "front"
    },
    {
      "key": "document",
      "label": "ڈاکومنٹ",
      "left": 43,
      "top": 51.2,
      "width": 15,
      "page": "front"
    },
    {
      "key": "import_local",
      "label": "امپورٹڈ / لوکل",
      "left": 28.9,
      "top": 51.2,
      "width": 10.7,
      "page": "front"
    },
    {
      "key": "meter",
      "label": "میٹر ریڈنگ",
      "left": 9.6,
      "top": 51.2,
      "width": 13.4,
      "page": "front"
    },
    {
      "key": "horse_power",
      "label": "ہارس پاور",
      "left": 88.3,
      "top": 54.8,
      "width": 7.4,
      "page": "front"
    },
    {
      "key": "noc_no",
      "label": "این او سی نمبر",
      "left": 68.9,
      "top": 54.8,
      "width": 13.8,
      "page": "front"
    },
    {
      "key": "book_no",
      "label": "بک نمبر",
      "left": 51.2,
      "top": 54.8,
      "width": 13.8,
      "page": "front"
    },
    {
      "key": "key_no",
      "label": "چابی نمبر",
      "left": 32.5,
      "top": 54.8,
      "width": 13.8,
      "page": "front"
    },
    {
      "key": "condition",
      "label": "کنڈیشن گاڑی",
      "left": 9.6,
      "top": 54.8,
      "width": 17.3,
      "page": "front"
    },
    {
      "key": "other_details",
      "label": "دیگر تفصیلات گاڑی",
      "left": 9.6,
      "top": 58.3,
      "width": 78.2,
      "page": "front"
    },
    {
      "key": "txn_date",
      "label": "ٹرانزیکشن تاریخ",
      "left": 87.5,
      "top": 62,
      "width": 9,
      "page": "front"
    },
    {
      "key": "txn_time",
      "label": "ٹائم",
      "left": 76,
      "top": 62,
      "width": 7.7,
      "page": "front"
    },
    {
      "key": "price",
      "label": "قیمت خرید و فروخت",
      "left": 52.7,
      "top": 62,
      "width": 13.1,
      "page": "front"
    },
    {
      "key": "advance",
      "label": "ایڈوانس رقم",
      "left": 33.7,
      "top": 62,
      "width": 11.6,
      "page": "front"
    },
    {
      "key": "remaining",
      "label": "بقایا رقم",
      "left": 9.6,
      "top": 62,
      "width": 17.2,
      "page": "front"
    },
    {
      "key": "return_date",
      "label": "تاریخ واپسی (بقایا رقم)",
      "left": 73.5,
      "top": 65.5,
      "width": 17.9,
      "page": "front"
    },
    {
      "key": "payment_method",
      "label": "ادائیگی کا طریقہ",
      "left": 46,
      "top": 65.5,
      "width": 17.5,
      "page": "front"
    },
    {
      "key": "cheque_no",
      "label": "چیک / ٹرانزیکشن نمبر",
      "left": 9.6,
      "top": 65.5,
      "width": 23.4,
      "page": "front"
    },
    {
      "key": "notes",
      "label": "نوٹ",
      "left": 9.6,
      "top": 69.1,
      "width": 86,
      "page": "front"
    },
    {
      "key": "buyer_signature",
      "label": "دستخط خریدار",
      "left": 69.5,
      "top": 83.7,
      "width": 20,
      "page": "front"
    },
    {
      "key": "seller_signature",
      "label": "دستخط فروخت کنندہ / مالک",
      "left": 36.7,
      "top": 83.7,
      "width": 19.8,
      "page": "front"
    },
    {
      "key": "showroom_signature",
      "label": "دستخط و مہر شوروم",
      "left": 10.3,
      "top": 83.7,
      "width": 20.2,
      "page": "front"
    },
    {
      "key": "witness1_name",
      "label": "گواہ 1 نام بمعہ ولدیت",
      "left": 70.6,
      "top": 88.7,
      "width": 19.3,
      "page": "front"
    },
    {
      "key": "witness1_cnic",
      "label": "گواہ 1 شناختی کارڈ",
      "left": 51.3,
      "top": 88.7,
      "width": 14.3,
      "page": "front"
    },
    {
      "key": "witness1_mobile",
      "label": "گواہ 1 موبائل",
      "left": 32.4,
      "top": 88.7,
      "width": 14.5,
      "page": "front"
    },
    {
      "key": "witness1_signature",
      "label": "گواہ 1 دستخط",
      "left": 10.3,
      "top": 88.7,
      "width": 15.2,
      "page": "front"
    },
    {
      "key": "witness2_name",
      "label": "گواہ 2 نام بمعہ ولدیت",
      "left": 70.6,
      "top": 93.6,
      "width": 19.3,
      "page": "front"
    },
    {
      "key": "witness2_cnic",
      "label": "گواہ 2 شناختی کارڈ",
      "left": 51.3,
      "top": 93.6,
      "width": 14.3,
      "page": "front"
    },
    {
      "key": "witness2_mobile",
      "label": "گواہ 2 موبائل",
      "left": 32.4,
      "top": 93.6,
      "width": 14.5,
      "page": "front"
    },
    {
      "key": "witness2_signature",
      "label": "گواہ 2 دستخط",
      "left": 10.3,
      "top": 93.6,
      "width": 15.2,
      "page": "front"
    },
    {
      "key": "back_notes_1",
      "label": "پشت — نوٹ / ہدایات 1",
      "left": 2.2,
      "top": 78,
      "width": 83,
      "page": "back"
    },
    {
      "key": "back_notes_2",
      "label": "پشت — نوٹ / ہدایات 2",
      "left": 2.2,
      "top": 82,
      "width": 95,
      "page": "back"
    },
    {
      "key": "back_notes_3",
      "label": "پشت — نوٹ / ہدایات 3",
      "left": 2.2,
      "top": 86,
      "width": 95,
      "page": "back"
    },
    {
      "key": "back_notes_4",
      "label": "پشت — نوٹ / ہدایات 4",
      "left": 2.2,
      "top": 90,
      "width": 95,
      "page": "back"
    }
  ],
  "rental": [
    {
      "key": "receipt_no",
      "label": "رسید نمبر",
      "left": 84.3,
      "top": 25.3,
      "width": 11.2,
      "page": "front"
    },
    {
      "key": "date",
      "label": "تاریخ",
      "left": 9.9,
      "top": 25.3,
      "width": 11,
      "page": "front"
    },
    {
      "key": "client_name",
      "label": "نام کسٹمر",
      "left": 71.9,
      "top": 28.5,
      "width": 23.8,
      "page": "front"
    },
    {
      "key": "client_father",
      "label": "ولدیت (کسٹمر)",
      "left": 45.7,
      "top": 28.5,
      "width": 23.2,
      "page": "front"
    },
    {
      "key": "client_cnic",
      "label": "شناختی کارڈ (کسٹمر)",
      "left": 9.9,
      "top": 28.5,
      "width": 30.5,
      "page": "front"
    },
    {
      "key": "client_address",
      "label": "ایڈریس (کسٹمر)",
      "left": 9.9,
      "top": 32.5,
      "width": 85.4,
      "page": "front"
    },
    {
      "key": "client_contact1",
      "label": "رابطہ نمبر ۱ (کسٹمر)",
      "left": 74.4,
      "top": 35.5,
      "width": 21.1,
      "page": "front"
    },
    {
      "key": "client_contact2",
      "label": "رابطہ نمبر ۲ (کسٹمر)",
      "left": 49.9,
      "top": 35.5,
      "width": 21.1,
      "page": "front"
    },
    {
      "key": "client_emergency",
      "label": "رابطہ نمبر (ایمرجنسی — کسٹمر)",
      "left": 9.9,
      "top": 35.5,
      "width": 30.5,
      "page": "front"
    },
    {
      "key": "guarantor_name",
      "label": "نام ضامن",
      "left": 71,
      "top": 39,
      "width": 23.8,
      "page": "front"
    },
    {
      "key": "guarantor_father",
      "label": "ولدیت (ضامن)",
      "left": 44.9,
      "top": 39,
      "width": 23.2,
      "page": "front"
    },
    {
      "key": "guarantor_cnic",
      "label": "شناختی کارڈ (ضامن)",
      "left": 9.9,
      "top": 39,
      "width": 29.6,
      "page": "front"
    },
    {
      "key": "guarantor_address",
      "label": "ایڈریس (ضامن)",
      "left": 9.9,
      "top": 43,
      "width": 85.4,
      "page": "front"
    },
    {
      "key": "guarantor_contact1",
      "label": "رابطہ نمبر ۱ (ضامن)",
      "left": 74.4,
      "top": 46,
      "width": 21.1,
      "page": "front"
    },
    {
      "key": "guarantor_contact2",
      "label": "رابطہ نمبر ۲ (ضامن)",
      "left": 49.9,
      "top": 46,
      "width": 21.1,
      "page": "front"
    },
    {
      "key": "guarantor_emergency",
      "label": "رابطہ نمبر (ایمرجنسی — ضامن)",
      "left": 9.9,
      "top": 46,
      "width": 30.5,
      "page": "front"
    },
    {
      "key": "vehicle_type",
      "label": "قسم گاڑی",
      "left": 78.3,
      "top": 49.5,
      "width": 17,
      "page": "front"
    },
    {
      "key": "maker_model",
      "label": "میک / ماڈل",
      "left": 54.3,
      "top": 49.5,
      "width": 19.8,
      "page": "front"
    },
    {
      "key": "reg_no",
      "label": "رجسٹریشن نمبر",
      "left": 30.5,
      "top": 49.5,
      "width": 19.1,
      "page": "front"
    },
    {
      "key": "engine_no",
      "label": "انجن نمبر",
      "left": 9.9,
      "top": 49.5,
      "width": 17.6,
      "page": "front"
    },
    {
      "key": "horse_power",
      "label": "ہارس پاور",
      "left": 75.2,
      "top": 53,
      "width": 19.3,
      "page": "front"
    },
    {
      "key": "color",
      "label": "کلر",
      "left": 63.7,
      "top": 53,
      "width": 10.2,
      "page": "front"
    },
    {
      "key": "import_local",
      "label": "امپورٹڈ / لوکل",
      "left": 48.9,
      "top": 53,
      "width": 10.2,
      "page": "front"
    },
    {
      "key": "condition",
      "label": "کنڈیشن گاڑی",
      "left": 33.5,
      "top": 53,
      "width": 10.2,
      "page": "front"
    },
    {
      "key": "vehicle_price",
      "label": "قیمت گاڑی",
      "left": 9.9,
      "top": 53,
      "width": 19.4,
      "page": "front"
    },
    {
      "key": "meter_out",
      "label": "میٹر ریڈنگ روانگی",
      "left": 77.6,
      "top": 56.5,
      "width": 15,
      "page": "front"
    },
    {
      "key": "meter_in",
      "label": "میٹر ریڈنگ واپسی",
      "left": 56.5,
      "top": 56.5,
      "width": 15,
      "page": "front"
    },
    {
      "key": "departure_date",
      "label": "تاریخ روانگی",
      "left": 40.7,
      "top": 56.5,
      "width": 11.6,
      "page": "front"
    },
    {
      "key": "departure_time",
      "label": "وقت روانگی",
      "left": 25.1,
      "top": 56.5,
      "width": 11.6,
      "page": "front"
    },
    {
      "key": "return_date",
      "label": "تاریخ واپسی",
      "left": 9.9,
      "top": 56.5,
      "width": 11,
      "page": "front"
    },
    {
      "key": "return_time",
      "label": "وقت واپسی",
      "left": 83.2,
      "top": 60,
      "width": 11.6,
      "page": "front"
    },
    {
      "key": "duration",
      "label": "دورانیہ",
      "left": 67.5,
      "top": 60,
      "width": 12.2,
      "page": "front"
    },
    {
      "key": "rent_rate",
      "label": "کرایہ یوم / ماہ / لوکل",
      "left": 44.2,
      "top": 60,
      "width": 15,
      "page": "front"
    },
    {
      "key": "total_rent",
      "label": "ٹوٹل رقم",
      "left": 27.1,
      "top": 60,
      "width": 14.3,
      "page": "front"
    },
    {
      "key": "advance",
      "label": "ایڈوانس رقم",
      "left": 9.9,
      "top": 60,
      "width": 13.2,
      "page": "front"
    },
    {
      "key": "remaining",
      "label": "بقایا رقم",
      "left": 81.6,
      "top": 63.5,
      "width": 14.3,
      "page": "front"
    },
    {
      "key": "cheque_no",
      "label": "چیک / ٹرانزیکشن نمبر (اگر ہو)",
      "left": 53.9,
      "top": 63.5,
      "width": 17.7,
      "page": "front"
    },
    {
      "key": "security",
      "label": "سکیورٹی امانت",
      "left": 33.5,
      "top": 63.5,
      "width": 15,
      "page": "front"
    },
    {
      "key": "received_by",
      "label": "کس نے وصول کیا",
      "left": 9.9,
      "top": 63.5,
      "width": 20.6,
      "page": "front"
    },
    {
      "key": "license_no",
      "label": "لائسنس نمبر",
      "left": 81.2,
      "top": 67,
      "width": 13.6,
      "page": "front"
    },
    {
      "key": "license_authority",
      "label": "جاری کردہ اتھارٹی",
      "left": 58.6,
      "top": 67,
      "width": 16.3,
      "page": "front"
    },
    {
      "key": "license_issue",
      "label": "تاریخ اجراء",
      "left": 43.2,
      "top": 67,
      "width": 11.6,
      "page": "front"
    },
    {
      "key": "license_expiry",
      "label": "تاریخ ختم",
      "left": 27.7,
      "top": 67,
      "width": 11.6,
      "page": "front"
    },
    {
      "key": "fuel_level",
      "label": "فیول لیول",
      "left": 9.9,
      "top": 67,
      "width": 14.1,
      "page": "front"
    },
    {
      "key": "other_details",
      "label": "دیگر تفصیلات و نوٹ",
      "left": 9.9,
      "top": 71,
      "width": 79.7,
      "page": "front"
    },
    {
      "key": "client_signature",
      "label": "دستخط کسٹمر",
      "left": 68.6,
      "top": 83.7,
      "width": 22,
      "page": "front"
    },
    {
      "key": "guarantor_signature",
      "label": "دستخط ضامن",
      "left": 38.1,
      "top": 83.7,
      "width": 22.6,
      "page": "front"
    },
    {
      "key": "showroom_signature",
      "label": "دستخط و مہر ادارہ",
      "left": 10.4,
      "top": 83.7,
      "width": 22.6,
      "page": "front"
    },
    {
      "key": "witness1_name",
      "label": "گواہ 1 نام بمعہ ولدیت",
      "left": 70.6,
      "top": 88.7,
      "width": 19.3,
      "page": "front"
    },
    {
      "key": "witness1_cnic",
      "label": "گواہ 1 شناختی کارڈ",
      "left": 51.3,
      "top": 88.7,
      "width": 14.3,
      "page": "front"
    },
    {
      "key": "witness1_mobile",
      "label": "گواہ 1 موبائل",
      "left": 32.4,
      "top": 88.7,
      "width": 14.5,
      "page": "front"
    },
    {
      "key": "witness1_signature",
      "label": "گواہ 1 دستخط",
      "left": 10.3,
      "top": 88.7,
      "width": 15.2,
      "page": "front"
    },
    {
      "key": "witness2_name",
      "label": "گواہ 2 نام بمعہ ولدیت",
      "left": 70.6,
      "top": 93.6,
      "width": 19.3,
      "page": "front"
    },
    {
      "key": "witness2_cnic",
      "label": "گواہ 2 شناختی کارڈ",
      "left": 51.3,
      "top": 93.6,
      "width": 14.3,
      "page": "front"
    },
    {
      "key": "witness2_mobile",
      "label": "گواہ 2 موبائل",
      "left": 32.4,
      "top": 93.6,
      "width": 14.5,
      "page": "front"
    },
    {
      "key": "witness2_signature",
      "label": "گواہ 2 دستخط",
      "left": 10.3,
      "top": 93.6,
      "width": 15.2,
      "page": "front"
    },
    {
      "key": "back_notes_1",
      "label": "پشت — نوٹ / ہدایات 1",
      "left": 2.2,
      "top": 70.4,
      "width": 83,
      "page": "back"
    },
    {
      "key": "back_notes_2",
      "label": "پشت — نوٹ / ہدایات 2",
      "left": 2.2,
      "top": 74.4,
      "width": 95,
      "page": "back"
    },
    {
      "key": "back_notes_3",
      "label": "پشت — نوٹ / ہدایات 3",
      "left": 2.2,
      "top": 78.4,
      "width": 95,
      "page": "back"
    },
    {
      "key": "back_notes_4",
      "label": "پشت — نوٹ / ہدایات 4",
      "left": 2.2,
      "top": 82.4,
      "width": 95,
      "page": "back"
    },
    {
      "key": "back_client_signature",
      "label": "پشت — دستخط کسٹمر",
      "left": 66,
      "top": 92.4,
      "width": 24.5,
      "page": "back"
    },
    {
      "key": "back_guarantor_signature",
      "label": "پشت — دستخط ضامن",
      "left": 32,
      "top": 92.4,
      "width": 25.2,
      "page": "back"
    },
    {
      "key": "back_showroom_signature",
      "label": "پشت — دستخط ادارہ",
      "left": 1.3,
      "top": 92.4,
      "width": 25.2,
      "page": "back"
    }
  ]
};
export const documentPages = { receipt: [receipt1.url, receipt2.url, receipt3.url, receipt4.url, receipt5.url, receipt6.url], rental: [rental1.url, rental2.url, rental3.url, rental4.url] };
export const pageLabels = { receipt: ["شوروم — سامنے", "شوروم — پشت", "فروخت کنندہ — سامنے", "فروخت کنندہ — پشت", "خریدار — سامنے", "خریدار — پشت"], rental: ["شوروم — سامنے", "شوروم — پشت", "کسٹمر — سامنے", "کسٹمر — پشت"] };
