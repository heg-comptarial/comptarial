"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    onYearChange?.(parseInt(value, 10));
  };

  return (
    <Select value={selectedYear} onValueChange={handleYearChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sélectionnez une année" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
