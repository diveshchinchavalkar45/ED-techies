# TeamSync AI — Full-Stack Architecture

> **Smart teams. Better projects.**  
> Autonomous student project team formation and lifecycle coaching platform.

---

## 🗂️ Project Structure

The project has been segregated into three clean, independent directories:

```
teamsync-ai/
│
├── 📂 frontend/        ➔ React 19 + TypeScript + Vite + Tailwind CSS (Deploy on Vercel)
│   ├── src/            # UI components, lifecycle views, AI coach panel, Supabase client
│   ├── public/         # Icons and static brand assets
│   ├── vercel.json     # SPA routing configuration for Vercel
│   ├── .env.example    # Frontend environment template
│   └── package.json    # Frontend dependencies & scripts
│
├── 📂 backend/         ➔ Node.js + Express + TypeScript (Deploy on Render)
│   ├── src/            # REST API routes, Team Balancer engine, Supabase admin client
│   ├── render.yaml     # Render blueprint deployment configuration
│   ├── .env.example    # Backend environment template
│   └── package.json    # Backend dependencies & scripts
│
└── 📂 database/        ➔ Supabase PostgreSQL (Database Cloud)
    ├── schema.sql      # Tables (projects, students, teams, team_members), RLS policies & indexes
    ├── seed.sql        # Demo data (Smart Campus Assistant with 12 students & balanced teams)
    └── README.md       # Step-by-step Supabase setup guide
```

---

## 🚀 Quick Setup & Deployment Guide

### 1️⃣ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase project dashboard.
3. Run the SQL script from [`database/schema.sql`](./database/schema.sql) to create the schema and security policies.
4. *(Optional)* Run [`database/seed.sql`](./database/seed.sql) to populate demo students.
5. In **Project Settings ➔ API**, note your credentials:
   * **Project URL:** `https://your-project-id.supabase.co`
   * **Anon (Public) Key:** `eyJhbGciOiJIUzI1NiIsInR...`
   * **Service Role (Secret) Key:** `eyJhbGciOiJIUzI1NiIsInR...` *(Click Reveal)*

---

### 2️⃣ Backend Deployment on Render

1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New + ➔ Web Service** and connect your GitHub repository.
4. Configure the service:
   * **Name:** `teamsync-ai-backend`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   * `PORT`: `10000`
   * `SUPABASE_URL`: *(Your Supabase Project URL)*
   * `SUPABASE_SERVICE_ROLE_KEY`: *(Your Supabase Service Role Secret Key)*
   * `SUPABASE_ANON_KEY`: *(Your Supabase Anon Public Key)*
   * `FRONTEND_URL`: `https://your-frontend.vercel.app` *(or `*` for all origins)*
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://teamsync-ai-backend.onrender.com`).
   * Test health check: `https://teamsync-ai-backend.onrender.com/api/health`

---

### 3️⃣ Frontend Deployment on Vercel

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New ➔ Project** and import your GitHub repository.
3. In project settings:
   * **Framework Preset:** `Vite`
   * **Root Directory:** Click *Edit* and select `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. In **Environment Variables**, add:
   * `VITE_API_URL`: *(Your Render backend URL, e.g. `https://teamsync-ai-backend.onrender.com`)*
   * `VITE_SUPABASE_URL`: *(Your Supabase Project URL)*
   * `VITE_SUPABASE_ANON_KEY`: *(Your Supabase Anon Public Key)*
5. Click **Deploy**.

---

## 💻 Local Development

### Run Backend
```bash
cd backend
npm install
# Create .env from .env.example
npm run dev
# Server running at http://localhost:5000
```

### Run Frontend
```bash
cd frontend
npm install
# Create .env from .env.example
npm run dev
# Client running at http://localhost:5173
```
