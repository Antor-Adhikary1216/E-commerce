import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT ?? 587,
        secure: (env.SMTP_PORT ?? 587) === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!transporter) {
    console.log(`[dev] Email to ${to} — ${subject}\n${html}`);
    return;
  }
  try {
    await transporter.sendMail({ from: env.SMTP_FROM ?? env.SMTP_USER, to, subject, html });
  } catch (err) {
    console.error(`[email] Failed to send to ${to}:`, err);
    throw err;
  }
}
