'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';

export default function ProfileMenu() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-lg"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
      {/* Notifications */}
      <button className="relative p-2 hover:bg-surface rounded-lg group">
        <BellIcon className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
      </button>

      {/* Profile Menu */}
      <Link href="/profile" className="flex items-center gap-2 p-1 hover:bg-surface rounded-lg">
        <img
          src={user.image}
          alt={user.name}
          className="w-8 h-8 rounded-full border border-border"
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-text/60">{user.role}</div>
        </div>
      </Link>
    </div>
  );
}
