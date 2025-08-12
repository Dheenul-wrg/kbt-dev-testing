import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Register - KBT Trip Builder',
  description: 'Create a new account with KBT Trip Builder.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
