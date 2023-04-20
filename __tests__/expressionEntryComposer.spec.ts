import { expressionEntryComposer } from "../src/utilities/expressionEntryComposer";
import { uniqueAttributeKeyCreator } from "../src/utilities/uniqueAttributeKeyCreator";

describe("expressionEntryComposer", () => {
  const useComposer = () => {
    const makeNameKey = uniqueAttributeKeyCreator("a");
    const makeValueKey = uniqueAttributeKeyCreator("va");
    return expressionEntryComposer({ makeNameKey, makeValueKey });
  };
  it("SET should be used", () => {
    const composeExpressionEntry = useComposer();
    const [operation, expression] = composeExpressionEntry({
      path: ["#"],
      prev: "prev",
      next: 1,
    });
    expect(operation).toBe("set");
    expect(expression).toEqual({
      expression: "#a0 = :va0",
      attributeNames: { "#a0": "#" },
      attributeValues: { ":va0": 1 },
    });
  });
  it("SET should be used", () => {
    const composeExpressionEntry = useComposer();
    const [operation, expression] = composeExpressionEntry({
      path: ["#"],
      prev: "prev",
      next: "next",
    });
    expect(operation).toBe("set");
    expect(expression).toEqual({
      expression: "#a0 = :va0",
      attributeNames: { "#a0": "#" },
      attributeValues: { ":va0": "next" },
    });
  });
  it("ADD should be used", () => {
    const composeExpressionEntry = useComposer();
    const [operation, expression] = composeExpressionEntry({
      path: ["#"],
      prev: 0,
      next: 1,
    });
    expect(operation).toBe("add");
    expect(expression).toEqual({
      expression: "#a0 :va0",
      attributeNames: { "#a0": "#" },
      attributeValues: { ":va0": 1 },
    });
  });
  it("same value", () => {
    const composeExpressionEntry = useComposer();
    const sameValue = composeExpressionEntry({
      path: ["@_roles"],
      prev: "hoge",
      next: "hoge",
    });
    expect(sameValue).toEqual([
      "noop",
      { expression: "", attributeNames: {}, attributeValues: {} },
    ]);
  });
});
