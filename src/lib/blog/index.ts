import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  lang: "id" | "en";
  cover: string;
  draft: boolean;
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content/blog");

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const fullPath = path.join(postsDirectory, slug, "index.mdx");
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated,
    author: data.author,
    tags: data.tags || [],
    lang: data.lang || "en",
    cover: data.cover || "",
    draft: data.draft || false,
    content,
  };
});

export const getAllPosts = cache(
  async ({ lang }: { lang?: "id" | "en" } = {}): Promise<Post[]> => {
    const slugs = fs.readdirSync(postsDirectory);
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await getPostBySlug(slug);
        return post;
      })
    );

    const validPosts = posts.filter((post): post is Post => post !== null);

    const filteredByLang = lang
      ? validPosts.filter((post) => post.lang === lang)
      : validPosts;

    return filteredByLang.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
);