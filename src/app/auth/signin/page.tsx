'use client'

import { EmailSignIn } from '@/components/auth/EmailSignIn'
import { supabase } from '@/lib/supabase/client'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

type Provider = 'google' | 'facebook'

interface ProviderButton {
  provider: Provider
  icon: JSX.Element
  label: string
  color: string
  bgColor: string
  hoverBgColor: string
}

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const error = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error))
    }
  }, [error])

  const providers: ProviderButton[] = [
    {
      provider: 'google',
      icon: <FaGoogle className="h-5 w-5" />,
      label: 'Continue with Google',
      color: 'text-white',
      bgColor: 'bg-[#4285F4]',
      hoverBgColor: 'hover:bg-[#3367D6]'
    },
    {
      provider: 'facebook',
      icon: <FaFacebook className="h-5 w-5" />,
      label: 'Continue with Facebook',
      color: 'text-white',
      bgColor: 'bg-[#1877F2]',
      hoverBgColor: 'hover:bg-[#0C63D4]'
    }
  ]

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          skipBrowserRedirect: false,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-white p-8 justify-center items-center">
        <div className="max-w-md space-y-6">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="BLE Logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <h1 className="text-3xl font-bold">BLE</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Connect, Share, and Thrive with Your Local Community
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of people in Bamenda who are already using BLE to connect,
            share resources, and build a stronger community.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Connect with Locals</h3>
                <p className="opacity-75 text-sm">Build meaningful relationships in your community</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Share Resources</h3>
                <p className="opacity-75 text-sm">Exchange goods, services, and knowledge</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Thrive Together</h3>
                <p className="opacity-75 text-sm">Grow and prosper as a community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="md:hidden flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="BLE Logo"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <h1 className="text-2xl font-bold text-primary">BLE</h1>
            </div>
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/90">
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:px-10">
            <div className="space-y-4">
              {providers.map((p) => (
                <button
                  key={p.provider}
                  onClick={() => handleSocialLogin(p.provider)}
                  disabled={loading}
                  className={`flex w-full justify-center items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium ${p.color} ${p.bgColor} ${p.hoverBgColor} transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{p.icon}</span>
                  <span>{loading ? 'Loading...' : p.label}</span>
                </button>
              ))}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <EmailSignIn redirectTo={redirectTo} />
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="font-medium text-foreground hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
