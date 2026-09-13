# Connectrix v2 integration

This branch extends the existing Next.js/MongoDB application. It keeps the existing `User`, `Club`, and `Post` collections and routes. No existing records are rewritten or seeded, and it makes no connection to the production database during build or tests.

## Student paths

- The dashboard has General (all public posts) and For You (own posts, joined clubs, and profile-topic tags) feeds. The existing post creation, comments, and likes remain connected to their existing APIs.
- Search is available beside the profile control. The student navigation links to Feed, Clubs/Organizations, Campus Map, Resources, Add Post, and Marketplace on mobile and desktop.
- Marketplace lists only active entries from approved vendors. Students can send inquiries; an inquiry is not an order or payment.
- Map places and resources are published from the admin content page. Empty collections show an honest empty state rather than fictional campus locations.
- Students see in-person dues receipts after an authorized club account records the payment.

## Vendor review

The vendor application collects business information and goes to `pending`. An admin must independently review identity and premises/products, record case references, and approve listing access. **Do not put NIN, BVN, account numbers, identity scans, or videos in these forms or database fields.** The new collections contain only case references and review outcomes. Payout account linking, automated KYC, checkout, and money movement require a verified provider integration and are deliberately unavailable.

## Dues and receipts

Existing `Club.isPayable` and `membershipFeeAmount` determine whether a club collects dues; existing `User.clubs` determines membership eligibility. `Club.duesPeriod` is additive and defaults to `Current semester` for old documents. A club officer can update that period and attest to receiving the exact configured amount in person. The server checks the officer's club email, active payable club, membership, and current period, then issues a uniquely numbered receipt. A unique index blocks duplicate student/club/period receipts. Both student and club screens read the same `DuesReceipt` record. The old `/pay-dues` endpoint now returns an explicit 503 instead of suggesting a mock initiation is a completed payment.

## Release checklist

1. Review the branch and run `npm ci`, `npm run test:v2`, `npx tsc --noEmit`, and `npm run build` with normal environment variables.
2. Check roles and forms against a staging MongoDB copy with test users; tests in this branch do not touch live data.
3. Add verified payment, payout, and KYC providers before enabling online transactions. Do not mark payments paid on initiation or trust client-side verification claims.
4. Approve a production deployment separately. This branch does not alter the existing Connectrix deployment.
