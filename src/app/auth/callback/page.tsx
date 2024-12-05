'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Remove Facebook's _=_ hash if present
      if (window.location.hash === '#_=_') {
        history.replaceState 
          ? history.replaceState(null, '', window.location.href.split('#')[0])
          : window.location.hash = ''
      }

      const { searchParams } = new URL(window.location.href)
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/'

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          
          // Successful login
          router.refresh() // Refresh to update auth state
          router.push(next)
        } catch (error) {
          console.error('Error:', error)
          router.push('/auth/signin?error=Unable to sign in')
        }
      } else {
        // No code found, redirect to sign in
        router.push('/auth/signin')
      }
    }

    handleAuthCallback()
  }, [router])

  return null
}
