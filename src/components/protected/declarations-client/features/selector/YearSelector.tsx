"use client";

import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface YearSelectorProps {
  years: string[];
  selectedYear: string;
  onYearChange?: (year: number) => void;
  className?: string;
}

export default function YearSelector({
  years,
  selectedYear,
  onYearChange,
  className,
}: YearSelectorProps) {
  const handleYearChange = (value: string) => {
    onYearChange?.(Number.parseInt(value, 10));
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        <CalendarIcon className="h-5 w-5" />
      </div>
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger
          className={cn(
            "pl-10 pr-8 py-3 h-auto text-base border-gray-200 rounded-md bg-white",
            className
          )}
        >
          <SelectValue placeholder="Sélectionnez une année" />
        </SelectTrigger>
        <SelectContent>
          {years.length > 0 ? (
            years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-data" disabled>
              Aucune année disponible
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
