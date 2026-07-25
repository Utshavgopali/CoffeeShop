import Link from 'next/link'

export default function SplashPage() {
  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="bg-glow" />

      <div className="fade-up d1" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="splash-logo">brew<br />haven</div>
        <div className="logo-tagline" style={{ marginBottom: 0 }}>Sip. Savour. Stay.</div>
      </div>

      <Link
        href="/login"
        className="fade-up d3"
        style={{
          marginTop: '3rem',
          position: 'relative',
          zIndex: 1,
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          color: 'var(--gold)',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}
      >
        Enter →
      </Link>
    </main>
  )
}
