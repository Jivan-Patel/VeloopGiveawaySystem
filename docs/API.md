# VELOOP Giveaway & Rewards System - Authoritative API Specification

This document provides the authoritative REST API reference for the VELOOP Giveaway & Rewards platform, including headers, request contracts, response envelopes, error dictionaries, and copy-paste curl commands.

---

## 1. Global Architecture & Standards

### 1.1 Base URLs
- **Local Development:** `http://localhost:5000`
- **Production API:** `https://veloop-giveaway-api.onrender.com`

### 1.2 Unified Success Envelope
All successful responses are returned with HTTP 200/201 and wrapped in standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation"
}
```

### 1.3 Unified Error Envelope
All error responses return standard HTTP 4xx/5xx status codes and conform to:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_ENUM_CODE",
    "message": "Clear explanation of the error condition",
    "details": {}
  }
}
```

### 1.4 Headers & Authentication
| Header | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `Authorization` | `string` | Format: `Bearer <jwt_token>` | For protected endpoints |
| `Content-Type` | `string` | Always `application/json` | For POST / PATCH bodies |
| `Idempotency-Key`| `string` | Unique client UUID (e.g. `uuidv4`) preventing double charging | Recommended on `/join` |
| `X-Device-Id` | `string` | SHA-256 client device fingerprint for fraud scoring | Optional (auto-generated if omitted) |
| `X-Forwarded-For`| `string` | Client IP address for velocity checks | Handled by reverse proxy |

---

## 2. Authentication & Identity Endpoints

### 2.1 Login User
Authenticates user credentials and returns signed JWT with wallet balances.
- **Route:** `POST /api/auth/login`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "jivan@veloop.io",
  "password": "Password123!"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "userId": "VE10025",
      "email": "jivan@veloop.io",
      "role": "USER",
      "wallet": {
        "ves": 2500,
        "sves": 800,
        "tokens": 5000
      }
    }
  }
}
```
- **Example Curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jivan@veloop.io","password":"Password123!"}'
```

### 2.2 Register User
Registers a new platform user with initial signup rewards.
- **Route:** `POST /api/auth/register`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "newuser@veloop.io",
  "password": "SecurePassword123!",
  "referralCode": "REF-88421"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "userId": "VE10089",
      "email": "newuser@veloop.io",
      "role": "USER",
      "wallet": {
        "ves": 1000,
        "sves": 200,
        "tokens": 1000
      }
    }
  }
}
```

### 2.3 Get Current Authenticated User & Balances
Retrieves the real-time profile and wallet integer balance for the calling session.
- **Route:** `GET /api/auth/me`
- **Auth:** `Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "VE10025",
      "email": "jivan@veloop.io",
      "role": "USER",
      "wallet": {
        "ves": 2250,
        "sves": 800,
        "tokens": 5000
      }
    }
  }
}
```

---

## 3. Giveaway Participation Endpoints

### 3.1 List Active Giveaways & Global Metrics
Returns all current giveaway pools with aggregated statistics and user-specific participation states if authenticated.
- **Route:** `GET /api/giveaways`
- **Auth:** Optional (enriches response with `isParticipating` if token present)
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "giveaways": [
      {
        "giveawayId": "gw-summer-2026",
        "title": "iPhone 15 Pro",
        "slug": "iphone-15-pro",
        "status": "ACTIVE",
        "entryFee": {
          "amount": 250,
          "currency": "VE"
        },
        "participantsCount": 1840,
        "maxParticipants": 5000,
        "startAt": "2026-11-01T00:00:00.000Z",
        "endAt": "2026-11-15T23:59:59.000Z",
        "prize": {
          "id": "prize-iphone-15-pro",
          "name": "Apple iPhone 15 Pro (128GB)",
          "type": "PHYSICAL",
          "retailPrice": 134900,
          "imageUrl": "https://images.unsplash.com/photo-1695048133142-1a20484d2569"
        }
      }
    ],
    "stats": {
      "totalGiveawaysActive": 24,
      "totalParticipants": 8500,
      "prizesWon": 1200
    }
  }
}
```

