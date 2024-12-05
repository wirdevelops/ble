'use client'

import { signIn } from 'next-auth/react'
import { IconType } from 'react-icons'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import { useState } from 'react'

interface AuthButtonProps {
  provider: 'google' | 'facebook'
  className?: string
}

const providerIcons: Record<string, IconType> = {
  google: FcGoogle,
  facebook: FaFacebook,
}

const providerNames: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
}

export function AuthButton({ provider, className = '' }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const Icon = providerIcons[provider]

  const handleSignIn = async () => {
    try {
      console.log(`Starting ${provider} sign-in...`)
      setIsLoading(true)
      
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      })
      
      console.log(`${provider} sign-in result:`, result)
      
      if (result?.error) {
        console.error(`${provider} sign-in error:`, result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-3 w-full 
        rounded-lg p-3 text-sm font-semibold
        hover:opacity-90 transition-opacity
        disabled:opacity-50 disabled:cursor-not-allowed
        ${provider === 'google' ? 'bg-white text-gray-600 border border-gray-300' : ''}
        ${provider === 'facebook' ? 'bg-[#1877F2] text-white' : ''}
        ${className}
      `}
    >
      <Icon className="w-5 h-5" />
      {isLoading ? 'Connecting...' : `Continue with ${providerNames[provider]}`}
    </button>
  )
}
