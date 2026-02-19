# OptiSchedule API

Backend API for OptiSchedule Pro, built with Node.js, Express, and Prisma.

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)

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

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root.

3. Add the required environment variables:

   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public
   JWT_SECRET=your_jwt_secret_at_least_32_characters
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   CORS_ORIGIN=http://localhost:3000
   ```

4. Run Prisma migrations and generate the client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. (Optional) Seed demo data:

   ```bash
   node seed.js
   ```

## Running the API

- Development:

  ```bash
  npm run dev
  ```

- Production:

  ```bash
  npm start
  ```

The server runs on `PORT` (default: `4000`).

## Available Routes

Base URL: `http://localhost:4000`

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
