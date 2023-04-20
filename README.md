# AWS DynamoDB Update Expression Composer

二つのオブジェクトを比較し、DynamoDB の更新式に変換するライブラリです
DynamoDB の差分更新を容易に適用することができます

```typescript
import { composeUpdateExpressions } from "dynamodb-update-expression-composer";
const expressions1 = await composeUpdateExpressions(
  { array: [] },
  { array: [1] }
);
expect(expressions1.UpdateExpression).toBe("set #a0[0] = :va0");
const expressions2 = await composeUpdateExpressions(
  {
    hoge: ["WxrgLJ32SpSTJynRREmosQ"],
  },
  {
    hoge: ["e3oTy2YjRKSJMxyRuiczRQ", "WxrgLJ32SpSTJynRREmosQ"],
  }
);
expect(expressions2.UpdateExpression).toBe("set #a0[0] = :va0,#a0[1] = :va1");
```

```typescript
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import * as ExpressionComposer from "dynamodb-update-expression-composer";
const before = {
  pk: "primary",
  value: 0,
};
const after = {
  pk: "primary",
  value: 1,
};
const updateExpression = ExpressionComposer.composeUpdateExpressions(
  before,
  after
);

const command = new TransactWriteCommand({
  TransactItems: [
    {
      Update: {
        TableName: "tableName",
        Key: {
          pk: "primary",
        },
        UpdateExpression: updateExpression.UpdateExpression,
        ExpressionAttributeNames: {
          ...updateExpression.ExpressionAttributeNames,
        },
        ExpressionAttributeValues: {
          ...updateExpression.ExpressionAttributeValues,
        },
      },
    },
  ],
});
ddbDoc.send(command);
```
