'use client';

import { useQueryState } from 'nuqs';
import { useCallback, useRef, useEffect, useMemo } from 'react';

export const useModal = () => {
  const [modal, setModal] = useQueryState('modal');
  const [email, setEmail] = useQueryState('email');
  const [otp, setOtp] = useQueryState('otp');
  const [resetToken, setResetToken] = useQueryState('resetToken');

  // Performance tracking
  const renderCount = useRef(0);
  const lastModalChange = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current++;
    if (modal) lastModalChange.current = Date.now();
  }, [modal]);

  const openModal = useCallback(
    (newModal: string, params?: Record<string, string>) => {
      try {
        if (newModal === 'login' || newModal === 'register') {
          setEmail(null);
          setOtp(null);
          setResetToken(null);
        }

        setModal(newModal);

        if (params?.email) setEmail(encodeURIComponent(params.email));
        if (params?.otp) setOtp(params.otp);
        if (params?.resetToken)
          setResetToken(encodeURIComponent(params.resetToken));
      } catch (error) {
        console.error(`[Modal] Error opening ${newModal}:`, error);
      }
    },
    [setModal, setEmail, setOtp, setResetToken]
  );

  const closeModal = useCallback(() => {
    try {
      setModal(null);
      setEmail(null);
      setOtp(null);
      setResetToken(null);
    } catch (error) {
      console.error('[Modal] Error closing modal:', error);
    }
  }, [setModal, setEmail, setOtp, setResetToken]);

  const isModalOpen = useCallback(
    (modalType: string) => modal === modalType,
    [modal]
  );

  // Convenience functions
  const openLogin = useCallback(() => openModal('login'), [openModal]);
  const openRegister = useCallback(() => openModal('register'), [openModal]);
  const openForgotPassword = useCallback(
    () => openModal('forgot-password'),
    [openModal]
  );

  // Memoize the return object to prevent unnecessary re-renders
  const modalState = useMemo(
    () => ({
      modal,
      email: email ? decodeURIComponent(email) : null,
      otp,
      resetToken: resetToken ? decodeURIComponent(resetToken) : null,
      openModal,
      closeModal,
      isModalOpen,
      // Convenience
      openLogin,
      openRegister,
      openForgotPassword,
      // Debug metrics
      __performance: {
        renderCount: renderCount.current,
        lastModalChange: lastModalChange.current,
        currentModal: modal,
      },
    }),
    [
      modal,
      email,
      otp,
      resetToken,
      openModal,
      closeModal,
      isModalOpen,
      openLogin,
      openRegister,
      openForgotPassword,
    ]
  );

  return modalState;
};
