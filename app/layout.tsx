import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fight Corner Coach',
  description: 'AI-powered voice boxing coach',
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