### 3.2 Get Giveaway Detail
Fetches detailed state for a specific giveaway pool identified by slug or ID.
- **Route:** `GET /api/giveaways/:id`
- **Auth:** Optional
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "giveaway": {
      "giveawayId": "gw-summer-2026",
      "title": "iPhone 15 Pro",
      "status": "ACTIVE",
      "entryFee": { "amount": 250, "currency": "VE" },
      "participantsCount": 1840,
      "isParticipating": false
    }
  }
}
```

### 3.3 Join Giveaway (ACID Transactional Ledger Deduction)
Submits user participation into a giveaway pool with atomic integer balance deduction, idempotency locking, and fraud evaluation.
- **Route:** `POST /api/giveaways/:id/join`
- **Auth:** `Bearer <token>`
- **Headers:**
  - `Idempotency-Key`: `550e8400-e29b-41d4-a716-446655440000`
  - `X-Device-Id`: `df81729bca0217...`
- **Request Body:** `{}` (Authoritative fee is derived strictly from DB, body fee overrides are ignored)
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "participationId": "6aec8acea00b3c711fcb0488",
    "ticketNumber": 1841,
    "feeDeducted": 250,
    "currency": "VE",
    "remainingBalance": 2250,
    "joinedAt": "2026-11-05T14:15:30.000Z"
  },
  "message": "Successfully entered giveaway pool."
}
```
- **Error Responses:**
  - `402 Payment Required` $\to$ `{"code": "INSUFFICIENT_FUNDS", "message": "Required 250 VE, available 100 VE"}`
  - `409 Conflict` $\to$ `{"code": "ALREADY_PARTICIPATING", "message": "User is already registered in this giveaway pool"}`
  - `403 Forbidden` $\to$ `{"code": "PARTICIPATION_BLOCKED", "message": "Participation restricted due to high security risk score"}`

### 3.4 Submit Prize Claim (Winner Claim Fulfillment)
Permits verified giveaway winners to submit delivery and fulfillment credentials within the mandatory 7-day post-draw window.
- **Route:** `POST /api/giveaways/:id/claim`
- **Auth:** `Bearer <token>`
- **Request Body (Physical Prize):**
```json
{
  "fullName": "Jivan Patel",
  "phone": "+91 98765 43210",
  "addressLine1": "Tower 4, SG Highway, Bodakdev",
  "addressLine2": "Opp. Science City Road",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pincode": "380054"
}
```
- **Request Body (Digital Gift Card / Voucher):**
```json
{
  "email": "jivan@veloop.io",
  "phone": "+91 98765 43210"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "claimId": "6aec8acea00b3c711fcb0490",
    "giveawayId": "gw-summer-2026",
    "userId": "VE10025",
    "prizeType": "PHYSICAL",
    "status": "SUBMITTED",
    "claimWindowClosesAt": "2026-11-22T23:59:59.000Z",
    "submittedAt": "2026-11-10T12:00:00.000Z"
  },
  "message": "Prize claim recorded successfully."
}
```
- **Error Responses:**
  - `403 Forbidden` $\to$ `{"code": "NOT_A_WINNER", "message": "User is not a designated winner for this giveaway"}`
  - `400 Bad Request` $\to$ `{"code": "CLAIM_EXPIRED", "message": "The 7-day claim window for this prize has expired"}`
  - `409 Conflict` $\to$ `{"code": "ALREADY_CLAIMED", "message": "Prize claim has already been submitted for this giveaway"}`

---

## 4. Administrative & Governance Endpoints

### 4.1 Admin Finalize Giveaway & Select Winner
Executes uniform cryptographic random winner selection (`crypto.randomInt` + Fisher-Yates ticket shuffle) across active participants and transitions pool to `FINALIZED`.
- **Route:** `POST /api/admin/giveaways/:id/finalize`
- **Auth:** `Bearer <admin_jwt>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "giveawayId": "gw-summer-2026",
    "winnersStatus": "FINALIZED",
    "winners": [
      {
        "userId": "VE10025",
        "ticketNumber": 142,
        "selectionMethod": "CRYPTO_RANDOM",
        "drawnAt": "2026-11-06T11:42:15.000Z"
      }
    ]
  },
  "message": "Giveaway finalized and winner cryptographically selected."
}
```

### 4.2 Admin Redraw Winner
Disqualifies an existing winner (e.g. for PRD rule infringement or non-claim) and cryptographically draws a replacement winner from the remaining eligible ticket pool.
- **Route:** `POST /api/admin/giveaways/:id/redraw`
- **Auth:** `Bearer <admin_jwt>`
- **Request Body:**
```json
{
  "userId": "VE10025",
  "reason": "Failed compliance address verification within claim timeline"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "giveawayId": "gw-summer-2026",
    "disqualifiedUserId": "VE10025",
    "newWinner": {
      "userId": "VE10092",
      "ticketNumber": 894,
      "selectionMethod": "CRYPTO_RANDOM_REDRAW"
    }
  },
  "message": "Winner redrawn and audit log updated."
}
```

