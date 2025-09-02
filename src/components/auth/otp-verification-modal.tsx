'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import SharedModalWrapper from './shared-modal-wrapper';
import { verifyOtp } from '@/services/api/auth-service';
import { useModal } from '@/hooks/use-modal';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onOtpVerified: (resetToken: string) => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onOtpVerified,
}) => {
  const { goBack } = useModal();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user types
    if (error) setError('');
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyOtp({ email, otp: otpString });

      if (result.success && result.resetToken) {
        // The API returns resetToken at the root level
        const resetToken = result.resetToken;

        onOtpVerified(resetToken);
      } else {
        setError(result.message || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setTimeLeft(600); // Reset timer
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimeLeft(600);
    onClose();
  };

  if (!isOpen) return null;

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
                Enter
                <br />
                Verification Code
              </h1>
              <p className="font-gt-america font-[300] text-sm lg:text-[0.875rem] text-center tracking-[0px] ml-2 leading-[120%] mb-1.75 mt-0.5">
                We&apos;ve sent a 6-digit code to {email}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="pl-4 lg:pl-11 pr-4 lg:pr-12 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-[3px] text-red-300 text-xs lg:text-sm">
                {error}
              </div>
            )}

            <div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 font-gt-america pl-4 lg:pl-11 pr-4 lg:pr-12"
              >
                <div className="flex flex-col gap-[9px]">
                  <div className="text-center">
                    <legend className="text-brand-secondary text-sm lg:text-base font-gt-america font-medium tracking-wide">
                      Enter OTP
                    </legend>
                  </div>
                  <div className="flex justify-center gap-1 sm:gap-1.5 lg:gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onInput={e => {
                          // Only allow numbers
                          const value = e.currentTarget.value;
                          if (value && !/^\d$/.test(value)) {
                            e.currentTarget.value = value.replace(/\D/g, '');
                          }
                        }}
                        aria-label={`Digit ${index + 1} of 6-digit OTP`}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-center bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-sm sm:text-[16px] lg:text-[18px] tracking-[0.06em] rounded-[3px] focus:outline-none focus:border-brand-secondary"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full font-[100] flex items-center justify-center gap-2 py-3 lg:py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-xs lg:text-[0.65625rem] uppercase tracking-[0.15em] h-auto disabled:opacity-50 disabled:cursor-not-allowed pb-2 lg:pb-2.5"
                  >
                    {isLoading ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <span>verify otp</span>
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

            <div className="text-center mt-4">
              <button
                onClick={handleResendOtp}
                disabled={timeLeft > 0 || isLoading}
                className="text-button-green font-medium hover:text-[#5a6a38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs lg:text-sm"
              >
                {timeLeft > 0
                  ? `Resend OTP (${formatTime(timeLeft)})`
                  : 'Resend OTP'}
              </button>
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

export default OtpVerificationModal;
