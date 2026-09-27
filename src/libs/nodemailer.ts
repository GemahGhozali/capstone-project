import "server-only";

import { getEnv } from "@/utils/env";
import nodemailer from "nodemailer";

const host = getEnv("EMAIL_SERVER_HOST");
const port = Number(getEnv("EMAIL_SERVER_PORT"));
const user = getEnv("EMAIL_SERVER_USER");
const pass = getEnv("EMAIL_SERVER_PASSWORD");
const from = getEnv("EMAIL_FROM");

const transporter = nodemailer.createTransport({ host, port, secure: true, auth: { user, pass } });

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendMailParams): Promise<boolean> {
  try {
    await transporter.sendMail({ from, to, subject, html });
    return true;
  } catch {
    return false;
  }
}
