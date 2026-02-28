'use client';

import ImageCarousel, { FOOTER_IMAGES } from './ImageCarousel';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[color:var(--border)]">
      {/* Carousel section */}
      <div className="max-w-full overflow-hidden">
        <ImageCarousel direction="left" images={FOOTER_IMAGES} />
      </div>

      {/* Credits bar */}
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-boxing-red flex items-center justify-center">
            <span className="text-base font-black text-white">B</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--text)]">Box AI Tutor</p>
            <p className="text-xs text-[color:var(--muted)]">AI-powered boxing coach</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-[color:var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-boxing-red" />
            Mistral AI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            ElevenLabs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Next.js + Vercel
          </span>
        </div>

        <p className="text-xs text-[color:var(--muted)]">
          Built for Mistral Worldwide Hackathon 2026
        </p>
      </div>
    </footer>
  );
}
