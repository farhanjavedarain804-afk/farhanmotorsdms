import { describe, expect, it } from "vitest";
import { documentFields, documentPages } from "./documentTemplates";
describe("Original uploaded documents", () => {
  it("keeps showroom, seller and buyer receipt fronts and backs", () => {
    expect(documentPages.receipt).toHaveLength(6);
  });
  it("keeps rental showroom and client fronts and backs", () => {
    expect(documentPages.rental).toHaveLength(4);
  });
  for (const kind of ["receipt", "rental"] as const) {
    it(`${kind} inputs map to distinct blanks within the source page`, () => {
      const fields = documentFields[kind];
      expect(new Set(fields.map(f => f.key)).size).toBe(fields.length);
      for (const f of fields) {
        expect(f.left).toBeGreaterThanOrEqual(0);
        expect(f.left + f.width).toBeLessThanOrEqual(100);
        expect(f.top).toBeLessThan(100);
      }
    });
  }
});