'use server';
import { cookies } from 'next/headers';
import { apiRequest } from './axios';

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const res = await apiRequest<{ token: string }>({
      url: '/auth/login',
      method: 'POST',
      data: { email, password },
    });

    if (res?.data?.token) {
      const cookieStore = await cookies();
      cookieStore.set('connect.sid', res.data.token);
      return {
        success: true,
        message: 'Login successful',
      };
    }
    return {
      success: false,
      message: res.message,
    };
  } catch (error) {
    throw new Error('Login failed');
  }
}
