'use client';

import { getSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(session => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
      const result = await signIn('google', {
        callbackUrl: '/auth/debug',
        redirect: false,
      });
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Session</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Check</h2>
        <div className="space-y-2">
          <div>
            NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set'}
          </div>
          <div>NODE_ENV: {process.env.NODE_ENV}</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test OAuth</h2>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Google Sign In
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Important Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>
            Check that Google OAuth redirect URI is exactly:{' '}
            <code className="bg-gray-100 px-1 rounded">
              http://localhost:3000/api/auth/callback/google
            </code>
          </li>
          <li>Ensure NEXTAUTH_SECRET is set in your .env file</li>
          <li>Check browser console for any errors during sign in</li>
          <li>Verify cookies are enabled in your browser</li>
        </ul>
      </div>
    </div>
  );
}