### 4.3 List All Claims (Fulfillment Queue)
Returns submitted claims with optional filtering by fulfillment status (`SUBMITTED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `REJECTED`).
- **Route:** `GET /api/admin/claims?status=SUBMITTED`
- **Auth:** `Bearer <admin_jwt>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "claims": [
      {
        "_id": "6aec8acea00b3c711fcb0490",
        "giveawayId": "gw-summer-2026",
        "userId": "VE10025",
        "prizeType": "PHYSICAL",
        "status": "SUBMITTED",
        "submittedAt": "2026-11-10T12:00:00.000Z",
        "details": {
          "fullName": "Jivan Patel",
          "city": "Ahmedabad",
          "state": "Gujarat",
          "pincode": "380054"
        }
      }
    ]
  }
}
```

### 4.4 Update Claim Dispatch & Tracking
Updates dispatch status and attaches courier tracking information for physical prize shipments.
- **Route:** `PATCH /api/admin/claims/:id`
- **Auth:** `Bearer <admin_jwt>`
- **Request Body:**
```json
{
  "status": "SHIPPED",
  "courierPartner": "BlueDart Express",
  "trackingNumber": "BD-88492019",
  "notes": "Dispatched via overnight air transit"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "claimId": "6aec8acea00b3c711fcb0490",
    "status": "SHIPPED",
    "courierPartner": "BlueDart Express",
    "trackingNumber": "BD-88492019",
    "updatedAt": "2026-11-10T16:00:00.000Z"
  }
}
```

### 4.5 Admin KPI Dashboard & Audit Stream
Retrieves system-wide performance indicators, total ledger volume, active pools count, and immutable audit logs.
- **Route:** `GET /api/admin/dashboard`
- **Auth:** `Bearer <admin_jwt>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "metrics": {
      "activePools": 24,
      "totalParticipations": 8500,
      "totalClaims": 1200,
      "pendingClaims": 14,
      "blockedFraudAttempts": 47
    },
    "auditStream": [
      {
        "action": "GIVEAWAY_FINALIZED",
        "userId": "ADMIN",
        "giveawayId": "gw-summer-2026",
        "result": "SUCCESS",
        "createdAt": "2026-11-06T11:42:15.000Z"
      }
    ]
  }
}
```

---

## 5. System Healthcheck Endpoints

### 5.1 Service Health & Database Connection
Monitors service availability, process uptime, and MongoDB replica set connectivity.
- **Route:** `GET /health` or `GET /api/health`
- **Auth:** Public
- **Response:** `200 OK`
```json
{
  "status": "ok",
  "service": "veloop-giveaway-api",
  "version": "1.0.0",
  "uptimeSeconds": 14520,
  "timestamp": "2026-11-10T16:15:45.000Z",
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

---

## 6. Comprehensive Error Code Catalog

| Error Code | HTTP Status | Root Cause & Resolution |
| :--- | :---: | :--- |
| `AUTH_UNAUTHORIZED` | 401 | Missing or invalid Bearer JWT in `Authorization` header. |
| `AUTH_FORBIDDEN` | 403 | Authenticated user lacks `ADMIN` role privileges. |
| `INSUFFICIENT_FUNDS` | 402 | User wallet balance in specified currency is lower than authoritative entry fee. |
| `ALREADY_PARTICIPATING` | 409 | User has already joined this giveaway pool. Multiple entries are restricted per PRD. |
| `GIVEAWAY_NOT_FOUND` | 404 | Provided giveaway ID or slug does not exist in authoritative database. |
| `GIVEAWAY_NOT_ACTIVE` | 400 | Giveaway pool has ended, is paused, or has not yet commenced. |
| `GIVEAWAY_ALREADY_FINALIZED` | 409 | Winners have already been selected for this pool. Idempotency guard preserves prior draw. |
| `NOT_A_WINNER` | 403 | Caller attempting prize claim is not among selected winners. |
| `CLAIM_EXPIRED` | 400 | Claim submitted past the mandatory 7-day post-draw window (`endAt + 7 days`). |
| `ALREADY_CLAIMED` | 409 | Prize claim has already been submitted for this giveaway and winner. |
| `INVALID_CLAIM_PAYLOAD` | 400 | Missing required shipping parameters (fullName, address, 6-digit PIN) or gift card email. |
| `PARTICIPATION_BLOCKED` | 403 | Fraud score $\ge 70$ triggered by device velocity or multiple accounts on identical device. |
| `RATE_LIMITED` | 429 | Exceeded 200 requests per 15-minute window. Backoff and retry. |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception. Transaction automatically rolled back via ACID session. |

---

## 7. Development & Testing Commands

To run all automated API, security, race condition, and claim verification suites:
```bash
# Execute comprehensive node test runner
npm --prefix server test
```
All tests utilize in-memory MongoDB replica sets (`MongoMemoryReplSet`) with multi-document ACID transactions.
