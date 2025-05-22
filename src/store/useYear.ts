// store/useYearStore.ts
import { create } from 'zustand';

type YearStore = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
};

export const useYearStore = create<YearStore>((set) => ({
  selectedYear: '',
  setSelectedYear: (year) => set({ selectedYear: year }),
}));
