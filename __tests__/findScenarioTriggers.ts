import { TalkFlowWeb } from "@talkflow-web/types";
import { Container } from "../interfaces";

export async function findScenarioTriggers(
  { datastores: { routings } }: Container,
  params: {
    id: string;
    filter: {
      type: string;
    };
  }
) {
  await routings
    .table("triggers")
    .where({
      allOf: [["trigger", "==", params.filter.type]],
    })
    .list({});
}
