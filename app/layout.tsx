import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Box AI Tutor',
  description: 'Box AI Tutor web (Next.js + App Router)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
