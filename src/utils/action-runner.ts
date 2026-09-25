import { ActionResponse } from "@/types";

export async function runAction(actionFn: () => Promise<ActionResponse>): Promise<ActionResponse> {
  const response = await actionFn();
  if (!response.success) throw response;
  return response;
}
