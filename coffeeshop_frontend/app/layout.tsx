import './globals.css'
import { Metadata } from 'next'
import { AuthProvider } from '../lib/context/AuthContext'

export const metadata: Metadata = {
  title: 'BrewHaven',
  description: 'Your favourite coffee, always.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
