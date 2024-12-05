import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ProfileMenu from '@/components/ProfileMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BLE - Bamenda Local Exchange',
  description: 'Connect, Share, and Thrive with your local community in Bamenda',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-center" />
            <ProfileMenu />
            {children}
            <BottomNav />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
