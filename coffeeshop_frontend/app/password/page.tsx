'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../lib/context/AuthContext'
import { ChangePasswordSchema } from '../../lib/types/auth'
import { changePasswordAction } from '../../lib/actions/auth-action'

interface FormErrors { currentPassword?: string; newPassword?: string; confirmNewPassword?: string; form?: string }

export default function PasswordPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [currentPassword, setCurrentPw]     = useState('')
  const [newPassword, setNewPw]             = useState('')
  const [confirmNewPassword, setConfirmPw]  = useState('')
  const [errors, setErrors]                 = useState<FormErrors>({})
  const [saving, setSaving]                 = useState(false)
  const [success, setSuccess]               = useState('')

  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])

  const clear = (f: keyof FormErrors) => setErrors(p => ({ ...p, [f]: '' }))

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setErrors({}); setSuccess('')
    const result = ChangePasswordSchema.safeParse({ currentPassword, newPassword, confirmNewPassword })
    if (!result.success) {
      const f = result.error.flatten().fieldErrors
      setErrors({
        currentPassword: f.currentPassword?.[0],
        newPassword: f.newPassword?.[0],
        confirmNewPassword: f.confirmNewPassword?.[0],
      })
      return
    }
    setSaving(true)
    const res = await changePasswordAction({ currentPassword, newPassword })
    setSaving(false)
    if (!res.ok) { setErrors({ form: res.message }); return }
    setSuccess('Password updated successfully ✓')
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
  }

  if (loading || !user) return null

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="bg-glow" />
      <div className="logo fade-up d1">brew<br />haven</div>

      <div className="form-card fade-up d2">
        <div className="form-title">Change Password</div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { id: 'cpw',  label: 'Current Password', value: currentPassword, set: setCurrentPw, key: 'currentPassword' as const },
            { id: 'npw',  label: 'New Password',      value: newPassword,     set: setNewPw,     key: 'newPassword'     as const, hint: 'At least 6 characters' },
            { id: 'cnpw', label: 'Confirm New Password', value: confirmNewPassword, set: setConfirmPw, key: 'confirmNewPassword' as const },
          ].map(({ id, label, value, set, key, hint }) => (
            <div className="field" key={id}>
              <div className="field-header"><label className="field-label" htmlFor={id}>{label}</label></div>
              <div className="input-row">
                <input id={id} type="password" value={value}
                  onChange={e => { set(e.target.value); clear(key) }}
                  placeholder={hint ?? '••••••••'} />
              </div>
              {errors[key] && <p className="field-error">{errors[key]}</p>}
            </div>
          ))}

          {success && <p className="alert-success">{success}</p>}
          {errors.form && <p className="alert-error">{errors.form}</p>}

          <button type="submit" className="btn-primary" disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>

        <div className="page-nav">
          <Link href="/dashboard">← Dashboard</Link>
          <Link href="/profile">Edit profile</Link>
        </div>
      </div>
    </main>
  )
}
