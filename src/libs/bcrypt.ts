import "server-only";

import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPasswordsInBatches(passwords: string[], batchSize = 10): Promise<string[]> {
  const hashedPasswords: string[] = [];

  for (let index = 0; index < passwords.length; index += batchSize) {
    const batch = passwords.slice(index, index + batchSize);
    const hashedBatch = await Promise.all(batch.map((password) => hashPassword(password)));
    hashedPasswords.push(...hashedBatch);
  }

  return hashedPasswords;
}
