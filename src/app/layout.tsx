import type { Metadata } from 'next'
import { dmSerifDisplay, dmSans, jetBrainsMono } from '@/lib/fonts'
import { PageShell } from '@/components/layout/PageShell'
import { ToastProvider } from '@/components/ui/Toast'
import { ChatButton } from '@/components/chat/ChatButton'
import { ChatWindow } from '@/components/chat/ChatWindow'
import './globals.css'

export const metadata: Metadata = {
  title: 'Help Center — Kasasagi',
  description: 'Get help with your Kasasagi order. Track packages, start returns, file claims, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <ToastProvider>
          <PageShell>{children}</PageShell>
          <ChatButton />
          <ChatWindow />
        </ToastProvider>
      </body>
    </html>
  )
}
