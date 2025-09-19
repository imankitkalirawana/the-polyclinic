'use server';
import { login as customLogin } from '@/lib/auth';

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    const result = await customLogin({ email, password });
    return { success: true, data: result };
  } catch (error) {
    return {
      error: 'error',
      message: error instanceof Error ? error.message : 'Login failed',
      status: 401,
    };
  }
};
