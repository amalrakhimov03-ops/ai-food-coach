"use client"

import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/25">
            <svg
              className="h-5 w-5 text-accent-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-foreground">AI Food Coach</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Возможности
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Как это работает
          </a>
          <a
            href="#stats"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Статистика
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-px"
          >
            Начать бесплатно
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 text-foreground transition-colors hover:bg-muted/50 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-lg px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Возможности
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Как это работает
            </a>
            <a
              href="#stats"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Статистика
            </a>
            <div className="flex flex-col gap-3 pt-5 border-t border-border/60">
              <Link
                href="/login"
                className="rounded-xl border border-border/60 px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
