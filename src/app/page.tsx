'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useModal } from '@/hooks';

export default function Home() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const { openLogin, openRegister } = useModal();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <p>KBT Next app</p>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to KBT Trip Builder
        </h1>

        {status === 'loading' ? (
          <p className="text-gray-600">Loading...</p>
        ) : session ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Welcome back, <strong>{session.user?.name}</strong>!
              </p>
              <p className="text-green-600 text-sm">{session.user?.email}</p>
            </div>
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Account Settings
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Sign in to start building your Kentucky trip
            </p>
            <div className="space-x-4">
              <button
                onClick={openLogin}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
              <button
                onClick={openRegister}
                className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
