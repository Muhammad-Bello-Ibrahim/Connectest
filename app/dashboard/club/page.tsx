"use client"

import { useAuth } from "@/components/auth-provider"
import Newsfeed from "@/components/newsfeed"

// TODO: Replace with actual club context or fetch club info dynamically
const CLUB_ID = "mock-club-id";
const CLUB_NAME = "Your Club Name";
const CLUB_ABBR = "CLUB";

export default function ClubDashboardPage() {
  // You may want to fetch club info based on route params or context
  return (
    <Newsfeed
      clubId={CLUB_ID}
      clubName={CLUB_NAME}
      clubAbbreviation={CLUB_ABBR}
      title={CLUB_NAME + " Newsfeed"}
      description="Share updates and engage with your club community"
    />
  );
}

