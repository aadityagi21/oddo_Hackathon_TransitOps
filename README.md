# TransitOps – Smart Transport Operations Platform

Enterprise fleet and transport management platform built with the MERN stack.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Recharts
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcrypt (Phase 2+)

## Project Structure

```
transitops/
├── backend/    # Express API server
└── frontend/   # React Vite app
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

## Development Phases

1. ✅ Project setup & scaffolding
2. Authentication & RBAC
3. Vehicle & Driver modules
4. Trip management (core business rules)
5. Maintenance, Fuel & Expenses
6. Dashboard & Reports
