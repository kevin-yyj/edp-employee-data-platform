# EDP Employee Data Platform (MVP)

This project now includes:
- Vite + React frontend
- Vercel Functions backend (`/api/*`)
- Supabase data model (schema + seed + RLS)
- Coze AI assistant embedding on the AI page

## 1) Local development

1. Install dependencies
   - `npm install`
2. Copy env file
   - `cp .env.example .env.local`
3. Start frontend
   - `npm run dev`

## 2) Supabase initialization

Run SQL in Supabase SQL Editor in this order:
1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/seed.sql`](supabase/seed.sql)

## 3) Required environment variables

Set these in `.env.local` (local) and Vercel Project Settings (production):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_COZE_BOT_ID`
- `VITE_COZE_BASE_URL` (optional, default `https://www.coze.cn`)

## 4) Authentication notes

Vercel Functions require Supabase JWT in `Authorization: Bearer <token>`.

For local quick testing, set token in browser console:
- `localStorage.setItem("edp_access_token", "<your_supabase_access_token>")`

## 5) Vercel deployment

1. Push repo to GitHub.
2. Import repo in Vercel.
3. Add environment variables above.
4. Deploy.

`vercel.json` already includes SPA rewrite configuration for frontend routing.
