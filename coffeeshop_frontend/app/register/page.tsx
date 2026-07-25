'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RegisterSchema } from '../../lib/types/auth'
import { registerAction } from '../../lib/actions/auth-action'

interface FormErrors { name?: string; email?: string; password?: string; confirmPassword?: string; form?: string }

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName]                     = useState('')
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [confirmPassword, setConfirmPw]     = useState('')
  const [showPw, setShowPw]                 = useState(false)
  const [errors, setErrors]                 = useState<FormErrors>({})
  const [loading, setLoading]               = useState(false)

  const clear = (f: keyof FormErrors) => setErrors(p => ({ ...p, [f]: '' }))

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setErrors({})
    const result = RegisterSchema.safeParse({ name, email, password, confirmPassword })
    if (!result.success) {
      const f = result.error.flatten().fieldErrors
      setErrors({ name: f.name?.[0], email: f.email?.[0], password: f.password?.[0], confirmPassword: f.confirmPassword?.[0] })
      return
    }
    setLoading(true)
    const res = await registerAction(result.data)
    setLoading(false)
    if (!res.ok) { setErrors({ form: res.message }); return }
    router.push('/dashboard')
  }

  const Field = ({ id, label, type = 'text', value, onChange, error, placeholder }: {
    id: string; label: string; type?: string; value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void; error?: string; placeholder?: string
  }) => (
    <div className="field">
      <div className="field-header"><label className="field-label" htmlFor={id}>{label}</label></div>
      <div className="input-row">
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete="off" />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  )

  return (
    <main className="page">
      <div className="bg-glow" />
      <div className="logo fade-up d1">brew<br />haven</div>

      <div className="form-card fade-up d2">
        <div className="form-title">Create Account</div>

        <form onSubmit={handleSubmit} noValidate>
          <Field id="name" label="Full Name" value={name}
            onChange={e => { setName(e.target.value); clear('name') }}
            error={errors.name} placeholder="Your name" />

          <Field id="email" label="Email" type="email" value={email}
            onChange={e => { setEmail(e.target.value); clear('email') }}
            error={errors.email} placeholder="you@example.com" />

          <div className="field">
            <div className="field-header"><label className="field-label" htmlFor="pw">Password</label></div>
            <div className="input-row">
              <input id="pw" type={showPw ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); clear('password') }}
                placeholder="At least 6 characters" />
              <button type="button" className="eye-toggle" onClick={() => setShowPw(s => !s)}>
                {showPw
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <Field id="cpw" label="Confirm Password" type="password" value={confirmPassword}
            onChange={e => { setConfirmPw(e.target.value); clear('confirmPassword') }}
            error={errors.confirmPassword} placeholder="••••••••" />

          {errors.form && <p className="alert-error">{errors.form}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="nav-text fade-up d4">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </main>
  )
}
