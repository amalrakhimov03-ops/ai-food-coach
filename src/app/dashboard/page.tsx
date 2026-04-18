'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
  if (!dateString) return '—'

  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDayKey(dateString: string | null) {
  if (!dateString) return null

  const d = new Date(dateString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDayLabel(dayKey: string) {
  const [year, month, day] = dayKey.split('-')
  return `${day}.${month}.${year}`
}

export default function DashboardPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [error, setError] = useState<string | null>(null)

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
          router.push('/login')
          return
        }

        setEmail(user.email || '')
        setUserId(user.id)

        const { data, error: logsError } = await supabase
          .from('food_logs')
          .select(
            'id, user_id, source, raw_text, meal_type, calories, protein, fat, carbs, logged_at, created_at'
          )
          .eq('user_id', user.id)
          .order('logged_at', { ascending: false })
          .limit(100)

        if (logsError) {
          setError(logsError.message)
          setLogs([])
          return
        }

        setLogs(data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
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

    const todayCalories = todayKey
      ? (caloriesByDayMap.get(todayKey) || 0)
      : 0

    const dailyCalories = Array.from(caloriesByDayMap.values())
    const averageDailyCalories =
      dailyCalories.length > 0
        ? Math.round(
            dailyCalories.reduce((sum, value) => sum + value, 0) /
              dailyCalories.length
          )
        : 0

    const totalProtein = logs.reduce((sum, log) => sum + Number(log.protein || 0), 0)
    const totalFat = logs.reduce((sum, log) => sum + Number(log.fat || 0), 0)
    const totalCarbs = logs.reduce((sum, log) => sum + Number(log.carbs || 0), 0)

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
        <p className="text-white/60">Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">AI Food Coach</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-white/60">{email}</p>
            <p className="mt-1 text-xs text-white/35 break-all">
              user_id: {userId}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            Ошибка загрузки данных: {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Meals logged</p>
            <p className="mt-3 text-3xl font-semibold">{stats.totalMeals}</p>
            <p className="mt-2 text-sm text-white/50">
              Всего записей в food_logs
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Average daily calories</p>
            <p className="mt-3 text-3xl font-semibold">
              {stats.averageDailyCalories}
            </p>
            <p className="mt-2 text-sm text-white/50">
              Среднее количество калорий в день
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Today calories</p>
            <p className="mt-3 text-3xl font-semibold">{stats.todayCalories}</p>
            <p className="mt-2 text-sm text-white/50">
              Сумма калорий за сегодня
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Avg protein</p>
            <p className="mt-3 text-2xl font-semibold">{stats.avgProtein} g</p>
            <p className="mt-2 text-sm text-white/50">
              Средний белок на запись
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Avg fat</p>
            <p className="mt-3 text-2xl font-semibold">{stats.avgFat} g</p>
            <p className="mt-2 text-sm text-white/50">
              Средний жир на запись
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Avg carbs</p>
            <p className="mt-3 text-2xl font-semibold">{stats.avgCarbs} g</p>
            <p className="mt-2 text-sm text-white/50">
              Средние углеводы на запись
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium">Calories History</h2>
            <p className="mt-2 text-sm text-white/60">
              Последние 7 дней по сумме калорий
            </p>

            <div className="mt-4 space-y-3">
              {stats.caloriesHistory.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/40">
                  У вас пока нет записей. Отправьте первое сообщение в Telegram-бота.
                </div>
              ) : (
                stats.caloriesHistory.map((item) => (
                  <div
                    key={item.date}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161b22] px-4 py-3"
                  >
                    <span className="text-sm text-white/70">
                      {formatDayLabel(item.date)}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {item.calories} kcal
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <p className="mt-2 text-sm text-white/60">
              Последние записи о еде
            </p>

            <div className="mt-4 space-y-3">
              {logs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/40">
                  Пока данных нет
                </div>
              ) : (
                logs.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-white/10 bg-[#161b22] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white break-words">
                          {log.raw_text || 'Без описания'}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          {formatDate(log.logged_at)}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          source: {log.source || 'manual'}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-white">
                          {log.calories || 0} kcal
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          {log.meal_type || 'unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/55">
                      <span>P: {log.protein ?? 0}</span>
                      <span>F: {log.fat ?? 0}</span>
                      <span>C: {log.carbs ?? 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}