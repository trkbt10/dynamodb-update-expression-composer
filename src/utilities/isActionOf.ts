export function isReplaced(a: any, b: any) {
  return typeof a !== typeof b;
}

export function isComputation(a: any, b: any) {
  return typeof a === "number" && typeof b === "number";
}

export function isRemoved(a: any, b: any) {
  return typeof a !== "undefined" && typeof b === "undefined";
}

export function isUpdated(a: any, b: any) {
  return typeof a === typeof b;
}
