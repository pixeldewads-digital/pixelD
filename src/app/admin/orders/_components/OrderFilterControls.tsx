"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaymentStatus } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function OrderFilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string | undefined) => {
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

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      handleFilterChange("from", range.from.toISOString());
    } else {
      handleFilterChange("from", undefined);
    }
    if (range?.to) {
      handleFilterChange("to", range.to.toISOString());
    } else {
      handleFilterChange("to", undefined);
    }
  };

  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  return (
    <div className="flex items-center gap-4 mb-4">
      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {Object.values(PaymentStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !fromDate && !toDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fromDate && toDate ? (
              <>
                {format(new Date(fromDate), "LLL dd, y")} -{" "}
                {format(new Date(toDate), "LLL dd, y")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={fromDate ? new Date(fromDate) : new Date()}
            selected={{ from: fromDate ? new Date(fromDate) : undefined, to: toDate ? new Date(toDate) : undefined }}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" onClick={() => router.push(pathname)}>Clear</Button>
    </div>
  );
}