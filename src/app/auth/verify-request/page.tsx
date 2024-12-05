'use client'

import Image from 'next/image'
import { HiOutlineMail } from 'react-icons/hi'

export default function VerifyRequest() {
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
          <div className="rounded-full bg-blue-100 p-3">
            <HiOutlineMail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Check your email
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          A sign in link has been sent to your email address.
          Click the link to complete your sign in.
        </p>

        <div className="mt-8 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="text-blue-600 hover:text-blue-500"
          >
            Try another method
          </button>
        </div>
      </div>
    </div>
  )
}
