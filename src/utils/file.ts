import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

export async function uploadFile({ file, uploadPath }: { file: File | string; uploadPath: string }): Promise<string> {
  if (typeof file === "string") return file;

  try {
    return await processUpload({ file, uploadPath });
  } catch {
    throw new Error("Gagal memproses upload file!");
  }
}

export async function uploadFileOptional({ file, uploadPath }: { file: File | string | null; uploadPath: string }): Promise<string | null> {
  if (typeof file === "string") return file;

  if (!file || file.size === 0) return null;

  try {
    return await processUpload({ file, uploadPath });
  } catch {
    throw new Error("Gagal memproses upload file!");
  }
}

export async function deleteFile(filePath: string) {
  try {
    const oldFilePath = path.join(process.cwd(), "public", filePath);
    await fs.unlink(oldFilePath);
  } catch {
    throw new Error("Gagal menghapus file!");
  }
}

async function processUpload({ file, uploadPath }: { file: File; uploadPath: string }): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", uploadPath);
  await fs.mkdir(uploadDir, { recursive: true });

  const fileName = generateUniqueFileName(file);
  const filePath = path.join(uploadDir, fileName);

  try {
    await writeFile({ file, filePath });
    return path.posix.join("/", uploadPath, fileName);
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});
    throw error;
  }
}

function generateUniqueFileName(file: File) {
  const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
  const fileExtension = path.extname(file.name);
  return `${uniqueSuffix}${fileExtension}`;
}

async function writeFile({ file, filePath }: { file: File; filePath: string }) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);
}
