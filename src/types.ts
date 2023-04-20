export type OperationType = "NOOP" | "ADD" | "SET" | "REMOVE";

export type Expression = {
  expression: string;
  attributeNames: Record<string, string>;
  attributeValues: Record<string, any>;
};
export type PrimitiveTypes = bigint | boolean | null | number | string | symbol | undefined;

export type PropertyOrPrimitiveType = PrimitiveTypes | Properties;
export type Properties = {
  [key: string]: PropertyOrPrimitiveType | PropertyOrPrimitiveType[];
};
export type ExpressionEntries = [string, Expression];
