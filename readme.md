# OptiSchedule API

Backend API for the OptiSchedule Pro scheduling platform.

## Tech Stack

- Node.js
- Express
- Prisma
- PostgreSQL
- JWT (authentication utilities)

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

## Available Routes

- `GET /health` - Health check endpoint.
- `GET /api/protected` - Test protected route placeholder.
- `GET /api/shifts/test` - Shift route test endpoint.
- `POST /api/shifts` - Shift route POST test endpoint.

## Project Structure

```text
.
├── middleware/
├── prisma/
├── routes/
├── server.js
└── package.json
```
