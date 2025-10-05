import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

interface PriceBadgeProps {
  priceCents: number;
  currency?: string;
  className?: string;
}

export function PriceBadge({ priceCents, currency, className }: PriceBadgeProps) {
  return (
    <Badge className={className}>
      {formatCurrency(priceCents / 100, currency)}
    </Badge>
  );
}