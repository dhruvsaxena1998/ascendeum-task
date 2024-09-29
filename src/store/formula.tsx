import { create } from "zustand";

type FormulaStore = {
  formula: string;
  variables: Record<string, number>;
  result: number | null;

  setFormula: (value: string) => void;
  setVariables: (value: Record<string, number>) => void;
  setResult: (value: number | null) => void;
};

export const useFormulaStore = create<FormulaStore>()((set) => ({
  formula: "",
  variables: {},
  result: 0,

  setFormula: (value) => set(() => ({ formula: value })),
  setVariables: (value) => set(() => ({ variables: value })),
  setResult: (value) => set(() => ({ result: value })),
}));
