import type { ExpressionEntries } from "../types";
export declare function concatExpression(expressionSource: ExpressionEntries[]): {
    updateExpression: string;
    attributeNames: Record<string, string>;
    attributeValues: Record<string, any>;
};
