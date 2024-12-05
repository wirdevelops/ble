'use client'

import { useState } from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import { BiLoaderAlt } from 'react-icons/bi'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface EmailSignInProps {
  loading?: boolean
  setLoading?: (loading: boolean) => void
  redirectTo: string
}

export function EmailSignIn({ loading: parentLoading, setLoading: setParentLoading, redirectTo }: EmailSignInProps) {
  const [localLoading, setLocalLoading] = useState(false)
  const [email, setEmail] = useState('')

  const loading = parentLoading || localLoading
  const setLoading = setParentLoading || setLocalLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          shouldCreateUser: true,
          data: {
            email_confirmed: true,
          },
        },
      })

      if (error) throw error

      toast.success(
        'Check your email for the magic link!',
        { duration: 6000 }
      )
      setEmail('')
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(
        error.message || 'Failed to send magic link',
        { duration: 4000 }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineMail 
              className="h-5 w-5 text-gray-400" 
              aria-hidden="true" 
            />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={loading}
            className="
              block w-full pl-10 pr-3 py-2
              border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              disabled:bg-gray-50 disabled:text-gray-500
              sm:text-sm
            "
            placeholder="you@example.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="
          w-full flex justify-center items-center
          px-4 py-2 text-sm font-medium
          text-white bg-primary
          border border-transparent rounded-md shadow-sm
          hover:bg-primary/90
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        "
      >
        {loading ? (
          <>
            <BiLoaderAlt className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          'Send Magic Link'
        )}
      </button>

      <p className="mt-2 text-sm text-gray-500 text-center">
        We'll email you a magic link for a password-free sign in.
      </p>
    </form>
  )
}
