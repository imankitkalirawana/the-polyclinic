'use server';
// eslint-disable-next-line no-restricted-imports
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { apiRequest } from './axios';

export async function login({ email, password }: { email: string; password: string }) {
  try {
    console.log('auth.ts: Before login');
    const res = await apiRequest<{ token: string }>({
      url: '/auth/login',
      method: 'POST',
      data: { email, password },
    });
    console.log('auth.ts: After login with res', res);

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

export async function logout() {
  try {
    const res = await apiRequest<{ message: string }>({
      url: '/auth/logout',
      method: 'POST',
    });

    if (res.success) {
      const cookieStore = await cookies();
      cookieStore.delete('connect.sid');
      return {
        success: true,
        message: 'Logout successful',
      };
    }
    return {
      success: false,
      message: 'Logout failed',
    };
  } catch (error) {
    throw new Error((error as AxiosError).message || 'Logout failed');
  }
}
