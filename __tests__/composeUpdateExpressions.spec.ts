import { composeUpdateExpressions } from "../src/utilities/composeUpdateExpressions";
describe("composeUpdateExpressions", () => {
  it("should be successful", async () => {
    const expressions1 = await composeUpdateExpressions(
      { array: [] },
      { array: [1] }
    );
    expect(expressions1.UpdateExpression).toBe("set #a0[0] = :va0");
    const expressions2 = await composeUpdateExpressions(
      {
        "@_roles": ["WxrgLJ32SpSTJynRREmosQ"],
      },
      {
        "@_roles": ["e3oTy2YjRKSJMxyRuiczRQ", "WxrgLJ32SpSTJynRREmosQ"],
      }
    );
    expect(expressions2.UpdateExpression).toBe(
      "set #a0[0] = :va0,#a0[1] = :va1"
    );
  });
  it("the same contnt, skip it", async () => {
    const expressions = await composeUpdateExpressions(
      {
        "@_roles": ["WxrgLJ32SpSTJynRREmosQ"],
      },
      {
        "@_roles": ["WxrgLJ32SpSTJynRREmosQ"],
      }
    );
    expect(expressions.UpdateExpression).toBe("");
  });
  it("the droped, removed it", async () => {
    const expressions = await composeUpdateExpressions(
      {
        "@_roles": ["a", "b"],
      },
      {
        "@_roles": ["b"],
      }
    );
    expect(expressions.UpdateExpression).toBe(
      "set #a0[0] = :va0 remove #a0[1]"
    );
  });
});
