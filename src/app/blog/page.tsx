import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { Pagination } from "@/components/blog/Pagination";

const POSTS_PER_PAGE = 12;

type BlogPageProps = {
  params: { lang?: "id" | "en" };
  searchParams: {
    page?: string;
    tag?: string;
  };
};

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const lang = params.lang || "en";
  const allPosts = await getAllPosts({ lang });
  const publishedPosts = allPosts.filter((post) => !post.draft);

  const currentPage = parseInt(searchParams.page || "1", 10);
  const currentTag = searchParams.tag;

  const filteredPosts = currentTag
    ? publishedPosts.filter((post) => post.tags.includes(currentTag))
    : publishedPosts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const postsForPage = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="container my-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]} />
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold">The PixelDew Blog</h1>
        <p className="text-muted-foreground mt-2">
          Tips, tutorials, and updates from the PixelDew team.
        </p>
      </div>

      {currentTag && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            Showing posts tagged with: <span className="text-primary">{currentTag}</span>
          </h2>
        </div>
      )}

      {postsForPage.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsForPage.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No posts found.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            tag={currentTag}
          />
        </div>
      )}
    </div>
  );
}