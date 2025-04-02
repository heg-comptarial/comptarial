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
  startYear?: number;
  endYear?: number;
  onYearChange?: (year: number) => void;
  className?: string;
}

export default function YearSelector({
  startYear = 2015,
  endYear = new Date().getFullYear() + 10,
  onYearChange,
  className,
}: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  );

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    onYearChange?.(Number.parseInt(value, 10));
  };

  return (
    <Select value={selectedYear} onValueChange={handleYearChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select year" />
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
