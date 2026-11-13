# Astral Grimoire — Firestore Security Specification

## 1. Data Invariants

1. **Owner & Verified Identity Lock**: Every document under `/users/{userId}` and its subcollections (`/transactions`, `/readings`, `/playlists`) is strictly private to `request.auth.uid == userId` with `request.auth.token.email_verified == true`.
2. **Initial Star Dust Integrity**: Creating `/users/{userId}` allows a maximum initial `starDustBalance` of `500`, `checkInStreak == 0`, `totalCheckIns == 0`, `lastCheckInDate == ""`, and `createdAt == updatedAt == request.time`, paired atomically (`existsAfter`) with a welcome `transactions` record or valid starting state.
3. **Action-Partitioned Profile Updates**: Updating `/users/{userId}` is strictly partitioned into three mutually exclusive actions:
   - **Profile Edit**: Only `displayName`, `mysticTitle`, `avatarUrl`, `language`, and `updatedAt` may change; `starDustBalance`, `checkInStreak`, `lastCheckInDate`, `totalCheckIns`, `uid`, `email`, and `createdAt` remain untouched.
   - **Daily Check-In**: `lastCheckInDate` must change to a valid non-empty date string, `totalCheckIns == existing().totalCheckIns + 1`, `checkInStreak == existing().checkInStreak + 1` (or reset to `1`), and `starDustBalance` increases by exact `500` (days 1–6) or `1500` (when `newStreak % 7 == 0`), enforced against `lastCheckInAt` cooldown (`>= 12h` or new date) and atomic transaction logging (`getAfter` / `existsAfter`).
   - **Tarot Reading Spend**: `starDustBalance` decreases by exact reading cost (`100`, `300`, or `500`), remaining `>= 0`, and `updatedAt == request.time`.
4. **Immutable Ledger**: `/users/{userId}/transactions/{transactionId}` records are append-only (`allow update, delete: if false`) and must match the authenticated user's UID and server `request.time`.
5. **Bounded Arrays & Strings (Denial-of-Wallet Guard)**: Every string has explicit `.size()` bounds, `avatarUrl <= 120000` bytes, `cards` list size is strictly `1 <= cards.size() <= 5` matching the reading tier (`1`, `3`, or `5`), and document IDs match `^[a-zA-Z0-9_\\-]+$` up to 128 chars.

## 2. "Dirty Dozen" Adversarial Payloads (Must All Return `PERMISSION_DENIED`)

1. **Cross-User Profile Read**: User B (`uid: "user_b"`) executes `get(/users/user_a)` -> DENIED.
2. **Unverified Email Write**: Newly registered Email/Password user with `email_verified: false` attempts `set(/users/user_a)` -> DENIED.
3. **Inflated Initial Star Dust**: User A creates `/users/user_a` with `starDustBalance: 999999` -> DENIED.
4. **Profile Edit Balance Tampering**: User A updates `displayName` while sneaking `starDustBalance: 50000` into `affectedKeys()` -> DENIED.
5. **Ghost Field Shadow Update**: User A updates profile with extra field `isAdmin: true` -> DENIED.
6. **Same-Day Double Check-In**: User A calls check-in twice with the same `lastCheckInDate` -> DENIED.
7. **Arbitrary Check-In Reward**: User A submits check-in increasing `starDustBalance` by `+5000` instead of `+500` or `+1500` -> DENIED.
8. **Negative Balance Reading**: User A submits a reading spend resulting in `starDustBalance: -200` -> DENIED.
9. **Transaction Ledger Tampering**: User A attempts `update` or `delete` on `/users/user_a/transactions/tx_1` -> DENIED.
10. **Forged Transaction Ownership**: User A creates `/users/user_a/transactions/tx_2` with `userId: "user_b"` -> DENIED.
11. **Oversized Document / ID Poisoning**: User A creates `/users/user_a/readings/bad$id_with_invalid_chars` or injects a `question` of 2,000 characters or `cards` array of 10 cards -> DENIED.
12. **Client Timestamp Forgery**: User A creates a reading with `createdAt` set to a backdated timestamp instead of `request.time` -> DENIED.
