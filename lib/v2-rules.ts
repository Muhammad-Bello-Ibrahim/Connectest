export type DuesClub = { status?: string; isPayable?: boolean; membershipFeeAmount?: number | null; duesPeriod?: string; email?: string };
export type DuesActor = { role: string; email?: string };
export type DuesMember = { role: string; clubs?: Array<{ toString(): string }> };

export function canIssueDuesReceipt(club: DuesClub | null, officer: DuesActor, member: DuesMember | null, clubId: string, period: string) {
  if (!club || club.status !== "active" || !club.isPayable || !club.membershipFeeAmount || club.membershipFeeAmount <= 0) return false;
  if (officer.role !== "admin" && (officer.role !== "club" || club.email?.toLowerCase() !== officer.email?.toLowerCase())) return false;
  if (member?.role !== "student" || !member.clubs?.some(id => id.toString() === clubId)) return false;
  return period === (club.duesPeriod || "Current semester");
}

export function canPublishListing(vendor: { status: string; owner: { toString(): string } } | null, userId: string) {
  return Boolean(vendor && vendor.status === "approved" && vendor.owner.toString() === userId);
}
