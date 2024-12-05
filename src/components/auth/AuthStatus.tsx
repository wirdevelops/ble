'use client'

import { useAuth } from '@/hooks/useAuth'
import { BiUser, BiLogOut } from 'react-icons/bi'
import Image from 'next/image'
import Link from 'next/link'

export function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-surface animate-pulse" />
    )
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/signin"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <BiUser className="w-5 h-5" />
        <span>Sign In</span>
      </Link>
    )
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2">
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BiUser className="w-6 h-6 text-primary" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 py-2 bg-surface border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="px-4 py-2 border-b border-border">
          <p className="font-medium truncate">{user?.name}</p>
          <p className="text-sm text-text/60 truncate">{user?.email}</p>
        </div>
        
        <Link
          href="/profile"
          className="block px-4 py-2 text-sm hover:bg-primary/5 transition-colors"
        >
          Profile
        </Link>
        
        <Link
          href="/settings"
          className="block px-4 py-2 text-sm hover:bg-primary/5 transition-colors"
        >
          Settings
        </Link>
        
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <BiLogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
