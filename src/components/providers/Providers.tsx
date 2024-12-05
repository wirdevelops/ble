
'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/auth-helpers-nextjs'
import { createBrowserClient } from '@supabase/ssr/dist/main/createBrowserClient'

const AuthContext = createContext<{
  session: Session | null
  signOut: () => Promise<void>
}>({
  session: null,
  signOut: async () => {},
})

export function Providers({
  children,
  session: initialSession,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const [session, setSession] = useState(initialSession)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_OUT') {
        router.push('/auth/signin')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <AuthContext.Provider value={{ session, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// 'use client'

// import { ThemeProvider } from 'next-themes'
// import { Session } from '@supabase/supabase-js'
// import { createContext, useContext, useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'

// const SessionContext = createContext<Session | null>(null)

// export function useSession() {
//   return useContext(SessionContext)
// }

// export function Providers({
//   children,
//   session: initialSession
// }: {
//   children: React.ReactNode
//   session: Session | null
// }) {
//   const [session, setSession] = useState<Session | null>(initialSession)
//   const router = useRouter()

//   useEffect(() => {
//     // Update session when it changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//       router.refresh()
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [router])

//   return (
//     <SessionContext.Provider value={session}>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         {children}
//       </ThemeProvider>
//     </SessionContext.Provider>
//   )
// }
