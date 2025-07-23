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
 * Enhanced club assignment: always add to SRC, match by faculty/department/state/religion/LGA, general clubs are opt-in.
 * Returns an array of club ObjectIds.
 */
export async function assignAndCreateClubsForUser({
  facultyAbbr, facultyFull, departmentAbbr, departmentFull, state, religion, lga
}: {
  facultyAbbr?: string,
  facultyFull?: string,
  departmentAbbr?: string,
  departmentFull?: string,
  state?: string,
  religion?: string,
  lga?: string
}) {
  const clubsToEnsure: Array<Partial<{ type: string, faculty?: string, department?: string, name?: string, abbreviation?: string }>> = [];
  // Always ensure SRC club exists
  let srcClub = await Club.findOne({ type: "src" });
  if (!srcClub) {
    srcClub = await Club.create({
      type: "src",
      name: "Student Representative Council",
      abbreviation: "SRC",
      status: "active"
    });
  }
  // Ensure faculty/department clubs exist
  if (facultyAbbr && facultyFull) {
    clubsToEnsure.push({ type: "faculty", faculty: facultyAbbr, name: facultyFull, abbreviation: facultyAbbr });
  }
  if (facultyAbbr && departmentAbbr && departmentFull) {
    clubsToEnsure.push({ type: "department", faculty: facultyAbbr, department: departmentAbbr, name: departmentFull, abbreviation: departmentAbbr });
  }
  for (const club of clubsToEnsure) {
    const exists = await Club.findOne({
      type: club.type,
      faculty: club.faculty,
      ...(club.department ? { department: club.department } : {})
    });
    if (!exists) {
      await Club.create({
        type: club.type,
        faculty: club.faculty,
        department: club.department,
        name: club.name,
        abbreviation: club.abbreviation,
        status: "active"
      });
    }
  }
  // Now match all relevant clubs (excluding 'general' and 'src')
  const matchQuery = {
    $or: [
      facultyAbbr ? { type: "faculty", faculty: { $in: [facultyAbbr, facultyFull] } } : null,
      facultyAbbr && departmentAbbr ? { type: "department", faculty: { $in: [facultyAbbr, facultyFull] }, department: { $in: [departmentAbbr, departmentFull] } } : null,
      state ? { type: "state", state } : null,
      religion ? { type: "religion", religion } : null,
      lga ? { type: "lga", localGovt: lga } : null,
    ].filter(Boolean)
  };
  const matchingClubs: import("./models/Club").IClub[] = await Club.find(matchQuery);
  // Always add SRC club
  const clubIds = [srcClub._id, ...matchingClubs.map((club) => club._id)];
  return clubIds;
}

