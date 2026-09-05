# OpsMind — Autonomous Business OS

> Production-grade AI-powered payment operations, fraud prevention, cash-flow forecasting, and automated revenue recovery platform for high-velocity modern merchants.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?logo=react-query)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Tests-729b1b?logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2ead33?logo=playwright)](https://playwright.dev/)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Environment Variables](#environment-variables)
4. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
5. [Realtime WebSocket Infrastructure](#realtime-websocket-infrastructure)
6. [API Layer & State Management](#api-layer--state-management)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Guide](#deployment-guide)
   - [Vercel Deployment](#vercel-deployment)
   - [Docker & Containerized Cloud (AWS / GCP)](#docker--containerized-cloud)
   - [Bare Metal / PM2 + Nginx](#bare-metal--pm2--nginx)

---

## Architecture Overview

OpsMind is architected using **Layered Clean Architecture** with unidirectional data flow, edge route interception, and reactive cache synchronization:

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

## Folder Structure

```text
apps/web/
├── prisma/
│   ├── schema.prisma             # Database schema (Organizations, Users, Transactions)
│   └── seed.ts                   # Enterprise mock data seeder
├── public/                       # Static assets and brand logos
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── (auth)/               # Auth routes (login, signup, reset-password)
│   │   ├── api/                  # Centralized REST route handlers
│   │   │   ├── copilot/          # AI Copilot streaming route
│   │   │   ├── customers/        # Customer search and telemetry
│   │   │   ├── dashboard/        # Consolidated dashboard KPI payload
│   │   │   ├── forecast/         # Cash flow and predictive series
│   │   │   ├── fraud/            # Sentinel fraud alerts and rule firewall
│   │   │   ├── notifications/    # Chronological notification stream
│   │   │   ├── payments/         # Payment recovery & smart retry rail
│   │   │   ├── revenue/          # Multi-currency revenue stream
│   │   │   └── settings/         # Enterprise settings persistence
│   │   ├── dashboard/            # Authenticated Enterprise SaaS dashboard
│   │   ├── error.tsx             # Standardized 500 error boundary page
│   │   ├── layout.tsx            # Root layout with stacked providers
│   │   ├── not-found.tsx         # 404 Not Found glassmorphism page
│   │   └── page.tsx              # Landing page (Strictly preserved)
│   ├── components/
│   │   ├── dashboard/            # Specialized dashboard widgets
│   │   │   ├── advanced-filter-bar.tsx
│   │   │   ├── cash-flow-forecast.tsx
│   │   │   ├── command-palette.tsx   # Cmd+K global shortcuts
│   │   │   ├── copilot-drawer.tsx    # Conversational AI drawer
│   │   │   ├── dashboard-skeleton.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── export-modal.tsx      # CSV, JSON, PDF 5-entity matrix
│   │   │   ├── fraud-alerts-panel.tsx
│   │   │   ├── kpi-cards.tsx
│   │   │   ├── notification-drawer.tsx
│   │   │   ├── orders-table.tsx
│   │   │   └── revenue-chart.tsx
│   │   ├── layout/               # Shell components (Sidebar, TopNavbar)
│   │   ├── security/             # Session timeout warning modal
│   │   ├── settings/             # React Hook Form + Zod settings tabs
│   │   └── ui/                   # Reusable glassmorphic atoms (Button, Dialog, Input)
│   ├── hooks/
│   │   ├── queries/              # TanStack Query custom hooks & mutations
│   │   ├── use-auth.ts           # Authentication & RBAC permissions hook
│   │   ├── use-realtime-engine.ts# Live telemetry sync hook
│   │   └── use-websocket.ts      # WebSocket connection & subscription hook
│   ├── lib/
│   │   ├── api/                  # Typed API services & ApiClient wrapper
│   │   ├── websocket/            # OpsWebSocketClient with auto-reconnect
│   │   ├── dashboard-data.ts     # Baseline types and mock models
│   │   └── utils.ts              # Styling and formatting utilities
│   ├── middleware.ts             # Edge authentication guard
│   ├── providers/                # Auth, Theme, Query, WebSocket, and Notification providers
│   ├── store/                    # Zustand persistent client store
│   └── types/                    # TypeScript domain definitions
└── tests/
    ├── components/               # React Testing Library component tests
    ├── e2e/                      # Playwright end-to-end specs
    └── unit/                     # Vitest unit test suites
```

---

## Environment Variables

Create a `.env.production` file in `apps/web`:

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `DATABASE_URL` | **Yes** | `"file:./dev.db"` | PostgreSQL connection string (or SQLite for dev) |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `http://localhost:3000` | Canonical public URL of the application |
| `NEXT_PUBLIC_API_URL` | No | `""` (same origin) | Remote API URL if backend is decoupled |
| `NEXT_PUBLIC_WS_URL` | No | `wss://...` | WebSocket streaming server endpoint |
| `JWT_SECRET` | **Yes** | — | Cryptographic secret for signing session tokens |
| `NODE_ENV` | **Yes** | `production` | Node environment flag |

---

## Role-Based Access Control (RBAC)

OpsMind ships with 4 first-class enterprise roles:

1. **Admin**:
   - Full read and write access across all operational rails.
   - Access to Organization Settings, Billing, API Key generation, Team Management, and Firewall Rules.
2. **Analyst**:
   - Access to Dashboard, Revenue, Forecast, and AI Copilot.
   - Settings, API Keys, and Team Management are automatically hidden.
3. **Support**:
   - Access to Orders management, Customer profiles, and Payment Retries.
   - Billing, API Keys, and Financial Forecasts are hidden.
4. **Viewer**:
   - Read-only overview access.
   - All mutation actions (Refund, Retry, Apply Rule, Invite Member) are disabled.

> **Role Switcher**: In development and staging, switch roles on the fly via the User Profile menu in the Top Navbar.

---

## Realtime WebSocket Infrastructure

The `OpsWebSocketClient` provides production streaming resilience:
- **Exponential Backoff Reconnect**: Automatically recovers from dropped connections with randomized jitter.
- **Heartbeat Ping/Pong**: Detects silent socket timeouts every 20 seconds.
- **Automatic Fallback Simulator**: If deployed without a standalone WS cluster, it falls back to a high-fidelity synthetic streaming rail.
- **Query Cache Invalidation**: Incoming events on `dashboard:metrics`, `fraud:alerts`, and `payments:status` update TanStack Query cache without page refresh.

---

## API Layer & State Management

All data fetching is abstracted through typed client classes:
```typescript
import { dashboardApi, fraudApi, paymentsApi, settingsApi } from "@/lib/api";

// Automatic retry with exponential backoff & typed response
const dashboardData = await dashboardApi.getDashboard("org_acme");
```

Settings forms are built with **React Hook Form** and validated with **Zod**:
```typescript
const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  title: z.string().min(2),
});
```

---

## Testing Strategy

### Unit Tests (Vitest)
Executes unit tests for API error parsing, retry wrappers, and RBAC matrix:
```bash
npm test
```

### End-to-End Tests (Playwright)
Executes critical user flows (Authentication, Route Guards, Command Palette, Notification Drawer):
```bash
npm run test:e2e
```

### Static Analysis
```bash
npm run lint
```

---

## Deployment Guide

### Vercel Deployment

1. Push your repository to GitHub / GitLab.
2. Import project into Vercel.
3. Set the Root Directory to `apps/web`.
4. Configure Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`).
5. Deploy. Turbopack will compile static and dynamic routes automatically.

### Docker & Containerized Cloud (AWS ECS / Cloud Run)

Create a `Dockerfile` at the root of `apps/web`:
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
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t opsmind-web .
docker run -p 3000:3000 -e JWT_SECRET="your-secret" opsmind-web
```

### Bare Metal / PM2 + Nginx

1. Build production bundle:
   ```bash
   npm run build
   ```
2. Start process with PM2:
   ```bash
   pm2 start npm --name "opsmind-web" -- start
   ```
3. Configure Nginx reverse proxy with SSL termination and WebSocket upgrade headers:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name app.opsmind.io;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
