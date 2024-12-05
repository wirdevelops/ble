import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    if (!code) {
      return NextResponse.redirect(new URL('/auth/signin?error=No code provided', request.url))
    }``

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the session to access user details
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(new URL('/auth/signin?error=Session error', request.url))
    }

    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, onboarding_completed')
      .eq('id', session.user.id)
      .single()

    // If no profile exists, create one
    if (profileError?.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email,
          role: 'user',
          onboarding_completed: false,
        })

      if (insertError) {
        console.error('Profile creation error:', insertError)
        return NextResponse.redirect(new URL('/auth/signin?error=Profile creation failed', request.url))
      }

      // Store the intended destination in the URL for after onboarding
      return NextResponse.redirect(new URL(`/onboarding?next=${encodeURIComponent(next)}`, request.url))
    }

    // Handle other profile errors
    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.redirect(new URL('/auth/signin?error=Profile error', request.url))
    }

    // If profile exists but onboarding is not complete, redirect to onboarding
    if (!profile.onboarding_completed) {
      return NextResponse.redirect(new URL(`/onboarding?next=${encodeURIComponent(next)}`, request.url))
    }

    // Profile exists and onboarding is complete, redirect to the intended destination
    return NextResponse.redirect(new URL(next, request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=Authentication failed', request.url))
  }
}
