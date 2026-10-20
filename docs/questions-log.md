# VELOOP Giveaway System — Questions & Decision Log

**Author:** Jivan  
**Start Date:** Tuesday, 20 Oct 2026 (WD1)  
**Working Hours:** Mon–Fri, 9:30 AM – 6:15 PM IST  
**Official Schedule:** 18 Working Days (Tue 20 Oct – Thu 12 Nov 2026) / 24 Calendar Days  

---

## Log Protocol

Each entry documents:
1. **Context & What was understood**
2. **What was tried / architectural default chosen**
3. **What is still unclear / pending mentor confirmation**

---

## [WD1 · Tue 20 Oct 2026] — Initial Architecture Decisions & Day 1 Clarifications

### Architectural Defaults Locked for Build (Day 1 Decisions)

1. **Giveaway Document Hierarchy (One Giveaway per Prize Pool)**
   - *Understood:* The frontend displays 4 to 6 prizes with distinct end dates (12d, 9d, 7d, 5d), separate currencies (VE, SVE, Tokens), and entry fees. The backend requires a compound unique index `unique(userId, giveawayId)`.
   - *Default Selected:* Every prize pool is stored as an independent `Giveaway` document (unique `slug`, `prizeId`, `entry.currency`, `entry.amount`, `startAt`, `endAt`, `winnerCount`, `status`, `winnersStatus`). An optional `campaign` field (e.g. `"Summer Rewards"`) groups them on the home page. This ensures `unique(userId, giveawayId)` allows a user to participate in multiple different prize draws without conflict.
   - *Alternative:* If VELOOP mandates 1 Giveaway with multiple Prize Pools, the schema index must become `unique(userId, giveawayId, prizeId)`.

2. **Auth & Authoritative Wallet Abstraction**
   - *Understood:* The brief mandates existing VELOOP auth and an authoritative wallet, but no external repository, schema, or API credentials were provided.
   - *Default Selected:* Built lightweight stubs for `User`, `Wallet` (`ves`, `sves`, `tokens` stored strictly as integers), and JWT authentication isolated behind `authMiddleware` and `balanceService`. When the real VELOOP services become available, only these two integration points need updating.

3. **Client vs. Server Authority & Masked IDs**
   - *Understood:* The frontend specification suggested comparing `currentUserId === winner.userId`, but security forbids trusting the client, and public winner endpoints must protect privacy.
   - *Default Selected:* Public winner endpoints exclusively return masked identifiers (`VE****25`). A private authenticated endpoint (`GET /api/giveaways/:id/my-status`) computes `isWinner`, `canJoin`, and `claimState` on the server. The UI never compares raw user IDs.

4. **Countdown Timer Zero Behavior**
   - *Understood:* Client device clocks can be skewed, manipulated, or out of sync.
   - *Default Selected:* The countdown component is display-only with a calculated `serverTime` offset. When reaching zero, it displays *"Verifying..."* and polls the backend. The giveaway state flips only when the server returns `ENDED`.

5. **Winner Reveal State Management**
   - *Understood:* An `ENDED` giveaway does not automatically imply winners have been selected.
   - *Default Selected:* Introduced `winnersStatus: "PENDING" | "FINALIZED"`. The reveal animation executes only when transitioning from `PENDING` to `FINALIZED`.

6. **Single vs Multiple Entries**
   - *Understood:* Section 99 vs the "Your Entries: 24" counter in section 56 created conflicting signals.
   - *Default Selected:* Strictly 1 paid entry per user per giveaway (entries count is 0 or 1 in live mode). Task-based bonus entries are marked mock-only (P2).

7. **Tech Stack Enforcement**
   - *Rule:* The grading rubric strictly mandates **Bootstrap + CSS Modules**. Tailwind CSS is an automatic rubric failure. We are using `react-bootstrap` for accessible dialogs/tabs/modals with deep custom CSS-variable overrides for the dark luxury theme.

---

### Questions Submitted to Mentor (Day 1 Review)

| # | Question | Current Default / Fallback |
|---|---|---|
| **Q1** | Is each prize pool its own `Giveaway` document (recommended for distinct end dates/currencies/fees), or is the entire campaign 1 giveaway with multiple prize pools? | Default: 1 Giveaway document per prize pool grouped by `campaign`. |
| **Q2** | Is there an existing API contract, repository, or schema for VELOOP auth and wallet? If not, is our abstracted stub (behind `authMiddleware` and `balanceService`) approved? | Default: Abstracted stub with JWT and integer wallet balances. |
| **Q3** | What are SVEs, and can VEs or Tokens be purchased or cashed out to fiat? | Default: In-app reward currencies, non-purchasable placeholders. |
| **Q4** | Is one paid entry per user per giveaway the final rule? What is the official refund policy if a giveaway is cancelled? | Default: 1 entry per user per giveaway. Refund text marked `[PLACEHOLDER]`. |
| **Q5** | When the same device hash is detected on two accounts in the same giveaway, should it be blocked immediately or flagged for review? | Default: Assigned +40 risk score, which flags/blocks per fraud threshold. |
| **Q6** | Are task-based bonus entries part of the required MVP or demo only? | Default: Mock/demo only (P2 cut). |
| **Q7** | Has a paid-entry random draw been vetted from a legal/compliance perspective under Indian gaming/lottery laws? | Default: Neutral, non-gambling copy used; "100% Fair" & "Guaranteed" removed; T&C marked placeholder. |
| **Q8** | Does the 20–24 day timeline mean calendar days (ending Thu 12 Nov) or working days (ending Mon 16 – Fri 20 Nov), and is today (Tue 20 Oct) the official Day 1? | Default: Planned for 18 working days (deadline Thu 12 Nov, 5:30 PM IST). |
| **Q9** | Is an admin dashboard UI in scope, or are admin REST endpoints sufficient? | Default: REST endpoints with admin role check; no separate admin UI. |
| **Q10** | Are there any hosting constraints for the backend API and database? | Default: Frontend on Vercel, Backend on Render/Railway, Database on MongoDB Atlas. |
| **Q11** | The official notice mentions stipend performance criteria in its intro but does not state them. What are the specific performance evaluation criteria? | Awaiting mentor clarification. |
| **Q12** | Where can we access the 9 raw image assets (13.8 MB transparent PNGs) referenced in the brief for optimization to WebP? | Temporarily generating/using placeholders until the source bundle is linked. |
