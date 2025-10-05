import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatters";

describe("formatCurrency", () => {
  it("formats a given number into IDR currency format", () => {
    expect(formatCurrency(100000)).toBe("Rp 100.000");
  });

  it("handles zero correctly", () => {
    expect(formatCurrency(0)).toBe("Rp 0");
  });

  it("handles different currencies", () => {
    expect(formatCurrency(100, "USD")).toBe("US$100");
  });

  it("handles numbers with decimals by rounding them", () => {
    expect(formatCurrency(12345.67)).toBe("Rp 12.346");
  });
});