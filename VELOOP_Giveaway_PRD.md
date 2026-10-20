# VELOOP Giveaway System — PRD and 24-Day Plan

Prepared for Jivan · 20 Oct 2026 · Draft v2 · Mon–Fri only, 9:30 AM–6:15 PM IST · Day 1 = Tue 20 Oct 2026 · Deadline 5:30 PM IST: Thu 12 Nov if 20–24 means calendar days, Mon 16 to Fri 20 Nov if working days

## 1. Verdict on the brief

The brief is a good frontend spec and a good security spec stapled together without reconciling them. Followed literally, it gives you a data model that cannot work, a frontend you must partly rewrite when the backend lands, and a scope that does not fit the calendar unless you work real days.

**Scope reality.** About 103 frontend requirements, about 74 backend requirements, two deployments, 11 screenshot states, a README and API docs. Realistic effort: 110–140 focused hours. Reading 20–24 days as calendar days gives 18 working days (Tue 20 Oct to Thu 12 Nov, Mon–Fri only), so this plan assumes about 6.5 focused h/day (about 117 h) inside the 9:30 AM–6:15 PM window. That fits only if feedback rounds stay short and P1 and P2 are cut first. If the days are working days, the deadline is Mon 16 to Fri 20 Nov and there is comfortable slack. Ask which reading is correct at the Day 1 review.

**What is genuinely good in the brief:** backend-as-authority, unique index plus transaction plus idempotency, append-only transactions, masked winner IDs, no fake data after integration. Treat those as the grading core. Visual polish is second.

## 2. Conflicts and gaps to resolve on Day 1

**1. One giveaway or six?** Frontend sections 12–13 show one giveaway with four prizes. Sections 79–85 give every prize its own page, currency and fee. Ref_02 shows different end times per prize (12d, 9d, 7d, 5d). Backend section 7–8 demands unique(userId, giveawayId). If all prizes live inside one Giveaway, a user who joins the iPhone draw can never join the Watch draw.
*Default:* every prize pool is its own Giveaway document (own slug, currency, fee, endAt, winnerCount, status). An optional `campaign` field (for example Summer Rewards) groups them on the home page. The mandatory unique(userId, giveawayId) index then works exactly as written. *Alternative if the mentor says the whole campaign shares one start/end:* one Giveaway with prize pools and unique(userId, giveawayId, prizeId).

**2. Auth and wallet are not in the material.** The brief says use the existing VELOOP auth and authoritative wallet, but gives no repo, schema or API.
*Default:* build User, Wallet {ves, sves, tokens as integers} and JWT auth inside this repo behind `authMiddleware` and `balanceService`, so swapping in the real system touches two files. Ask for the real contract on Day 1 and do not wait for the answer.

**3. Client-side winner matching vs server authority.** Frontend section 34 compares currentUserId to winner.userId in the browser. Backend section 34 says the frontend cannot be trusted, and section 25 says public winners must be masked. Both cannot hold.
*Default:* public endpoints return masked IDs only. `my-status` returns isWinner, prize and claim state computed on the server. The mock adapter returns the same shape. The UI never compares IDs.

**4. Countdown reaching zero.** Frontend section 10 flips to ended at zero. Backend section 5 forbids the frontend deciding.
*Default:* the countdown is display only. At zero it shows Verifying and refetches. State changes only when the server says ENDED. The countdown uses a serverTime offset from the API so a wrong device clock cannot lie. In mock mode the adapter plays the server.

**5. Winner reveal has no backend state.** ENDED does not mean winners exist.
*Default:* add `winnersStatus: PENDING | FINALIZED`. The reveal animation plays only when the UI observes PENDING to FINALIZED. It never invents a result.

**6. Winner slider vs no fake activity.** Sections 18 and 62 say A user just won. Sections 21 and 63 say do not fake real-time activity or show winners for a live giveaway.
*Default:* the slider reads finalized past winners and says VE****82 won an iPhone 15 Pro · August Reward Rush. Never use just now. Mock data carries `isDemo` and a dev-only badge.

**7. The reference images break the brief's own rules.** Ref_02 says 100% Fair & Transparent and Trusted by 10K+ Users, which section 43 and 53 forbid. Ref_01 copy (giveaway codes, unlock VEs instantly) describes code redemption, not a paid-entry draw. Write your own copy. Say Clear rules, not 100% fair. Label stats as demo until real.

