function concatExpression(expressionSource) {
  const groupedExpressions = {};
  for (const [type, expression] of expressionSource) {
    if (!Array.isArray(groupedExpressions[type])) {
      groupedExpressions[type] = [];
    }
    groupedExpressions[type].push(expression);
  }
  const mergedExpressions = Object.entries(groupedExpressions).reduce(
    (acc, [type, expressions]) => {
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
function uniqueAttributeKeyCreator(prefix = "a") {
  const attributeKeyMap = /* @__PURE__ */ new Map();
  let counter = 0;
  const generateKey = (seed) => {
    const attrKey = attributeKeyMap.get(seed);
    if (attrKey) {
      return attrKey;
    }
    const generatedKey = `${prefix}${counter++}`;
    attributeKeyMap.set(seed, generatedKey);
    return generatedKey;
  };
  return (path) => {
    return generateKey(path);
  };
}
function isReplaced(a, b) {
  return typeof a !== typeof b;
}
function isComputation(a, b) {
  return typeof a === "number" && typeof b === "number";
}
function isRemoved(a, b) {
  return typeof a !== "undefined" && typeof b === "undefined";
}
function isUpdated(a, b) {
  return typeof a === typeof b;
}
function expressionEntryComposer({
  makeNameKey,
  makeValueKey
}) {
  return ({
    path,
    prev,
    next
  }) => {
    if (prev === next) {
      return [
        "noop",
        { expression: "", attributeNames: {}, attributeValues: {} }
      ];
    }
    const filteredPath = path.filter(
      (key) => typeof key === "string"
    );
    const attributeKeys = filteredPath.map((path2) => makeNameKey(path2));
    const expkey = path.reduce((acc, path2, i) => {
      const prefix = acc === "" ? "" : `.`;
      return `${acc}${typeof path2 === "number" ? `[${path2}]` : `${prefix}#${makeNameKey(path2)}`}`;
    }, "");
    const attributeNameEntries = attributeKeys.map((key, i) => {
      return [`#${key}`, filteredPath[i].toString()];
    });
    if (isRemoved(prev, next)) {
      const expression = `${expkey}`;
      return [
        "remove",
        {
          expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {}
        }
      ];
    }
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
            [`:${vkey}`]: gap
          }
        }
      ];
    }
    if (isUpdated(prev, next)) {
      const vkey = `${makeValueKey(next)}`;
      const expression = `${expkey} = :${vkey}`;
      return [
        "set",
        {
          expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {
            [`:${vkey}`]: next
          }
        }
      ];
    }
    if (isReplaced(prev, next)) {
      const vkey = `${makeValueKey(next)}`;
      const expression = `${expkey} = :${vkey}`;
      return [
        "set",
        {
          expression,
          attributeNames: Object.fromEntries(attributeNameEntries),
          attributeValues: {
            [`:${vkey}`]: next
          }
        }
      ];
    }
    return [
      "noop",
      { expression: "", attributeNames: {}, attributeValues: {} }
    ];
  };
}
function compareTwoObjects(path, prev, next) {
  if (Object.is(prev, next)) {
    return [];
  }
  if (typeof prev !== typeof next) {
    return [{ path, prev, next }];
  }
  if (Array.isArray(prev) && Array.isArray(next)) {
    const compareResults = [];
    for (let i = 0, iz = Math.max(prev.length, next.length); i < iz; i++) {
      const p = prev[i];
      const n = next[i];
      compareResults.push(...compareTwoObjects([...path, i], p, n));
    }
    return compareResults;
  }
  if (isObject(prev) && isObject(next)) {
    const combinedKeys = /* @__PURE__ */ new Set([...Object.keys(prev), ...Object.keys(next)]);
    const compareResults = [];
    for (const key of combinedKeys.values()) {
      const p = prev[key];
      const n = next[key];
      compareResults.push(...compareTwoObjects([...path, key], p, n));
    }
    return compareResults;
  }
  return [{ path, prev, next }];
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function composeUpdateExpressions(prev, next) {
  const changes = compareTwoObjects([], prev, next);
  const makeNameKey = uniqueAttributeKeyCreator("a");
  const makeValueKey = uniqueAttributeKeyCreator("va");
  const composeExpressionEntry = expressionEntryComposer({
    makeNameKey,
    makeValueKey
  });
  const expressions = changes.map(composeExpressionEntry);
  const concatedExpression = concatExpression(expressions);
  return {
    UpdateExpression: concatedExpression.updateExpression,
    ExpressionAttributeNames: concatedExpression.attributeNames,
    ExpressionAttributeValues: concatedExpression.attributeValues
  };
}
export {
  composeUpdateExpressions
};
