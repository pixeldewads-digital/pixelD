"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, ProductStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

export function ProductFilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === "all") {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("search") as string;
    handleFilterChange("search", searchQuery);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <form onSubmit={handleSearch} className="flex-grow">
        <Input
          type="search"
          name="search"
          placeholder="Search by title..."
          defaultValue={searchParams.get("search") ?? ""}
          className="w-full"
        />
      </form>
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {Object.values(ProductStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {Object.values(Category).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={clearFilters}>Clear</Button>
    </div>
  );
}