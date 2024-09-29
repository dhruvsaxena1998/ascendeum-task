import { clsx, type ClassValue } from "clsx";
import { err, ok } from "neverthrow";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNumber(value: unknown) {
  if (typeof value === "number") return value - value === 0;
  if (typeof value === "string" && value.trim() !== "")
    return Number.isFinite(+value);

  return false;
}

export const precedence: Record<string, number> = {
  "^": 3,
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
};

export function isOperator(char: string) {
  return char in precedence || char === "(" || char === ")";
}

export function isOperand(char: string) {
  return (
    (char >= "a" && char <= "z") ||
    (char >= "A" && char <= "Z") ||
    (char >= "0" && char <= "9")
  );
}

export function operate(a: number, b: number, operator: string) {
  switch (operator) {
    case "+":
      return ok(a + b);
    case "-":
      return ok(a - b);
    case "*":
      return ok(a * b);
    case "/":
      return b === 0 ? err("Division by zero") : ok(a / b);
    case "^":
      return ok(Math.pow(a, b));
    default:
      return err("Invalid operator");
  }
}

export function removeExtraSpaces(input: string) {
  return input.replace(/\s+/g, "").match(/([0-9a-zA-Z]+|[*+-\\/\\(\\)])/g);
}

export function formatExpression(
  formula: string,
  variables: Record<string, number>
) {
  let expression = formula;

  // Replace implicit multiplication between a number and a variable
  expression = expression.replace(/(\d)([a-zA-Z])/g, "$1*$2");

  // Replace implicit multiplication between variables
  expression = expression.replace(/([a-zA-Z])([a-zA-Z])/g, "$1*$2");

  // Handle consecutive variables (more than two) e.g., x*y*z
  let prevExpression;
  do {
    prevExpression = expression;
    expression = expression.replace(
      /([a-zA-Z])\*([a-zA-Z])([a-zA-Z])/g,
      "$1*$2*$3"
    );
  } while (expression !== prevExpression);

  Object.entries(variables).forEach(([variable, value]) => {
    expression = expression.replace(
      new RegExp(variable, "g"),
      value.toString()
    );
  });

  return expression;
}
