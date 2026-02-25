# Fight Corner Coach

Voice-first boxing coach with camera preview, drill timers, and API key inputs for **Mistral** (vision analysis) and **ElevenLabs** (voice feedback).

## Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **Voice**: ElevenLabs API (client key entry)
- **Vision/AI**: Mistral API (client key entry)
- **Deployment**: Vercel-ready

## Features
- Voice-first training flow with drill sequencing
- Camera preview with stance grid overlay
- In-session timer + drill tips
- Local API key entry (stored in `sessionStorage`)

## Project Structure
```
app/
├── page.tsx              # Main entry
├── layout.tsx            # Root layout
├── globals.css           # Tailwind + custom styles
└── components/
    ├── ApiKeyInput.tsx   # Mistral + ElevenLabs key form
    ├── CameraFeed.tsx    # Camera preview + frame capture loop
    ├── VoiceCoach.tsx    # Main coaching UI
    ├── DrillCard.tsx     # Drill display
    ├── SessionTimer.tsx  # Training timer
    └── VoiceWave.tsx     # Voice activity visualization
```

## Getting Started
```bash
npm install
npm run dev
```

## Environment Variables
This app expects keys to be entered in the UI. For hosting convenience, you can also provide defaults via:
```
NEXT_PUBLIC_MISTRAL_API_KEY=
NEXT_PUBLIC_ELEVENLABS_API_KEY=
```

## Deployment
- **Vercel**: import the repo, set env vars (optional), deploy.
- **Node**: `npm run build && npm start`

---
Built for the Mistral Iterate Hackathon.
