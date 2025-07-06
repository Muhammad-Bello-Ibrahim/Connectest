import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Removed nodemailer and sendMail from this file. Use sendMail from lib/server-mail.ts in server-only code.

