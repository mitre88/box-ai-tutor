import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Box AI Tutor — Your AI Boxing Coach',
  description: 'Real-time form analysis, voice coaching, and structured drills powered by Mistral AI and ElevenLabs.',
  openGraph: {
    title: 'Box AI Tutor',
    description: 'Your AI Boxing Coach — Real-time form analysis, voice coaching, and structured drills.',
    siteName: 'Box AI Tutor',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
