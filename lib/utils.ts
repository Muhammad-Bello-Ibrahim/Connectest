import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import nodemailer from "nodemailer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Email utility for password reset and notifications
export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

