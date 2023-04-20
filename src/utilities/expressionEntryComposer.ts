import { isComputation, isRemoved, isReplaced, isUpdated } from "./isActionOf";
import type { ExpressionEntries } from "../types";

export function expressionEntryComposer({
  makeNameKey,
  makeValueKey,
}: {
  makeNameKey: (path: any) => string;
  makeValueKey: (path: any) => string;
}) {
  return ({
    path,
    prev,
    next,
  }: {
    path: (string | number)[];
    prev: any;
    next: any;
  }): ExpressionEntries => {
    if (prev === next) {
      return [
        "noop",
        { expression: "", attributeNames: {}, attributeValues: {} },
      ];
    }
    const filteredPath = path.filter(
      (key): key is string => typeof key === "string"
    );
    const attributeKeys = filteredPath.map((path) => makeNameKey(path));
    const expkey = path.reduce((acc, path, i) => {
      const prefix = acc === "" ? "" : `.`;
      return `${acc}${
        typeof path === "number"
          ? `[${path}]`
          : `${prefix}#${makeNameKey(path)}`
      }`;
    }, "");
    const attributeNameEntries = attributeKeys.map((key, i) => {
      return [`#${key}`, filteredPath[i].toString()];
    });
    // Remove
    if (isRemoved(prev, next)) {
      const expression = `${expkey}`;
      return [
        "remove",
        {
          expression: expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {},
        },
      ];
    }
    // Change value
    if (isComputation(prev, next)) {
      const gap = next - prev;
      const vkey = `${makeValueKey(gap)}`;
      const expression = `${expkey} :${vkey}`;

      return [
        "add",
        {
          expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {
            [`:${vkey}`]: gap,
          },
        },
      ];
    }
    // Update
    if (isUpdated(prev, next)) {
      const vkey = `${makeValueKey(next)}`;
      const expression = `${expkey} = :${vkey}`;

      return [
        "set",
        {
          expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {
            [`:${vkey}`]: next,
          },
        },
      ];
    }
    // Replace
    if (isReplaced(prev, next)) {
      const vkey = `${makeValueKey(next)}`;
      const expression = `${expkey} = :${vkey}`;
      return [
        "set",
        {
          expression: expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {
            [`:${vkey}`]: next,
          },
        },
      ];
    }
    return [
      "noop",
      { expression: "", attributeNames: {}, attributeValues: {} },
    ];
  };
}
