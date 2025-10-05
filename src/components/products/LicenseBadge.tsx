import { Badge } from "@/components/ui/badge";
import { License } from "@prisma/client";
import { cn } from "@/lib/utils";

interface LicenseBadgeProps {
  license: License;
  className?: string;
}

export function LicenseBadge({ license, className }: LicenseBadgeProps) {
  return (
    <Badge
      variant={license === "COMMERCIAL" ? "default" : "secondary"}
      className={cn(className)}
    >
      {license.charAt(0) + license.slice(1).toLowerCase()} License
    </Badge>
  );
}