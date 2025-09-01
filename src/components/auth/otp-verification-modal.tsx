'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import SharedModalWrapper from './shared-modal-wrapper';

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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
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
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (data.success) {
        onOtpVerified(data.resetToken);
      } else {
        setError(data.message);
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
    <SharedModalWrapper isOpen={isOpen} onClose={handleClose}>
      <div className="text-center pl-8 lg:pl-12.5 pr-8 lg:pr-12 flex flex-col gap-[9px]">
        <h1 className="font-signifier text-2xl lg:text-[42px] font-[100] text-brand-secondary leading-[99%] tracking-[-1px] text-center m-0 p-0 h-[88px]">
          Enter<br></br> OTP
        </h1>
        <p className="font-gt-america font-[300] text-[14px] text-center tracking-[0px] ml-2 leading-[120%] h-[41px]">
          We&apos;ve sent a 6-digit code to {email}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="pl-8 lg:pl-11 pr-8 lg:pr-12 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-[3px] text-red-300 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[12px] font-gt-america pl-8 lg:pl-11 pr-8 lg:pr-12"
      >
        <div className="flex flex-col gap-[9px]">
          <legend>Enter OTP</legend>
          <div className="flex justify-center gap-1.5 lg:gap-2">
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
                aria-label={`Digit ${index + 1} of 6-digit OTP`}
                inputMode="numeric"
                className="w-10 h-10 lg:w-12 lg:h-12 text-center bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[16px] lg:text-[18px] tracking-[0.06em] rounded-[3px] focus:outline-none focus:border-brand-secondary"
              />
            ))}
          </div>

          <div className="text-center text-sm text-brand-secondary">
            <span>Time remaining: </span>
            <span className={timeLeft <= 60 ? 'text-red-400' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full font-[100] flex items-center justify-center gap-2 py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-[10.5px] uppercase tracking-[0.15em] h-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
      </form>

      <div className="text-center mt-4">
        <button
          onClick={handleResendOtp}
          className="text-button-green font-medium hover:text-[#5a6a38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Resend OTP
        </button>
      </div>

      <div className="text-center mt-6 text-sm text-brand-secondary">
        <span>Back to </span>
        <button
          onClick={handleClose}
          className="text-button-green font-medium hover:text-[#5a6a38] transition-colors"
        >
          Forgot Password
        </button>
      </div>
    </SharedModalWrapper>
  );
};

export default OtpVerificationModal;
