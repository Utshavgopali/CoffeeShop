'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../lib/context/AuthContext'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => { if (!loading && !user) router.replace('/login') }, [loading, user, router])
  if (loading || !user) return null

  const initials = user.name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()

  const handleLogout = () => { logout(); router.replace('/login') }

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="bg-glow" />
      <div className="logo fade-up d1">brew<br />haven</div>

      <div className="form-card fade-up d2" style={{ textAlign: 'center' }}>
        <div className="avatar-wrap">
          {user.avatar
            ? <img src={user.avatar} alt="Avatar" className="avatar-img" />
            : <div className="avatar-placeholder">{initials}</div>
          }
        </div>

        <div className="form-title">Welcome, {user.name} ☕</div>

        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          Logged in as <strong style={{ color: 'var(--cream)' }}>{user.email}</strong>
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '1.8rem' }}>
          This is a protected dashboard.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Link href="/profile" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Edit Profile
          </Link>
          <Link href="/password" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Change Password
          </Link>
          <button type="button" onClick={handleLogout} className="field-forgot"
            style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}>
            Sign out
          </button>
        </div>
      </div>
    </main>
  )
}
