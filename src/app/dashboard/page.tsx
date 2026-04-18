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
  const [userId, setUserId] = useState<string | null>(null) // ДОБАВЛЕНО: состояние для ID
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [error, setError] = useState<string | null>(null)

  // Константа для ссылки (вынес вверх для удобства)
  const botLink = userId 
    ? `https://t.me/ai_coach_hse_bot?start=${userId}` 
    : "https://t.me/ai_coach_hse_bot"

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
        setUserId(user.id) // ДОБАВЛЕНО: сохраняем UUID из Supabase

        const { data, error: logsError } = await supabase
          .from("food_logs")
          .select("id, user_id, source, raw_text, meal_type, calories, protein, fat, carbs, logged_at, created_at")
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
      caloriesByDayMap.set(dayKey, (caloriesByDayMap.get(dayKey) || 0) + (log.calories || 0))
    }

    const caloriesHistory = Array.from(caloriesByDayMap.entries())
      .map(([date, calories]) => ({ date, calories }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7)

    const todayCalories = todayKey ? caloriesByDayMap.get(todayKey) || 0 : 0
    const dailyCalories = Array.from(caloriesByDayMap.values())
    const averageDailyCalories = dailyCalories.length > 0
        ? Math.round(dailyCalories.reduce((sum, value) => sum + value, 0) / dailyCalories.length)
        : 0

    const totalProtein = logs.reduce((sum, log) => sum + Number(log.protein || 0), 0)
    const totalFat = logs.reduce((sum, log) => sum + Number(log.fat || 0), 0)
    const totalCarbs = logs.reduce((sum, log) => sum + Number(log.carbs || 0), 0)

    return {
      totalMeals,
      todayCalories,
      averageDailyCalories,
      caloriesHistory,
      avgProtein: totalMeals > 0 ? Math.round((totalProtein / totalMeals) * 10) / 10 : 0,
      avgFat: totalMeals > 0 ? Math.round((totalFat / totalMeals) * 10) / 10 : 0,
      avgCarbs: totalMeals > 0 ? Math.round((totalCarbs / totalMeals) * 10) / 10 : 0,
    }
  }, [logs])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-8 w-8 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                <svg className="h-5 w-5 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-foreground">AI Food Coach</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
                {email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">{email}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Добро пожаловать</h1>
          <p className="mt-2 text-muted-foreground">Отслеживайте свой прогресс и контролируйте питание</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ошибка загрузки данных: {error}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Сегодня</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">{stats.todayCalories}</p>
            <p className="mt-1 text-sm text-muted-foreground">калорий</p>
          </div>
          {/* ... Другие карточки статов оставляем без изменений */}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">История калорий</h2>
            <div className="mt-6 space-y-3">
              {stats.caloriesHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">У вас пока нет записей</p>
                  {/* ИСПРАВЛЕННАЯ ССЫЛКА 1 */}
                  <a href={botLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80">
                    Начать в Telegram
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              ) : (
                stats.caloriesHistory.map((item) => (
                  <div key={item.date} className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                    <span className="text-sm text-foreground">{formatDayLabel(item.date)}</span>
                    <span className="text-sm font-semibold text-foreground">{item.calories} kcal</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Activity Section */}
          <section className="rounded-2xl border border-border bg-card p-6">
             <h2 className="text-lg font-semibold text-foreground">Последние записи</h2>
             {/* ... Список записей без изменений */}
          </section>
        </div>

        {/* Quick Action */}
        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Добавить приём пищи</h3>
              <p className="mt-1 text-sm text-muted-foreground">Отправьте описание еды в Telegram для мгновенного анализа</p>
            </div>
            {/* ИСПРАВЛЕННАЯ ССЫЛКА 2 */}
            <a href={botLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">
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