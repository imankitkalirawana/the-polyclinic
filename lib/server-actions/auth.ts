'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'error', message: error.message, status: 401 };
    }

    throw error;
  }
};

export const googleLogin = async () => {
  await signIn('google');
};
