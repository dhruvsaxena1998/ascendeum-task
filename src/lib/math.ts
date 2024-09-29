import { ok, err } from "neverthrow";
import {
  formatExpression,
  isNumber,
  isOperand,
  operate,
  precedence,
  removeExtraSpaces,
} from "@/lib/utils";

export function infixToPostfix(expression: string) {
  const infix = removeExtraSpaces(expression);
  if (!infix) {
    return "";
  }

  // Initialize an empty stack and an empty postfix array
  const stack = [];
  const postfix = [];

  for (let i = 0; i < infix.length; i++) {
    const char = infix[i];

    // If the current character is an operand, add it to the postfix array
    if (isOperand(char)) {
      postfix.push(char);
    }
    // If the stack is empty, push the current character onto the stack
    else if (stack.length === 0) {
      stack.push(char);
    }
    // If the current character is a closing parenthesis, pop operators from the stack
    // and add them to the postfix array until an opening parenthesis is found
    else if (char === ")") {
      while (stack[stack.length - 1] !== "(") {
        postfix.push(stack.pop());
      }
      stack.pop(); // Remove the opening parenthesis from the stack
    }
    // If the precedence of the current character is higher than the precedence
    // of the top operator on the stack, push the current character onto the stack
    else if (precedence[char] > precedence[stack.at(-1)!]) {
      stack.push(char);
    }
    // If the precedence of the current character is lower than or equal to the
    // precedence of the top operator on the stack, pop operators from the stack
    // and add them to the postfix array until the precedence is higher or the
    // stack is empty, then push the current character onto the stack
    else {
      while (
        precedence[char] <= precedence[stack.at(-1)!] &&
        stack.length !== 0 &&
        stack.at(-1) !== "("
      ) {
        postfix.push(stack.pop());
      }
      stack.push(char);
    }
  }

  // Add any remaining operators on the stack to the postfix array
  while (stack.length !== 0) {
    postfix.push(stack.pop());
  }

  return postfix.join(" ");
}

export const evaluatePostfix = (expression: string) => {
  const stack: number[] = [];

  for (const token of expression.split(" ")) {
    // If the token is an operand, push it onto the stack
    if (isOperand(token)) {
      stack.push(Number(token));
    }
    // If the token is an operator, pop the two most recent operands from the stack,
    // perform the operation, and push the result back onto the stack
    else {
      const b = stack.pop()!;
      const a = stack.pop()!;

      const operatedValue = operate(a, b, token);
      if (operatedValue.isErr()) {
        return operatedValue;
      } else {
        stack.push(operatedValue.value);
      }
    }
  }

  // If the stack does not have exactly one element after processing all tokens,
  // the expression is invalid
  if (stack.length !== 1) {
    return err("Invalid expression");
  }

  return ok(stack[0]);
};

interface ICalculateOptions {
  formula: string;
  variables: Record<string, number>;
}
export const calculate = (options: ICalculateOptions) => {
  const { formula, variables } = options;

  if (!formula) {
    return err("Formula is required");
  }

  const expression = formatExpression(formula, variables);
  return evaluate(expression);
};

export const evaluate = (expression: string) => {
  const postfixExpression = infixToPostfix(expression);

  const result = evaluatePostfix(postfixExpression);

  if (result.isErr()) {
    return result;
  }

  if (!isNumber(result.value)) {
    return err("Invalid result");
  }

  return ok(result.value);
};
