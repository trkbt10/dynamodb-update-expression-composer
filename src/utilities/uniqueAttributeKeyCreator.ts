export function uniqueAttributeKeyCreator(prefix: string = "a") {
  const attributeKeyMap = new Map<string, string>();
  let counter = 0;
  const generateKey = (seed: string) => {
    const attrKey = attributeKeyMap.get(seed);
    if (attrKey) {
      return attrKey;
    }
    const generatedKey = `${prefix}${counter++}`;
    attributeKeyMap.set(seed, generatedKey);
    return generatedKey;
  };
  return (path: string): string => {
    return generateKey(path);
  };
}
