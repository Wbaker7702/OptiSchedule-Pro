# OptiSchedule API

Backend API for OptiSchedule Pro, built with Node.js, Express, and Prisma.

## What is OptiSchedule Pro?

OptiSchedule Pro is a scheduling and labor-compliance platform.
It helps teams build shifts with clear, policy-aware decisions so schedules can be created faster and with fewer manual checks.

## What it can do

- Manage core scheduling data for stores, employees, and shifts
- Evaluate shifts against state-specific labor rules (currently Michigan and Florida rule engines are included)
- Support secure auth workflows with JWT-based login/register routes
- Provide API endpoints for shift operations and service health monitoring

## How quick it can do it

OptiSchedule Pro is designed for near real-time scheduling feedback:

- Core API calls are lightweight and return quickly under normal load
- Compliance checks run in-request using rule logic, so teams get immediate pass/fail feedback
- Typical single-shift validation workflows are intended to complete in seconds, not minutes

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
   JWT_SECRET="replace-with-a-secure-secret"
   ```

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. (Optional for first-time DB setup) Run migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

## Running the API

- Development mode:

  ```bash
  npm run dev
  ```

- Production mode:

  ```bash
  npm start
  ```

Server default: `http://localhost:4000`

## Project Structure

```text
.
├── config/
│   └── env.js
├── middleware/
│   └── auth.js
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── routes/
│   ├── auth.js
│   └── shifts.js
├── rules/
│   ├── index.js
│   ├── MI.js
│   ├── mi.js
│   └── server.js
├── server.js
├── seed.js
└── FL.js
```

## Available Routes

Route paths (base URL is environment-specific):

- `GET /health`
  Returns API health status.

- `GET /api/protected`
  Test protected route response.

- `GET /api/shifts/test`
  Test shift route wiring.

- `POST /api/shifts`
  Echo endpoint for shift POST payload testing.

## Notes

- `routes/auth.js` and `middleware/auth.js` are present, but auth routes are not currently mounted in `server.js`.
- State compliance rule engines are located in `rules/` (for example, `MI.js` and `FL.js`).
