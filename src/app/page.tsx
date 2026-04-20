'use client'

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  // Трекаем просмотр страницы при загрузке
  useEffect(() => {
    trackEvent('landing_view', { 
      referrer: document.referrer 
    })
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-gradient" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 h-80 w-80 rounded-full bg-accent/8 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 h-96 w-96 rounded-full bg-accent/5 blur-[120px] animate-pulse-glow animation-delay-200" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2.5 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-sm font-medium text-accent">AI-Powered Nutrition Assistant</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
              <span className="block text-balance">Самый быстрый способ</span>
              <span className="block gradient-text mt-2">контролировать питание</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground animate-slide-up animation-delay-100">
              Отправь фото или опиши еду голосом в Telegram. AI мгновенно рассчитает калории, БЖУ и даст персональные рекомендации для достижения твоих целей.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up animation-delay-200">
              <Link
                href="/register"
                onClick={() => trackEvent('cta_click', { location: 'hero', target: 'register' })}
                className="group flex items-center gap-2.5 rounded-2xl bg-accent px-7 py-4 text-base font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
              >
                Начать бесплатно
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <a
                href="https://t.me/ai_coach_hse_bot"
                onClick={() => trackEvent('cta_click', { location: 'hero', target: 'telegram' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-card/50 px-7 py-4 text-base font-medium text-foreground transition-all hover:bg-muted hover:border-accent/30 hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5 text-[#229ED9]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.73 6.65-2.87 7.97-3.43 3.8-1.57 4.59-1.84 5.1-1.85.11 0 .37.03.53.14.14.1.18.23.2.33-.01.06.01.24 0 .38z" />
                </svg>
                Открыть в Telegram
              </a>
            </div>
          </div>

          {/* Hero Image / Preview */}
          <div className="relative mx-auto mt-20 max-w-5xl animate-slide-up animation-delay-300">
            <div className="rounded-3xl border border-border/60 bg-card/80 p-3 shadow-2xl shadow-accent/5">
              <div className="rounded-2xl bg-muted/50 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-accent/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Сегодня</p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">1,847</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">калорий</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Белки</p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                        <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">89g</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">из 120g цели</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-orange-500/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Приёмы пищи</p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
                        <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">4</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">записи сегодня</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Возможности</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Всё, что нужно для контроля питания
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              Мощные инструменты AI для простого и эффективного отслеживания вашего рациона
            </p>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                ),
                title: "Голосовой ввод",
                description: "Просто скажи, что ты съел. AI распознает речь и автоматически рассчитает все нутриенты.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                ),
                title: "AI-анализ Gemini",
                description: "Передовая модель Gemini анализирует еду, определяет продукты и точно рассчитывает калории.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                ),
                title: "Telegram интеграция",
                description: "Используй привычный Telegram для логирования. Отправляй текст, голос или фото еды.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: "Детальная статистика",
                description: "Отслеживай прогресс с помощью наглядных графиков и понятной аналитики по дням и неделям.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Персонализация",
                description: "Установи свои цели по калориям и БЖУ. AI адаптирует рекомендации под твой профиль.",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "История питания",
                description: "Полная история всех приёмов пищи с возможностью просмотра и анализа за любой период.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border/60 bg-card/50 p-7 transition-all duration-300 hover:border-accent/40 hover:bg-card hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-28 md:py-36 bg-card/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Как это работает</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Три простых шага к здоровому питанию
            </h2>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3 md:gap-12">
            {[
              {
                step: "01",
                title: "Отправь еду",
                description: "Опиши свой приём пищи текстом, голосовым сообщением или отправь фото в Telegram бота.",
              },
              {
                step: "02",
                title: "AI анализирует",
                description: "Gemini распознаёт продукты, рассчитывает калории, белки, жиры и углеводы.",
              },
              {
                step: "03",
                title: "Получи результат",
                description: "Мгновенный ответ с анализом и персональными рекомендациями прямо в Telegram.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group">
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-2xl font-bold text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent/20">
                  {item.step}
                </div>
                {index < 2 && (
                  <div className="absolute top-10 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-accent/40 to-transparent md:block" />
                )}
                <h3 className="mt-8 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-28 md:py-36">
        <div className="absolute inset-0 bg-radial-gradient opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Статистика</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Цифры, которые говорят сами за себя
            </h2>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10K+", label: "Пользователей" },
              { value: "500K+", label: "Записей о еде" },
              { value: "99.2%", label: "Точность AI" },
              { value: "< 3 сек", label: "Время ответа" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border/60 bg-card/50 p-8 text-center transition-all duration-300 hover:border-accent/40 hover:bg-card hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text transition-transform duration-300 group-hover:scale-105">{stat.value}</p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 md:py-36 bg-card/50 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Готов взять питание под контроль?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Присоединяйся к тысячам пользователей, которые уже используют AI Food Coach для достижения своих целей.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              onClick={() => trackEvent('cta_click', { location: 'footer', target: 'register' })}
              className="group flex items-center gap-2.5 rounded-2xl bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              Создать аккаунт бесплатно
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="https://t.me/ai_coach_hse_bot"
              onClick={() => trackEvent('cta_click', { location: 'footer', target: 'telegram' })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-card/50 px-8 py-4 text-base font-medium text-foreground transition-all hover:bg-muted hover:border-accent/30 hover:-translate-y-0.5"
            >
              Попробовать в Telegram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
