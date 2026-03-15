'use client'

import Link from 'next/link'
import { HelpCircle, User, LogOut, ChevronDown, Package } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : ''

  return (
    <header className="border-b border-border bg-bg-surface">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-fg-primary hover:opacity-80 transition-opacity">
          <span className="font-display text-xl">Kasasagi</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/faq"
            className="flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg-primary transition-colors"
          >
            <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Help Center</span>
          </Link>

          {isAuthenticated && currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full text-sm text-fg-secondary hover:text-fg-primary transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-medium">
                  {initials}
                </span>
                <span className="hidden sm:inline">{currentUser.firstName}</span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-bg-surface shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-fg-primary truncate">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-fg-muted truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:bg-bg-surface-2 transition-colors"
                    >
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      My Profile
                    </Link>
                    <Link
                      href="/profile/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:bg-bg-surface-2 transition-colors"
                    >
                      <Package className="h-4 w-4" strokeWidth={1.5} />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:bg-bg-surface-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.5} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg-primary transition-colors"
            >
              <User className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Log in</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
