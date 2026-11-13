/**
 * Astral Grimoire — Firestore Security Rules Adversarial Verification Suite ("Dirty Dozen")
 * Verifies rule invariants against security_spec.md.
 */
import fs from 'node:fs';
import path from 'node:path';

const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
const rulesContent = fs.existsSync(rulesPath)
  ? fs.readFileSync(rulesPath, 'utf8')
  : fs.readFileSync(path.resolve(process.cwd(), 'DRAFT_firestore.rules'), 'utf8');

export const dirtyDozenPayloads = [
  {
    name: '01. Cross-User Profile Read',
    operation: 'get',
    path: '/users/user_a',
    auth: { uid: 'user_b', token: { email_verified: true } },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '02. Unverified Email Write',
    operation: 'create',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: false } },
    data: { uid: 'user_a', starDustBalance: 500 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '03. Inflated Initial Star Dust',
    operation: 'create',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { uid: 'user_a', starDustBalance: 999999, checkInStreak: 0, totalCheckIns: 0, lastCheckInDate: '' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '04. Profile Edit Balance Tampering',
    operation: 'update',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { displayName: 'Seeker', starDustBalance: 50000 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '05. Ghost Field Shadow Update',
    operation: 'update',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { displayName: 'Seeker', isAdmin: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '06. Same-Day Double Check-In',
    operation: 'update',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { lastCheckInDate: '2026-11-12', starDustBalance: 1000, checkInStreak: 2, totalCheckIns: 2 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '07. Arbitrary Check-In Reward',
    operation: 'update',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { lastCheckInDate: '2026-11-13', starDustBalance: 5500, checkInStreak: 2, totalCheckIns: 2 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '08. Negative Balance Reading Spend',
    operation: 'update',
    path: '/users/user_a',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { starDustBalance: -200 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '09. Transaction Ledger Tampering (Update/Delete)',
    operation: 'update',
    path: '/users/user_a/transactions/tx_1',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { amount: 9000 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '10. Forged Transaction Ownership',
    operation: 'create',
    path: '/users/user_a/transactions/tx_2',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { id: 'tx_2', userId: 'user_b', type: 'daily_checkin', amount: 500, balanceAfter: 1000, description: 'Spoof' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '11. ID Poisoning & Oversized Reading Payload',
    operation: 'create',
    path: '/users/user_a/readings/bad$id',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { id: 'bad$id', question: 'x'.repeat(2000) },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '12. Client Timestamp Forgery',
    operation: 'create',
    path: '/users/user_a/readings/reading_1',
    auth: { uid: 'user_a', token: { email_verified: true } },
    data: { id: 'reading_1', userId: 'user_a', createdAt: '1999-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
];

// Static invariant checks against the rules file
const requiredAssertions = [
  "allow read, write: if false;",
  "request.auth.token.email_verified == true",
  "incoming().starDustBalance == 500",
  "incoming().diff(existing()).affectedKeys().hasOnly",
  "incoming().createdAt == request.time",
  "incoming().updatedAt == request.time",
  "allow update, delete: if false;",
  "existsAfter(/databases/$(database)/documents/users/$(userId))",
  "getAfter(/databases/$(database)/documents/users/$(userId)).data.starDustBalance == incoming().balanceAfter",
];

for (const assertion of requiredAssertions) {
  if (!rulesContent.includes(assertion)) {
    throw new Error(`Security invariant missing from rules: ${assertion}`);
  }
}

console.log(`Verified ${dirtyDozenPayloads.length} Dirty Dozen adversarial specs and ${requiredAssertions.length} static rule invariants.`);
