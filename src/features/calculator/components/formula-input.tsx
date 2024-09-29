import { useState, type ChangeEvent } from "react";

import { useFormulaStore } from "@/store/formula";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export const FormulaInput = () => {
  const [error, setError] = useState("");
  const { formula, setFormula } = useFormulaStore();

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    const allowedCharacterSet = /^[0-9a-zA-Z+\-*^/]*$/;

    const isValidInput = allowedCharacterSet.test(value);
    if (isValidInput) {
      setError("");
      setFormula(value);
    } else {
      setError(
        "Invalid character entered. Only 0-9, a-z, A-Z, +, -, *, ^, and / are allowed."
      );
    }
  };

  return (
    <div>
      <label
        htmlFor="formula"
        className="block text-sm font-medium text-stone-700 dark:text-stone-400 mb-2"
      >
        Enter Formula:
      </label>

      <Textarea
        className="default-bg rounded-md"
        value={formula}
        placeholder="Enter your formula (e.g., 2*x^2 + 3*y + 1)"
        onChange={handleInput}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const FormulaInputForVariables = (props: {
  variable: string;
  value: number;
  handleVariableChange: (variable: string, value: number) => void;
}) => {
  return (
    <Card className="w-full md:w-[calc(50%-0.5rem)]">
      <CardHeader>
        <label className="text-sm consolas">
          {props.variable} = {props.value}
        </label>
      </CardHeader>

      <CardContent>
        <Slider
          min={0}
          max={100}
          step={1}
          className="p-2"
          value={[props.value]}
          onValueChange={(newValue) =>
            props.handleVariableChange(props.variable, newValue[0])
          }
        />
      </CardContent>
    </Card>
  );
};
