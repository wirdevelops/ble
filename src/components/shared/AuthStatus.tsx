'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { BiLogIn, BiLogOut } from 'react-icons/bi';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-primary/10"></div>
    );
  }

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-primary/10 transition-colors"
      >
        <BiLogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
    >
      <BiLogIn className="w-4 h-4" />
      <span>Sign In</span>
    </button>
  );
}
