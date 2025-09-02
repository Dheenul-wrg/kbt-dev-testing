'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { TextField } from './custom-textfield';
import { KBTNewsletter } from './kbt-newsletter';
import { SocialSignButton } from './social-sign-in-button';

interface RegistrationPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegistrationPopup({
  isOpen = false,
  onClose,
  onSwitchToLogin,
}: RegistrationPopupProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleNewsletterChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      newsletter: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Register user with email and password only
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          newsletter: formData.newsletter,
        }),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(registerResult.error || 'Registration failed');
        return;
      }

      setSuccess('Account created successfully! Signing you in...');

      // Auto-login after successful registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Sign-in failed after registration - provide helpful error message
        console.error(
          'Auto sign-in failed after registration:',
          signInResult.error
        );

        const errorMessage =
          signInResult.error === 'CredentialsSignin'
            ? 'Account created successfully, but there was an issue with automatic sign-in. Please try signing in manually with your new credentials.'
            : `Account created successfully, but automatic sign-in failed: ${signInResult.error}. Please try signing in manually.`;

        setError(errorMessage);
        setSuccess(''); // Clear the success message
        return;
      }

      // Only redirect if sign-in was successful
      setSuccess('Account created and signed in successfully! Redirecting...');

      // Small delay to show the success message before redirect
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    setError('');
    try {
      await signIn(provider, {
        callbackUrl: '/',
        redirect: false, // Prevent automatic redirect to handle result
      });
    } catch (error) {
      setError(`An error occurred during ${provider} sign in`);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="rounded-[3px] max-w-[370px] w-full h-auto overflow-hidden relative shadow-2xl text-white">
        <div className="bg-kbt-deep-green flex flex-col justify-center gap-[12px] pt-9 pb-5">
          <div className="text-center pl-12.5 pr-12 flex flex-col gap-[9px]">
            <h1 className="font-signifier text-2xl lg:text-[2.625rem] font-[100] text-brand-secondary leading-[99%] tracking-[-1px] text-center m-0 p-0 h-[88px]">
              Create an account.
            </h1>
            <p className="font-gt-america font-[300] text-[0.875rem] text-center tracking-[0px] ml-2 leading-[120%] h-[41px]">
              Sign up to build, save and share your dream Bourbon Trail
              <sup>TM</sup> trip.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="px-11 text-red-400 text-sm font-gt-america">
              {error}
            </div>
          )}
          {success && (
            <div className="px-11 text-green-400 text-sm font-gt-america">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-[9px] pl-11 pr-12">
            <SocialSignButton
              icon="/icons/facebook.svg"
              label="SIGN UP WITH FACEBOOK"
              onClick={() => handleSocialSignIn('facebook')}
              className="w-full flex items-center justify-center gap-3 py-[10px] bg-transparent border text-[#F1EDDD] rounded-[3px] uppercase leading-[100%] tracking-[0.15em] max-h-[35px] font-gt-america text-[0.65625rem]"
            />
            <SocialSignButton
              icon="/icons/apple.svg"
              label="SIGN UP WITH APPLE"
              onClick={() => handleSocialSignIn('apple')}
              className="w-full h-fit flex items-center justify-center gap-3 px-4 py-[10px] bg-transparent border text-[#F1EDDD] rounded-[3px] uppercase leading-[100%] tracking-[0.15em] max-h-[35px] font-gt-america text-[0.65625rem]"
            />
            <SocialSignButton
              icon="/icons/google.svg"
              label="SIGN UP WITH GOOGLE"
              onClick={() => handleSocialSignIn('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-[10px] bg-transparent border text-[#F1EDDD] rounded-[3px] uppercase leading-[100%] tracking-[0.15em] max-h-[35px] font-gt-america text-[0.65625rem]"
            />
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center pl-11 pr-12">
              <div className="w-full border-t border-brand-secondary/30"></div>
            </div>
            <div className="font-gt-america relative flex justify-center text-[0.75rem] tracking-[0px] leading-[18px]">
              <span className="px-2.5 bg-kbt-deep-green text-brand-secondary">
                or continue with
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[12px] font-gt-america pl-11 pr-12"
          >
            <div className="flex flex-col gap-[9px]">
              <TextField
                name="email"
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-3.5 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
              />
              <TextField
                name="password"
                type="password"
                placeholder="CHOOSE A PASSWORD"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-3.5 py-3.5 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-[100] flex items-center justify-center gap-2 py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-[0.65625rem] uppercase tracking-[0.15em] h-auto disabled:opacity-50"
            >
              <span>
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </span>
              {!isLoading && (
                <Image
                  src="/icons/arrow.svg"
                  alt="Arrow"
                  width={10}
                  height={10}
                  className="h-[10px]"
                />
              )}
            </button>
            <KBTNewsletter
              checked={formData.newsletter}
              onChange={handleNewsletterChange}
            />
          </form>

          <div className="text-center mt-6 text-sm text-brand-secondary px-11">
            <span>Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-button-green font-medium hover:text-[#5a6a38] transition-colors hover:cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
