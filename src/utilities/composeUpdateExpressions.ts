import { concatExpression } from "./concatExpression";
import { uniqueAttributeKeyCreator } from "./uniqueAttributeKeyCreator";
import { expressionEntryComposer } from "./expressionEntryComposer";
import { compareTwoObjects } from "./compareTwoObjects";

export function composeUpdateExpressions(prev: {}, next: {}) {
  const changes = compareTwoObjects([], prev, next);
  const makeNameKey = uniqueAttributeKeyCreator("a");
  const makeValueKey = uniqueAttributeKeyCreator("va");
  const composeExpressionEntry = expressionEntryComposer({
    makeNameKey,
    makeValueKey,
  });
  const expressions = changes.map(composeExpressionEntry);
  const concatedExpression = concatExpression(expressions);
  return {
    UpdateExpression: concatedExpression.updateExpression,
    ExpressionAttributeNames: concatedExpression.attributeNames,
    ExpressionAttributeValues: concatedExpression.attributeValues,
  };
}
