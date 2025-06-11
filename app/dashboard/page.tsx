'use client';
import { useSession } from 'next-auth/react';

export default function AppointmentPage() {
  const { data } = useSession();

  console.log(data);
  return <div>Hello world</div>;
}
