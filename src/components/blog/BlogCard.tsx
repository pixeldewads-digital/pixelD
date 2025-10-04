import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/lib/blog";
import { TagBadge } from "./TagBadge";
import { format } from "date-fns";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        {post.cover && (
          <div className="relative w-full h-48">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(post.date), "MMMM d, yyyy")}
          </p>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <p className="text-muted-foreground line-clamp-3">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}