import { compareTwoObjects } from "../src/utilities/compareTwoObjects";
describe("compareTwoObjects", () => {
  it("primitive types", () => {
    expect(compareTwoObjects([], 0, 1)).toStrictEqual([
      { path: [], prev: 0, next: 1 },
    ]);
    expect(compareTwoObjects([], 1, 0)).toStrictEqual([
      { path: [], prev: 1, next: 0 },
    ]);
    expect(compareTwoObjects([], 0, 0)).toStrictEqual([]);
    expect(compareTwoObjects([], "a", "a")).toStrictEqual([]);
    expect(compareTwoObjects([], "a", "b")).toStrictEqual([
      { path: [], prev: "a", next: "b" },
    ]);

    expect(compareTwoObjects([], "1", 0)).toStrictEqual([
      { path: [], prev: "1", next: 0 },
    ]);
  });
  it("object types", () => {
    expect(compareTwoObjects([], {}, {})).toStrictEqual([]);
    expect(compareTwoObjects([], { key: 0 }, { key: 1 })).toStrictEqual([
      { path: ["key"], prev: 0, next: 1 },
    ]);
  });
  it("array types", () => {
    expect(compareTwoObjects([], [], [])).toStrictEqual([]);
    expect(compareTwoObjects([], [0], [1])).toStrictEqual([
      { path: [0], prev: 0, next: 1 },
    ]);
    expect(compareTwoObjects([], [0, 1, 2], [0, 1, 2, 3])).toStrictEqual([
      { path: [3], prev: undefined, next: 3 },
    ]);
  });
  it("nested values", () => {
    expect(
      compareTwoObjects([], [{ array: [] }], [{ array: [] }])
    ).toStrictEqual([]);
    expect(
      compareTwoObjects(
        [],
        [{ array: [{ key: "A" }] }],
        [{ array: [{ key: "B" }] }]
      )
    ).toStrictEqual([{ next: "B", path: [0, "array", 0, "key"], prev: "A" }]);
  });
});
