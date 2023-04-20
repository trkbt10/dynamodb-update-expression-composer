import { uniqueAttributeKeyCreator } from "../src/utilities/uniqueAttributeKeyCreator";

describe("uniqueAttributeKeyCreator", () => {
  it("basic", () => {
    const creator = uniqueAttributeKeyCreator();
    expect(creator("a")).toBe("a0");
    expect(creator("b")).toBe("a1");
    expect(creator("c")).toBe("a2");
  });
  it("if the same key is passed, it will return the same value", () => {
    const creator = uniqueAttributeKeyCreator();
    expect(creator("a")).toBe("a0");
    expect(creator("a")).toBe("a0");
  });
  it("include prefix", () => {
    const creator = uniqueAttributeKeyCreator("prefix");
    expect(creator("a")).toBe("prefix0");
    expect(creator("b")).toBe("prefix1");
  });
});
