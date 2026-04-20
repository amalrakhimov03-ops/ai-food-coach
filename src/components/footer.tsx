import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
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
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Персональный AI-ассистент для контроля питания. Отправляй еду текстом или голосом, получай мгновенный анализ и рекомендации.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Продукт</h4>
            <ul className="mt-5 space-y-4">
              <li>
                <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Как это работает
                </a>
              </li>
              <li>
                <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Статистика
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Связь</h4>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href="https://t.me/ai_coach_hse_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Telegram Bot
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Web App
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2024 AI Food Coach. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/ai_coach_hse_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-all hover:bg-[#229ED9]/10 hover:border-[#229ED9]/30 hover:text-[#229ED9]"
              aria-label="Telegram"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.73 6.65-2.87 7.97-3.43 3.8-1.57 4.59-1.84 5.1-1.85.11 0 .37.03.53.14.14.1.18.23.2.33-.01.06.01.24 0 .38z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
