# Waiting Room

A full-stack electronic medical record application built with TypeScript. Patients can be browsed, their medical entries viewed in detail, and new entries added through a structured form. The project covers a realistic separation of concerns between a REST API backend and a React frontend, with strict runtime validation at the API boundary.

## Features

- View a list of patients with name, gender, and occupation
- View individual patient pages with full details and medical history
- Three entry types with distinct visual treatment:
  - Health Check — with a heart-based health rating indicator
  - Hospital — with discharge date and criteria
  - Occupational Healthcare — with employer name and optional sick leave range
- Diagnosis codes displayed as chips with tooltips showing the full diagnosis name
- Add new medical entries through a dynamic form that adapts to the selected entry type
- Input validation on both client and server with error feedback surfaced to the user
- Date pickers, a health rating select, and a multi-select for diagnosis codes

## Tech Stack

**Backend**

- Node.js with Express 5
- TypeScript (run directly via `--experimental-transform-types`, no separate compile step)
- Zod for runtime schema validation of all incoming request bodies

**Frontend**

- React 19 with TypeScript
- Vite
- Material UI (MUI v7) for components and layout
- Axios for HTTP requests
- React Router v7

## Project Structure

```
waiting-room/
  backend/
    data/             # In-memory seed data (patients, diagnoses)
    src/
      routes/         # Express route handlers
      services/       # Business logic layer
      middleware.ts   # Zod parsing and error middleware
      types.ts        # Shared types and Zod schemas
      index.ts        # Server entry point
  frontend/
    src/
      components/
        AddEntryForm/       # Dynamic entry creation form
        AddPatientModal/    # Modal with patient creation form
        PatientListPage/    # Patient table with add-patient action
        PatientPage/        # Patient detail view with entry cards
      services/             # Axios wrappers for API calls
      types.ts              # Shared TypeScript types
      App.tsx               # Root component with routing
```

## Getting Started

### Prerequisites

- Node.js 22 or later

### Backend

```bash
cd backend
npm install
npm run dev
```

The API server starts on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server starts on `http://localhost:5173`. All `/api` requests are proxied to the backend.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/ping` | Health check |
| GET | `/api/diagnoses` | List all diagnoses |
| GET | `/api/patients` | List all patients (SSN and entries omitted) |
| POST | `/api/patients` | Add a new patient |
| GET | `/api/patients/:id` | Get a single patient with full entry history |
| POST | `/api/patients/:id/entries` | Add a medical entry to a patient |

All `POST` endpoints validate the request body with Zod and return structured error messages on failure.

## Data Model

Medical entries use a discriminated union on the `type` field:

```typescript
type Entry = HealthCheckEntry | HospitalEntry | OccupationalHealthcareEntry;
```

The frontend mirrors this union and uses exhaustive switch-case rendering with a compile-time `assertNever` guard, ensuring new entry types cannot be silently unhandled.
