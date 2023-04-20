import type { ExpressionEntries, Expression } from "../types";

export function concatExpression(expressionSource: ExpressionEntries[]) {
  const groupedExpressions: Record<string, Expression[]> = {};
  for (const [type, expression] of expressionSource) {
    if (!Array.isArray(groupedExpressions[type])) {
      groupedExpressions[type] = [];
    }
    groupedExpressions[type].push(expression);
  }
  const mergedExpressions = Object.entries(groupedExpressions).reduce<{
    updateExpression: string[];
    attributeNames: Record<string, string>;
    attributeValues: Record<string, any>;
  }>(
    (acc, [type, expressions]) => {
      // Skip no operation expression
      if (type === "noop") {
        return acc;
      }
      acc.updateExpression.push(`${type} ${expressions.map((exp) => exp.expression).join(",")}`);
      for (const { attributeNames, attributeValues } of expressions) {
        Object.entries(attributeNames).forEach(([key, value]) => {
          acc.attributeNames[key] = value;
        });
        Object.entries(attributeValues).forEach(([key, value]) => {
          acc.attributeValues[key] = value;
        });
      }
      return acc;
    },
    { updateExpression: [], attributeNames: {}, attributeValues: {} }
  );
  return {
    updateExpression: mergedExpressions.updateExpression.join(" "),
    attributeNames: mergedExpressions.attributeNames,
    attributeValues: mergedExpressions.attributeValues
  };
}
