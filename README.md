# Next Todo

A Next.js Todo application with PostgreSQL integration.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Design Pattern](#design-pattern)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)

---

## Features

- Next.js frontend and API routes
- PostgreSQL database for persistent storage
- RESTful API design

## Project Structure

```
next-todo/
├── app/                # Next.js App Router (pages, layouts, API routes)
│   └── api/            # API route handlers
├── components/         # Reusable React components
├── db/                 # Database connection and queries
├── models/             # Data models (e.g., User, Todo)
├── public/             # Static assets
├── styles/             # CSS/SCSS files
├── package.json
├── tsconfig.json
└── README.md
```

## Design Pattern

This project uses a **modular structure** with separation of concerns:

- **App Router:** All routing and API logic in `app/` and `app/api/`.
- **Components:** UI elements in `components/`.
- **Database Layer:** Connection and queries in `db/`.
- **Models:** Data schema and validation in `models/`.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/next-todo.git
   cd next-todo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Database Setup

1. **Ensure PostgreSQL is installed and running.**

2. **Create the database:**
   ```bash
   createdb -U postgres -h localhost -p 5432 nextdb
   ```

3. **Configure environment variables:**

   Create a `.env.local` file in the root directory:

   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nextdb
   ```

4. **Run migrations (if using Prisma or similar):**
   ```bash
   
    npx prisma init
    npx prisma migrate dev --name init
    npx prisma db seed
    npx prisma generate
   npx prisma migrate dev
   ```

## Running the Project

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
## Project Layer
---

| Layer        | What it does               | Reusability                  | Focus         |
| ------------ | -------------------------- | ---------------------------- | ------------- |
| `repository` | Pure Prisma queries        | ✅ Reusable across services   | 💾 DB logic   |
| `service`    | Business rules             | ✅ Reusable across APIs/pages | 🧠 App logic  |
| `api route`  | HTTP request/response only | ❌ Only used once             | 🌐 Networking |


## License

MIT