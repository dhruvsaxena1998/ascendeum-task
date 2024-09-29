import { expect, test, describe } from "vitest";
import { infixToPostfix, evaluatePostfix, calculate } from "./math";

describe("[infixToPostfix]", () => {
  test("should convert simple arithmetic expressions", () => {
    expect(infixToPostfix("2 + 3")).toBe("23+");
    expect(infixToPostfix("5 - 1")).toBe("51-");
    expect(infixToPostfix("4 * 6")).toBe("46*");
    expect(infixToPostfix("8 / 2")).toBe("82/");
  });

  test("should handle expressions with multiple operators", () => {
    expect(infixToPostfix("2 + 3 * 4 - 5")).toBe("234*+5-");
    expect(infixToPostfix("(2 + 3) * 4")).toBe("23+4*");
    expect(infixToPostfix("2 * (3 + 4) / 5")).toBe("234+*5/");
  });

  test("should handle expressions with variables", () => {
    expect(infixToPostfix("a + b")).toBe("ab+");
    expect(infixToPostfix("x - y")).toBe("xy-");
    expect(infixToPostfix("p * q + r / s")).toBe("pq*rs/+");
  });

  test("should handle expressions with both numbers and variables", () => {
    expect(infixToPostfix("2 * a + 3 * b")).toBe("2a*3b*+");
    expect(infixToPostfix("(x + y) * 4 / z")).toBe("xy+4*z/");
    expect(infixToPostfix("a * b - c / d")).toBe("ab*cd/-");
  });

  test("should handle expressions with extra spaces", () => {
    expect(infixToPostfix("2 +   3")).toBe("23+");
    expect(infixToPostfix("  4 * 6  ")).toBe("46*");
    expect(infixToPostfix("(2 + 3)   * 4")).toBe("23+4*");
  });
});

describe("[evaluatePostfix]", () => {
  test("should evaluate simple arithmetic expressions", () => {
    let result = evaluatePostfix(infixToPostfix("2 + 3"));
    if (result.isOk()) {
      expect(result.value).toBe(5);
    }

    result = evaluatePostfix(infixToPostfix("5 - 1"));
    if (result.isOk()) {
      expect(result.value).toBe(4);
    }

    result = evaluatePostfix(infixToPostfix("4 * 6"));
    if (result.isOk()) {
      expect(result.value).toBe(24);
    }
    result = evaluatePostfix(infixToPostfix("8 / 2"));
    if (result.isOk()) {
      expect(result.value).toBe(4);
    }
  });

  test("should evaluate expressions with exponents", () => {
    let result = evaluatePostfix(infixToPostfix("22^4+56-6^2"));
    if (result.isOk()) {
      expect(result.value).toBe(36);
    }

    result = evaluatePostfix(infixToPostfix("2+3^4"));
    if (result.isOk()) {
      expect(result.value).toBe(83);
    }
  });

  test("should evaluate expressions with multiple operators", () => {
    let result = evaluatePostfix(infixToPostfix("2 + 3 * 4 - 5"));
    if (result.isOk()) {
      expect(result.value).toBe(9);
    }

    result = evaluatePostfix(infixToPostfix("(2 + 3) * 4"));
    if (result.isOk()) {
      expect(result.value).toBe(20);
    }

    result = evaluatePostfix(infixToPostfix("2 * (3 + 4) / 5"));
    if (result.isOk()) {
      expect(result.value).toBe(2.8);
    }
  });

  test("should evaluate expressions with nested parentheses", () => {
    let result = evaluatePostfix(infixToPostfix("(2 + 3) * 4"));
    if (result.isOk()) {
      expect(result.value).toBe(20);
    }

    result = evaluatePostfix(infixToPostfix("2 * (3 + 4) - (5-1) * 4"));
    if (result.isOk()) {
      expect(result.value).toBe(-2);
    }

    result = evaluatePostfix(infixToPostfix("(2 + 3) * (4 - 5 + (6-2))"));
    if (result.isOk()) {
      expect(result.value).toBe(15);
    }
  });
});

describe("[calculate expressions]", () => {
  test("should calculate simple arithmetic expressions", () => {
    let result = calculate({
      formula: "2 + 3",
      variables: {},
    });
    if (result.isOk()) {
      expect(result.value).toBe(5);
    }

    result = calculate({
      formula: "5 - 1",
      variables: {},
    });
    if (result.isOk()) {
      expect(result.value).toBe(4);
    }

    result = calculate({
      formula: "4 * 6",
      variables: {},
    });
    if (result.isOk()) {
      expect(result.value).toBe(24);
    }
  });

  test("should calculate expressions with variables", () => {
    let result = calculate({
      formula: "a + b",
      variables: {
        a: 2,
        b: 3,
      },
    });
    if (result.isOk()) {
      expect(result.value).toBe(5);
    }

    result = calculate({
      formula: "x^y/z",
      variables: {
        x: 2,
        y: 3,
        z: 2,
      },
    });
    if (result.isOk()) {
      expect(result.value).toBe(4);
    }
  });

  test("should calculate expressions with both numbers and variables", () => {
    let result = calculate({
      formula: "2 * a + 3 * b",
      variables: {
        a: 2,
        b: 3,
      },
    });
    if (result.isOk()) {
      expect(result.value).toBe(13);
    }

    result = calculate({
      formula: "2 + (x + y) * 4 / z",
      variables: {
        x: 2,
        y: 3,
        z: 2,
      },
    });
    if (result.isOk()) {
      expect(result.value).toBe(12);
    }
  });

  test("should calculate expressions with variables without operators", () => {
    let result = calculate({
      formula: "2a + b",
      variables: {
        a: 2,
        b: 3,
      },
    });
    if (result.isOk()) {
      expect(result.value).toBe(7);
    }

    result = calculate({
      formula: "2x^y/z",
      variables: {
        x: 2,
        y: 3,
        z: 2,
      },
    });
    if (result.isOk()) {
      expect(result.value).toBe(8);
    }
  });
});
