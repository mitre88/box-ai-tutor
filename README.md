# Fight Corner Coach

Voice-first AI boxing coach for Mistral Iterate Hackathon.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Voice**: ElevenLabs API
- **AI**: Mistral API (user-provided key)
- **Deployment**: Vercel

## Features
- API key input on first launch
- Voice-guided training sessions
- Real-time audio streaming
- Session summaries
- "Next drill" recommendations

## Project Structure
```
app/
├── page.tsx              # Main entry
├── layout.tsx            # Root layout
├── globals.css           # Tailwind + custom styles
├── components/
│   ├── ApiKeyInput.tsx   # Mistral key setup
│   ├── VoiceCoach.tsx    # Main voice interface
│   ├── SessionTimer.tsx  # Training timer
│   ├── DrillCard.tsx     # Exercise display
│   └── SummaryView.tsx   # Post-session recap
├── hooks/
│   ├── useElevenLabs.ts  # Voice synthesis
│   └── useMistral.ts     # AI coaching logic
└── lib/
    ├── elevenlabs.ts     # Voice API client
    └── mistral.ts        # Mistral API client
```

## Design System
- **Dark theme**: #0a0a0c background
- **Accent**: #ff2d2d (boxing red)
- **Voice wave**: Animated audio visualization
- **Glass cards**: backdrop-blur effects

## Getting Started
```bash
npm install
npm run dev
```

## Environment Variables
```
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key
```

Note: Mistral API key is entered by user in the app.
