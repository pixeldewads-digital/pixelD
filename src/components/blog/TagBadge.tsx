import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TagBadge({ tag }: { tag: string }) {
  return (
    <Link href={`/blog?tag=${encodeURIComponent(tag)}`}>
      <Badge variant="secondary" className="hover:bg-secondary/80">
        {tag}
      </Badge>
    </Link>
  );
}