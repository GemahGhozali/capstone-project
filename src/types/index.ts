export type ErrorFields = Record<string, string>;

export type ActionResponse<TData = void> = {
  success: boolean;
  message: string;
  data?: TData;
  errors?: ErrorFields;
};
