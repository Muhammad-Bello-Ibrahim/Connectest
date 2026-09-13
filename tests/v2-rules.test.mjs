import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../lib/v2-rules.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(output, { exports });
const { canIssueDuesReceipt, canPublishListing } = exports;

test("only the correct club officer may issue a receipt to an eligible member for the current period", () => {
  const club = { status: "active", isPayable: true, membershipFeeAmount: 2500, duesPeriod: "2026 semester 1", email: "club@example.test" };
  const officer = { role: "club", email: "club@example.test" };
  const member = { role: "student", clubs: ["club-1"] };
  assert.equal(canIssueDuesReceipt(club, officer, member, "club-1", "2026 semester 1"), true);
  assert.equal(canIssueDuesReceipt(club, { ...officer, email: "other@example.test" }, member, "club-1", "2026 semester 1"), false);
  assert.equal(canIssueDuesReceipt(club, officer, { ...member, clubs: [] }, "club-1", "2026 semester 1"), false);
  assert.equal(canIssueDuesReceipt(club, officer, member, "club-1", "2025 semester 2"), false);
  assert.equal(canIssueDuesReceipt({ ...club, isPayable: false }, officer, member, "club-1", "2026 semester 1"), false);
});

test("listing access belongs only to the approved vendor owner", () => {
  assert.equal(canPublishListing({ status: "approved", owner: "student-1" }, "student-1"), true);
  assert.equal(canPublishListing({ status: "pending", owner: "student-1" }, "student-1"), false);
  assert.equal(canPublishListing({ status: "approved", owner: "student-2" }, "student-1"), false);
});
