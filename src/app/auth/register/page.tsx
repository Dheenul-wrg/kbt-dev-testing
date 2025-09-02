import { Metadata } from 'next';
import { RegistrationPopup } from '../../../components/auth/register';

export const metadata: Metadata = {
  title: 'Register - KBT Trip Builder',
  description: 'Create a new account with KBT Trip Builder.',
};

export default function RegisterPage() {
  return <RegistrationPopup />;
}
