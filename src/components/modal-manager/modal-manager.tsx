'use client';

import React, { useMemo, useCallback } from 'react';
import { useModal } from '@/hooks/use-modal';

import LoginModal from '../auth/login-modal';
import { RegistrationPopup } from '../auth/register';
import ForgotPasswordModal from '../auth/forgot-password-modal';
import OtpVerificationModal from '../auth/otp-verification-modal';
import ResetPasswordModal from '../auth/reset-password-modal';

export function ModalManager() {
  const { modal, email, resetToken, openModal, closeModal } = useModal();

  // Memoize modal props to prevent unnecessary re-renders
  const modalProps = useMemo(
    () => ({ isOpen: true, onClose: closeModal }),
    [closeModal]
  );

  // Memoize callbacks to prevent recreation on every render
  const handleOtpVerified = useCallback(
    (token: string) => openModal('reset-password', { resetToken: token }),
    [openModal]
  );

  const handlePasswordReset = useCallback(
    () => openModal('login'),
    [openModal]
  );

  const handleSwitchToLogin = useCallback(
    () => openModal('login'),
    [openModal]
  );

  const handleOtpSent = useCallback(
    (userEmail: string) => openModal('otp-verification', { email: userEmail }),
    [openModal]
  );

  // Early return if no modal is open
  if (!modal) return null;

  // Modal map for clean rendering
  const modalMap: Record<string, React.ReactElement> = {
    login: <LoginModal {...modalProps} />,
    register: (
      <RegistrationPopup
        {...modalProps}
        onSwitchToLogin={handleSwitchToLogin}
      />
    ),
    'forgot-password': (
      <ForgotPasswordModal {...modalProps} onOtpSent={handleOtpSent} />
    ),
    'otp-verification': (
      <OtpVerificationModal
        {...modalProps}
        email={email || ''}
        onOtpVerified={handleOtpVerified}
      />
    ),
    'reset-password': (
      <ResetPasswordModal
        {...modalProps}
        email={email || ''}
        resetToken={resetToken || ''}
        onPasswordReset={handlePasswordReset}
      />
    ),
  };

  return modalMap[modal] ?? null;
}
