import { Metadata } from 'next';
import LoginModal from '@/components/auth/login-modal';

export const metadata: Metadata = {
  title: 'Login - KBT Trip Builder',
  description: 'Sign in to your KBT Trip Builder account.',
};

export default function LoginPage() {
  return <LoginModal isOpen={true} />;
}
