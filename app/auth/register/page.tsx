import Register from '@/components/auth/register';
import { RegisterProvider } from '@/components/auth/register/store';

export default function RegisterPage() {
  return (
    <RegisterProvider>
      <Register />
    </RegisterProvider>
  );
}
