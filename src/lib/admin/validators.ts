import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  category: z.enum(["SOCIAL_MEDIA", "MINI_EDU", "BALI_ITINERARY"]),
  priceCents: z.coerce.number().int().min(0, "Price must be a positive number."),
  license: z.enum(["PERSONAL", "COMMERCIAL"]),
  formats: z.preprocess((val) => {
    if (typeof val === 'string') return val.split(',');
    return val;
  }, z.array(z.string()).min(1, "At least one format must be selected.")),
  coverImageUrl: z.string().url("Must be a valid URL."),
  galleryUrls: z.preprocess((val) => {
    if (typeof val === 'string' && val.length > 0) return val.split(',');
    if (Array.isArray(val)) return val.filter(v => v.length > 0);
    return [];
  }, z.array(z.string().url("Each gallery URL must be a valid URL.")).default([])),
  fileKey: z.string().min(1, "A file key is required."),
  version: z.string().default("1.0.0"),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED"]).default("DRAFT"),
});

export type ProductSchema = z.infer<typeof productSchema>;