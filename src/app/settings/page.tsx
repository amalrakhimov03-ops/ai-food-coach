'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Settings() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const botLink = `https://t.me/ai_coach_hse_bot?start=${user?.id}`

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-6">Настройки профиля</h1>
      <div className="bg-card border border-border p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Привязка Telegram</h2>
        <p className="text-muted-foreground mb-6">
          Привяжите бота, чтобы он узнавал вас и записывал данные в ваш личный профиль.
        </p>
        
        {user ? (
          <a 
            href={botLink}
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all"
          >
            Привязать Telegram
          </a>
        ) : (
          <p className="text-red-400">Сначала нужно войти в аккаунт</p>
        )}
      </div>
    </div>
  )
}