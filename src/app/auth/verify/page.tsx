'use client';

import { BiEnvelope, BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifyRequest() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <BiEnvelope className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold">Check your email</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-text/60">
              A sign in link has been sent to {email ? <span className="font-medium text-text">{email}</span> : 'your email address'}.
            </p>
            <p className="text-text/60">
              Click the link to complete your sign in.
            </p>
          </div>

          <div className="bg-surface-dark p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Didn't receive the email?</p>
            <ul className="text-text/60 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Allow a few minutes for the email to arrive</li>
            </ul>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
          >
            <BiArrowBack className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
