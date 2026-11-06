# CivicTrack — System Architecture & Design Specification

CivicTrack is a modern, responsive, accessible civic-tech platform that connects residents, municipal authorities, department field officers, and city administrators.

---

## 1. Technical Stack & Architecture

- **Framework**: Next.js 16+ (App Router, Server Components & Client Boundaries)
- **Language**: TypeScript 5 (Strict type checking, zero `any`)
- **Styling**: Tailwind CSS v4 + Custom Civic Design Tokens (`globals.css`)
- **Icons**: Lucide React
- **Form Management & Validation**: React Hook Form + Zod (`@hookform/resolvers`)
- **Data Fetching & API Service Layer**: Axios (configured with mock adapter for frontend execution, structured for seamless backend plug-and-play)
- **Data Visualization**: Recharts (Monthly Intake Trajectory, Domain Category Breakdown)

---

## 2. Design System & Tokens

### Color Palette
- **Primary Navy**: `#0F172A` (Slate 900) & `#0A1128` (Navy 950) — Authoritative, stable, trustworthy civic presence.
- **Teal / Emerald Accent**: `#0D9488` (Teal 600) & `#14B8A6` (Teal 500) — Clear, modern, positive civic engagement.
- **Surface**: `#F8FAFC` (Slate 50) & `#FFFFFF` (Crisp White).
- **Status Semantic Palette**:
  - `Submitted`: Amber (`bg-amber-50 text-amber-800 border-amber-200`)
  - `Under Review`: Blue (`bg-blue-50 text-blue-800 border-blue-200`)
  - `In Progress`: Indigo (`bg-indigo-50 text-indigo-800 border-indigo-200`)
  - `Resolved`: Emerald (`bg-emerald-50 text-emerald-800 border-emerald-200`)
  - `Rejected`: Slate (`bg-slate-100 text-slate-700 border-slate-300`)

### Typography & Spacing
- Variable fonts: Geist Sans & Geist Mono.
- 4px baseline grid, consistent border-radius (`0.5rem` - `0.75rem`), subtle borders (`1px solid #E2E8F0`).

---

## 3. Directory Architecture

```
CivicTrack/
├── README.md
├── PROJECT_PROGRESS.md
├── docs/
│   └── ARCHITECTURE.md
└── project/
    ├── app/
    │   ├── layout.tsx                  # Root layout & font injection
    │   ├── page.tsx                    # Landing / community homepage
    │   ├── globals.css                 # CSS variables & theme tokens
    │   ├── (public)/                   # Unauthenticated public portal
    │   │   ├── about/page.tsx          # Municipal mission & FAQ
    │   │   └── issues/
    │   │       ├── page.tsx            # Public issue directory & search
    │   │       └── [id]/page.tsx       # Public issue tracker & details
    │   ├── (auth)/                     # Auth & onboarding
    │   │   ├── login/page.tsx          # 1-Click demo role switcher
    │   │   ├── register/page.tsx       # Resident signup
    │   │   └── forgot-password/page.tsx # Password reset
    │   ├── resident/                   # Resident self-service portal
    │   │   ├── dashboard/page.tsx      # Personal summary & quick report
    │   │   ├── report-issue/page.tsx   # Validated issue submission form
    │   │   ├── my-reports/page.tsx     # My reports tracking list
    │   │   └── profile/page.tsx        # Profile & notification preferences
    │   ├── authority/                  # Municipal administration portal
    │   │   ├── dashboard/page.tsx      # Triage queue & department workload
    │   │   ├── assigned-issues/page.tsx # Full municipal dispatch table
    │   │   └── profile/page.tsx        # Administrator credentials
    │   ├── officer/                    # Field officer task hub
    │   │   ├── dashboard/page.tsx      # Field tasks & equipment status
    │   │   ├── department-issues/page.tsx # Department worklist
    │   │   └── profile/page.tsx        # Officer vehicle & credentials
    │   └── admin/                      # System administration
    │       ├── dashboard/page.tsx      # Recharts analytics & KPIs
    │       ├── users/page.tsx          # User directory & role modifier
    │       ├── departments/page.tsx    # Department SLA configurations
    │       ├── reports/page.tsx        # Audit log & CSV exporter
    │       └── settings/page.tsx       # Global municipal parameters
    ├── components/
    │   ├── ui/                         # Button, Badge, Card, Input, Textarea, Select, Modal, StatusPill, EmptyState, Skeleton, Alert, Tabs, Avatar
    │   ├── layout/                     # Navbar, Footer, Sidebar, DashboardHeader, DashboardLayoutShell
    │   ├── common/                     # Breadcrumbs, StatCard, PageHeader
    │   ├── issues/                     # IssueCard, IssueFiltersBar, IssueTimeline, IssueDetailView
    │   ├── forms/                      # AssignOfficerModal, StatusUpdateModal
    │   └── charts/                     # MonthlyTrendChart, CategoryDistributionChart
    ├── constants/                      # Statuses, Categories, Navigation items
    ├── hooks/                          # useIssues, useAuth, useDebounce
    ├── lib/                            # utils.ts (`cn()`, date & relative formatters)
    ├── mock/                           # issues.ts, users.ts, departments.ts, analytics.ts
    ├── services/                       # api-client.ts, issue-service.ts, auth-service.ts, department-service.ts, analytics-service.ts
    └── types/                          # issue.ts, user.ts, department.ts, common.ts
```

---

## 4. Role-Based Access & Perspectives

1. **Public Citizen / Guest**: Explores community issues, searches issues by category/ward/status, views resolution transparency timelines.
2. **Resident (Alex Morgan)**: Submits geo-located issue reports with photo attachments, tracks report status history, receives updates, upvotes local issues.
3. **Authority Administrator (Marcus Vance)**: Triage center, reviews incoming submissions, assigns reports to specific municipal departments and officers, flags duplicates, manages SLAs.
4. **Field Department Officer (Elena Rostova)**: Receives department assignments, updates field progress, posts work notes, attaches resolution verification proofs.
5. **System Administrator (Sarah Jenkins)**: Oversees city-wide analytics, department workload distribution, user directory, audit trails, and system settings.

---

## 5. Backend-Ready Service Layer

The frontend communicates with a standardized service layer (`services/issue-service.ts`, `services/user-service.ts`, `services/analytics-service.ts`). When a real Node.js or REST/GraphQL backend is deployed, only `services/api-client.ts` needs endpoint redirection. No component rewrite is required.
