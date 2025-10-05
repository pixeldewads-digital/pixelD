import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-gray dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-img:rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}