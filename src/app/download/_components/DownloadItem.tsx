"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderItem, Product, DownloadLog } from "@prisma/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type DownloadItemProps = {
  item: OrderItem & { product: Product; order: { createdAt: Date } };
  downloadLogs: DownloadLog[];
};

export function DownloadItem({ item, downloadLogs }: DownloadItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const maxAttempts = parseInt(process.env.NEXT_PUBLIC_DOWNLOAD_MAX_ATTEMPTS || "5", 10);
  const ttlDays = parseInt(process.env.NEXT_PUBLIC_SIGNED_URL_TTL_DAYS || "7", 10);

  const downloadsUsed = downloadLogs.filter(log => log.success).length;
  const downloadsRemaining = maxAttempts - downloadsUsed;

  const expiryDate = new Date(item.order.createdAt);
  expiryDate.setDate(expiryDate.getDate() + ttlDays);
  const isExpired = new Date() > expiryDate;

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/downloads/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId: item.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get download link.");
      }

      const { url } = await response.json();
      window.open(url, "_blank");
      toast.success("Your download will begin shortly.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const canDownload = downloadsRemaining > 0 && !isExpired;

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div>
        <p className="font-semibold">{item.product.title}</p>
        <p className="text-sm text-muted-foreground">
          {canDownload
            ? `${downloadsRemaining} of ${maxAttempts} downloads remaining.`
            : "Download limit reached or link expired."}
        </p>
        <p className="text-xs text-muted-foreground">
          Expires {formatDistanceToNow(expiryDate, { addSuffix: true })}
        </p>
      </div>
      <Button onClick={handleDownload} disabled={isLoading || !canDownload}>
        {isLoading ? "Generating..." : "Get Download Link"}
      </Button>
    </div>
  );
}