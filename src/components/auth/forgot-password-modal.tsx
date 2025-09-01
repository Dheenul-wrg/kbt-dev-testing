'use client';

import React, { useState } from 'react';
import { TextField } from './custom-textfield';
import SharedModalWrapper from './shared-modal-wrapper';

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
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
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
    setEmail('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <SharedModalWrapper isOpen={isOpen} onClose={handleClose}>
      <div className="text-center pl-8 lg:pl-12.5 pr-8 lg:pr-12 flex flex-col gap-[9px]">
        <h1 className="font-signifier text-2xl lg:text-[42px] font-[100] text-brand-secondary leading-[99%] tracking-[-1px] text-center m-0 p-0 h-[88px]">
          Forgot
          <br /> Password
        </h1>
        <p className="font-gt-america font-[300] text-[14px] text-center tracking-[0px] ml-2 leading-[120%] h-[41px]">
          Enter your email address and we&apos;ll send you an OTP to reset your
          password.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="pl-8 lg:pl-11 pr-8 lg:pr-12 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-[3px] text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="pl-8 lg:pl-11 pr-8 lg:pr-12 mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-[3px] text-green-300 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[12px] font-gt-america pl-8 lg:pl-11 pr-8 lg:pr-12"
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
            className="w-full px-3.5 pt-3.25 pb-3 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[10.5px] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full font-[100] flex items-center justify-center gap-2 py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-[10.5px] uppercase tracking-[0.15em] h-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span>Sending OTP...</span>
          ) : (
            <>
              <span>send otp</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-[10px]"
              >
                <path
                  d="M1 5H9M9 5L5 1M9 5L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-brand-secondary">
        <span>Remember your password? </span>
        <button
          onClick={handleClose}
          className="text-button-green font-medium hover:text-[#5a6a38] transition-colors"
        >
          Sign In
        </button>
      </div>
    </SharedModalWrapper>
  );
};

export default ForgotPasswordModal;
