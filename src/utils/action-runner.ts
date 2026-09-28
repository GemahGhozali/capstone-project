import { ActionResponse } from "@/types";

export async function runAction<TData>(actionFn: () => Promise<ActionResponse<TData>>): Promise<ActionResponse<TData>> {
  const response = await actionFn();
  if (!response.success) throw response;
  return response;
}
