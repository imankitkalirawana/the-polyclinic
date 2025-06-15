'use client';
import { useSession } from 'next-auth/react';

export default function AppointmentPage() {
  const { data } = useSession();

  return <div>Hello world</div>;
}
