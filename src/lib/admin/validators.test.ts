import { describe, it, expect } from "vitest";
import { productSchema } from "./validators";

const validProductData = {
  title: "Test Product",
  slug: "test-product",
  description: "This is a test product description.",
  category: "SOCIAL_MEDIA",
  priceCents: 10000,
  license: "COMMERCIAL",
  formats: ["FIGMA"],
  coverImageUrl: "https://example.com/cover.jpg",
  fileKey: "products/test-product.zip",
};

describe("productSchema", () => {
  it("should validate correct product data", () => {
    const result = productSchema.safeParse(validProductData);
    expect(result.success).toBe(true);
  });

  it("should fail if title is too short", () => {
    const result = productSchema.safeParse({ ...validProductData, title: "a" });
    expect(result.success).toBe(false);
  });

  it("should fail if slug is invalid", () => {
    const result = productSchema.safeParse({ ...validProductData, slug: "invalid slug" });
    expect(result.success).toBe(false);
  });

  it("should fail if price is negative", () => {
    const result = productSchema.safeParse({ ...validProductData, priceCents: -100 });
    expect(result.success).toBe(false);
  });

  it("should fail if cover image URL is invalid", () => {
    const result = productSchema.safeParse({ ...validProductData, coverImageUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("should fail if formats array is empty", () => {
    const result = productSchema.safeParse({ ...validProductData, formats: [] });
    expect(result.success).toBe(false);
  });
});