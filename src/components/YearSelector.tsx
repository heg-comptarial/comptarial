"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSelectorProps {
  years: string[];
  onYearChange?: (year: number) => void;
  className?: string;
}

export default function YearSelector({
  years,
  onYearChange,
  className,
}: YearSelectorProps) {
  const [selectedYear, setSelectedYear] = useState<string>(years[0] ?? "");

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
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
