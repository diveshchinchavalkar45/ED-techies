# Supabase Database Setup Guide

This directory contains the database migration scripts and seed data for **TeamSync AI**.

---

## 🚀 Quick Setup (3 Steps in Supabase)

### Step 1: Open Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Open your project dashboard (or create a new project called `teamsync-ai`).

### Step 2: Run the Schema
1. In the left navigation, click on **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the entire contents of [`schema.sql`](./schema.sql).
4. Click **Run** (or `Ctrl`+`Enter`).
   - This creates tables: `projects`, `students`, `teams`, `team_members` and configures Row Level Security (RLS) policies and indexes.

### Step 3: Run the Seed Data (Optional for Demo)
1. In the **SQL Editor**, open another new query.
2. Copy and paste the contents of [`seed.sql`](./seed.sql).
3. Click **Run**.
   - This inserts the default `Smart Campus Assistant` project and 12 sample students.

---

## 🔑 Locating Your Supabase Credentials

In your Supabase dashboard:
1. Navigate to **Project Settings** (gear icon in left sidebar) ➔ **API** (or **Data API**).
2. You will find:
   - **Project URL:** `https://xxxxxxxxxxxx.supabase.co`
   - **Anon (Public) Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role (Secret) Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Click *Reveal* - keep this secret for the backend!)

---

## 📋 Environment Variables Mapping

| Key in Supabase | Backend (`backend/.env`) | Frontend (`frontend/.env`) |
| :--- | :--- | :--- |
| **Project URL** | `SUPABASE_URL` | `VITE_SUPABASE_URL` |
| **Anon Public Key** | `SUPABASE_ANON_KEY` | `VITE_SUPABASE_ANON_KEY` |
| **Service Role Key** | `SUPABASE_SERVICE_ROLE_KEY` | *(Never expose on frontend)* |
