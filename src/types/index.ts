export type ErrorFields = Record<string, string>;

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: ErrorFields;
};
