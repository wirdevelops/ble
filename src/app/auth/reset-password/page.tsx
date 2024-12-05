'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineMail } from 'react-icons/hi'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      setSent(true)
      toast.success('Password reset instructions sent to your email!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <Image
              src="/logo.png"
              alt="BLE Logo"
              width={64}
              height={64}
              className="mx-auto rounded-xl"
            />
            <h2 className="mt-6 text-3xl font-bold text-foreground">Check Your Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent password reset instructions to {email}
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-primary hover:text-primary/90"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Image
            src="/logo.png"
            alt="BLE Logo"
            width={64}
            height={64}
            className="mx-auto rounded-xl"
          />
          <h2 className="mt-6 text-3xl font-bold text-center text-foreground">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-primary hover:text-primary/90"
            >
              Return to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
