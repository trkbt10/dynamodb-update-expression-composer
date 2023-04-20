import { concatExpression } from "../src/utilities/concatExpression";

describe("concatExpression", () => {
  it("should be successful", async () => {
    const result = concatExpression([
      [
        "add",
        {
          expression: "#a0 :va0",
          attributeNames: { "#a0": "value" },
          attributeValues: { ":va0": 1 },
        },
      ],
      [
        "add",
        {
          expression: "#a1 :va1",
          attributeNames: { "#a1": "value" },
          attributeValues: { ":va1": 1 },
        },
      ],
    ]);
    expect(result).toEqual({
      updateExpression: "add #a0 :va0,#a1 :va1",
      attributeNames: { "#a0": "value", "#a1": "value" },
      attributeValues: { ":va0": 1, ":va1": 1 },
    });
  });
  it("should be successful", async () => {
    const result = concatExpression([
      [
        "noop",
        {
          expression: "",
          attributeNames: {},
          attributeValues: {},
        },
      ],
    ]);
    expect(result).toEqual({
      updateExpression: "",
      attributeNames: {},
      attributeValues: {},
    });
  });
});
