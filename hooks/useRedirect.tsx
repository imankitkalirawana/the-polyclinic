'use client';
import { useSession } from 'next-auth/react';

export default function UseRedirect() {
  useSession({
    required: true,
  });
  return null;
}
