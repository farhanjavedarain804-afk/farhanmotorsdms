import jsPDF from "jspdf";
import { documentFields, documentPages, type DocumentKind } from "./documentTemplates";

export async function renderDocument(kind: DocumentKind, values: Record<string, string>): Promise<string[]> {
  await document.fonts.load('18px "Noto Nastaliq Urdu"');
  return Promise.all(documentPages[kind].map(async (url, index) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 2382;
    canvas.height = 1684;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Document canvas unavailable");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (const field of documentFields[kind].filter(f => f.page === (index % 2 === 0 ? "front" : "back"))) {
      const value = values[field.key]?.trim();
      if (!value) continue;
      const available = field.width / 100 * canvas.width - 12;
      let size = 25;
      ctx.direction = /[\u0600-\u06ff]/.test(value) ? "rtl" : "ltr";
      ctx.font = `${size}px "Noto Nastaliq Urdu", sans-serif`;
      while (ctx.measureText(value).width > available && size > 8) {
        size -= 1;
        ctx.font = `${size}px "Noto Nastaliq Urdu", sans-serif`;
      }
      ctx.fillText(value, (field.left + field.width / 2) / 100 * canvas.width, field.top / 100 * canvas.height - 5, available);
    }
    return canvas.toDataURL("image/jpeg", 0.96);
  }));
}

export function createDocumentPDF(pages: string[]): Blob {
  if (!pages.length) throw new Error("No document pages");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  pages.forEach((page, i) => {
    if (i) pdf.addPage("a4", "landscape");
    pdf.addImage(page, "JPEG", 0, 0, 297, 210);
  });
  return pdf.output("blob");
}

export async function deliverDocument(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "application/pdf" });
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: filename }); return; }
    catch (error) { if ((error as DOMException).name === "AbortError") return; }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function printDocument(pages: string[]) {
  const frame = document.createElement("iframe");
  frame.className = "document-print-frame";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) { frame.remove(); throw new Error("Print unavailable"); }
  doc.open();
  doc.write(`<html><head><title>Farhan Motors Document</title><style>@page{size:A4 landscape;margin:0}html,body{margin:0;padding:0}img{display:block;width:297mm;height:210mm;break-after:page}img:last-child{break-after:auto}</style></head><body>${pages.map(p => `<img src="${p}"/>`).join("")}</body></html>`);
  doc.close();
  Promise.all(Array.from(doc.images).map(img => img.decode())).then(() => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    setTimeout(() => frame.remove(), 60000);
  }).catch(() => frame.remove());
}