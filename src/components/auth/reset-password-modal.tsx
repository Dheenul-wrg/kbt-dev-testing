'use client';

import React, { useState } from 'react';
import { TextField } from './custom-textfield';
import SharedModalWrapper from './shared-modal-wrapper';
import Image from 'next/image';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  resetToken: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  resetToken,
}) => {
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
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset successfully!');
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
    setFormData({ newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <SharedModalWrapper isOpen={isOpen} onClose={handleClose}>
      <div className="text-center pl-8 lg:pl-12.5 pr-8 lg:pr-12 flex flex-col gap-[9px]">
        <h1 className="font-signifier text-2xl lg:text-[42px] font-[100] text-brand-secondary leading-[99%] tracking-[-1px] text-center m-0 p-0 h-[88px]">
          Reset
          <br /> Password
        </h1>
        <p className="font-gt-america font-[300] text-[14px] text-center tracking-[0px] ml-2 leading-[120%] h-[41px]">
          Enter your new password below.
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
            name="newPassword"
            type="password"
            placeholder="ENTER NEW PASSWORD"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full px-3.5 pt-3.25 pb-3 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[10.5px] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
            required
          />

          <TextField
            name="confirmPassword"
            type="password"
            placeholder="CONFIRM NEW PASSWORD"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3.5 pt-3.5 pb-3.25 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary text-[10.5px] tracking-[0.06em] transition-colors leading-none rounded-[3px] h-auto"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full font-[100] flex items-center justify-center gap-2 py-3.5 bg-kbt-dark-green text-[#F1EDDD] text-[10.5px] uppercase tracking-[0.15em] h-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
      </form>

      <div className="text-center mt-6 text-sm text-brand-secondary">
        <span>Back to </span>
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

export default ResetPasswordModal;