**8. Undefined business rules.** What SVEs are, refund policy, whether more than one entry is allowed (section 99 vs the Your Entries: 24 counter in section 56), and whether task-based entries exist at all.
*Default:* one paid entry per user per giveaway. Live mode shows entries as 0 or 1. Task-based entries are mock-only and P2. Refund and T&C text is marked [PLACEHOLDER — pending VELOOP policy], as the brief requires.

**9. Edge cases the brief never mentions.** Fewer participants than winnerCount; zero participants; a winner later flagged as fraud; a winner who never claims; two finalize calls at once.
*Default:* draw min(n, winnerCount); zero participants finalizes with an empty set; a fraudulent winner is replaced by an admin redraw of that slot, audit-logged; an unclaimed prize becomes EXPIRED with no auto-redraw; finalize is guarded by an atomic winnersStatus flip plus unique(giveawayId, userId) on winners.

**10. Legal and policy flag (not yours to decide, but put it in writing).** Charging virtual currency for a random chance at real prizes, while the brief says it must not feel like gambling, is exactly where lottery and gaming rules can apply in India, and the risk rises if VEs can be bought or cashed out. I am not a lawyer. Ask the mentor who signed this off. Keep eligibility, T&C and refund as placeholders and avoid words like guaranteed or fair.

**11. Stack trap.** The brief requires Bootstrap plus CSS Modules. Tailwind is an automatic rubric miss, so do not reach for it out of habit. Use `react-bootstrap` for Modal, Accordion, Tabs and Toast (free focus trapping and ARIA) and override with CSS variables. Un-themed Bootstrap looks generic, so never ship a default-styled component.

**12. Infrastructure.** MongoDB transactions need a replica set; a local standalone mongod will throw. Use an Atlas free cluster for dev and mongodb-memory-server as a replica set for tests. Vercel serverless is a poor home for this Express API and its cron. Frontend on Vercel, API on Render or Railway. Use a strict CLIENT_URL CORS allowlist and Authorization-header access tokens (skip cookie refresh unless VELOOP already uses it) to avoid SameSite problems.

## 3. Goals and success criteria

**Goal.** A giveaway system that feels like a real, trustworthy reward platform: premium, restrained, not casino-like, with the backend as the single source of truth.

**A new visitor must answer in 5 seconds:** what is this, what can I win, how do I join, is it trustworthy, are people really winning, did I win, what happens next.

**Hard success criteria**
- Every item in brief section 75 (final checklist) passes.
- 20 parallel join requests from one user produce exactly 1 participation and 1 deduction.
- Modified amount, currency, userId or prizeId in a request changes nothing.
- A live giveaway never shows winners; an ended one shows 1 iPhone, 3 Watch, 5 AirPods, 10 Amazon winners (configurable).
- A non-winner cannot reach the claim form by UI or by API.
- No console errors; production build passes; both apps deployed.

## 4. Scope

**P0 — must ship**
- Home page: banner, hero, stats, countdown, status handling, prize cards, how-to-participate, winner slider, Winners and Previous Winners tabs, rules, FAQ, trust section, footer.
- Detail page per giveaway: hero, prize info, fee and balance panel, how it works, T&C, important information, confirm modal, success, already joined, login required.
- Claim flow: physical form, gift-card email form, five claim states.
- Custom loader, skeletons, empty and error states, responsive 320–1920, accessibility basics.
- Backend: all models, auth, read APIs, join pipeline (transaction, idempotency, unique index), lifecycle, winner selection, claims, rate limiting, security middleware, audit log, fraud scoring, error codes.
- Tests for the race, duplicate, balance, status and tamper scenarios.
- README, API.md, screenshots, GitHub, two deployments.

**P1 — if on schedule:** winner reveal animation polish, Notify Me persistence, my-wins home banner, prize detail drawer, Vitest unit tests for countdown and state derivation, Postman collection.

**P2 — cut first:** Three.js or heavy parallax, prize comparison, winner spotlight, task-based entry progress, your-chance indicator, field-level PII encryption.

**Out of scope:** admin UI (endpoints only), real payments or email sending, real VELOOP wallet integration, push notifications.

**If the mentor expects the 20-day mark (Fri 6 Nov, WD14):** drop all P1 and P2, cut fraud scoring to device hash plus tamper signals, and merge QA into the integration day. Only feasible at about 8 h/day.

## 5. States and CTA matrix

**Giveaway states (from the server):** UPCOMING, ACTIVE, ENDED with winnersStatus PENDING, ENDED with FINALIZED, ARCHIVED.
**User states:** visitor, logged in not joined, participant, winner, non-winner.

