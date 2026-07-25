'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LoginSchema } from '../../lib/types/auth'
import { loginAction } from '../../lib/actions/auth-action'

interface FormErrors { email?: string; password?: string; form?: string }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [loading, setLoading]   = useState(false)

  const clear = (f: keyof FormErrors) => setErrors(p => ({ ...p, [f]: '' }))

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setErrors({})
    const result = LoginSchema.safeParse({ email, password })
    if (!result.success) {
      const f = result.error.flatten().fieldErrors
      setErrors({ email: f.email?.[0], password: f.password?.[0] })
      return
    }
    setLoading(true)
    const res = await loginAction(result.data)
    setLoading(false)
    if (!res.ok) { setErrors({ form: res.message }); return }
    router.push('/dashboard')
  }

  return (
    <main className="page">
      <div className="bg-glow" />
      <div className="logo fade-up d1">brew<br />haven</div>

      <div className="form-card fade-up d2">
        <div className="form-title">Welcome Back</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="email">Email</label>
            </div>
            <div className="input-row">
              <span className="input-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input id="email" type="email" autoComplete="email" value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clear('email') }}
                placeholder="you@example.com" />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="password">Password</label>
              <button type="button" className="field-forgot">Forgot?</button>
            </div>
            <div className="input-row">
              <span className="input-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); clear('password') }}
                placeholder="••••••••" />
              <button type="button" className="eye-toggle" onClick={() => setShowPw(s => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          {errors.form && <p className="alert-error">{errors.form}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="or-divider">or</div>
        <button type="button" className="btn-ghost">Continue with Google</button>
      </div>

      <p className="nav-text fade-up d4">
        No account yet? <Link href="/register">Sign up</Link>
      </p>
    </main>
  )
}
