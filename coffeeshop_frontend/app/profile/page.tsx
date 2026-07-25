'use client'

import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../lib/context/AuthContext'
import { UpdateProfileSchema } from '../../lib/types/auth'
import { updateProfileAction } from '../../lib/actions/auth-action'

interface FormErrors { name?: string; email?: string; form?: string }

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, setUser } = useAuth()

  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [avatar, setAvatar]   = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors]   = useState<FormErrors>({})
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); setPreview(user.avatar) }
  }, [user])

  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setAvatar(file)
    if (file) setPreview(URL.createObjectURL(file))
    setSuccess('')
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setErrors({}); setSuccess('')
    const result = UpdateProfileSchema.safeParse({ name, email })
    if (!result.success) {
      const f = result.error.flatten().fieldErrors
      setErrors({ name: f.name?.[0], email: f.email?.[0] })
      return
    }
    setSaving(true)
    const res = await updateProfileAction({ name, email, avatar })
    setSaving(false)
    if (!res.ok) { setErrors({ form: res.message }); return }
    setUser(res.data)
    setPreview(res.data.avatar)
    setAvatar(null)
    setSuccess('Profile updated successfully ✓')
  }

  if (loading || !user) return null
  const initials = user.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="bg-glow" />
      <div className="logo fade-up d1">brew<br />haven</div>

      <div className="form-card fade-up d2">
        <div className="form-title">Edit Profile</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="avatar-wrap">
            {preview
              ? <img src={preview} alt="Avatar" className="avatar-img" />
              : <div className="avatar-placeholder">{initials}</div>
            }
            <label className="file-btn">
              Change photo
              <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="field">
            <div className="field-header"><label className="field-label" htmlFor="name">Name</label></div>
            <div className="input-row">
              <input id="name" type="text" value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                placeholder="Your name" />
            </div>
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="field">
            <div className="field-header"><label className="field-label" htmlFor="email">Email</label></div>
            <div className="input-row">
              <input id="email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                placeholder="you@example.com" />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          {success && <p className="alert-success">{success}</p>}
          {errors.form && <p className="alert-error">{errors.form}</p>}

          <button type="submit" className="btn-primary" disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <div className="page-nav">
          <Link href="/dashboard">← Dashboard</Link>
          <Link href="/password">Change password</Link>
        </div>
      </div>
    </main>
  )
}
