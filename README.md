# Box AI Tutor (web)

Voice-first boxing coach web app (hackathon build). Uses **camera preview** in the browser + **Mistral** (reasoning/coaching) + **ElevenLabs** (voice).

## Stack
- Next.js (App Router)
- Tailwind CSS
- Deploy: Vercel

## What’s included (current)
- **Key setup** page (Mistral + ElevenLabs)
  - Keys stored in the browser via `sessionStorage`
  - Optional defaults via `.env` for convenience
- **Camera preview** (`getUserMedia`) for laptop/desktop/mobile
- **Session** page (start/stop timer) + live camera component hook
- **Summary** stub page
- **API routes** for key validation (server-side checks)
  - `POST /api/mistral/test` with `{ "key": "..." }`
  - `POST /api/elevenlabs/test` with `{ "key": "..." }`
- **i18n scaffolding** with locales: **EN/ES/FR** (`/en`, `/es`, `/fr`)

## Routes
- `/{locale}/setup`
- `/{locale}/camera`
- `/{locale}/session`
- `/{locale}/summary`

Locales: `en`, `es`, `fr`.

## Running locally
```bash
npm install
npm run dev
```
Open: http://localhost:3000

## Deploying to Vercel
Import the repo in Vercel → deploy (standard Next.js).

## Environment variables
See `.env.example` (optional).
