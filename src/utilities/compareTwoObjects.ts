type Paths = (string | number)[];
export type CompareResult<B = any, A = any> = {
  path: Paths;
  prev: B;
  next: A;
};
export function compareTwoObjects(
  path: (string | number)[],
  prev: any,
  next: any
): CompareResult[] {
  // Same value
  if (Object.is(prev, next)) {
    return [];
  }

  // Replace
  if (typeof prev !== typeof next) {
    return [{ path, prev, next }];
  }

  // Compare two arrays
  if (Array.isArray(prev) && Array.isArray(next)) {
    const compareResults: CompareResult[] = [];
    for (let i = 0, iz = Math.max(prev.length, next.length); i < iz; i++) {
      const p = prev[i];
      const n = next[i];
      compareResults.push(...compareTwoObjects([...path, i], p, n));
    }
    return compareResults;
  }
  // Compare two objects
  if (isObject(prev) && isObject(next)) {
    const combinedKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    const compareResults: CompareResult[] = [];
    for (const key of combinedKeys.values()) {
      const p = prev[key];
      const n = next[key];
      compareResults.push(...compareTwoObjects([...path, key], p, n));
    }
    return compareResults;
  }

  // Primitive
  return [{ path, prev, next }];
}
function isObject(value: any): value is { [key: string]: any } {
  return value !== null && typeof value === "object";
}
