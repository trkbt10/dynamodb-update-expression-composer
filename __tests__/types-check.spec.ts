import { composeUpdateExpressions } from "../src";
describe("types-check", () => {
  it("Boolean", () => {
    const b = {
      boolean: true,
    };
    const a = {
      boolean: false,
    };
    const expressions = composeUpdateExpressions(b, a);
    expect(expressions).toStrictEqual({
      UpdateExpression: "set #a0 = :va0",
      ExpressionAttributeNames: { "#a0": "boolean" },
      ExpressionAttributeValues: { ":va0": false },
    });
  });
  it("String", () => {
    const b = {
      string: "before",
    };
    const a = {
      string: "after",
    };
    const expressions = composeUpdateExpressions(b, a);
    expect(expressions).toStrictEqual({
      UpdateExpression: "set #a0 = :va0",
      ExpressionAttributeNames: { "#a0": "string" },
      ExpressionAttributeValues: { ":va0": a.string },
    });
  });
  it("Number", () => {
    const b = {
      numeric: 2,
    };
    const a = {
      numeric: 1,
    };
    const expressions = composeUpdateExpressions(b, a);
    expect(expressions).toStrictEqual({
      UpdateExpression: "add #a0 :va0",
      ExpressionAttributeNames: { "#a0": "numeric" },
      ExpressionAttributeValues: { ":va0": a.numeric - b.numeric },
    });
  });
  it("If the same value has a different type, it is considered as a separate value.", () => {
    const b = {
      numeric: 1,
      string: "2",
    };
    const a = {
      numeric: 2,
      string: "1",
    };
    const expressions = composeUpdateExpressions(b, a);
    expect(expressions).toStrictEqual({
      UpdateExpression: "add #a0 :va0 set #a1 = :va1",
      ExpressionAttributeNames: { "#a0": "numeric", "#a1": "string" },
      ExpressionAttributeValues: { ":va0": 1, ":va1": "1" },
    });
  });
});
