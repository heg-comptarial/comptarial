"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const years = Array.from({ length: 20 }, (_, i) => 2020 + i); // Generates years from 2020 to 2039

export default function Page() {
  const [selectedYear, setSelectedYear] = useState<string | undefined>();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Select onValueChange={setSelectedYear}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
