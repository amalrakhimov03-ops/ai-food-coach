import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 inline-block rounded-full border border-white/10 px-3 py-1 text-sm text-white/70">
            AI Nutrition Assistant
          </p>

          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            AI Food Coach
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Умный AI-ассистент для контроля питания через Telegram и Web App.
            Отправляй еду текстом или голосом, получай анализ, советы и историю.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              Открыть Web App
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
            >
              Смотреть возможности
            </a>

            <a
              href="https://t.me/ai_coach_hse_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
            >
              Открыть Telegram
            </a>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3"
      >
        {[
          {
            title: 'Telegram + Голос',
            text: 'Логируй питание через текстовые и голосовые сообщения.',
          },
          {
            title: 'AI-анализ',
            text: 'Gemini анализирует еду, считает калории и даёт рекомендации.',
          },
          {
            title: 'История и Dashboard',
            text: 'Просматривай историю питания и персональную статистику.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  )
}