import * as z from "zod";
import { ErrorFields } from "@/types";

export function formatZodError(error: z.ZodError): ErrorFields {
  const { fieldErrors } = z.flattenError(error);
  const errors = Object.entries<string[]>(fieldErrors).map(([field, messages]) => [field, messages[0]]);
  return Object.fromEntries(errors);
}
