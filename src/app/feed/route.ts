import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await getAllPosts();
  const publishedPosts = posts.filter(post => !post.draft);

  const items = publishedPosts.map(p => `
    <item>
      <title>${p.title}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/blog/${p.slug}</guid>
      <description><![CDATA[${p.description}]]></description>
      ${p.tags.map(tag => `<category>${tag}</category>`).join("")}
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PixelDew Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Updates, tutorials, and tips from the PixelDew team.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}