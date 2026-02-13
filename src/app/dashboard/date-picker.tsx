"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date }: { date: Date }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(selected: Date | undefined) {
    if (!selected) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(selected, "yyyy-MM-dd"));
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="size-4" />
          {format(date, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
