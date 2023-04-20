import type { ExpressionEntries } from "../types";
export declare function expressionEntryComposer({ makeNameKey, makeValueKey, }: {
    makeNameKey: (path: any) => string;
    makeValueKey: (path: any) => string;
}): ({ path, prev, next, }: {
    path: (string | number)[];
    prev: any;
    next: any;
}) => ExpressionEntries;
