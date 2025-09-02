'use client';

import React, { createContext, useContext, useState } from 'react';
import LoginModal from '@/components/auth/login-modal';
import { RegistrationPopup } from '@/components/auth/register';

interface AuthModalContextType {
  showLoginModal: () => void;
  showRegisterModal: () => void;
  hideLoginModal: () => void;
  hideRegisterModal: () => void;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

interface AuthModalProviderProps {
  children: React.ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({
  children,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const showRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const hideLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const hideRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const value: AuthModalContextType = {
    showLoginModal,
    showRegisterModal,
    hideLoginModal,
    hideRegisterModal,
    isLoginModalOpen,
    isRegisterModalOpen,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      <LoginModal isOpen={isLoginModalOpen} onClose={hideLoginModal} />
      <RegistrationPopup
        isOpen={isRegisterModalOpen}
        onClose={hideRegisterModal}
      />
    </AuthModalContext.Provider>
  );
};
