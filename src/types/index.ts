export type ErrorFields = Record<string, string>;

export type ActionResponse<TData = void> = {
  success: boolean;
  message: string;
  data?: TData;
  errors?: ErrorFields;
};

export type Role = "Mahasiswa" | "Dosen Capstone Project" | "Dosen Pembimbing" | "Kaprodi";
