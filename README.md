# VELOOP Giveaway & Rewards System

A secure, backend-authoritative reward and giveaway platform built for VELOOP. Engineered with race-condition-proof entry pipelines, atomic conditional ledger tracking, server-driven countdown verification, privacy-preserving masked winner IDs, and zero casino mechanics.

---

## Architecture & Technology Stack

- **Frontend**: React 19, Vite, Bootstrap 5 & React-Bootstrap (for accessible Modals, Accordions, Tabs), CSS Modules (`.module.css`), Lucide Icons, Framer Motion.
- **Styling & Design System**: Custom **Luxury Obsidian Charcoal (`#0B0E0D`), Refined Emerald Jade (`#10B981`), Natural Titanium (`#E2E8F0`), and Champagne Gold (`#F5B83D`)** palette. All generic Bootstrap styles are deeply overridden with CSS variables. Strictly no AI-prone violet/purple or neon blue gradients.
- **Backend API**: Node.js, Express, Helmet, CORS allowlisting, Mongo-Sanitize, Zod schema validation, JSON Web Tokens (JWT), Express-Rate-Limit.
- **Database**: MongoDB (Atlas Replica Set for multi-document ACID transactions).
- **Service Layer**: Dual-adapter architecture (`mockAdapter` and `liveAdapter` selected via `VITE_API_MODE`). Live mode never falls back to mock data.

---

## Project Structure

```
VELOOPGiveawaySystem/
├── package.json               # Root monorepo orchestration
├── .gitignore
├── .env.example
├── client/                    # Frontend React application
│   ├── vercel.json            # Vercel SPA rewrites & caching
│   ├── src/
│   │   ├── components/        # Isolated components with CSS Modules
│   │   │   ├── Banner/        # Reusable GiveawayBanner
│   │   │   ├── Hero/          # GiveawayHero with restrained motion
│   │   │   ├── Loader/        # ThemedLoader with cycling messages
│   │   │   ├── Skeleton/      # Shimmer skeleton primitives
│   │   │   ├── DevStateSwitcher/ # 1-click QA state flipper
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── config/            # Currencies, prize types, statuses, errors
│   │   ├── data/              # Authoritative mock JSON contract
│   │   ├── hooks/             # useCountdown (clock sync), useGiveaways, useAuth
│   │   ├── pages/             # Giveaway, GiveawayDetail, Login, SignUp, Earn
│   │   ├── services/          # giveawayApi, mockAdapter, liveAdapter
│   │   └── styles/            # Design tokens (variables.css)
│   └── public/assets/prizes/  # High-resolution copyright-free photography
└── server/                    # Backend Express API
    ├── render.yaml            # Render Web Service deploy spec
    ├── Procfile               # Cloud process file
    └── src/
        ├── app.js             # Security middleware and route mounting
        ├── server.js          # Server entry point
        └── config/db.js       # MongoDB & replica set transaction verification
```

---

## Getting Started

### Prerequisites
- Node.js >= v20.x
- npm >= 10.x

### 1. Installation
Install dependencies in both `client` and `server`:
```bash
npm --prefix client install
npm --prefix server install
```

### 2. Environment Configuration
Copy `.env.example` templates:
```bash
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### 3. Run Locally
```bash
# Start Client (Vite Dev Server on http://localhost:5173)
npm run dev:client

# Start Backend API (Express on http://localhost:5000)
npm run dev:server
```

---

## Dev State Switcher (QA & Screenshot Capture)

A floating **Dev QA** widget is mounted in the bottom-right corner during development or when appending `?demo=1` to the URL.

It enables 1-click toggling of:
- **User States**: Visitor (Logged Out) vs Logged In (`VE10025`).
- **Wallet Scenarios**: Sufficient balance (2,500 VE), Low VE (40 VE — triggers *"Earn More VE"*), Low SVE (20 SVE), Zero balance.
- **Giveaway Lifecycles**: Active, Upcoming, Ended (Selecting Winners), Ended (Finalized).

---

## Deployment Specifications

- **Client**: Configured for Vercel deployment with SPA rewrites in `client/vercel.json`.
- **API**: Configured for Render/Railway deployment in `server/render.yaml` with automated health check monitoring at `/health`.

---

## Verification & Health Check
- API Health Status: `GET http://localhost:5000/health` $\rightarrow$ `200 OK` (`{ status: "ok", service: "veloop-giveaway-api" }`)
- Client Build Test: `npm --prefix client run build` $\rightarrow$ 0 errors.
