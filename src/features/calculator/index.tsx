import { useCallback, useEffect } from "react";

import * as Math from "@/lib/math";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormulaStore } from "@/store/formula";

import { FormulaDisplay } from "@/features/calculator/components/formula-display";
import {
  FormulaInput,
  FormulaInputForVariables,
} from "./components/formula-input";

export const Calculator = () => {
  const { formula, variables, result, setVariables, setResult } =
    useFormulaStore();

  const handleVariables = useCallback(
    (input: string) => {
      const regex = /[a-zA-Z]/g;
      const vars = [...new Set(input.match(regex) || [])];

      const detectedVars: Record<string, number> = {};
      vars.forEach((v) => {
        detectedVars[v] = variables[v] ?? 0;
      });

      setVariables(detectedVars);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variables]
  );

  useEffect(() => {
    handleVariables(formula);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formula]);

  useEffect(() => {
    const result = Math.calculate({
      formula,
      variables,
    });

    if (result.isErr()) {
      setResult(null);
    } else {
      setResult(result.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formula, variables]);

  const handleVariableChange = (variable: string, value: number) => {
    setVariables({ ...variables, [variable]: value });
  };

  return (
    <Card className="w-full md:w-1/2 mx-auto">
      <CardHeader className="poppins-bold">Formula Calculator</CardHeader>
      <CardContent>
        <div className="flex items-center space-4 rounded-md border p-2 my-2 default-bg">
          <p className="text-lg poppins-regular">Result: {result}</p>
        </div>

        <Separator className="my-4" />

        <div className="h-16 mb-2 default-bg rounded-md flex items-center justify-center cursor-not-allowed">
          <FormulaDisplay />
        </div>

        <Separator className="my-4" />

        <FormulaInput />

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-4">
          {Object.entries(variables).map(([variable, value]) => (
            <FormulaInputForVariables
              key={variable}
              variable={variable}
              value={value}
              handleVariableChange={handleVariableChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
