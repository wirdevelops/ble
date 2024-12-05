'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (provider?: string) => {
    if (provider) {
      await signIn(provider, { callbackUrl: '/' })
    } else {
      router.push('/auth/signin')
    }
  }

  const logout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    login,
    logout,
  }
}
