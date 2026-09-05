# OpsMind — Autonomous Business OS

<div align="center">

![OpsMind Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

**Autonomous AI Operating System for Modern Merchants**  
*Monitor real-time revenue, intercept sophisticated fraud, salvage failed payments, forecast cash flow, and converse with your business.*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4_(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Tested-729B1B?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

</div>

---

## 🌟 Overview

OpsMind is an enterprise-grade **Autonomous Business Operating System** designed for high-velocity global merchants, marketplaces, and fintech platforms. Combining autonomous AI agent pipelines with real-time payment telemetry, OpsMind replaces fragmented spreadsheets and dashboards with an intelligent self-driving control tower.

---

## 🚀 Core Capabilities

### 1. 🛡️ Sentinel AI Fraud Defense
- **Realtime Anomaly Detection**: Intercepts credential stuffing, BIN attacks, TOR exit nodes, and synthetic identities at the network edge.
- **Automated Firewall Rules**: AI-synthesized rule suggestions with one-click edge deployment.
- **Quarantine & Risk Scoring**: Granular risk evaluation (0–100) with quarantine workflows.

### 2. ⚡ Smart Retry & Revenue Recovery Rail
- **Autonomous Dunning**: Salvages soft declines, expired cards, and transient processor downtime with intelligent scheduling.
- **Zero-Touch Re-routing**: Bypasses 3DS latency and regional processor degradation dynamically.
- **Recovered Revenue Ledger**: Transparent recovery tracking with exact fee breakdowns.

### 3. 📈 Cash-Flow Forecasting & Liquidity Controller
- **Predictive Horizon**: 30-day, 60-day, and 90-day cash flow projections with upper and lower bound confidence intervals.
- **Runway Telemetry**: Real-time runway analysis, safe-to-spend calculations, and upcoming inflow/outflow schedules.
- **Multi-Currency Treasury**: Supports multi-currency settlements (USD, EUR, GBP, SGD) with automatic conversion.

### 4. 🤖 AI Copilot Drawer
- **Conversational Intelligence**: Ask complex analytical questions like *"Why did revenue fall yesterday?"*, *"Show high-risk orders from Germany"*, or *"Run dunning recovery cycle"*.
- **Streaming Responses**: Token-by-token real-time streaming with Markdown analysis, metric pills, and direct actions.

### 5. ⚡ Global Command Palette (`Cmd + K` / `Ctrl + K`)
- **Fuzzy Search**: Instant search across orders, customers, transactions, fraud events, and settings.
- **Keyboard-Driven Workflows**: Navigate pages, trigger exports, toggle dark/light themes, and launch Copilot without leaving the keyboard.

### 6. 📊 Multi-Format Export Matrix
- **5 Core Entities**: Revenue, Payments, Customers, Fraud Alerts, and Cash-Flow Forecast.
- **3 File Formats**: CSV (RFC 4180 compliant), JSON (indented payload), and PDF (printable report).
- **Executive AI Briefing**: Instant LLM-generated operational briefing summary.

---

## 🏛️ Architecture Overview

OpsMind adheres to **Layered Clean Architecture** principles, enforcing separation of concerns between presentation, state orchestration, API abstraction, and edge security:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                              │
│  Next.js 16 App Router (RSC + Client Components) / Dark Glassmorphism  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       State & Provider Mesh                            │
│   AuthProvider  │  QueryProvider  │  WebSocketProvider │ Notification  │
│   (RBAC + JWT)  │ (TanStack v5)   │  (Auto-Reconnect)  │ (Queue/Toast) │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
┌───────────────────────────────────────┐ ┌──────────────────────────────┐
│        API Service Abstraction        │ │     WebSocket Abstraction    │
│  dashboardApi   │   fraudApi          │ │  OpsWebSocketClient          │
│  revenueApi     │   paymentsApi       │ │  Topics: metrics, fraud,     │
│  forecastApi    │   settingsApi       │ │  payments, revenue, copilot  │
│  customersApi   │   notificationsApi  │ └──────────────────────────────┘
└───────────────────┬───────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Edge Route Guard & Backend API                         │
│  middleware.ts (Cookie JWT verification & Route Shielding)             │
│  Next.js Route Handlers (/api/dashboard, /api/fraud, /api/settings...) │
└───────────────────┬────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Data & Persistence Layer                          │
│  Prisma ORM  │  PostgreSQL / SQLite  │  Redis Edge Cache Simulation    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 Role-Based Access Control (RBAC)

OpsMind implements strict enterprise role boundaries:

| Role | Dashboard | Revenue & Forecast | Orders & Customers | Payments & Retry | Settings & API Keys |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Admin** | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write | ✅ Full Access |
| **Analyst** | ✅ Read | ✅ Read/Write | ✅ Read | ✅ Read | ❌ Hidden |
| **Support** | ✅ Read | ❌ Hidden | ✅ Read/Write | ✅ Retry/Manage | ❌ Hidden |
| **Viewer** | ✅ Read | ✅ Read | ✅ Read | ❌ Read Only | ❌ Hidden |

> **Interactive Role Switcher**: In development and demo mode, switch roles in real time via the User Profile menu in the Top Navbar to verify permission gating dynamically.

---

## 📁 Repository Structure

```text
OpsMind/
├── apps/
│   └── web/
│       ├── prisma/
│       │   ├── schema.prisma         # Database models (User, Organization, Order, FraudAlert)
│       │   └── seed.ts               # Production-grade mock telemetry seeder
│       ├── public/                   # Static icons, brand marks, and svgs
│       ├── src/
│       │   ├── app/                  # Next.js 16 App Router
│       │   │   ├── (auth)/           # Authentication routes (login, signup, reset)
│       │   │   ├── api/              # RESTful route handlers
│       │   │   │   ├── copilot/      # AI Copilot streaming endpoint
│       │   │   │   ├── customers/    # Customer profiles & LTV telemetry
│       │   │   │   ├── dashboard/    # Consolidated telemetry KPIs
│       │   │   │   ├── forecast/     # Cash flow & runway series
│       │   │   │   ├── fraud/        # Sentinel firewall alerts
│       │   │   │   ├── notifications/# Chronological notification stream
│       │   │   │   ├── payments/     # Payment recovery & smart dunning
│       │   │   │   ├── revenue/      # Multi-currency revenue stream
│       │   │   │   └── settings/     # Enterprise settings persistence
│       │   │   ├── dashboard/        # Authenticated SaaS operating system
│       │   │   ├── error.tsx         # Standardized 500 error boundary
│       │   │   ├── layout.tsx        # Root layout with stacked providers
│       │   │   ├── not-found.tsx     # 404 Not Found glassmorphism page
│       │   │   └── page.tsx          # High-converting landing page
│       │   ├── components/           # Component library
│       │   │   ├── dashboard/        # KPI cards, charts, drawers, modals
│       │   │   ├── layout/           # Sidebar, TopNavbar, Drawer containers
│       │   │   ├── security/         # Idle session timeout warning modal
│       │   │   ├── settings/         # React Hook Form + Zod settings tabs
│       │   │   └── ui/               # Accessible UI atoms (Button, Dialog, Input)
│       │   ├── hooks/
│       │   │   ├── queries/          # TanStack Query v5 hooks & mutations
│       │   │   ├── use-auth.ts       # Auth context & permission resolution
│       │   │   ├── use-realtime-engine.ts # Realtime telemetry synchronization
│       │   │   └── use-websocket.ts  # WebSocket subscription hook
│       │   ├── lib/
│       │   │   ├── api/              # Typed API clients with retry & error parsing
│       │   │   ├── websocket/        # OpsWebSocketClient with auto-reconnect
│       │   │   └── dashboard-data.ts # Types and baseline models
│       │   ├── middleware.ts         # Edge JWT authentication guard
│       │   ├── providers/            # Auth, Theme, Query, WS, Notification providers
│       │   └── store/                # Zustand persistent client store
│       └── tests/
│           ├── e2e/                  # Playwright end-to-end user flow specs
│           └── unit/                 # Vitest unit test suites (API, RBAC)
├── package.json                      # Monorepo workspaces manifest
└── README.md                         # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 1. Clone & Install
```bash
git clone https://github.com/kanifnathzirpe/OpsMind.git
cd OpsMind
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `DATABASE_URL` | **Yes** | `"file:./dev.db"` | PostgreSQL connection string or SQLite local database |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `http://localhost:3000` | Canonical app URL |
| `NEXT_PUBLIC_API_URL` | No | `""` (same origin) | Remote API URL if backend is decoupled |
| `NEXT_PUBLIC_WS_URL` | No | `wss://...` | WebSocket streaming server endpoint |
| `JWT_SECRET` | **Yes** | — | Cryptographic secret for signing session tokens |

### 3. Initialize Database
```bash
npm run db:seed --workspace=web
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view OpsMind.

---

## 🧪 Available Scripts

From the repository root:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Next.js Turbopack development server on `http://localhost:3000` |
| `npm run type-check` | Runs TypeScript compiler validation (`tsc --noEmit`) with zero errors |
| `npm run lint` | Runs ESLint across all workspaces with zero warnings |
| `npm test` | Runs Vitest unit test suites (API error handling & RBAC matrix) |
| `npm run test:e2e` | Runs Playwright end-to-end tests across Chromium, Firefox, and WebKit |
| `npm run build` | Generates an optimized production bundle across all 24 routes |
| `npm run start` | Runs the production Next.js server |

---

## 🚢 Deployment Guide

### Vercel (Recommended)
1. Import repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `apps/web`.
3. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`.
4. Deploy — Next.js Turbopack compiles static and dynamic routes automatically.

### Docker & Cloud Containers (AWS ECS / GCP Cloud Run)
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/apps/web/public ./public
COPY --from=base /app/apps/web/.next/standalone ./
COPY --from=base /app/apps/web/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t opsmind .
docker run -p 3000:3000 -e JWT_SECRET="your-256-bit-secret" opsmind
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Built with ❤️ for modern global merchants by the <b>OpsMind Engineering Team</b>.
</div>