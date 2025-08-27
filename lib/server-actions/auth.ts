'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { getUserModel } from '@/models/User';
import { connectDB } from '../db';
import { getSubdomain } from '@/auth/sub-domain';

export const verifyEmail = async (email: string) => {
  const subdomain = await getSubdomain();
  const conn = await connectDB(subdomain);
  const user = await getUserModel(conn).findOne({ email });
  if (!user) {
    return { error: 'error', message: 'User not found', status: 404 };
  }

  return { success: true, message: 'Email verified' };
};

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
