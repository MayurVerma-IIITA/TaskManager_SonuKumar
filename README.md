# Task Manager Kanban App

A production-ready full-stack Task Manager application for the intern assignment. Authenticated users can register, log in, and manage their own tasks across a Kanban board with three stages: Todo, In Progress, and Done.

The app is split into two deployable projects:

- `client` - React, Vite, Tailwind CSS frontend
- `server` - Node.js, Express, Prisma, PostgreSQL REST API

## Live Links

- Frontend: https://client-liart-nine-79.vercel.app
- Backend: https://task-manager-api-production-1765.up.railway.app

## Screenshots

Add screenshots here after local testing or deployment.

## Features

- User registration, login, logout, and protected routes
- JWT authentication with password hashing via bcryptjs
- Persisted task data in PostgreSQL through Prisma ORM
- Kanban board with Todo, In Progress, and Done columns
- Drag and drop task movement with optimistic UI updates
- Create, edit, and delete task workflows
- Field-level backend validation with `422` responses
- Toast notifications for task actions and API errors
- Responsive light-theme UI built with Tailwind CSS
- Scoped task queries so users only access their own tasks
- Vercel frontend config and Railway backend start config

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router v6, Axios, @hello-pangea/dnd, React Hot Toast |
| Backend | Node.js, Express, Prisma ORM, JWT, bcryptjs, express-validator, cors, dotenv |
| Database | PostgreSQL hosted on Neon |
| Deployment | Vercel for frontend, Railway for backend, Neon for database |

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Update `server/.env`:

```env
DATABASE_URL="your-neon-postgresql-url"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run Prisma migration and start the API:

```bash
npx prisma migrate dev --name init
npm run dev
```

The backend runs at `http://localhost:5000`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## API Documentation

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Register a new user and return `{ token, user }` |
| `POST` | `/api/auth/login` | No | Log in and return `{ token, user }` |
| `GET` | `/api/auth/me` | Yes | Return the currently authenticated user |
| `GET` | `/api/tasks` | Yes | Fetch all tasks for the logged-in user |
| `POST` | `/api/tasks` | Yes | Create a task with `{ title, description?, stage? }` |
| `PUT` | `/api/tasks/:id` | Yes | Update a task with `{ title?, description?, stage? }` |
| `DELETE` | `/api/tasks/:id` | Yes | Delete a task and return `204 No Content` |

## Deployment

### Frontend on Vercel

The `client/vercel.json` file rewrites all routes to `index.html` for React Router support.

Set this environment variable in the Vercel dashboard:

```env
VITE_API_URL=https://your-railway-backend-url
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

### Backend on Railway

Railway can use the included `server/Procfile`:

```text
web: node src/server.js
```

Set these environment variables in the Railway dashboard:

```env
DATABASE_URL=your-neon-pooled-connection-url
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://your-vercel-frontend-url
```

On first production deploy, run:

```bash
npx prisma migrate deploy
```

### Database on Neon

Create a PostgreSQL database in Neon and use the connection pooling URL for `DATABASE_URL` in production. Use the direct connection string locally if preferred for migrations.

## Assumptions & Tradeoffs

- JWT was used instead of server sessions because it keeps the API stateless and simple to deploy on Railway.
- PostgreSQL with Prisma was chosen because it provides reliable relational persistence, type-safe data access, and easy migrations.
- A Kanban layout matches the assignment workflow and gives users a clear visual model of task progress.
- Drag and drop uses optimistic UI updates so movement feels instant; if the API update fails, the UI reverts and shows an error toast.
- With more time, useful additions would include due dates, priorities, search, labels, team sharing, activity history, pagination, and automated tests.

## AI Tools Disclosure

This project was generated with assistance from OpenAI Codex as a development tool. The backend, frontend, configuration files, and README were implemented according to the assignment requirements, including the required REST API, Prisma schema, JWT authentication, protected task operations, and deployment-ready project structure.
