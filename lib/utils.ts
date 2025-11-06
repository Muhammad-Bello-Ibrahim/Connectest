import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


import Club from "./models/Club";

/**
 * Assign clubs to a user based on their profile fields. Auto-create faculty/department clubs if missing.
 * Returns an array of club ObjectIds.
 */

/**
 * Club assignment function - now returns an empty array to prevent automatic club creation
 * This function is kept for backward compatibility but no longer creates or assigns clubs
 */
export async function assignAndCreateClubsForUser() {
  // Return empty array to prevent any club assignments
  return [];
}

