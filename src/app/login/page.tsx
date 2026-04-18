'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
  }

  const handleForgotPassword = async () => {
  const email = window.prompt('Введите email для восстановления пароля')
  if (!email) return

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/reset-password',
  })

  if (error) {
    alert(error.message)
    return
  }

  alert('Письмо для сброса пароля отправлено')
}
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="mb-3 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
          AI Food Coach
        </p>

        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>

        <p className="mt-2 text-sm text-white/60">
          Войди в аккаунт
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-[#161b22] px-4 py-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-[#161b22] px-4 py-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-white/60 hover:text-white"
          >
            Забыли пароль?
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/60">
          Нет аккаунта?{' '}
          <a href="/register" className="text-white underline">
            Create account
          </a>
        </p>
      </div>
    </main>
  )
}