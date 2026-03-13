import { Header } from './Header'
import { Footer } from './Footer'

interface PageShellProps {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
