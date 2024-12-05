'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { BiErrorCircle } from 'react-icons/bi'

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case 'Configuration':
      return {
        title: 'Server Configuration Error',
        message: 'There is a problem with the server configuration. Please contact support.',
      }
    case 'AccessDenied':
      return {
        title: 'Access Denied',
        message: 'You do not have permission to sign in. Please contact support if you believe this is a mistake.',
      }
    case 'Verification':
      return {
        title: 'Invalid or Expired Link',
        message: 'The sign in link is no longer valid. It may have expired or already been used.',
      }
    case 'EmailSignin':
      return {
        title: 'Email Error',
        message: 'The email sign in failed. Please try again or use a different sign in method.',
      }
    case 'OAuthSignin':
      return {
        title: 'Sign In Error',
        message: 'Error connecting to the provider. Please try again or use a different sign in method.',
      }
    case 'OAuthCallback':
      return {
        title: 'Provider Error',
        message: 'Error receiving response from provider. Please try again.',
      }
    default:
      return {
        title: 'Authentication Error',
        message: 'An unexpected error occurred. Please try again.',
      }
  }
}

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { title, message } = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="mx-auto"
        />
        
        <div className="mt-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <BiErrorCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="
              inline-flex items-center justify-center
              px-6 py-3 border border-transparent
              text-base font-medium rounded-md
              text-white bg-blue-600 hover:bg-blue-700
              focus:outline-none focus:ring-2
              focus:ring-offset-2 focus:ring-blue-500
            "
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
