import { describe, it, expect } from "vitest";
import { articleJsonLd, productJsonLd } from "./jsonld";
import { Post } from "../blog";
import { Product } from "@prisma/client";

describe("articleJsonLd", () => {
  it("should generate correct JSON-LD for a blog post", () => {
    const post: Post = {
      slug: "sample-post",
      title: "Sample Post",
      description: "This is a sample post.",
      date: "2025-01-01",
      author: "John Doe",
      tags: ["sample"],
      lang: "en",
      cover: "cover.jpg",
      draft: false,
      content: "...",
    };

    const jsonld = articleJsonLd(post);
    expect(jsonld["@type"]).toBe("Article");
    expect(jsonld.headline).toBe("Sample Post");
    expect(jsonld.author[0].name).toBe("John Doe");
  });
});

describe("productJsonLd", () => {
  it("should generate correct JSON-LD for a product", () => {
    const product: Product = {
      id: "prod_1",
      slug: "sample-product",
      title: "Sample Product",
      description: "This is a sample product.",
      category: "SOCIAL_MEDIA",
      priceCents: 15000,
      currency: "IDR",
      license: "COMMERCIAL",
      formats: ["CANVA"],
      coverImageUrl: "https://example.com/product.jpg",
      galleryUrls: [],
      fileKey: "product.zip",
      version: "1.0",
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const jsonld = productJsonLd(product);
    expect(jsonld["@type"]).toBe("Product");
    expect(jsonld.name).toBe("Sample Product");
    expect(jsonld.offers.price).toBe("150.00");
  });
});