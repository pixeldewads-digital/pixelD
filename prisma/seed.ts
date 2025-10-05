import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  // ensure admin user if ADMIN_EMAILS provided
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  for (const email of admins) {
    await db.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: { email, role: "ADMIN", name: "PixelDew Admin" }
    });
  }

  // create sample products
  const samples = [
    {
      slug: "sma-ig-ads-starter",
      title: "IG Ads Starter Pack",
      description: "30 template iklan IG siap pakai.",
      category: "SOCIAL_MEDIA",
      priceCents: 99000,
      formats: ["CANVA","FIGMA"],
      coverImageUrl: "/seed/ig-ads.jpg",
      galleryUrls: ["/seed/ig-ads-1.jpg","/seed/ig-ads-2.jpg"],
      fileKey: "products/ig-ads-starter.zip",
      status: "PUBLISHED"
    },
    {
      slug: "mini-edu-umkm-fb-ads",
      title: "Mini Edu: UMKM FB Ads",
      description: "Panduan ringkas + template copy.",
      category: "MINI_EDU",
      priceCents: 79000,
      formats: ["PDF"],
      coverImageUrl: "/seed/mini-edu.jpg",
      galleryUrls: ["/seed/mini-edu-1.jpg"],
      fileKey: "products/mini-edu-umkm.zip",
      status: "PUBLISHED"
    },
    {
      slug: "bali-itinerary-3d2n",
      title: "Bali Itinerary 3D2N",
      description: "Rencana perjalanan 3 hari 2 malam.",
      category: "BALI_ITINERARY",
      priceCents: 59000,
      formats: ["PDF"],
      coverImageUrl: "/seed/bali-3d2n.jpg",
      galleryUrls: ["/seed/bali-3d2n-1.jpg"],
      fileKey: "products/bali-3d2n.zip",
      status: "PUBLISHED"
    }
  ];

  for (const p of samples) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        currency: "IDR",
        license: "COMMERCIAL",
        version: "1.0.0",
        galleryUrls: p.galleryUrls as any
      } as any
    });
  }
}

main().then(() => db.$disconnect());