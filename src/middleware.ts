import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Array of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
  '/share',
]

// Array of auth flow routes
const authFlowRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
]

// Array of onboarding routes
const onboardingRoutes = [
  '/onboarding',
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const path = new URL(request.url).pathname

  // Allow public routes without authentication
  if (publicRoutes.some(route => path === route || path.startsWith(`${route}/`))) {
    // If user is authenticated and tries to access auth routes, redirect to dashboard
    if (session && authFlowRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Check authentication for protected routes
  if (!session) {
    // Store the original URL to redirect after login
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // If we have a session, check profile and onboarding status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    // If we can't fetch the profile, sign out the user
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Handle onboarding redirect
  if (!profile?.onboarding_completed && !onboardingRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  return response
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/public/).*)',
  ],
}
