import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, Post } from "@/lib/blog";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { format } from "date-fns";
import { Prose } from "@/components/blog/Prose";
import { TagBadge } from "@/components/blog/TagBadge";
import { BlogCard } from "@/components/blog/BlogCard";
import { articleJsonLd } from "@/lib/seo/jsonld";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const allPosts = await getAllPosts();
  const alternates: { [key: string]: string } = {};
  allPosts
    .filter((p) => p.slug === params.slug && p.lang !== post.lang)
    .forEach((p) => {
      alternates[p.lang] = `${process.env.NEXT_PUBLIC_SITE_URL}/${p.lang}/blog/${p.slug}`;
    });

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${post.lang}/blog/${post.slug}`,
      languages: alternates,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.cover ? [`/blog/${post.slug}/${post.cover}`] : [],
    },
  };
}

async function getRelatedPosts(currentPost: Post) {
    const allPosts = await getAllPosts();
    return allPosts.filter(p =>
        p.slug !== currentPost.slug &&
        !p.draft &&
        p.tags.some(tag => currentPost.tags.includes(tag))
    ).slice(0, 3);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post || post.draft) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);

  return (
    <div className="container my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <article className="mt-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="text-muted-foreground mt-2">
            By {post.author} on {format(new Date(post.date), "MMMM d, yyyy")}
          </p>
          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </header>
        <Prose>
          <MDXRemote source={post.content} />
        </Prose>
      </article>

      {relatedPosts.length > 0 && (
          <aside className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map(p => <BlogCard key={p.slug} post={p} />)}
              </div>
          </aside>
      )}
    </div>
  );
}