'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAuth?: boolean; requireOnboarding?: boolean } = {}
) => {
  return function WithAuthComponent(props: P) {
    const { user, loading, isOnboardingComplete } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (loading) return

      if (options.requireAuth && !user) {
        // User is not authenticated, redirect to signin
        const redirectUrl = new URLSearchParams()
        redirectUrl.set('redirectTo', pathname)
        router.push(`/auth/signin?${redirectUrl.toString()}`)
        return
      }

      if (user && options.requireOnboarding && !isOnboardingComplete) {
        // User needs to complete onboarding
        router.push('/auth/onboarding')
        return
      }

      if (user && pathname.startsWith('/auth') && pathname !== '/auth/onboarding') {
        // User is authenticated but trying to access auth pages
        router.push('/dashboard')
        return
      }
    }, [user, loading, isOnboardingComplete, router, pathname])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (options.requireAuth && !user) {
      return null // Don't render anything while redirecting
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
