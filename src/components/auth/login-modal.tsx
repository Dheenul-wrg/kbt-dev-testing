'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField } from './custom-textfield';
import { SocialSignButton } from './social-sign-in-button';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        // Close modal and redirect
        onClose?.();
        router.push('/');
        router.refresh(); // Refresh to update session state
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    setError('');

    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      setError(`An error occurred during ${provider} sign in`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({ email: '', password: '' });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 "
      role="dialog"
      aria-modal="true"
    >
      <div
        className="rounded-[3px] max-w-[739px] w-full h-auto min-h-[600px] overflow-hidden relative shadow-2xl text-white "
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute lg:top-4.75 right-5.5 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Close modal"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <Image
            src="/icons/Navigation.svg"
            alt="close"
            width={49}
            height={23}
            className="w-[49px] h-[23px]"
          />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Section - Form */}
          <div className="bg-kbt-deep-green flex flex-col justify-center gap-[12px] max-w-[370px] pt-9 pb-5">
            <div className="text-center pl-12.5 pr-12 flex flex-col gap-[9px]">
              <h1 className="font-signifier text-2xl lg:text-[2.625rem] font-[100] text-brand-secondary leading-[99%] tracking-[-1px] text-center m-0 p-0 h-[88px]">
                Build your own<br></br> Bourbon Trail<sup>™</sup>
              </h1>
              <p className="font-gt-america font-[300] text-[0.875rem] text-center tracking-[0px] ml-2 leading-[120%] h-[41px]">
                Sign in to build, save and share your dream Bourbon Trail™
                trip.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="pl-11 pr-12 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-[3px] text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-[9px] pl-11 pr-12">
              <SocialSignButton
                icon="/icons/Facebook.svg"
                label="SIGN IN WITH FACEBOOK"
                onClick={() => handleSocialSignIn('facebook')}
                className="w-full flex items-center justify-center gap-3 py-[10px] bg-transparent border text-[#F1EDDD] rounded-[3px] uppercase leading-[100%] tracking-[0.15em] max-h-[35px] font-gt-america text-[0.65625rem]"
              />
              <SocialSignButton
                icon="/icons/Vector.svg"
                label="SIGN IN WITH APPLE"
                onClick={() => handleSocialSignIn('apple')}
                className="w-full h-fit flex items-center justify-center gap-3 px-4 py-[10px] bg-transparent border text-[#F1EDDD] rounded-[3px] uppercase leading-[100%] tracking-[0.15em] max-h-[35px] font-gt-america text-[0.65625rem]"
              />
              <SocialSignButton
                icon="/icons/google-white-icon 1.svg"
                label="SIGN IN WITH GOOGLE"
                onClick={() => handleSocialSignIn('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-[10px] bg-transparent border text-[#F1EDDD] rounded-[3px] uppercase leading-[100%] tracking-[0.15em] max-h-[35px] font-gt-america text-[0.65625rem]"
              />
            </div>

            <div className="relative text-center ">
              <div className="absolute inset-0 flex items-center pl-11 pr-12">
                <div className="w-full border-t border-brand-secondary/30"></div>
              </div>
              <div className=" font-gt-america relative flex justify-center text-[0.75rem] tracking-[0px] leading-[18px]">
                <span className="px-2.5 bg-kbt-deep-green text-brand-secondary ">
                  or continue with
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[12px] font-gt-america pl-11 pr-12"
            >
              <div className="flex flex-col gap-[9px]">
                <label htmlFor="email" className="">
                  Email
                </label>
                <TextField
                  name="email"
                  type="email"
                  placeholder="ENTER USERNAME OR EMAIL"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 pt-3.25 pb-3 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
                  required
                />

                <TextField
                  name="password"
                  type="password"
                  placeholder="ENTER PASSWORD"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3.5 pt-3.5 pb-3.25 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
                  required
                />
              </div>

              <div className="flex justify-center">
                <Link
                  href="/forgot-password"
                  className="text-[0.8125rem] tracking-[0px] leading-[18px] underline font-[400]"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-[100] flex items-center justify-center gap-2 py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-[0.65625rem] uppercase tracking-[0.15em] h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>sign in</span>
                    <Image
                      src="/icons/arrow.svg"
                      alt="Arrow"
                      width={10}
                      height={10}
                      className="h-[10px]"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-brand-secondary">
              <span>Don&apos;t have an account? </span>
              <Link
                href="/signup"
                className="text-button-green font-medium hover:text-button-green transition-colors"
              >
                Sign Up Now
              </Link>
            </div>
          </div>

          {/* Right Section - Full Image */}
          <div className="hidden lg:block flex-1 h-full w-full">
            <Image
              src="/images/KDA_Image_Rickhouse_2 .jpg"
              alt="Bourbon barrel warehouse"
              width={450}
              height={780}
              className="w-full h-full object-cover object-center rounded-r-xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
