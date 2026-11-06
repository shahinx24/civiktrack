# CivicTrack — Community Issue Reporting & Municipal Tracking Platform

CivicTrack is a modern, responsive, production-quality civic-tech frontend built to empower community residents, municipal authorities, department officers, and city administrators to report, triage, track, and resolve local civic issues with transparent accountability.

---

## Key Highlights

- **Frontend-First Architecture**: Built on Next.js 16 (App Router), TypeScript 5, and Tailwind CSS v4.
- **Role-Based Portals**:
  - **Public Citizen**: Browse public issues, search by category/ward, inspect transparent resolution timelines.
  - **Resident Portal**: Geo-tagged issue submission, photo attachments, personal report dashboard, status tracking.
  - **Authority Administrator**: Triage incoming reports, assign issues to departments and officers, manage SLA compliance.
  - **Department Field Officer**: Field work log, update status to *In Progress* or *Resolved*, upload resolution proofs.
  - **System Administrator**: Comprehensive Recharts analytics, department management, user directory, and civic audit reports.
- **Design System**: Tailored civic aesthetic utilizing Deep Navy (`#0F172A`), Slate, and vibrant Teal (`#0D9488`), with subtle shadows, crisp typography, and full mobile responsiveness.
- **Backend-Ready Service Layer**: Pure frontend with realistic mock data driven through an Axios abstraction layer, ready to point to a production REST/GraphQL API.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.4.3 (App Router, Turbopack) |
| **Language** | TypeScript (Strict mode, no `any`) |
| **Styling** | Tailwind CSS v4, `@theme` tokens |
| **UI Components** | Lucide React, Custom Atomic Design Kit |
| **Forms & Validation** | React Hook Form, Zod (`@hookform/resolvers`) |
| **Service Layer** | Axios Client with Mock Service Adapters |
| **Data Visualization** | Recharts |

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation & Development Run

```bash
# Navigate to the project directory
cd project

# Install dependencies (already pre-configured)
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

### Production Build

```bash
cd project
npm run build
npm run start
```

---

## Project Structure

For full details on directory layout, architectural boundaries, and design tokens, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

For current development milestones and roadmap, see [`PROJECT_PROGRESS.md`](PROJECT_PROGRESS.md).
