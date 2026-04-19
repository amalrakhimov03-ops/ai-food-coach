"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type FoodLog = {
  id: string
  user_id: string
  source: string | null
  raw_text: string | null
  meal_type: string | null
  calories: number | null
  protein: number | null
  fat: number | null
  carbs: number | null
  logged_at: string | null
  created_at: string | null
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—"

  return new Date(dateString).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getDayKey(dateString: string | null) {
  if (!dateString) return null

  const d = new Date(dateString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDayLabel(dayKey: string) {
  const [year, month, day] = dayKey.split("-")
  return `${day}.${month}.${year}`
}

export default function DashboardPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/login")
          return
        }

        setEmail(user.email || "")
        setUserId(user.id)

        const { data, error: logsError } = await supabase
          .from("food_logs")
          .select(
            "id, user_id, source, raw_text, meal_type, calories, protein, fat, carbs, logged_at, created_at"
          )
          .eq("user_id", user.id)
          .order("logged_at", { ascending: false })
          .limit(100)

        if (logsError) {
          setError(logsError.message)
          setLogs([])
          return
        }

        setLogs(data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error")
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  const stats = useMemo(() => {
    const totalMeals = logs.length

    const todayKey = getDayKey(new Date().toISOString())

    const caloriesByDayMap = new Map<string, number>()

    for (const log of logs) {
      const dayKey = getDayKey(log.logged_at)
      if (!dayKey) continue

      caloriesByDayMap.set(
        dayKey,
        (caloriesByDayMap.get(dayKey) || 0) + (log.calories || 0)
      )
    }

    const caloriesHistory = Array.from(caloriesByDayMap.entries())
      .map(([date, calories]) => ({ date, calories }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7)

    const todayCalories = todayKey ? caloriesByDayMap.get(todayKey) || 0 : 0

    const dailyCalories = Array.from(caloriesByDayMap.values())
    const averageDailyCalories =
      dailyCalories.length > 0
        ? Math.round(
            dailyCalories.reduce((sum, value) => sum + value, 0) /
              dailyCalories.length
          )
        : 0

    const totalProtein = logs.reduce(
      (sum, log) => sum + Number(log.protein || 0),
      0
    )
    const totalFat = logs.reduce((sum, log) => sum + Number(log.fat || 0), 0)
    const totalCarbs = logs.reduce(
      (sum, log) => sum + Number(log.carbs || 0),
      0
    )

    const avgProtein =
      totalMeals > 0 ? Math.round((totalProtein / totalMeals) * 10) / 10 : 0
    const avgFat =
      totalMeals > 0 ? Math.round((totalFat / totalMeals) * 10) / 10 : 0
    const avgCarbs =
      totalMeals > 0 ? Math.round((totalCarbs / totalMeals) * 10) / 10 : 0
    
    return {
      totalMeals,
      todayCalories,
      averageDailyCalories,
      caloriesHistory,
      avgProtein,
      avgFat,
      avgCarbs,
    }
  }, [logs])
  
  const botLink = userId 
  ? `https://t.me/ai_coach_hse_bot?start=${userId}` 
  : "https://t.me/ai_coach_hse_bot"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-8 w-8 animate-spin text-accent"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
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
              <span className="text-lg font-semibold text-foreground">
                AI Food Coach
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
                {email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">{email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Добро пожаловать
          </h1>
          <p className="mt-2 text-muted-foreground">
            Отслеживайте свой прогресс и контролируйте питание
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ошибка загрузки данных: {error}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Сегодня
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <svg
                  className="h-5 w-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {stats.todayCalories}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">калорий</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Среднее в день
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {stats.averageDailyCalories}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">калорий</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Всего записей
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                <svg
                  className="h-5 w-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {stats.totalMeals}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">приёмов пищи</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">БЖУ</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20">
                <svg
                  className="h-5 w-5 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-lg font-semibold text-foreground">
                {stats.avgProtein}g
              </span>
              <span className="text-lg font-semibold text-foreground">
                {stats.avgFat}g
              </span>
              <span className="text-lg font-semibold text-foreground">
                {stats.avgCarbs}g
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              среднее на запись
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Calories History */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  История калорий
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Последние 7 дней
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {stats.caloriesHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-muted-foreground">
                    У вас пока нет записей
                  </p>
                  <a
                    href={botLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80"
                  >
                    Начать в Telegram
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              ) : (
                stats.caloriesHistory.map((item, index) => (
                  <div
                    key={item.date}
                    className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-xs font-medium text-accent">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground">
                        {formatDayLabel(item.date)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.calories} kcal
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Последние записи
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Недавняя активность
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {logs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Пока данных нет
                  </p>
                </div>
              ) : (
                logs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-border bg-muted/50 p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {log.raw_text || "Без описания"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                            {log.meal_type || "unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(log.logged_at)}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-foreground">
                          {log.calories || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-4 border-t border-border pt-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">P:</span>
                        <span className="text-xs font-medium text-foreground">
                          {log.protein ?? 0}g
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">F:</span>
                        <span className="text-xs font-medium text-foreground">
                          {log.fat ?? 0}g
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">C:</span>
                        <span className="text-xs font-medium text-foreground">
                          {log.carbs ?? 0}g
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Quick Action */}
        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Добавить приём пищи
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Отправьте описание еды в Telegram бота для мгновенного анализа
              </p>
            </div>
            <a
              href={botLink} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.99-1.73 6.65-2.87 7.97-3.43 3.8-1.57 4.59-1.84 5.1-1.85.11 0 .37.03.53.14.14.1.18.23.2.33-.01.06.01.24 0 .38z" />
              </svg>
              Открыть Telegram
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
