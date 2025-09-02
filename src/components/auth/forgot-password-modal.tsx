'use client';

import React, { useState } from 'react';
import { TextField } from './custom-textfield';
import SharedModalWrapper from './shared-modal-wrapper';
import { forgotPassword } from '@/services/api/auth-service';
import Image from 'next/image';
import { useModal } from '@/hooks/use-modal';
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpSent: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOtpSent,
}) => {
  const { goBack } = useModal();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await forgotPassword({ email });
      if (result.success) {
        setSuccess('Password reset email sent successfully!');
        // Call the callback to switch to OTP verification modal
        console.log('Calling onOtpSent with email:', email);
        onOtpSent(email);
      } else {
        setError(result.message || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="rounded-[3px] max-w-[739px] w-[95%] sm:w-full h-auto min-h-[500px] lg:min-h-[600px] overflow-hidden relative shadow-2xl text-white mx-2 sm:mx-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Back Arrow */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={goBack}
            className="p-2 text-brand-secondary hover:text-white transition-colors"
            aria-label="Go back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 lg:top-4.75 lg:right-5.5 text-white hover:bg-white/20 rounded-full transition-colors z-10"
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
          <div className="bg-deep-green flex flex-col justify-start lg:justify-center gap-[12px] w-full lg:max-w-[370px] pt-6 lg:pt-0 pb-5 lg:pb-0 px-4 lg:px-0">
            <div className="text-center pl-4 lg:pl-12.5 pr-4 lg:pr-12 flex flex-col gap-[9px]">
              <h1 className="font-signifier text-xl sm:text-2xl lg:text-[2.625rem] font-[100] text-brand-secondary leading-[99%] tracking-[-1px] text-center m-0 p-0 mt-0.5 ml-0.5">
                Forgot
                <br /> Password
              </h1>
              <p className="font-gt-america font-[300] text-sm lg:text-[0.875rem] text-center tracking-[0px] ml-2 leading-[120%] mb-1.75 mt-0.5">
                Enter your email address and we&apos;ll send you an OTP to reset
                your password.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="pl-4 lg:pl-11 pr-4 lg:pr-12 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-[3px] text-red-300 text-xs lg:text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="pl-4 lg:pl-11 pr-4 lg:pr-12 mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-[3px] text-green-300 text-xs lg:text-sm">
                {success}
              </div>
            )}

            <div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[12px] font-gt-america pl-4 lg:pl-11 pr-4 lg:pr-12"
              >
                <div className="flex flex-col gap-[9px]">
                  <TextField
                    name="email"
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-3.5 pt-3.25 pb-3 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-xs lg:text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full font-[100] flex items-center justify-center gap-2 py-3 lg:py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-xs lg:text-[0.65625rem] uppercase tracking-[0.15em] h-auto disabled:opacity-50 disabled:cursor-not-allowed pb-2 lg:pb-2.5"
                  >
                    {isLoading ? (
                      <span>Sending OTP...</span>
                    ) : (
                      <>
                        <span>send otp</span>
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
                </div>
              </form>
            </div>
          </div>

          {/* Right Section - Full Image */}
          <div className="hidden lg:block flex-1 h-full w-full h-auto">
            <Image
              src="/images/KDA_Image_Rickhouse_2.jpg"
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

export default ForgotPasswordModal;