| Situation | Primary CTA |
|---|---|
| Visitor, ACTIVE | Login to Participate, then redirect to /login |
| Logged in, not joined, enough balance | Join for {fee} {currency}, opens confirm modal |
| Logged in, balance short | Earn More {currency} (shows how many more are needed) |
| Joined | You're Participating ✓ with View Giveaway Status |
| UPCOMING | Notify Me |
| ENDED, winners pending | Selecting winners… (disabled) |
| ENDED, finalized, user won | Claim Your Prize |
| ENDED, finalized, user did not win | View Winners, Explore Next Giveaway |

Claim states: NOT_SUBMITTED (Claim Prize), SUBMITTED, PROCESSING, COMPLETED, EXPIRED (7-day window, configurable).

**Entry fees, stored in the database, never in components**

| Giveaway | Currency | Fee | Winners (demo) |
|---|---|---|---|
| iPhone 15 Pro | VE | 250 | 1 |
| Apple Watch Series 9 | VE | 200 | 3 |
| AirPods Pro | SVE | 500 | 5 |
| Amazon ₹2,000 | VE | 500 | 10 |
| Amazon ₹500 | VE | 300 | configurable |
| Amazon ₹20 | Token | 2,000 | configurable |

The brief gives winner counts only for the first four; confirm the others.

## 6. Frontend requirements

**Routes:** `/giveaway` (home), `/giveaway/:slug` (detail, 404 on unknown slug), `/login`, `/signup`, `/earn` (placeholder target for Earn More).

**Home order:** banner, hero, stats, featured giveaways plus how to participate, winner slider, Winners and Previous Winners tabs, rules, FAQ, trust, CTA, footer.

**Rules that apply everywhere**
- Join Now is a link to the detail page and never joins anything.
- Prize behaviour comes from registries (`config/prizeTypes.js` maps type to claim form; `config/currencies.js` maps VE, SVE, Token to labels and formatting). No `if (prize === 'Amazon')` in components.
- All data comes through `services/giveawayApi.js` with two adapters, mock and live, chosen by `VITE_API_MODE`. Live mode never falls back to mock data.
- Loading states: full-page themed loader (not a Bootstrap spinner; rotating messages no faster than every 2.5 s), skeletons for prize cards, stats, winners, previous winners and countdown, button-level Joining… and Submitting claim… states.
- Error states show friendly copy and a Try Again button, never raw errors. Backend error codes map to messages through one `errors.js`.
- Motion: subtle hover lift, slow float on hero art, parallax of 12 px or less, one glow per viewport, gradients only on the hero heading and primary CTA. Honour prefers-reduced-motion.
- Mobile is designed, not shrunk: stacked hero, prize cards as scroll-snap carousel, 2-column stats, touch-sized tabs, claim form that fits 320 px, CTA reachable by thumb.
- Accessibility: keyboard-operable everything, alt text, labelled fields, visible focus, ARIA tabs with arrow keys, modals trap focus and close on Esc, throttled live region for the countdown, slider pauses on hover, focus and touch.
- Performance: lazy routes, lazy images with width and height, hero image high priority, assets converted to WebP.

**Detail page:** back link (Giveaway Home on desktop, ← Giveaway on mobile), hero with prize image, badge, status and countdown, prize information card (winners, participants, ends in, entry fee, CTA), balance panel (balance, fee, enough or insufficient), About the Prize, How This Giveaway Works (7 steps), participation rules, Terms and Conditions (10 topics, placeholders flagged), expandable Important Information, compact footer. Confirm modal shows fee, balance and balance after, from the same data for every currency. Idempotency key is generated when the modal opens, not per click.

**Claim modal:** verification panel first (prize, giveaway, status, deadline, required info), then the form from the prize-type registry. Physical: name, phone (10-digit Indian mobile), address, city, state, PIN (6 digits). Gift card: email only, no address.

**Dev state switcher** (dev builds or ?demo=1 only): flips user state, giveaway state, balance and claim state in one click. You need it for the 11 required screenshots.

**Assets:** 9 PNGs, 13.8 MB total, and they appear to be transparent PNGs (verify). Rename to semantic names (giveaway-ticket, gift-box-gold, iphone-15-pro, apple-watch, airpods-pro, amazon-2000, amazon-500, amazon-20, gift-box-dark) and convert to WebP at about 800 px and 1400 px, target under 120 KB each.

