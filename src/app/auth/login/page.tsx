import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login - KBT Trip Builder',
  description: 'Sign in to your KBT Trip Builder account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
