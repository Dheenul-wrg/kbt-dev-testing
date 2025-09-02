'use client';

import React, { useState } from 'react';
import { TextField } from './custom-textfield';
import SharedModalWrapper from './shared-modal-wrapper';
import Image from 'next/image';
import { resetPassword } from '@/services/api/auth-service';
import { useModal } from '@/hooks/use-modal';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  resetToken: string;
  onPasswordReset?: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  resetToken,
  onPasswordReset,
}) => {
  const { goBack } = useModal();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await resetPassword({
        email: email,
        resetToken: resetToken,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        setSuccess('Password reset successfully!');
        // Call the callback after a short delay to show success message
        setTimeout(() => {
          onPasswordReset?.();
        }, 2000);
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
    setFormData({ newPassword: '', confirmPassword: '' });
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
                Reset
                <br /> Password
              </h1>
              <p className="font-gt-america font-[300] text-sm lg:text-[0.875rem] text-center tracking-[0px] ml-2 leading-[120%] mb-1.75 mt-0.5">
                Enter your new password below.
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
                    name="newPassword"
                    type="password"
                    placeholder="ENTER NEW PASSWORD"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3.5 pt-3.25 pb-3 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-xs lg:text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
                    required
                  />

                  <TextField
                    name="confirmPassword"
                    type="password"
                    placeholder="CONFIRM NEW PASSWORD"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3.5 pt-3.5 pb-3.25 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-xs lg:text-[0.65625rem] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
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
                      <span>Resetting...</span>
                    ) : (
                      <>
                        <span>reset password</span>
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

export default ResetPasswordModal;