**Design tokens (from the references):** background near-black violet (#0A0714), surface #130F23, primary violet #7C3AED / #8B5CF6, gold #F5B83D, success #22C55E. Per-prize accents as in Ref_02: violet iPhone, blue Watch, green AirPods, orange Amazon. One display typeface plus Inter, self-hosted.

## 7. Backend requirements

**Join pipeline, in this order**
1. Authenticate; identity comes only from the token.
2. Validate params and headers (zod or joi).
3. Rate limit.
4. Idempotency lookup: same key returns the stored response.
5. Load giveaway by id or slug from the database.
6. Effective status from server time: startAt <= now <= endAt, else GIVEAWAY_NOT_ACTIVE or GIVEAWAY_ENDED.
7. Eligibility, then existing participation, then fraud score.
8. Start a transaction. Debit with a conditional atomic update on the wallet: `findOneAndUpdate({userId, [field]: {$gte: fee}}, {$inc: {[field]: -fee}})`. A null result means INSUFFICIENT_*_BALANCE.
9. In the same transaction: create participation, create the entry transaction (balanceBefore and balanceAfter), increment participantsCount, write the audit log, store the idempotency record.
10. Commit. A duplicate-key error on participation aborts the transaction (so the debit rolls back) and maps to ALREADY_PARTICIPATING.

**Non-negotiables**
- Fee and currency come from the Giveaway document. Anything the client sends for amount, currency, userId, balance or prize is ignored and logged as a tamper signal.
- Currency maps through a fixed allow-list `{VE: 'ves', SVE: 'sves', TOKEN: 'tokens'}`. Never use a client string as a field name.
- Money is stored as integers.
- Transactions are append-only. Reversal is a new REVERSAL record linked to the original, never a delete.
- Status is derived from server time on every read. A cron job (node-cron) only performs side effects: ACTIVE to ENDED and winner finalization. Never rely on cron alone for correctness.
- Winner selection uses crypto.randomInt over ACTIVE participations, records selectionMethod and selectedAt, enforces winnerCount and is idempotent.
- Claim: server derives the winner, prize, prize type and required fields from the authenticated user. Per-type validation, one submission, deadline enforced. Claim details use `select: false`, never appear in public APIs, URLs or logs.
- Route order: static routes (`current`, `previous`, `previous/winners`, `my-wins`) before `/:idOrSlug`.
- Security: helmet, CORS allowlist (no wildcard), payload limit, mongo-sanitize, centralized error handler, validation on every route, admin routes need auth plus admin role (checked from the database) plus validation.
- Rate limits (starting values): join 5/min per user and 20/min per IP; claim 5/15 min; login 10/15 min per IP and email. Friendly RATE_LIMITED response.
- Audit every money and reward action: JOIN_GIVEAWAY, ENTRY_FEE_DEDUCTED, JOIN_REJECTED, DUPLICATE_ATTEMPT, FRAUD_FLAGGED, WINNER_SELECTED, CLAIM_SUBMITTED, with requestId, user, giveaway, amount, currency, result, timestamp and hashed IP.

**Error codes and user messages**

| Code | HTTP | Message shown |
|---|---|---|
| LOGIN_REQUIRED | 401 | Please login to participate. |
| GIVEAWAY_NOT_FOUND | 404 | We couldn't find this giveaway. |
| GIVEAWAY_NOT_ACTIVE | 409 | This giveaway isn't open yet. |
| GIVEAWAY_ENDED | 409 | This giveaway has ended. Check the winners. |
| ALREADY_PARTICIPATING | 409 | You're already participating. You can join again in the next giveaway. |
| INSUFFICIENT_VE / SVE / TOKEN_BALANCE | 402 | Not enough {currency}. You need {n} more. |
| PARTICIPATION_BLOCKED, SUSPICIOUS_ACTIVITY | 403 | Participation couldn't be completed. Try later or contact support. (No detail on why.) |
| RATE_LIMITED | 429 | Too many attempts. Please wait a moment. |
| CLAIM_NOT_ALLOWED | 403 | This prize can't be claimed from this account. |

## 8. Data model

- **User:** userId (VE10025 style), email, passwordHash, role, status, createdAt.
- **Wallet:** userId (unique), ves, sves, tokens.
- **Prize:** id, name, type (PHYSICAL | GIFT_CARD | DIGITAL), claimType, image, description, optional officially-defined value.
- **Giveaway:** giveawayId, campaign, slug (unique), title, description, prizeId, status (UPCOMING | ACTIVE | ENDED | ARCHIVED), winnersStatus, startAt, endAt, entry {currency, amount}, winnerCount, rules, eligibility, terms (each with isPlaceholder), claimWindowDays, participantsCount, finalizedAt. Indexes: unique slug, (status, endAt). Never overwrite old giveaways.
- **GiveawayParticipation:** userId, giveawayId, prizeId, entryCurrency, entryAmount, deviceHash, status (ACTIVE | FLAGGED | DISQUALIFIED), riskScore, transactionId, joinedAt. **Unique (userId, giveawayId).** Index (giveawayId, deviceHash).
- **GiveawayEntryTransaction:** transactionId (unique), userId, giveawayId, prizeId, currency, amount, type (ENTRY_FEE | REVERSAL), reversalOf, status (PENDING | SUCCESS | FAILED | REVERSED), balanceBefore, balanceAfter, requestId, createdAt.
- **IdempotencyKey:** key plus userId plus route (unique), request hash, stored response, TTL 24 h.
- **GiveawayWinner:** giveawayId, prizeId, userId, selectionMethod, selectedAt, status. Unique (giveawayId, userId).
- **PrizeClaim:** giveawayId, userId, winnerId (unique), status, details (select: false), deadlineAt, submittedAt.
- **DeviceRecord:** deviceHash, userId, giveawayIds, firstSeen, lastSeen.
- **FraudEvent:** userId, giveawayId, deviceHash, riskScore, reason, signals, action, createdAt.
- **AuditLog:** append-only, fields as above.

Previous winners stay attached to their original giveaway. Previous Winners is a query, not a data move.

## 9. API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | /api/giveaways/current | public | Active, upcoming and latest ended giveaways, stats, serverTime |
| GET | /api/giveaways/previous | public | Completed giveaways, paginated |
| GET | /api/giveaways/previous/winners | public | Masked past winners for the slider and tab |
| GET | /api/giveaways/my-wins | user | Added: the user's winning giveaways and claim state |
| GET | /api/giveaways/:idOrSlug | public | Details, rules, T&C, prize, fee, status |
| GET | /api/giveaways/:id/winners | public | Masked winners; empty list with winnersStatus PENDING until finalized |
| GET | /api/giveaways/:id/my-status | user | Joined, balance in the required currency, canJoin and reason, isWinner, claim state |
| POST | /api/giveaways/:id/join | user | Empty body. Headers: Idempotency-Key, X-Device-Id |
| POST | /api/giveaways/:id/claim | user | Claim details; server derives prize and type |
| GET | /api/giveaways/:id/my-claim | user | Own claim status only |
| POST | /api/auth/signup, /login; GET /api/auth/me | mixed | Stub auth until the real system is available |
| POST | /api/admin/giveaways; PATCH /api/admin/giveaways/:id | admin | Create and update |
| POST | /api/admin/giveaways/:id/finalize, /redraw | admin | Select winners; redraw one slot |
| GET, PATCH | /api/admin/claims, /api/admin/claims/:id | admin | List and process claims |

Masking is done on the server: VE10025 becomes VE****25.

## 10. Fraud model

Device hash is an abuse signal, not identity. The client sends a visitor ID; the server combines it with the user agent and HMACs it with a server secret. No raw device data is stored. Same IP is a weak signal on purpose because shared Wi-Fi is normal.

| Signal | Points |
|---|---|
| Same deviceHash already joined this giveaway on another account | +40 |
| Device seen on 3 or more accounts overall | +20 |
| Account younger than 24 h | +15 |
| More than 5 join or claim attempts per minute | +20 |
| Tampered request fields (amount, currency, userId, prizeId) | +25 |
| 5 or more failed attempts in 10 min | +15 |
| 4 or more accounts on one IP hash in this giveaway | +10 |
| Missing or invalid device header | +10 |

**Bands and actions (defaults to confirm):** 0–29 LOW allow. 30–59 MEDIUM allow, record FraudEvent for review. 60–79 HIGH block before charging, no entry, no deduction, generic message. 80–100 CRITICAL block and restrict the account pending admin review. An admin can later mark a participation FLAGGED or DISQUALIFIED; it is then excluded from the draw and a REVERSAL is issued only if policy says so.

## 11. Architecture and structure

**Repo:** one monorepo, `client/` and `server/`, one README, `.env.example` for each, no secrets, no node_modules.

**Client** `src/`: `components/` (GiveawayHero, GiveawayBanner, GiveawayStats, PrizeCard, FeaturedGiveaways, HowToParticipate, WinnerSlider, WinnersTabs, WinnerCard, PreviousWinnerCard, PrizeClaimModal, ConfirmParticipationModal, BalancePanel, GiveawayRules, FAQ, TrustSection, Countdown, Loader, DevStateSwitcher), `pages/` (Giveaway, GiveawayDetail, Login), `config/` (prizeTypes, currencies, errors), `services/` (giveawayApi, mockAdapter, liveAdapter), `hooks/` (useCountdown, useGiveaways, useAuth), `data/giveawayData.js` (mock that mirrors the real JSON), `utils/`, `assets/`, `styles/`. Each component has its own `.module.css`.

**Server** `src/`: the brief's structure (controllers, models, routes, middleware, services, validators, config, utils) plus `jobs/` for cron and `scripts/` for seeding.

**Seed scenarios:** `npm run seed -- --scenario active | upcoming | ended-pending | ended-finalized` so every screenshot state exists against the real API.

## 12. Test plan

**Backend (Jest, Supertest, mongodb-memory-server replica set)**
- Normal: correct currency and amount deducted, participation and transaction created.
- Duplicate: double click and 20 parallel requests produce one participation and one deduction.
- Balance: enough, short, wrong currency.
- Status: upcoming, active, ended, archived.
- Security: unauthenticated join, modified userId, amount, currency and prizeId, replayed request, rate limit, same device on two accounts.
- Winners: 3 concurrent finalize calls produce exactly winnerCount winners; fewer participants than winners; zero participants.
- Claims: winner succeeds once; non-winner gets CLAIM_NOT_ALLOWED; expired window rejected.

**Frontend:** manual matrix of 5 user states by 4 giveaway states by 3 prize types, at 320, 768, 1024, 1440 and 1920 px; keyboard-only pass; axe scan; Lighthouse on mobile; console clean; reduced-motion check.

## 13. Day-wise plan

The plan runs on working days (WD) only: Monday to Friday, 9:30 AM to 6:15 PM IST, with Saturday and Sunday off. Reading 20–24 days as calendar days gives 18 working days, WD1 = Tue 20 Oct to WD18 = Thu 12 Nov. Budget: about 6.5 focused hours a day. Each day carries roughly 1.3 days of the earlier plan, so it is tight by design; the cut order at the end is how you absorb slippage.

### Working agreement (from the official notice)

- Odd days (WD1, 3, 5 …) are review days. Work first, then post in the group when something is ready: link or GitHub, screenshots, what changed since the last review, and your unresolved questions.
- Even days are build-only. Apply the last review's feedback, fix, continue. Do not ask for a review. Try to solve problems yourself and note what you tried.
- Keep `docs/questions-log.md`. Each entry: what you understood, what you tried, what is still unclear. Check it, the brief and past feedback before asking; never repeat an answered question.
- Check the group for official polls every day and answer within the time. If you cannot, say why.
- Reserve 1.5–2 h of each even day for feedback from the previous review; the plan below already counts it.
- On every review day, share what exists, even if the milestone is only partly done.

### WD1 · Tue 20 Oct — Review 1: decide, set up, share
- Post in the group before 6:15 PM: this PRD, the data-model decision (one giveaway per prize) and the section 16 questions.
- Start `docs/questions-log.md`.
- If time remains: monorepo (`client/`, `server/`), Vite React and Express skeletons, `.gitignore`, `.env.example`, Atlas free cluster.

*Share:* PRD and questions. *Exit:* posted in the group; questions logged.

### WD2 · Wed 21 Oct — Build only: foundation and contracts
- Apply Day 1 answers and feedback (cap 1.5 h).
- Finish setup: client packages (bootstrap, react-bootstrap, react-router-dom, framer-motion, lucide-react), server packages (express, mongoose, helmet, cors, zod, express-rate-limit, mongo-sanitize, jsonwebtoken, bcrypt), Atlas transaction check, asset pipeline (rename, WebP), dark theme tokens that override Bootstrap.
- `giveawayData.js` mock that mirrors the final API JSON; `services/giveawayApi.js` with mock and live adapters; `errors.js`; registries (`prizeTypes.js`, `currencies.js`, `giveawayStatus.js`); useCountdown with server offset; router skeleton.

*Exit:* both apps run, `/health` responds, pages render mock JSON through the hooks, assets under about 150 KB.

### WD3 · Thu 22 Oct — Review 2: shell and hero
- Navbar, footer, layout; dev state switcher; themed loader v1 and skeleton primitives.
- Deploy the empty client to Vercel and a health-check API to Render or Railway now.
- GiveawayBanner and page hero, first cut: own copy, gift box and ticket, restrained motion, reduced-motion fallback.

*Share:* Vercel link, banner and hero screenshots at 320 and 1440 px, questions-log items. *Exit:* any state in one click; both deployments reachable.

### WD4 · Fri 23 Oct — Build only: stats, countdown, prize cards
- Apply Review 2 feedback.
- Countdown (d/h/m/s, throttled live region), status badge, ACTIVE, ENDED and UPCOMING blocks, GiveawayStats (demo-labelled).
- PrizeCard and FeaturedGiveaways: scroll-snap carousel on mobile, 2 columns on tablet, grid on desktop.

*Exit:* countdown correct against mocked server time and shows Verifying at zero; every card routes to `/giveaway/:slug` and changes nothing.

### WD5 · Mon 26 Oct — Review 3: home page
- HowToParticipate timeline, TrustSection (no unsupported claims), Giveaway Rules (7 topics), FAQ accordion (7 questions), and fixes to banner, stats and cards from feedback.

*Share:* home page top to bottom in the ACTIVE state at 320, 768 and 1440 px. *Exit:* home page complete in the ACTIVE state.

### WD6 · Tue 27 Oct — Build only: winners
- Apply Review 3 feedback.
- WinnerSlider (rotate about every 4.5 s, pause on hover, focus and touch, no autoplay under reduced motion), WinnersTabs with ARIA tabs, WinnerCard, PreviousWinnerCard, masking util, still-live and empty states.

*Exit:* a live giveaway shows no winners; an ended one shows 1, 3, 5 and 10.

### WD7 · Wed 28 Oct — Review 4: lifecycle and claims
- Controlled reveal (Selecting winners… then revealed), personal panel for every user state, next-giveaway preview.
- PrizeClaimModal: verification panel, physical form, gift-card form, five claim states, non-winner guard.

*Share:* every user state through the switcher, both claim modals. *Exit:* behaviour matches the section 5 matrix; both forms validate; focus is trapped.

### WD8 · Thu 29 Oct — Build only: detail page
- Apply Review 4 feedback.
- `/giveaway/:slug`: hero, back navigation, prize information card, About the Prize, 404; How This Giveaway Works (7 steps), participation rules, T&C (10 topics, placeholders marked), Important Information accordion, compact footer.

*Exit:* all six slugs render the right image, currency and fee from data.

### WD9 · Fri 30 Oct — Review 5: frontend complete on mock
- BalancePanel, ConfirmParticipationModal, Joining… state, success (You're In!), already joined, login-required modal to `/login`, error mapping, idempotency key per modal open.
- Responsive sweep 320 to 1920 px and an accessibility pass.

*Share:* the whole frontend on mock data, all six fees. *Exit:* join works for every currency and checks only the right one. **Checkpoint 1.**

### WD10 · Mon 2 Nov — Build only: backend foundation
- Apply frontend feedback (cap 2 h).
- All models and indexes from section 8, env validation, signup, login, JWT, admin-role middleware, seed script with the four scenarios.

*Exit:* seeds load; login returns a token; unique indexes confirmed in the database.

### WD11 · Tue 3 Nov — Review 6: read APIs live
- current, :idOrSlug, previous, winners, previous/winners (server-side masking), my-status, my-wins; correct route order; effective-status helper; serverTime in payloads; cron for ACTIVE to ENDED; helmet, CORS allowlist, payload limit, sanitizer, error handler.
- Switch the home page to live mode.

*Share:* API URL, sample responses, home page running live. *Exit:* live mode has no mock fallback.

### WD12 · Wed 4 Nov — Build only: join pipeline (the critical day)
- Apply Review 6 feedback (cap 1 h).
- participationService.join exactly as in section 7: conditional debit, transaction, idempotency, duplicate-key mapping, rate limiter, validators.
- Race tests: 20 parallel joins give 1 participation and 1 deduction.

*Exit:* every join error code reachable; race test green.

### WD13 · Thu 5 Nov — Review 7: fraud layer and live join
- Device hashing, DeviceRecord, risk engine with the section 10 weights, middleware, generic user messages, audit log on every money and reward action; fraud tests.
- Connect the frontend join flow to the live endpoint.

*Share:* live join demo, race and fraud test output. *Exit:* second account on the same device handled per the default policy. **Checkpoint 2.**

### WD14 · Fri 6 Nov — Build only: winners, claims, admin
- Apply Review 7 feedback.
- winnerService with crypto.randomInt, atomic finalize guard, redraw; claim endpoint with server-derived prize and type; admin endpoints behind auth, role and validation; tests for concurrent finalize, non-winner claim and expired window.

*Exit:* 3 concurrent finalize calls give exactly winnerCount winners; a non-winner claim returns CLAIM_NOT_ALLOWED.

### WD15 · Mon 9 Nov — Review 8: full integration
- Live end to end: winner and claim states, full-page loader, skeletons, empty and retry states, serverTime countdown, dev switcher hidden in production.
- Remaining security tests: tamper, replay, rate limit, upcoming, ended and archived.

*Share:* integrated live link, every seeded scenario. *Exit:* every flow in section 5 works against the real API; no console errors.

### WD16 · Tue 10 Nov — Build only: QA and polish, feature freeze
- Apply Review 8 feedback.
- Run the brief's section 75 checklist line by line; axe and keyboard-only pass; Lighthouse mobile; 320 to 1920 px sweep; reduced motion; lazy routes and bundle check; production builds of both apps.

*Exit:* feature complete. Nothing new gets built after today.

### WD17 · Wed 11 Nov — Review 9: ship candidate
- Final production deploy, CORS and env check, smoke test on the live URLs.
- README with every section the brief lists, API.md (endpoint, method, auth, request, response, error codes), screenshots of all 11 states at desktop, tablet and mobile from seed scenarios, Postman collection if time allows, GitHub push with no `.env`.

*Share:* live URLs, repo, README, screenshots. *Exit:* every deliverable exists.

### WD18 · Thu 12 Nov — Build only: final fixes, submit by noon
- Apply Review 9 feedback, re-run the checklist, submit well before 5:30 PM IST. No features.

### Checkpoints and cut order

- **Checkpoint 1 (end of WD9):** if the frontend is not complete on mock data, cut all P1 items and simplify detail-page content and motion before touching the backend.
- **Checkpoint 2 (end of WD13):** if the join pipeline or race test is not green, nothing else starts. Cut fraud scoring to device hash plus tamper signals only.
- **WD16:** feature freeze, no exceptions.
- **If 20–24 means working days** (deadline Mon 16 to Fri 20 Nov): keep this schedule through WD18 and use the extra days for P1 items, polish and more review rounds, then move the submission to the new date.

## 14. Deliverables checklist

- GitHub repo (client, server, assets, mock data, CSS Modules, config, README)
- Live frontend URL and live API URL
- README and API.md
- Screenshots: desktop, tablet, mobile; active, ended, upcoming; winners tab; previous winners; physical claim modal; Amazon gift-card claim modal; non-winner state
- Seed instructions so a reviewer can reproduce each state

## 15. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Scope exceeds real hours | High | P0 cut, daily exit checks, a fixed cut order, tell the mentor early |
| Data-model ambiguity found late | High | Decide on Day 1 and write it down |
| Visual polish rabbit hole | High | Time-box 90 min per component; one glow per viewport |
| Transactions fail on standalone Mongo | Medium | Atlas replica set from Day 1 |
| Wallet and auth contract differs from the stub | Medium | Isolate behind two files |
| First deployment problems on the last days | Medium | Deploy skeleton on WD3 |
| Heavy images hurt performance | Medium | WebP pipeline by WD2 |
| Mentor feedback arrives late | Medium | Share on every odd working day (official review cycle) |
| Feedback rework eats build days | High | Cap feedback at 2 h on even days, log questions, apply the cut order |

## 16. Questions to send the mentor on Day 1

1. Is each prize its own giveaway (my default), or one event with several prize pools?
2. Can I get the existing auth and wallet API contract or repo? If not, is a stub acceptable?
3. What are SVEs, and can VEs or Tokens be bought or cashed out?
4. Is one paid entry per user per giveaway final? What is the refund policy?
5. Same device on two accounts: block or flag?
6. Are task-based entries real, or demo only?
7. Who has approved a paid-entry random draw from a legal and policy view?
8. Do 20–24 days mean calendar days or working days, and is today the official Day 1?
9. Is an admin UI part of this task? (I assume no.)
10. Any hosting constraints for the backend?
11. The notice mentions stipend performance criteria in its intro but never states them. What are they?