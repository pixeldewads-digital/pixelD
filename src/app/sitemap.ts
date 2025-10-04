import { getAllPosts } from "@/lib/blog";
import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/templates`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
  ];

  const products = await db.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const productUrls = products.map((product) => ({
    url: `${siteUrl}/templates/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  const posts = await getAllPosts();
  const publishedPosts = posts.filter(post => !post.draft);

  const postUrls = publishedPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updated ? new Date(post.updated) : new Date(post.date),
  }));

  return [...staticPages, ...productUrls, ...postUrls];
}